const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  bio: String,
  phone: String,
  photo: String,
  isPublic: { type: Boolean, default: true },
  role: { type: String, default: 'user' } // 'user' or 'admin'
});

module.exports = mongoose.model('User', userSchema);
