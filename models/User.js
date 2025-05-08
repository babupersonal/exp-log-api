const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  nextLevelExp: { type: Number, default: 1000 },
  skills: [
    {
      name: String,
      exp: Number,
      color: String
    }
  ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
