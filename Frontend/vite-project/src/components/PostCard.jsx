import { getUser, getToken } from "../utils/auth";
import axios from "axios";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function PostCard({ post, onDelete, onEdit }) {
  const user = getUser();

  const isAuthorOrAdmin =
    user &&
    (user.role === "Admin" ||
      user.role === "Author" ||
      post.author?._id === user?.id);

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setLikes(res.data.likes);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comment`,
        { text: comment },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setComments(res.data);
      setComment("");
    } catch (error) {
      console.error("Comment failed", error);
    }
  };

  return (
      <>
    <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white mb-6 transition hover:shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h3>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
<ReactMarkdown>
  {post.content}
</ReactMarkdown>      </p>

      <div className="text-sm text-gray-500 mb-1">
        <span className="mr-4">
          <strong>Tags:</strong> {post.tags?.join(", ") || "None"}
        </span>
        <span>
          <strong>Category:</strong> {post.category || "General"}
        </span>
      </div>

      <div className="text-sm text-gray-400 mb-2">
        <strong>Author:</strong> {post.author?.name || "Unknown"}
      </div>

      <div
        className={`text-sm font-semibold mb-4 ${
          post.status === "draft"
            ? "text-yellow-600"
            : post.status === "scheduled"
            ? "text-blue-600"
            : "text-green-600"
        }`}
      >
        Status: {post.status?.toUpperCase()}
      </div>

      <div className="flex flex-wrap gap-3 mt-2">
        <button
          onClick={handleLike}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition"
        >
          ❤️ Like ({likes})
        </button>

        {isAuthorOrAdmin && (
          <>
            <button
              onClick={() => onEdit(post)}
              className="bg-blue-600 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md text-sm transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="bg-blue-600 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition"
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>

      <form onSubmit={handleComment} className="mt-6 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm transition"
        >
          💬 Comment
        </button>
      </form>

      {comments.length > 0 && (
        <div className="mt-5 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">
            Comments ({comments.length})
          </h4>
          {comments.map((c, idx) => (
            <div key={idx} className="text-sm text-gray-700">
              <span className="font-medium">{c.user?.name || "User"}:</span>{" "}
              {c.text}
            </div>
          ))}
        </div>
      )}
    </div>
  </>
  );
}

export default PostCard;
