require('dotenv').config();
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Company = require('../src/models/Company');
const bcrypt = require('bcryptjs');

(async function seed() {
  try {
    await connectDB(process.env.MONGO_URI);
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log('Admin exists', existing.email);
      process.exit(0);
    }
    const company = new Company({ name: 'Demo Company', country: 'India', currency: 'INR' });
    await company.save();
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
    const admin = new User({ name: 'Admin', email: process.env.ADMIN_EMAIL, passwordHash: passHash, role: 'Admin', company: company._id });
    await admin.save();
    console.log('Seeded Admin user:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
