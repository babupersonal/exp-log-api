const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const verifyToken = require('./middleware/auth');


app.use('/api', authRoutes); // /api/login, /api/register
app.use('/api/user', verifyToken, userRoutes); // 所有 user 資料都需登入

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB 連線成功"))
.catch(err => console.error("❌ MongoDB 連線失敗:", err));

// Middleware
app.use(cors());
app.use(express.json()); 

app.get('/api/user', async (req, res) => {
  try {
    let user = await User.findOne({ name: "黃楷烜" });

    if (!user) {
      user = new User({
        name: "黃楷烜",
        level: 7,
        exp: 0,
        nextLevelExp: 2000,
        skills: [
          { name: "Youtube", exp: 80, color: "bg-blue-400" },
          { name: "Thread", exp: 60, color: "bg-green-400" },
          { name: "Facebook", exp: 90, color: "bg-purple-400" }
        ]
      });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("讀取失敗：", err);
    res.status(500).json({ error: '資料庫錯誤' });
  }
});

app.post('/api/user/exp', async (req, res) => {
  const { addExp } = req.body;
  try {
    const user = await User.findOne({ name: "黃楷烜" });
    if (!user) return res.status(404).json({ error: '找不到使用者' });

    user.exp += addExp;

    while (user.exp >= user.nextLevelExp) {
      user.exp -= user.nextLevelExp;
      user.level += 1;
      user.nextLevelExp = Math.floor(user.nextLevelExp * 1.2);
    }

    await user.save();
    res.json({ status: 'ok', exp: user.exp, level: user.level });
  } catch (err) {
    console.error("更新 EXP 失敗：", err);
    res.status(500).json({ error: '更新錯誤' });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
