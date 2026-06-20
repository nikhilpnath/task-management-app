import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Task from '../models/Task';

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('Error: MONGO_URL environment variable is not defined in server/.env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB successfully.');

    // Clear existing collections
    console.log('Clearing existing users and tasks...');
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Collections cleared.');

    // Hash passwords
    console.log('Hashing passwords for seed user...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create seed users
    console.log('Creating user...');
    const users = await User.create([
      {
        name: 'Test User',
        email: 'testing@gmail.com',
        password: hashedPassword,
      }
    ]);
    console.log(`Seeded ${users.length} users successfully.`);

    // Create seed tasks
    console.log('Creating tasks...');
    const tasks = await Task.create([
      {
        title: 'Complete Project Roadmap',
        description: 'Detail the timeline, major milestones, and initial sprint goals.',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: 'testing@gmail.com',
      },
      {
        title: 'Review Pull Requests',
        description: 'Perform code review on outstanding backend and frontend branches.',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdBy: 'testing@gmail.com',
      },
      {
        title: 'Design FlowBoard Dashboard Mockups',
        description: 'Create landing, login, and dashboard user interface screens.',
        priority: 'high',
        status: 'done',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        createdBy: 'testing@gmail.com',
      },
      {
        title: 'Configure CI/CD Pipelines',
        description: 'Set up automated build, test, and container deployment workflows.',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdBy: 'testing@gmail.com',
      },
    ]);
    console.log(`Seeded ${tasks.length} tasks successfully.`);

    console.log('Database seeding process completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected successfully.');
    process.exit(0);
  }
};

seedDatabase();
