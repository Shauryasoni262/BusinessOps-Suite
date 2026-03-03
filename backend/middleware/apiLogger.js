const { supabase } = require('../config/database');

/**
 * Middleware to log all API requests to the database
 */
const apiLogger = async (req, res, next) => {
  const start = Date.now();
  
  // Capture the original end function to calculate response time
  const originalEnd = res.end;
  
  res.end = function (...args) {
    const responseTime = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Perform logging asynchronously to avoid blocking the response
    logToDatabase(req, statusCode, responseTime).catch(err => {
      console.error('Failed to log API request:', err.message);
    });
    
    originalEnd.apply(res, args);
  };
  
  next();
};

const logToDatabase = async (req, statusCode, responseTime) => {
  // Skip logging high-frequency or internal routes if necessary
  if (req.path === '/api/health' || req.path.startsWith('/api/logs')) {
    return;
  }

  const logData = {
    user_id: req.user ? req.user.id : null,
    method: req.method,
    path: req.originalUrl || req.url,
    status_code: statusCode,
    response_time: responseTime,
    ip_address: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    user_agent: req.headers['user-agent']
  };

  try {
    const { error } = await supabase
      .from('api_logs')
      .insert([logData]);
      
    if (error) {
      // If table doesn't exist yet, don't spam errors
      if (error.code !== 'PGRST116' && error.code !== '42P01') {
        process.stdout.write(`Log creation failed: ${error.message}\n`);
      }
    }
  } catch (err) {
    // Silently fail logging in code to prevent app crash
  }
};

module.exports = apiLogger;
