require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/designsyncs');

    // Delete existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    const users = [
      {
        name: 'Admin User',
        email: 'admin@designsyncs.com',
        password: 'admin123',
        role: 'admin',
        specialization: 'None'
      },
      {
        name: 'Team Member',
        email: 'team@designsyncs.com',
        password: 'team123',
        role: 'team',
        specialization: 'UI/UX'
      },
      {
        name: 'Client User',
        email: 'client@designsyncs.com',
        password: 'client123',
        role: 'client',
        specialization: 'None'
      }
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`User ${userData.email} created`);
    }

    // Create sample project
    const client = await User.findOne({ role: 'client' });
    const project = await Project.create({
      name: 'Sample Website Project',
      client: client._id,
      status: 'In Progress',
      deadline: new Date('2026-02-01'),
      progress: 50
    });

    // Create sample tasks
    const team = await User.findOne({ role: 'team' });
    await Task.create({
      projectId: project._id,
      title: 'UI/UX Design',
      assignedTo: team._id,
      status: 'Completed',
      order: 1
    });
    await Task.create({
      projectId: project._id,
      title: 'Development',
      assignedTo: team._id,
      status: 'In Progress',
      order: 2
    });

    console.log('Sample data created');
    console.log('Seeding completed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();