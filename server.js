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
    id: messages.length + 1, // Assign a unique ID based on the length of the array
    name,
    message,
    timestamp: Date.now(),
    comments: [] // Initialize with no comments
  };

  messages.push(newMessage);
  res.json({ status: 'success', message: newMessage });
});

// DELETE a specific message by ID
app.delete('/messages/:id', (req, res) => {
  const { id } = req.params;
  const messageIndex = messages.findIndex(msg => msg.id === parseInt(id));

  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages.splice(messageIndex, 1); // Remove the message from the array
  res.json({ status: 'success', message: 'Message deleted successfully' });
});

// POST a new comment to a message by ID
app.post('/messages/:id/comments', (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  const message = messages.find(msg => msg.id === parseInt(id));

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const newComment = {
    id: message.comments.length + 1,
    name,
    comment,
    timestamp: Date.now()
  };

  message.comments.push(newComment);
  res.json({ status: 'success', comment: newComment });
});

// DELETE a specific comment by message ID and comment ID
app.delete('/messages/:messageId/comments/:commentId', (req, res) => {
  const { messageId, commentId } = req.params;
  const message = messages.find(msg => msg.id === parseInt(messageId));

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const commentIndex = message.comments.findIndex(comment => comment.id === parseInt(commentId));

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  message.comments.splice(commentIndex, 1); // Remove the comment
  res.json({ status: 'success', message: 'Comment deleted successfully' });
});

// DELETE all messages
app.delete('/messages', (req, res) => {
  messages = [];
  res.json({ status: 'cleared' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
