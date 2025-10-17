const axios = require('axios');

const ollamaUrl = 'http://localhost:11434';
let currentModel = 'llama2'; // Default model, can be changed

// Test Ollama connection
const testConnection = async (req, res) => {
  try {
    const response = await axios.get(`${ollamaUrl}/api/tags`);
    res.json({
      success: true,
      message: 'Ollama connection successful',
      models: response.data.models || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to connect to Ollama',
      error: error.message
    });
  }
};

// Chat with AI
const chat = async (req, res) => {
  try {
    const { message, model = currentModel } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // First check if the model exists
    const modelsResponse = await axios.get(`${ollamaUrl}/api/tags`);
    const availableModels = modelsResponse.data.models || [];
    
    if (availableModels.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No AI models available. Please install a model first using: ollama pull llama2',
        availableModels: []
      });
    }

    // Use the first available model if the requested one doesn't exist
    const modelToUse = availableModels.find(m => m.name === model) ? model : availableModels[0].name;

    // Call Ollama API
    const response = await axios.post(`${ollamaUrl}/api/generate`, {
      model: modelToUse,
      prompt: message,
      stream: false
    });

    res.json({
      success: true,
      response: response.data.response,
      model: modelToUse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    
    if (error.response?.status === 404) {
      res.status(400).json({
        success: false,
        message: 'Model not found. Please install a model first using: ollama pull llama2'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get AI response',
        error: error.message
      });
    }
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

    // Set up streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Call Ollama with streaming
    const response = await axios.post(`${ollamaUrl}/api/generate`, {
      model: model,
      prompt: message,
      stream: true
    }, {
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      try {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const data = JSON.parse(line);
            if (data.response) {
              res.write(data.response);
            }
          }
        }
      } catch (err) {
        // Skip invalid JSON lines
      }
    });

    response.data.on('end', () => {
      res.end();
    });

    response.data.on('error', (error) => {
      console.error('Stream error:', error);
      res.end();
    });

  } catch (error) {
    console.error('Stream Chat Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to stream AI response',
      error: error.message
    });
  }
};

// Get available models
const getModels = async (req, res) => {
  try {
    const response = await axios.get(`${ollamaUrl}/api/tags`);
    res.json({
      success: true,
      models: response.data.models || []
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