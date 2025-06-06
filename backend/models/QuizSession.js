const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuizSession = sequelize.define('QuizSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // null for guest players
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sessionType: {
      type: DataTypes.ENUM('singleplayer', 'multiplayer'),
      defaultValue: 'singleplayer'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true, // null for mixed categories
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard', 'mixed'),
      defaultValue: 'mixed'
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      comment: 'Time in seconds'
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    language: {
      type: DataTypes.ENUM('de', 'en', 'es', 'fr'),
      defaultValue: 'en'
    }
  }, {
    tableName: 'quiz_sessions',
    timestamps: true
  });

  return QuizSession;
};