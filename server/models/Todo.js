const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TodoSchema = new mongoose.Schema({
  user: { type: Number, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  subtasks: [SubtaskSchema]
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
