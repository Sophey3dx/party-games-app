'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('questions', [
      {
        questionDE: 'Was ist die Hauptstadt von Deutschland?',
        questionEN: 'What is the capital of Germany?',
        questionES: '¿Cuál es la capital de Alemania?',
        questionFR: 'Quelle est la capitale de l\'Allemagne?',
        optionsDE: ['Berlin', 'München', 'Hamburg', 'Köln'],
        optionsEN: ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
        optionsES: ['Berlín', 'Múnich', 'Hamburgo', 'Colonia'],
        optionsFR: ['Berlin', 'Munich', 'Hambourg', 'Cologne'],
        correctAnswer: 0,
        difficulty: 'easy',
        categoryId: 1, // Geography
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionDE: 'Welcher Planet ist der Sonne am nächsten?',
        questionEN: 'Which planet is closest to the Sun?',
        questionES: '¿Qué planeta está más cerca del Sol?',
        questionFR: 'Quelle planète est la plus proche du Soleil?',
        optionsDE: ['Venus', 'Mars', 'Merkur', 'Erde'],
        optionsEN: ['Venus', 'Mars', 'Mercury', 'Earth'],
        optionsES: ['Venus', 'Marte', 'Mercurio', 'Tierra'],
        optionsFR: ['Vénus', 'Mars', 'Mercure', 'Terre'],
        correctAnswer: 2,
        difficulty: 'medium',
        categoryId: 2, // Science
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionDE: 'Wer hat "Harry Potter" geschrieben?',
        questionEN: 'Who wrote "Harry Potter"?',
        questionES: '¿Quién escribió "Harry Potter"?',
        questionFR: 'Qui a écrit "Harry Potter"?',
        optionsDE: ['J.R.R. Tolkien', 'J.K. Rowling', 'Stephen King', 'George R.R. Martin'],
        optionsEN: ['J.R.R. Tolkien', 'J.K. Rowling', 'Stephen King', 'George R.R. Martin'],
        optionsES: ['J.R.R. Tolkien', 'J.K. Rowling', 'Stephen King', 'George R.R. Martin'],
        optionsFR: ['J.R.R. Tolkien', 'J.K. Rowling', 'Stephen King', 'George R.R. Martin'],
        correctAnswer: 1,
        difficulty: 'easy',
        categoryId: 3, // Literature
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionDE: 'In welchem Jahr fiel die Berliner Mauer?',
        questionEN: 'In which year did the Berlin Wall fall?',
        questionES: '¿En qué año cayó el Muro de Berlín?',
        questionFR: 'En quelle année le mur de Berlin est-il tombé?',
        optionsDE: ['1987', '1989', '1991', '1985'],
        optionsEN: ['1987', '1989', '1991', '1985'],
        optionsES: ['1987', '1989', '1991', '1985'],
        optionsFR: ['1987', '1989', '1991', '1985'],
        correctAnswer: 1,
        difficulty: 'medium',
        categoryId: 4, // History
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        questionDE: 'Welcher Film gewann 2023 den Oscar für den besten Film?',
        questionEN: 'Which movie won the 2023 Oscar for Best Picture?',
        questionES: '¿Qué película ganó el Oscar 2023 a la Mejor Película?',
        questionFR: 'Quel film a remporté l\'Oscar 2023 du meilleur film?',
        optionsDE: ['Top Gun: Maverick', 'Avatar: The Way of Water', 'Everything Everywhere All at Once', 'The Banshees of Inisherin'],
        optionsEN: ['Top Gun: Maverick', 'Avatar: The Way of Water', 'Everything Everywhere All at Once', 'The Banshees of Inisherin'],
        optionsES: ['Top Gun: Maverick', 'Avatar: The Way of Water', 'Everything Everywhere All at Once', 'The Banshees of Inisherin'],
        optionsFR: ['Top Gun: Maverick', 'Avatar: The Way of Water', 'Everything Everywhere All at Once', 'The Banshees of Inisherin'],
        correctAnswer: 2,
        difficulty: 'medium',
        categoryId: 5, // Entertainment
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('questions', null, {});
  }
};