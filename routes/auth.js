const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post('/register', async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: '缺少帳號或密碼' });

  const existingUser = await User.findOne({ name });
  if (existingUser) return res.status(400).json({ error: '帳號已存在' });

  const hashedPwd = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    password: hashedPwd,
    level: 1,
    exp: 0,
    nextLevelExp: 1000,
    skills: []
  });

  await newUser.save();
  res.json({ status: '註冊成功' });
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (!user) return res.status(404).json({ error: '找不到帳號' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: '密碼錯誤' });

  const token = jwt.sign({ name: user.name }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

module.exports = router;
