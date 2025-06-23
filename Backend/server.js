
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import Post from './models/Post.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use("/api/public", publicRoutes);

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const postsToPublish = await Post.find({
    status: 'scheduled',
    scheduledAt: { $lte: now },
  });

  for (const post of postsToPublish) {
    post.status = 'published';
    await post.save();
    console.log(`✅ Published scheduled post: ${post.title}`);
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));
