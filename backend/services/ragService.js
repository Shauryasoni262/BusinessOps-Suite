// ============================================================================
// RAG SERVICE — The Heart of Retrieval-Augmented Generation
// ============================================================================
//
// 🧠 WHAT IS RAG?
// RAG = Retrieve → Augment → Generate
//
// Instead of asking an AI a question directly (and getting generic answers),
// we FIRST search our own database for relevant info, THEN give that info
// to the AI along with the question. This way the AI answers using OUR data.
//
// 📦 THIS FILE CONTAINS 4 KEY FUNCTIONS:
//
// 1. generateEmbedding(text)
//    → Converts text into a vector (array of 768 numbers)
//    → Similar meanings = similar numbers = we can search by meaning!
//
// 2. chunkText(text)
//    → Splits long text into smaller pieces (~500 chars each)
//    → Why? Because searching small chunks gives more precise results
//    → We add overlap so sentences at boundaries aren't lost
//
// 3. ingestResume(pdfText, resumeId)
//    → The "loading data" pipeline: chunk → embed → store in Pinecone
//    → This is called when a user UPLOADS a resume
//
// 4. queryResume(question, resumeId)
//    → The "asking questions" pipeline: embed question → search → generate
//    → This is called when a user ASKS a question about their resume
//
// ============================================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone } = require('@pinecone-database/pinecone');

// ── Initialize Clients ──────────────────────────────────────────────────────
// We create one instance of each client that the whole service reuses.

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Pinecone index name — this is like a "database table" for vectors
const PINECONE_INDEX_NAME = 'resume-analyzer';

// ============================================================================
// FUNCTION 1: generateEmbedding(text)
// ============================================================================
//
// 🧠 WHAT ARE EMBEDDINGS?
//
// An embedding converts text into an array of numbers (a "vector").
// For example:
//   "JavaScript developer" → [0.12, -0.34, 0.56, 0.78, ... 768 numbers]
//   "JS programmer"        → [0.11, -0.33, 0.55, 0.77, ... 768 numbers]
//   "Chocolate cake recipe" → [0.89, 0.22, -0.91, 0.03, ... 768 numbers]
//
// Notice: "JavaScript developer" and "JS programmer" have SIMILAR numbers
// because they mean similar things! "Chocolate cake" has very different numbers.
//
// This is how we search by MEANING instead of exact keywords.
//
// We use Google's "gemini-embedding-001" model.
// We explicitly request 768 dimensions to match our Pinecone index.
//
// ============================================================================

const generateEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent({
    content: { parts: [{ text }] },
    outputDimensionality: 768,
  });
  return result.embedding.values; // Returns an array of 768 numbers
};


// ============================================================================
// FUNCTION 2: chunkText(text, chunkSize, overlap)
// ============================================================================
//
// 🧠 WHY DO WE CHUNK TEXT?
//
// Imagine your resume is 3 pages long (~3000 words). If we embed the entire
// thing as one massive vector, the embedding becomes a "blurry average" of
// everything. When someone asks "What programming languages do you know?",
// the search might not find the right section because the vector represents
// everything at once.
//
// Instead, we split the text into small chunks of ~500 characters:
//   Chunk 1: "Skills: JavaScript, Python, React..."
//   Chunk 2: "Experience: 3 years at Google..."
//   Chunk 3: "Education: B.Tech from IIT Delhi..."
//
// Now each chunk has its OWN embedding, and when someone asks about skills,
// the search finds Chunk 1 precisely!
//
// 🧠 WHY OVERLAP?
//
// If we split text at exactly every 500 chars, we might cut a sentence in half:
//   Chunk 1: "...I am proficient in Java"
//   Chunk 2: "Script and TypeScript frameworks..."
//
// With 50 char overlap, the end of Chunk 1 overlaps with the start of Chunk 2:
//   Chunk 1: "...I am proficient in JavaScript and Type"
//   Chunk 2: "in JavaScript and TypeScript frameworks..."
//
// This way, "JavaScript" appears fully in at least one chunk.
//
// ============================================================================

const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Try to break at a sentence boundary (. ! ? or newline) for cleaner chunks
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      // Only use the break point if it's within a reasonable distance
      if (breakPoint > start + chunkSize * 0.5) {
        end = breakPoint + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start forward, but subtract overlap so chunks share some text
    start = end - overlap;
  }

  return chunks;
};


// ============================================================================
// FUNCTION 3: ingestResume(pdfText, resumeId)
// ============================================================================
//
// 🧠 THE "INGESTION" PIPELINE
//
// This is called when a user uploads a resume. It does 3 things:
//   1. Chunk the text → smaller pieces
//   2. Embed each chunk → convert each piece to a vector
//   3. Upsert to Pinecone → store vectors + original text in the database
//
// "Upsert" = Update if exists, Insert if new. This way re-uploading
// a resume replaces the old data instead of duplicating it.
//
// Each vector in Pinecone has:
//   - id: A unique identifier (e.g., "resume_abc123_chunk_0")
//   - values: The 768-number embedding
//   - metadata: The original text (so we can retrieve it later)
//
// We also store the resumeId in metadata so we can filter by resume
// when searching (one user's resume shouldn't interfere with another's).
//
// ============================================================================

