const express = require('express');
const { Question, Category } = require('../models');
const router = express.Router();

// Get random questions
router.get('/questions', async (req, res) => {
  try {
    const { 
      lang = 'en', 
      category, 
      difficulty, 
      limit = 10 
    } = req.query;

    const whereConditions = {
      isActive: true
    };

    if (category && category !== 'all') {
      whereConditions.categoryId = category;
    }

    if (difficulty && difficulty !== 'mixed') {
      whereConditions.difficulty = difficulty;
    }

    const questions = await Question.findAll({
      where: whereConditions,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', `name${lang.toUpperCase()}`]
      }],
      order: [['timesPlayed', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    // Format questions for frontend
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question: q[`question${lang.toUpperCase()}`] || q.questionEN,
      options: q[`options${lang.toUpperCase()}`] || q.optionsEN,
      correct: q.correctAnswer,
      category: q.category[`name${lang.toUpperCase()}`] || q.category.nameEN,
      difficulty: q.difficulty
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    const categories = await Category.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', `name${lang.toUpperCase()}`, 'icon', 'difficulty'],
      order: ['name']
    });

    const formattedCategories = categories.map(c => ({
      id: c.id,
      name: c.name,
      displayName: c[`name${lang.toUpperCase()}`] || c.nameEN,
      icon: c.icon,
      difficulty: c.difficulty
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;