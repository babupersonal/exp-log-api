const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// 登入
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user || password !== '123456') {
    return res.status(401).json({ error: '帳號或密碼錯誤' });
  }

  const token = jwt.sign({ name: user.name }, JWT_SECRET, { expiresIn: '3h' });
  res.json({ token });
});

// 註冊（可選）
router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  let user = await User.findOne({ name });
  if (user) return res.status(400).json({ error: '使用者已存在' });

  user = new User({
    name,
    password, // ⚠️ 實務上應該 hash 密碼
    level: 1,
    exp: 0,
    nextLevelExp: 1000,
    skills: []
  });

  await user.save();
  res.json({ status: '註冊成功' });
});

module.exports = router;
