const mongoose = require('mongoose');
const User = require('../server/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const createAdminUser = async () => {
  try {
    const adminUser = new User({
      email: 'admin@ailedgerpro.com',
      password: 'AdminSecurePass123!',
      companyName: 'AI Ledger Pro',
      kvkNumber: 'ADMIN001',
      vatNumber: 'ADMIN001',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdminUser();