const Task = require('../models/Task');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort, page = 1, limit = 50 } = req.query;

    const filter = { user: req.user.id };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'dueDate') sortOption = { dueDate: 1 };
    else if (sort === 'priority') {
      sortOption = { priority: -1, createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    // Dashboard stats
    const [totalCount, completedCount, pendingCount] = await Promise.all([
      Task.countDocuments({ user: req.user.id }),
      Task.countDocuments({ user: req.user.id, status: 'completed' }),
      Task.countDocuments({ user: req.user.id, status: 'pending' }),
    ]);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      stats: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
        completionRate:
          totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0,
      },
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, toggleTaskStatus };
