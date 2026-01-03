const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createClientWorkflow = async (req, res) => {
  try {
    const { name, email, password, projectName, deadline } = req.body;

    if (!name || !email || !password || !projectName || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: 'Invalid deadline date' });
    }

    // 1. Create Client User
    const client = await User.create({
      name,
      email,
      password,
      role: 'client'
    });

    // 2. Create Project
    const project = await Project.create({
      name: projectName,
      client: client._id,
      deadline: deadlineDate,
      status: 'Onboarding'
    });

    // 3. Create Automated Tasks (Sequential)
    const stages = ['Content', 'UI/UX', 'Dev', 'SEO'];
    for (let i = 0; i < stages.length; i++) {
      // Find a team member specializing in this stage
      const assignee = await User.findOne({ role: 'team', specialization: stages[i] });
      
      await Task.create({
        projectId: project._id,
        title: `${stages[i]} Implementation`,
        assignedTo: assignee ? assignee._id : null,
        order: i + 1,
        status: 'Pending'
      });
    }

    res.status(201).json({ message: 'Client and workflow created successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    
    const teamPerformance = await User.find({ role: 'team' }).lean();
    const projects = await Project.find().populate('client', 'name');

    // Calculate progress for each project
    const projectStats = await Promise.all(projects.map(async (proj) => {
      const tasks = await Task.find({ projectId: proj._id });
      const completed = tasks.filter(t => t.status === 'Completed').length;
      const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
      return { ...proj.toObject(), progress };
    }));

    res.json({
      summary: { totalProjects, completedProjects, totalTasks, completedTasks },
      projectStats,
      teamPerformance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};
