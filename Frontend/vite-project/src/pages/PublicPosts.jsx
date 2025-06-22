import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function PublicPosts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/public/posts");
    const publishedPosts = res.data.filter((post) => post.status === "published");
    setPosts(publishedPosts);
  };

  const handleLike = async (postId) => {
    const res = await axios.post(`http://localhost:5000/api/public/posts/${postId}/like`);
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, likes: Array(res.data.likes).fill("👍") }
          : p
      )
    );
  };

  const handleCommentChange = (id, value) => {
    setNewComments({ ...newComments, [id]: value });
  };

  const handleCommentSubmit = async (e, id) => {
    e.preventDefault();
    const res = await axios.post(`http://localhost:5000/api/public/posts/${id}/comment`, {
      text: newComments[id],
    });
    setComments({ ...comments, [id]: res.data });
    setNewComments({ ...newComments, [id]: "" });
  };

  return (
    <>
    <div className="min-h-screen pt-[64px] pb-10 bg-gray-50">
      <div className="max-w-10xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Explore Blogs</h2>

        {posts.length === 0 ? (
          <p className="text-gray-600 text-lg text-center mt-10">📭 No blogs found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border rounded-lg p-5 bg-white shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>

                <div className="mb-3 prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  <strong>Author:</strong> {post.author?.name || "Unknown"}
                </p>

                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    ❤️ {post.likes?.length || 0}
                  </button>
                </div>

                <form
                  onSubmit={(e) => handleCommentSubmit(e, post._id)}
                  className="flex gap-2 mb-3"
                >
                  <input
                    type="text"
                    value={newComments[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Write a comment"
                    className="border p-2 rounded w-full text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  >
                    Comment
                  </button>
                </form>

                <div>
                  {(comments[post._id] || post.comments || []).map((c, i) => (
                    <div key={i} className="text-sm text-gray-700 border-t pt-2 mt-2">
                      <strong>User:</strong> {c.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default PublicPosts;
