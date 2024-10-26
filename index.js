const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

const PORT = process.env.PORT || 25701;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});