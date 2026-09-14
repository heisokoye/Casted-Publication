import React, {useState, useEffect} from "react"
import { BsPencil, BsTrash, BsImage, BsCameraVideo } from 'react-icons/bs';
import ReactQuill from 'react-quill-new'; // rich text editor used for post content
import 'react-quill-new/dist/quill.snow.css';
import {addDoc, collection, serverTimestamp} from "firebase/firestore"; // used to add new documents
import { db} from "../../../Firebase"; // firebase exports (Firestore + Storage)
import {listenToPosts} from "./firestoreListen" // helper that listens to posts collection changes
import {doc, updateDoc, deleteDoc} from "firebase/firestore"; // CRUD helpers for Firestore
import Loader from "../../../components/loader/Loader"; // spinner component shown while loading data"
import '../../../App.css';
import { normalizeRichTextHtml } from "../../../utils/richText";
// Configuration for the ReactQuill editor's toolbar
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }], // header dropdown (H1, H2, normal)
    ['bold', 'italic', 'underline', 'strike', 'blockquote'], // inline styles
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], // lists/indent
    ['link', 'image', 'video'], // media / link
    ['clean'] // remove formatting
  ],
};

// Allowed formats for the ReactQuill editor (keeps editor content predictable)
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

// The main Dashboard component for the admin panel
const Dashboard = () => {
  // Controls whether the "Add / Edit Post" modal is visible
  const [isOpen, setIsOpen] = useState(false);
  
  // loading state: true while we fetch posts from Firestore
  const [loading, setLoading] = useState(true);

  // File upload state
  const [file, setFile] = useState(null); // selected file object (image/video)
  const [uploadProgress, setUploadProgress] = useState(0); // percentage during upload
  const [isUploading, setIsUploading] = useState(false); // disables form buttons during upload

  // Editing state: when editing an existing post, this holds the post object
  // null => adding a new post
  const [editingPost, setEditingPost] = useState(null);

  // Delete confirmation modal state: holds the post object to delete or null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Title / content of the post form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 

  // Local cached posts fetched from Firestore
  const [posts, setPosts] = useState([]);

  // Open the modal. If a post is supplied we populate the form for editing.
  const openModal = (post = null) => {
    if (post) {
      // entering "edit" mode: populate fields with post's data
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
    } else {
      // entering "add" mode: reset fields
      setEditingPost(null);
      setTitle('');
      setContent('');
      setFile(null);
    }
    // toggle modal visibility
    setIsOpen(!isOpen);
  };

  // Handler for editor content change
  const handleChange = (value) => {
    setContent(value);
  };

  // File input change handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // on mount: subscribe to posts collection via listenToPosts helper
  // listenToPosts should call the provided callback with an array of posts
  // and return an unsubscribe function.
  useEffect(() => {
    const unsubscribe = listenToPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false); // data received -> stop showing loader
    });
    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  // Form submit handler used for both adding new posts and updating existing ones
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: title required
    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    setIsUploading(true); // disable controls & show upload progress if file exists

    // default to values from the editing post if present
    let fileUrl = editingPost ? editingPost.fileUrl : '';
    let fileType = editingPost ? editingPost.fileType : '';

    // If user selected a new file, upload it to Firebase Storage
    if (file) {
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      if (!uploadPreset) {
        alert("Cloudinary upload preset is not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.");
        setIsUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset); 

      // Detect if it's an image or video
      const resourceType = file.type.startsWith("video") ? "video" : "image";

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dvhgc8tyi/${resourceType}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (!res.ok || !data.secure_url) {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
        fileUrl = data.secure_url;
        fileType = resourceType;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        alert("Upload to Cloudinary failed. Check your network or preset settings.");
        setIsUploading(false);
        return;
      }
    }


    // Build the post object that will be saved to Firestore
    const postData = {
      title,
      content: normalizeRichTextHtml(content),
      fileUrl,
      fileType,
    };

    try {
      if (editingPost) {
        // Update existing document: use the post's id to get a doc ref, then update it
        const postRef = doc(db, "posts", editingPost.id);
        await updateDoc(postRef, postData);
        alert("Post updated successfully!");
      } else {
        // Add a new document to the "posts" collection with createdAt timestamp
        await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: serverTimestamp(),
        });
        alert("Post added successfully!");
      }
      // Reset form and close modal on success
      resetAndCloseModal();
    } catch (error) {
      // If an error occurs while saving, stop any loading indicators and log it
      setLoading(false);
      console.error("Error saving document: ", error);
      alert("Error saving post. Check the console for details.");
    } finally {
      // always turn off uploading flag (enable UI again)
      setIsUploading(false);
    }
  };

  // Helper to reset form state and close the modal
  const resetAndCloseModal = () => {
    setTitle('');
    setContent('');
    setFile(null);
    setUploadProgress(0);
    setIsOpen(false);
  };

  // Open custom UI delete confirmation modal
  const promptDelete = (post) => {
    setDeleteTarget(post);
  };

  // Perform actual document deletion from Firestore after UI confirmation
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "posts", deleteTarget.id));
      console.log("Document successfully deleted!");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error removing document: ", error);
      alert("Failed to delete post. Check console for details.");
    } finally {
      setIsDeleting(false);
    }
  };


  // Render the dashboard UI
  return (
  <div className="min-h-screen bg-gray-50 pt-20 pb-12">
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your posts and content</p>
        </div>

        <button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white font-medium text-sm rounded-lg shadow hover:from-amber-600 hover:to-amber-700 transition self-start sm:self-auto"
        >
          + New Post
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group overflow-hidden"
            >
              {/* MEDIA */}
              <div className="shrink-0 w-24 sm:w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                {post.fileUrl && post.fileType === 'image' && (
                  <img
                    src={post.fileUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {post.fileUrl && post.fileType === 'video' && (
                  <video
                    src={post.fileUrl}
                    className="w-full h-full object-cover"
                  />
                )}
                {!post.fileUrl && (
                  <BsImage className="text-gray-400 text-xl" />
                )}
              </div>

              {/* BODY */}
              <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="text-gray-500 text-xs font-medium truncate shrink">
                    {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                  </span>
                  <div className="flex gap-2.5 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(post)}
                      className="p-2 text-gray-600 bg-gray-100/70 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                      title="Edit post"
                    >
                      <BsPencil size={13} />
                    </button>
                    <button
                      onClick={() => promptDelete(post)}
                      className="p-2 text-red-500 bg-red-50 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete post"
                    >
                      <BsTrash size={13} />
                    </button>
                  </div>
                </div>

                <h2 className="text-gray-900 font-semibold text-sm truncate">
                  {post.title || "Untitled Post"}
                </h2>

                <div className="flex justify-between items-center mt-2 text-gray-500 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    {post.fileType === 'video' ? <BsCameraVideo size={12} /> : <BsImage size={12} />}
                    {post.fileType === 'video' ? 'Video' : 'Article'}
                  </span>
                  <span className="text-amber-600 font-medium">Published</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* MODAL */}
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">

          {/* MODAL HEADER */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 border-b border-gray-100 shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <button
              onClick={resetAndCloseModal}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
            >
              ×
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
            
            {/* SCROLLABLE CONTENT AREA */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
              {/* TITLE */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* FILE */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">
                  Image / Video
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="w-full text-xs sm:text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>

              {/* EDITOR */}
              <div className="quill-container">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleChange}
                  modules={modules}
                  formats={formats}
                  className="h-44 sm:h-64 mb-14 sm:mb-12"
                />
              </div>

              {/* PROGRESS */}
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* FIXED FOOTER ACTIONS */}
            <div className="flex justify-end gap-3 p-3.5 sm:p-4 bg-gray-50 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={resetAndCloseModal}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition disabled:opacity-50 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 font-medium"
              >
                {isUploading
                  ? 'Uploading...'
                  : editingPost
                  ? 'Update Post'
                  : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* DELETE CONFIRMATION UI MODAL */}
    {deleteTarget && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-red-600 mb-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-full shrink-0">
              <BsTrash size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
          </div>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteTarget.title || 'this post'}"</span>? This action is permanent and cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
};

export default Dashboard;