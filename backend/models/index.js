const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const Question = require('./Question')(sequelize);
const Category = require('./Category')(sequelize);
const User = require('./User')(sequelize);
const QuizSession = require('./QuizSession')(sequelize);

// Define associations
Category.hasMany(Question, { foreignKey: 'categoryId', as: 'questions' });
Question.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(QuizSession, { foreignKey: 'userId', as: 'quizSessions' });
QuizSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Question,
  Category,
  User,
  QuizSession
};