const ingestResume = async (pdfText, resumeId) => {
  // Step 1: Chunk the text
  const chunks = chunkText(pdfText);
  console.log(`📦 Split resume into ${chunks.length} chunks`);

  // Step 2 & 3: Embed each chunk and prepare Pinecone vectors
  const index = pinecone.Index(PINECONE_INDEX_NAME);

  const vectors = [];
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);

    vectors.push({
      id: `resume_${resumeId}_chunk_${i}`,
      values: embedding,
      metadata: {
        text: chunks[i],          // Original text (for retrieval)
        resumeId: resumeId,       // Which resume this belongs to
        chunkIndex: i,            // Position in the original doc
      },
    });

    console.log(`  ✅ Chunk ${i + 1}/${chunks.length} embedded`);
  }

  // Step 3: Upsert all vectors to Pinecone (batch them)
  // Pinecone accepts up to 100 vectors per upsert call
  const BATCH_SIZE = 100;
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    await index.upsert({ records: batch });
  }

  console.log(`🎉 Successfully ingested ${vectors.length} chunks into Pinecone`);

  return {
    chunksCreated: chunks.length,
    resumeId: resumeId,
  };
};


// ============================================================================
// FUNCTION 4: queryResume(question, resumeId)
// ============================================================================
//
// 🧠 THE "RETRIEVAL + GENERATION" PIPELINE
//
// This is called when a user asks a question about their resume. Steps:
//
//   1. EMBED the question → convert it to the same 768-number format
//   2. SEARCH Pinecone → find the top 3 chunks most similar to the question
//      (Pinecone uses "cosine similarity" — the closer two vectors point
//       in the same direction, the more similar the texts are)
//   3. BUILD a prompt → combine the question + retrieved chunks
//   4. GENERATE → send the prompt to Gemini to get a natural language answer
//
// The prompt tells the AI: "Here is context from a resume. Answer the
// question using ONLY this context." This prevents hallucination (making
// things up) because the AI can only use the provided text.
//
// ============================================================================

const queryResume = async (question, resumeId) => {
  // Step 1: Embed the question
  const questionEmbedding = await generateEmbedding(question);

  // Step 2: Search Pinecone for similar chunks
  const index = pinecone.Index(PINECONE_INDEX_NAME);

  const queryResponse = await index.query({
    vector: questionEmbedding,
    topK: 5,                          // Get top 5 most similar chunks
    includeMetadata: true,             // We need the original text back
    filter: { resumeId: resumeId },    // Only search THIS resume
  });

  // Extract the text from the matched chunks
  console.log(`🔍 Found ${queryResponse.matches.length} semantic matches for the question.`);
  
  const relevantChunks = queryResponse.matches
    .filter(match => {
      console.log(`   - Chunk score: ${match.score.toFixed(4)}`);
      return match.score > 0.2; // Lowered from 0.3 to be more permissive
    })
    .map(match => match.metadata.text);

  if (relevantChunks.length === 0) {
    console.log("⚠️ No chunks passed the similarity threshold.");
    return {
      answer: "I couldn't find relevant information in the resume to answer your question. Could you try rephrasing it?",
      sourcesUsed: 0,
    };
  }

  // Step 3: Build the RAG prompt
  // This is "Augmenting" — we add retrieved context to the prompt
  const context = relevantChunks.join('\n\n---\n\n');

  const ragPrompt = `You are a helpful resume analyzer AI. You have been given sections from a user's resume.
Answer the user's question based ONLY on the resume content provided below.
If the answer cannot be found in the resume, say so clearly — do NOT make up information.
Be helpful, specific, and reference actual details from the resume.

═══ RESUME SECTIONS ═══
${context}
═══ END OF RESUME SECTIONS ═══

User's Question: ${question}

Answer:`;

  // Step 4: Generate the answer using Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const result = await model.generateContent(ragPrompt);
  const answer = result.response.text();

  return {
    answer: answer,
    sourcesUsed: relevantChunks.length,  // How many chunks were used
  };
};


// ============================================================================
// FUNCTION 5: deleteResume(resumeId)
// ============================================================================
// Cleanup: Delete all vectors for a resume from Pinecone
// ============================================================================

const deleteResume = async (resumeId) => {
  const index = pinecone.Index(PINECONE_INDEX_NAME);

  // Pinecone supports deleting by filter on serverless indexes
  // For starter indexes, we need to delete by IDs
  // We'll query first to get the IDs, then delete
  const dummyEmbedding = await generateEmbedding('resume');
  const existing = await index.query({
    vector: dummyEmbedding,
    topK: 100,
    filter: { resumeId: resumeId },
    includeMetadata: false,
  });

  if (existing.matches.length > 0) {
    const idsToDelete = existing.matches.map(m => m.id);
    await index.deleteMany(idsToDelete);
    console.log(`🗑️ Deleted ${idsToDelete.length} vectors for resume ${resumeId}`);
  }
};


// Export all functions
module.exports = {
  generateEmbedding,
  chunkText,
  ingestResume,
  queryResume,
  deleteResume,
};
