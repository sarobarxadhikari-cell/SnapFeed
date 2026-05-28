require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('../models/User');

const seedUsers = [
  { name: 'Alex Snapfeed', email: 'alex@snapfeed.com', password: 'password123', avatar: '', bio: 'Building the future of social communication' },
  { name: 'Sam Wilson', email: 'sam@snapfeed.com', password: 'password123', avatar: '', bio: 'Full-stack developer & designer' },
  { name: 'Jordan Lee', email: 'jordan@snapfeed.com', password: 'password123', avatar: '', bio: 'Digital creator & photographer' },
  { name: 'Demo User', email: 'demo@snapfeed.com', password: 'demo123456', avatar: '', bio: 'Just exploring Snapfeed Ultra' },
];

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log('Seed completed: 4 users created');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
