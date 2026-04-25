import React, {useState, useEffect} from "react"
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

  // Delete a post by ID
  const handleDelete = async(id)=>{
    try{
      await deleteDoc(doc(db, "posts", id));
      console.log("Document successfully deleted!");
    }
    catch(error){
      console.error("Error removing document: ", error);
    }
  }


  // Render the dashboard UI
  return (
  <div className="min-h-screen bg-gray-50 pt-20">
    
    <div className="max-w-7xl mx-auto px-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your posts and content</p>
        </div>

        <button
          onClick={() => openModal()}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow hover:from-amber-600 hover:to-amber-700 transition"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* MEDIA */}
              {post.fileUrl && post.fileType === 'image' && (
                <img
                  src={post.fileUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {post.fileUrl && post.fileType === 'video' && (
                <video
                  src={post.fileUrl}
                  controls
                  className="w-full h-48 object-cover"
                />
              )}

              {/* BODY */}
              <div className="p-4">
                <h2 className="text-gray-800 font-medium line-clamp-2">
                  {post.title}
                </h2>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openModal(post)}
                    className="flex-1 py-2 text-sm rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* MODAL */}
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* MODAL HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <button
              onClick={resetAndCloseModal}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleFormSubmit} className="flex flex-col max-h-[85vh]">
            
            {/* SCROLLABLE CONTENT AREA */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* TITLE */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              {/* FILE */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Image / Video
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="w-full text-sm"
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
                  className="h-64 mb-12"
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
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={resetAndCloseModal}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
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
  </div>
)
};

export default Dashboard;