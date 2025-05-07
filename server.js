const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let messages = []; // In-memory message store
let nextId = 1;

// Get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Post a new message
app.post('/messages', (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const newMessage = {
    id: nextId++,
    name,
    message,
    timestamp: Date.now(),
    comments: []
  };

  messages.push(newMessage);
  res.json({ status: 'success', message: newMessage });
});

// Post a comment to a message
app.post('/messages/:id/comments', (req, res) => {
  const messageId = parseInt(req.params.id);
  const { name, comment } = req.body;

  const msg = messages.find(m => m.id === messageId);
  if (!msg) {
    return res.status(404).json({ error: 'Message not found' });
  }

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  msg.comments.push({
    name,
    comment,
    timestamp: Date.now()
  });

  res.json({ status: 'success', comment: { name, comment } });
});

// Clear all messages
app.delete('/messages', (req, res) => {
  messages = [];
  nextId = 1;
  res.json({ status: 'cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
