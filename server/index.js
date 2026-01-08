const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/two_user_todos';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connect error', err));

const Todo = require('./models/Todo');

app.get('/api/todos', async (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: 'user query required' });
  const todos = await Todo.find({ user: parseInt(user) }).sort('-createdAt');
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { user, title, subtasks } = req.body;
  if (!user || !title) return res.status(400).json({ error: 'user and title required' });
  const todo = new Todo({ user, title, subtasks: subtasks || [] });
  await todo.save();
  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const updates = req.body;
  const todo = await Todo.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const path = require('path');
const fs = require('fs');

const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
