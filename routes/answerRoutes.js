const express = require('express');
const router = express.Router();
const {
  getAnswersByQuestion,
  getAnswerByUser,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  upvoteAnswer,
  downvoteAnswer
} = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/question/:questionId', getAnswersByQuestion);
router.get('/user/:userId', getAnswerByUser);

// Protected routes
router.post('/:questionId', protect, createAnswer);
router.put('/:id', protect, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.put('/:id/accept', protect, acceptAnswer);
router.put('/:id/upvote', protect, upvoteAnswer);
router.put('/:id/downvote', protect, downvoteAnswer);

module.exports = router;