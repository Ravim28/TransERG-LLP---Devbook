import Post from '../models/Post.js';


export const createPost = async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.user._id });
    await post.save();
      await post.populate("author", "name"); 

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { author: req.user._id };

    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.category) filter.category = req.query.category;

    const posts = await Post.find(filter).populate('author', 'name email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Not allowed' });
  }

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Not allowed' });
  }

  await post.deleteOne();
  const posts = await Post.find(
  req.user.role === 'Admin' ? {} : { author: req.user._id }
).populate('author', 'name email');
  res.json({ msg: 'Post deleted' });
};

export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const userId = req.user._id;
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  }
  await post.save();
  res.json({ likes: post.likes.length });
};

export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  res.json(post.comments);
};



