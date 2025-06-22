import axios from "axios";
import { getToken } from "../utils/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  tags: Yup.string().required("Tags are required"),
  category: Yup.string().required("Category is required"),
});

function EditPostForm({ post, onPostUpdated, onCancel }) {
  const initialValues = {
    title: post.title,
    content: post.content,
    tags: post.tags.join(", "),
    category: post.category,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${post._id}`,
        {
          ...values,
          tags: values.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      onPostUpdated(res.data);
    } catch (err) {
      alert("Error updating post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-md space-y-4 w-full max-w-[1300px]">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Edit Post
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <Field
                  name="title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter post title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Content (Markdown)
                </label>
                <MdEditor
                  value={values.content}
                  style={{ height: "400px" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={({ text }) => setFieldValue("content", text)}
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tags (comma separated)
                </label>
                <Field
                  name="tags"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. react, blog"
                />
                <ErrorMessage
                  name="tags"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <Field
                  name="category"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter category"
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-medium shadow transition"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
    </>
  );
}

export default EditPostForm;
