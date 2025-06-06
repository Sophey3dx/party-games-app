'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'geography',
        nameDE: 'Geografie',
        nameEN: 'Geography',
        nameES: 'Geografía',
        nameFR: 'Géographie',
        description: 'Questions about countries, capitals, and world geography',
        icon: '🌍',
        difficulty: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'science',
        nameDE: 'Wissenschaft',
        nameEN: 'Science',
        nameES: 'Ciencia',
        nameFR: 'Science',
        description: 'Biology, chemistry, physics and general science',
        icon: '🔬',
        difficulty: 'hard',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'literature',
        nameDE: 'Literatur',
        nameEN: 'Literature',
        nameES: 'Literatura',
        nameFR: 'Littérature',
        description: 'Books, authors, and literary works',
        icon: '📚',
        difficulty: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'history',
        nameDE: 'Geschichte',
        nameEN: 'History',
        nameES: 'Historia',
        nameFR: 'Histoire',
        description: 'Historical events and figures',
        icon: '🏛️',
        difficulty: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'entertainment',
        nameDE: 'Entertainment',
        nameEN: 'Entertainment',
        nameES: 'Entretenimiento',
        nameFR: 'Divertissement',
        description: 'Movies, music, celebrities and pop culture',
        icon: '🎬',
        difficulty: 'easy',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};