



import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getToken } from "../utils/auth";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt();

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  tags: Yup.string().required("Tags are required"),
  category: Yup.string().required("Category is required"),
  scheduledAt: Yup.string(),
});

function CreatePostForm({ onPostCreated }) {
  const initialValues = {
    title: "",
    content: "",
    tags: "",
    category: "",
    scheduledAt: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const newPost = {
      ...values,
      tags: values.tags.split(",").map((tag) => tag.trim()),
      status: values.scheduledAt ? "scheduled" : "published",
      scheduledAt: values.scheduledAt || null,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/posts", newPost, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      onPostCreated(res.data);
      resetForm();
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-white bg-blue-600 mb-6 rounded">
        Create New Post
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-8xl mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
                  Title
                </label>
                <Field
                  name="title"
                  type="text"
                  placeholder="Post Title"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Content</label>
                <div className="border border-gray-300 rounded overflow-hidden">
                  <MdEditor
                    value={values.content}
                    style={{ height: "300px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={({ text }) => setFieldValue("content", text)}
                  />
                </div>
                <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="tags" className="block mb-1 font-medium text-gray-700">
                  Tags
                </label>
                <Field
                  name="tags"
                  type="text"
                  placeholder="e.g. react, blog"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="tags" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="category" className="block mb-1 font-medium text-gray-700">
                  Category
                </label>
                <Field
                  name="category"
                  type="text"
                  placeholder="Enter category"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="scheduledAt" className="block mb-1 font-medium text-gray-700">
                  Schedule (optional)
                </label>
                <Field
                  name="scheduledAt"
                  type="datetime-local"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="scheduledAt"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default CreatePostForm;
