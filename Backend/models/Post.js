import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  category: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: String }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published", "scheduled"],
    default: "draft",
  },
  scheduledAt: Date,
});

export default mongoose.model('Post', postSchema);
