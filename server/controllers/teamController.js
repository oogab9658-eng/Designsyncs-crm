const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('projectId').populate('assignedTo', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // RBAC: Only assigned member can change status
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }

    task.status = status;
    task.updatedAt = Date.now();
    await task.save();

    // Auto-update project progress
    const projectTasks = await Task.find({ projectId: task.projectId });
    const completedCount = projectTasks.filter(t => t.status === 'Completed').length;
    const progress = Math.round((completedCount / projectTasks.length) * 100);

    await Project.findByIdAndUpdate(task.projectId, { progress });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
