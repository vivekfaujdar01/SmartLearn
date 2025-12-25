// User Model - Database schema and methods for user accounts
import mongoose from 'mongoose'; // MongoDB ODM for schema definition
import bcrypt from 'bcryptjs'; // Password hashing library for secure storage

/**
 * User Schema definition for MongoDB using Mongoose
 * Defines the structure of user documents in the 'users' collection
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's display name
  email: { type: String, required: true, unique: true, lowercase: true }, // Email address (used for login, stored lowercase)
  // 'select: false' ensures password isn't returned in queries by default for security
  password: { type: String, required: true, select: false }, // Hashed password (never store plain text!)
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' }, // User role for authorization
  createdAt: { type: Date, default: Date.now } // Account creation timestamp
});

/**
 * Pre-save middleware to hash the password before saving to the database
 * This runs automatically when a new user is created or password is changed
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  // This prevents re-hashing on updates to other fields
  if (!this.isModified('password')) return next();

  // Hash the password with a salt round of 10 (10 is a good balance of security and speed)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Instance method to compare a candidate password with the hashed password in DB
 * @param candidate - Plain text password to verify
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password); // bcrypt handles the comparison securely
};

export default mongoose.model('User', userSchema); // Export User model for use in controllers
