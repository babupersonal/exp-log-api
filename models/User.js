const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  password: String, // 可以是 null，因為 Google 登入不需要
  googleId: String, // 加這個
  level: Number,
  exp: Number,
  nextLevelExp: Number,
  skills: [String]
});

module.exports = mongoose.model('User', userSchema);
