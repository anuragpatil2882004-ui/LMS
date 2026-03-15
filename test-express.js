const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('<h1>Hello from Express!</h1><p>LMS Test Server</p>');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server listening on http://0.0.0.0:${port}`);
});