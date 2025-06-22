import express from "express";
import {
  getAllPublicPosts,
  likePublicPost,
  commentOnPublicPost,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/posts", getAllPublicPosts);
router.post("/posts/:id/like", likePublicPost);
router.post("/posts/:id/comment", commentOnPublicPost);

export default router;
