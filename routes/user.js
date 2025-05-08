const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  // 透過 req.user.name 找資料
  const user = await User.findOne({ name: req.user.name });
  res.json(user);
});

router.post('/exp', async (req, res) => {
  const { addExp } = req.body;
  const user = await User.findOne({ name: req.user.name });

  if (!user) return res.status(404).json({ error: '找不到使用者' });

  user.exp += addExp;
  while (user.exp >= user.nextLevelExp) {
    user.exp -= user.nextLevelExp;
    user.level++;
    user.nextLevelExp = Math.floor(user.nextLevelExp * 1.2);
  }

  await user.save();
  res.json({ status: 'ok', level: user.level, exp: user.exp });
});

module.exports = router;
