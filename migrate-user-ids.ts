import mongoose from 'mongoose';
import { User } from './src/models/user.model';

/**
 * Migration script to assign sequential userId to existing users
 * Run once to populate userId field for all existing documents
 */
async function migrateUserIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-api');
    console.log('Connected to MongoDB');

    // Get all users without userId
    const usersWithoutId = await User.find({ userId: { $exists: false } }).sort({ createdAt: 1 });
    
    if (usersWithoutId.length === 0) {
      console.log('All users already have userId assigned');
      await mongoose.disconnect();
      return;
    }

    console.log(`Found ${usersWithoutId.length} users without userId`);

    // Get the current max userId
    const maxUserIdDoc = await User.findOne({ userId: { $exists: true } }).sort({ userId: -1 });
    let nextUserId = maxUserIdDoc?.userId ? maxUserIdDoc.userId + 1 : 1;

    // Assign sequential userId to users without it
    for (const user of usersWithoutId) {
      user.userId = nextUserId;
      await user.save();
      console.log(`Assigned userId ${nextUserId} to ${user.email}`);
      nextUserId++;
    }

    console.log('Migration completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserIds();
