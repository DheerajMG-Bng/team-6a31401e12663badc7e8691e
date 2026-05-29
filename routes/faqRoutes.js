const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  approveFAQ,
  getFAQsByTag
} = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllFAQs);
router.get('/:id', getFAQById);
router.get('/tags/:tagId', getFAQsByTag);

// Protected routes
router.post('/', protect, authorize('moderator', 'admin'), createFAQ);
router.put('/:id', protect, authorize('moderator', 'admin'), updateFAQ);
router.delete('/:id', protect, authorize('admin'), deleteFAQ);
router.put('/:id/approve', protect, authorize('moderator', 'admin'), approveFAQ);

module.exports = router;