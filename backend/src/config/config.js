require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mhis_student_portal',
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'mhis-student-portal-secret-key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
  }
};