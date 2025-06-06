const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionDE: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    questionEN: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    questionES: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    questionFR: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    optionsDE: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isArray(value) {
          if (!Array.isArray(value) || value.length !== 4) {
            throw new Error('Options must be an array with exactly 4 elements');
          }
        }
      }
    },
    optionsEN: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isArray(value) {
          if (!Array.isArray(value) || value.length !== 4) {
            throw new Error('Options must be an array with exactly 4 elements');
          }
        }
      }
    },
    optionsES: {
      type: DataTypes.JSON,
      allowNull: true
    },
    optionsFR: {
      type: DataTypes.JSON,
      allowNull: true
    },
    correctAnswer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 3
      }
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'medium'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    timesPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    timesCorrect: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User ID who created this question (for custom questions)'
    }
  }, {
    tableName: 'questions',
    timestamps: true,
    indexes: [
      {
        fields: ['categoryId']
      },
      {
        fields: ['difficulty']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  return Question;
};