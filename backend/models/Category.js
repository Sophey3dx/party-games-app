const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nameDE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nameEN: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nameES: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nameFR: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '🧠'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'medium'
    }
  }, {
    tableName: 'categories',
    timestamps: true
  });

  return Category;
};