const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/user', (req, res) => {
  res.json({
    name: "黃楷烜",
    level: 7,
    exp: 1230,
    nextLevelExp: 2000,
    skills: [
      { name: "React", exp: 80, color: "bg-blue-400" },
      { name: "Node.js", exp: 60, color: "bg-green-400" },
      { name: "Tailwind CSS", exp: 90, color: "bg-purple-400" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
