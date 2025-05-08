const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  level: Number,
  exp: Number,
  nextLevelExp: Number,
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
