import Post from "../models/Post.js";

export const getAllPublicPosts = async (req, res) => {
try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const likePublicPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: "Post not found" });

  const identifier = req.user?._id?.toString() || req.ip;

  if (!identifier) return res.status(400).json({ msg: "Invalid user/IP" });

  if (!post.likes.includes(identifier)) {
    post.likes.push(identifier);
  } else {
    post.likes = post.likes.filter(id => id !== identifier);
  }

  await post.save();
  res.json({ likes: post.likes.length });
};


export const commentOnPublicPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({
      user: null,
      text: req.body.text || "No content",
    });
    await post.save();

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
