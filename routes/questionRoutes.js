const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  getQuestionsByUser,
  getQuestionsByTag
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('user/:userId', getQuestionsByUser);
router.get('/tags/:tagId', getQuestionsByTag);

// Protected routes
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.put('/:id/upvote', protect, upvoteQuestion);
router.put('/:id/downvote', protect, downvoteQuestion);

module.exports = router;