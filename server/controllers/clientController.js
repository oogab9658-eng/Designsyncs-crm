const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getMyProject = async (req, res) => {
  try {
    const project = await Project.findOne({ client: req.user._id });
    if (!project) return res.status(404).json({ message: 'No project found for this account' });

    const tasks = await Task.find({ projectId: project._id }).sort('order');
    res.json({ project, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
