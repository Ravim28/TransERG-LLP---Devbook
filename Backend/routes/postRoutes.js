import express from 'express';
import { createPost, getPosts, updatePost, deletePost 
 } from '../controllers/postController.js';
import { verifyToken } from '../middleware/auth.js';
import { likePost, addComment } from '../controllers/postController.js';

const router = express.Router();

router.post('/:id/like', verifyToken, likePost);
router.post('/:id/comment', verifyToken, addComment);
router.post('/', verifyToken, createPost);
router.get('/', verifyToken, getPosts);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

export default router;
