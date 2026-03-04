const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'arcee-ai/trinity-large-preview:free';
let currentModel = DEFAULT_MODEL;

// Helper to get auth headers
const getHeaders = () => ({
  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json'
});

// Test OpenRouter connection
const testConnection = async (req, res) => {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: currentModel,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.json({
        success: true,
        message: 'AI service connected successfully',
        models: [{ name: currentModel }]
      });
    } else {
      throw new Error(data.error?.message || 'Connection failed');
    }
  } catch (error) {
    console.error('OpenRouter connection test failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to AI service',
      error: error.message
    });
  }
};

// Chat with AI (non-streaming)
const chat = async (req, res) => {
  try {
    const { message, model = currentModel } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const modelToUse = model || currentModel;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get AI response');
    }

    const aiResponse = data.choices?.[0]?.message?.content || 'No response generated.';

    res.json({
      success: true,
      response: aiResponse,
      model: modelToUse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      error: error.message
    });
  }
};

// Stream chat (for real-time responses)
const streamChat = async (req, res) => {
  try {
    const { message, model = currentModel } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Set up streaming response headers
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        model: model || currentModel,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      res.write(errorData.error?.message || 'Error getting AI response');
      res.end();
      return;
    }

    // Read the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(content);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }

    res.end();

  } catch (error) {
    console.error('Stream Chat Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to stream AI response',
        error: error.message
      });
    } else {
      res.end();
    }
  }
};

// Get available models
const getModels = async (req, res) => {
  try {
    const models = [
      {
        name: DEFAULT_MODEL,
        size: 0,
        modified_at: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      models: models
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get models',
      error: error.message
    });
  }
};

// Change model
const changeModel = async (req, res) => {
  try {
    const { model } = req.body;

    if (!model) {
      return res.status(400).json({
        success: false,
        message: 'Model name is required'
      });
    }

    currentModel = model;

    res.json({
      success: true,
      message: `Model changed to ${model}`,
      currentModel: currentModel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to change model',
      error: error.message
    });
  }
};

module.exports = {
  testConnection,
  chat,
  streamChat,
  getModels,
  changeModel
};