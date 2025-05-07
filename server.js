const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let messages = []; // In-memory message store

// GET all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// POST a new message
app.post('/messages', (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const newMessage = {
    name,
    message,
    timestamp: Date.now()
  };

  messages.push(newMessage);
  res.json({ status: 'success', message: newMessage });
});

// DELETE all messages
app.delete('/messages', (req, res) => {
  messages = [];
  res.json({ status: 'cleared' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
