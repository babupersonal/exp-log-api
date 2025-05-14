// ✅ 套件引入
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ MongoDB 連線
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB 連線成功');
}).catch(err => {
  console.error('❌ MongoDB 連線失敗:', err);
});

// ✅ 中介軟體 middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Passport 序列化
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

console.log('🔍 GOOGLE_CALLBACK_URL =', process.env.GOOGLE_CALLBACK_URL);

// ✅ Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        name: profile.displayName,
        googleId: profile.id,
        level: 1,
        exp: 0,
        nextLevelExp: 1000,
        skills: []
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Google OAuth 登入
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth 回調
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://exp-log.onrender.com/home');
  }
);

// 回傳登入使用者資料
app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: '未登入' });
  }
});

// ✅ 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
