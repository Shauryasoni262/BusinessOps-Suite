// ============================================================================
// RESUME ANALYZER CONTROLLER
// ============================================================================
//
// 🧠 WHAT IS A CONTROLLER?
// A controller is the "middleman" between the HTTP request (from frontend)
// and the service (ragService.js). It:
//   1. Reads data from the request (file, message, resumeId)
//   2. Calls the RAG service functions
//   3. Sends back a response to the frontend
//
// We have 2 endpoints:
//   POST /upload  → Accept PDF → Extract text → Ingest into Pinecone
//   POST /chat    → Accept question + resumeId → Query Pinecone + Gemini
const pdfParse = require('pdf-parse');
const crypto = require('crypto');
const { ingestResume, queryResume, deleteResume } = require('../services/ragService');

// ────────────────────────────────────────────────────────────────────────────
// ENDPOINT 1: Upload Resume
// ────────────────────────────────────────────────────────────────────────────
//
// 🧠 HOW PDF EXTRACTION WORKS:
// The frontend sends a PDF file via multipart/form-data.
// Multer middleware catches it and puts the file buffer in `req.file`.
// We use `pdf-parse` to extract plain text from the PDF buffer.
// Then we call `ingestResume()` to chunk → embed → store in Pinecone.
//
// We generate a unique `resumeId` so each upload is separately searchable.
//
// ────────────────────────────────────────────────────────────────────────────

const uploadResume = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded. Please upload a resume PDF.',
      });
    }

    // Validate it's a PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are supported. Please upload a .pdf file.',
      });
    }

    console.log(`📄 Received resume: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)}KB)`);

    // Step 1: Extract text from the PDF buffer
    // pdf-parse v1 expects a buffer, and returns a promise resolving to an object with `text`
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;
    const pageCount = pdfData.numpages;

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract enough text from the PDF. The file might be image-based or corrupted.',
      });
    }

    console.log(`📝 Extracted ${extractedText.length} characters from PDF`);

    // Step 2: Generate a unique resume ID
    const resumeId = crypto.randomUUID();

    // Step 3: Ingest into Pinecone (chunk → embed → store)
    const result = await ingestResume(extractedText, resumeId);

    res.json({
      success: true,
      message: 'Resume uploaded and processed successfully!',
      data: {
        resumeId: resumeId,
        fileName: req.file.originalname,
        textLength: extractedText.length,
        chunksCreated: result.chunksCreated,
        pageCount: pageCount,
      },
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process the resume. Please try again.',
      error: error.message,
    });
  }
};


// ────────────────────────────────────────────────────────────────────────────
// ENDPOINT 2: Chat with Resume
// ────────────────────────────────────────────────────────────────────────────
//
// 🧠 THIS IS WHERE RAG HAPPENS:
// The user sends a question + the resumeId they got from uploading.
// We call `queryResume()` which:
//   1. Embeds the question
//   2. Searches Pinecone for matching resume chunks
//   3. Feeds those chunks + question to Gemini
//   4. Returns the AI's answer
//
// ────────────────────────────────────────────────────────────────────────────

const chatWithResume = async (req, res) => {
  try {
    const { message, resumeId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      });
    }

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required. Please upload a resume first.',
      });
    }

    console.log(`💬 Question for resume ${resumeId}: "${message}"`);

    // Call the RAG query pipeline
    const result = await queryResume(message, resumeId);

    res.json({
      success: true,
      data: {
        answer: result.answer,
        sourcesUsed: result.sourcesUsed,
      },
    });

  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response. Please try again.',
      error: error.message,
    });
  }
};


module.exports = {
  uploadResume,
  chatWithResume,
};
