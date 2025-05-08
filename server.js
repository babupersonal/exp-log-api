const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const verifyToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB 連線
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB 連線成功"))
.catch(err => console.error("❌ MongoDB 連線失敗:", err));

// Middleware
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', authRoutes);                          
app.use('/api/user', verifyToken, userRoutes);     

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
