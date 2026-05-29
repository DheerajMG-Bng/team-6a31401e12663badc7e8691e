const express = require('express');
const router = express.Router();
const {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getPopularTags
} = require('../controllers/tagController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllTags);
router.get('/popular', getPopularTags);
router.get('/:id', getTagById);

// Protected routes (only moderators/admins can manage tags)
router.post('/', protect, authorize('moderator', 'admin'), createTag);
router.put('/:id', protect, authorize('moderator', 'admin'), updateTag);
router.delete('/:id', protect, authorize('admin'), deleteTag);

module.exports = router;