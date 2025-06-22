import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import EditPostForm from "../components/EditPostForm";
// import PostFilter from "../components/PostFiiter";
import AdminSidebar from "../components/AdminSidebar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [filters, setFilters] = useState({ tag: "", category: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [currentView, setCurrentView] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(false);
      const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
 

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

  const fetchPosts = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/posts?${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPosts(res.data);
      // setPosts(res.data);
setFilteredPosts(res.data); // so filtering works

    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
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
    setPosts([newPost, ...posts]);
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


  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };
 useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
    <div className="pt-[64px] lg:pr-72 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <AdminSidebar
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
            }}          />
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

      {currentView === "users" && (
        <>
          {editingUser && (
            <Formik
              initialValues={{
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Name is required"),
                email: Yup.string().email("Invalid email").required("Email is required"),
                role: Yup.string().required("Role is required"),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const res = await axios.put(
                    `http://localhost:5000/api/users/${editingUser._id}`,
                    values,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                  );
                  setUsers(users.map((u) => (u._id === res.data._id ? res.data : u)));
                  setEditingUser(null);
                  resetForm();
                } catch (err) {
                  console.error("Update failed", err);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <Form className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="text-lg font-bold mb-2">Edit User</h3>
                <Field name="name" type="text" placeholder="Name" className="border p-2 rounded w-full mb-2" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mb-2" />

                <Field name="email" type="email" placeholder="Email" className="border p-2 rounded w-full mb-2" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mb-2" />

                <Field name="role" as="select" className="border p-2 rounded w-full mb-4">
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Author">Author</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mb-2" />

                <div className="flex gap-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-400 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </Formik>
          )}

          <h3 className="text-2xl text-white font-bold mt-6 mb-2 bg-blue-600 rounded text-center">All Registered Users</h3>
          <div className="bg-white shadow p-4 rounded">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border p-2 text-center">{user.name}</td>
                    <td className="border p-2 text-center">{user.email}</td>
                    <td className="border p-2 text-center">{user.role}</td>
                    <td className="border p-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
    </>
  );
}

export default AdminDashboard;
