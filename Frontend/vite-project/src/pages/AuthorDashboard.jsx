
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import EditPostForm from "../components/EditPostForm";
import AuthorSidebar from "../components/AuthorSidebar";

function AuthorDashboard() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [currentView, setCurrentView] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPosts(res.data);
      setFilteredPosts(res.data); 
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const updated = posts.filter((p) => p._id !== id);
      setPosts(updated);
      setFilteredPosts(updated);
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handlePostCreated = (newPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    setFilteredPosts(updated);
    setCurrentView("posts");
  };

  const handlePostUpdated = (updatedPost) => {
    const updated = posts.map((p) =>
      p._id === updatedPost._id ? updatedPost : p
    );
    setPosts(updated);
    setFilteredPosts(updated);
    setEditingPost(null);
    setCurrentView("posts");
  };

const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);

  const filtered = posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(query);
    const categoryMatch = post.category?.toLowerCase().includes(query);
    const tagsMatch = post.tags?.some((tag) =>
      tag.toLowerCase().includes(query)
    );

    return titleMatch || categoryMatch || tagsMatch;
  });

  setFilteredPosts(filtered);
};



  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div className="pt-[64px] lg:pr-72 relative min-h-screen bg-white">
        <h2 className="text-2xl font-bold mb-4">Author Dashboard</h2>

        <AuthorSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {currentView === "create" &&
          (editingPost ? (
            <EditPostForm
              post={editingPost}
              onPostUpdated={handlePostUpdated}
              onCancel={() => {
                setEditingPost(null);
                setCurrentView("posts");
              }}
            />
          ) : (
            <CreatePostForm onPostCreated={handlePostCreated} />
          ))}

        {currentView === "posts" && (
          <>
     <input
  type="text"
  value={searchQuery}
  onChange={handleSearch}
  placeholder="Search posts by category, or tags..."
  className={`peer w-full pl-10 p-3 border ${
    searchQuery ? "border-blue-500" : "border-gray-300"
  } rounded-md focus:outline-none focus:ring-2 focus:ring-skyblue bg-white text-left mb-6`}
/>

<h3 className="text-xl font-semibold mt-2 mb-2">All Posts</h3>

{filteredPosts.length === 0 ? (
  <p>No posts found.</p>
) : (
  filteredPosts.map((post) => (
    <PostCard
      key={post._id}
      post={post}
      onDelete={handleDelete}
      onEdit={(p) => {
        setEditingPost(p);
        setCurrentView("create");
      }}
    />
  ))
)}

          </>
        )}
      </div>
    </>
  );
}

export default AuthorDashboard;
