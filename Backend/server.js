// import express from 'express';
// import mongoose from 'mongoose';
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import cors from 'cors';

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/users', userRoutes);
// mongoose.connect('mongodb://localhost:27017/devbook')
//   .then(() => {
//     app.listen(5000, () => console.log('Server running on port 5000'));
//   })
//   .catch(err => console.log(err));






import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

import cron from 'node-cron';
import Post from './models/Post.js';
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

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
  .connect('mongodb://localhost:27017/devbook')
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.log('❌ MongoDB Connection Error:', err));
