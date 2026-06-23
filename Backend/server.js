const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// LOAD ENVIRONMENT VARIABLES AND CONNECT DATABASE FIRST
dotenv.config();
connectDB();

// SERVER INITIALIZATION
const app = express();

// BODY PARSER - JSON REQUEST AND URL-ENCODED REQUEST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CROSS-ORIGIN RESOURCE SHARING - FOR FRONTEND
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// CHECK ROUTE - SIMPLE ENDPOINT TO VERIFY SERVER IS RUNNING
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success : true,
    message : 'Server is Running',
    timestamp : new Date().toISOString()
  });
});

// GOLBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// PAGE NOT FOUND HANDLER
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Page not found' 
  });
});

// SERVER STARTUP
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// GRACEFUL SHUT DOWN HANDLER
const shutDown = async (signal) => {
  console.log(`\n ${signal} received. Shutting down server.`);

  server.close(async () => {
    console.log('Server closed');
    process.exit(0);
  });

  // FORCE CLOSE AFTER 10 SECONDS IF SHUT DOWN FAILS
  setTimeout(() => {
    console.log('Could not close connection in time. Force shut down');
    process.exit(1);
  }, 10000);
};

// LISTEN FOR TERMINATION SIGNALS
process.on('SIGINT', () => shutDown('SIGINT'));
process.on('SIGTERM', () => shutDown('SIGTERM'));

// HANDLE UNCAUGHT EXCEPTION
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception : ', error);
  shutDown('UNCAUGHT_EXCEPTION');
});

// HANDLE UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at : ', promise, 'reason : ', reason);
  shutDown('UNHANDLED_REJECTION');
});

module.exports = app;
