const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

router.use(protect);

router.route('/').get(getTasks).post(validateTask, createTask);
router.route('/:id').get(getTask).put(validateTask, updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;
