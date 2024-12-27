const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 3005;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/socialmedia', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define schema for users
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Define schema for posts
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

// Define schema for comments
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// User routes
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).send(user);
});

// Post routes
app.post('/api/posts', async (req, res) => {
  const post = new Post({ ...req.body, userId: req.user._id });
  await post.save();
  res.status(201).send(post);
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().populate('userId');
  res.send(posts);
});

// Comment routes
app.post('/api/comments', async (req, res) => {
  const comment = new Comment({ ...req.body, userId: req.user._id });
  await comment.save();
  res.status(201).send(comment);
});

app.get('/api/comments/:postId', async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).populate('userId');
  res.send(comments);
});

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});