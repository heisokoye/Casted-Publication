import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase"; // adjust path if needed

import "../../App.css"
import { BsArrowLeft } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { Helmet } from "react-helmet-async";
import { normalizeRichTextHtml } from "../../utils/richText";

/**
 * SinglePost component fetches and displays a single blog post based on the ID from the URL.
 * It uses Firebase Firestore to retrieve post data.
 */
const SinglePost = () => {
  // Get the post ID from the URL parameters.
  const { id } = useParams(); 
  // State to store the fetched post data.
  const [post, setPost] = useState(null);
  // State to manage the loading status.
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // useEffect hook to fetch the post data when the component mounts or the ID changes.
  useEffect(() => {
    setIsLoading(true);
    const fetchPost = async () => {
      // Create a reference to the specific document in the 'posts' collection.
      const docRef = doc(db, "posts", id);
      // Fetch the document snapshot.
      const docSnap = await getDoc(docRef);
      // If the document exists, set the post state with its data.
      if (docSnap.exists()) {
        setPost(docSnap.data());
      }
      setIsLoading(false);
    };
    fetchPost();
  }, [id]); // Dependency array includes 'id' to re-run effect if ID changes.

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Function to handle unified sharing (like in BlogPreview.jsx)
  const handleShare = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!post) return;

    // Use sharePreviewUrl for crawlers to pick up meta tags, fallback to main domain/url
    const shareUrl = `${window.location.origin}/share/post/${id}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: shareUrl,
      }).catch(console.error);
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
      window.open(whatsappUrl, '_blank', 'width=600,height=600');
    }
  };

  // Function to copy the direct post URL
  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  // Display a message if no post is found and loading has finished.
  if (!post && !isLoading) {
    return (
      <p className="mx-auto w-full max-w-3xl px-4 py-10 text-center text-gray-600 sm:px-6">
        Post not found
      </p>
    );
  }

  // Safely get the first 150 characters of the post content for the description
  const postDescription = post?.content
    ? stripHtml(post.content).substring(0, 150)
    : "Read this interesting post from Casted! Publications.";

  // Ensure image URL is absolute for social media crawlers
  const getAbsoluteImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return window.location.origin + (url.startsWith('/') ? url : '/' + url);
  };

  const imageUrl = getAbsoluteImageUrl(post?.fileUrl);
  const normalizedPostContent = normalizeRichTextHtml(post?.content || "");

  return (
    <div className="w-full min-w-0 py-10 sm:py-16 md:py-20">
      {post && (
        <Helmet>
          <title>{post.title} | Casted! Publications</title>
          <meta name="description" content={postDescription} />
          {/* Open Graph Tags */}
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={postDescription} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={`${window.location.origin}/share/post/${id}`} />
          <meta property="og:type" content="article" />
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={postDescription} />
          <meta name="twitter:image" content={imageUrl} />
        </Helmet>
      )}
      <div className="mx-auto w-full min-w-0 max-w-3xl 2xl:max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Conditional rendering: show loader while fetching, otherwise show post content. */}
        {isLoading ? (
          <div className="animate-pulse w-full max-w-full bg-white mt-8">
             <div className="h-6 bg-gray-200 rounded w-24 mb-8"></div>
             <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
             <div className="flex gap-4 mb-8">
               <div className="h-5 bg-gray-200 rounded w-32"></div>
               <div className="h-5 bg-gray-200 rounded w-32"></div>
             </div>
             <div className="h-[min(50vh,28rem)] sm:h-[24rem] md:h-[28rem] bg-gray-200 rounded-xl lg:rounded-2xl mb-8 w-full"></div>
             <div className="space-y-4">
               <div className="h-5 bg-gray-200 rounded w-full"></div>
               <div className="h-5 bg-gray-200 rounded w-full"></div>
               <div className="h-5 bg-gray-200 rounded w-5/6"></div>
               <div className="h-5 bg-gray-200 rounded w-4/6"></div>
               <div className="h-5 bg-gray-200 rounded w-full mt-8"></div>
               <div className="h-5 bg-gray-200 rounded w-full"></div>
               <div className="h-5 bg-gray-200 rounded w-3/4"></div>
             </div>
          </div>
        ) : (
          <div className="relative w-full">
            <article className="w-full min-w-0 max-w-full bg-white">
              {/* Display post title. */}
              <h1 className="text-2xl sm:text-3xl mt-10 md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 break-words">
                {post.title}
              </h1>
              
              {/* Metadata and Share Bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-0 sm:text-base">
                  <p className="font-medium text-gray-800">By {post.author || "Admin"}</p>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p>
                    {post.createdAt?.toDate().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mr-1">Share:</span>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-full transition-all duration-200"
                    title="Share Post"
                    aria-label="Share Post"
                  >
                    <IoShareOutline className="w-4 h-4 cursor-pointer" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-full transition-all duration-200"
                      title="Copy Link"
                      aria-label="Copy Link"
                    >
                      <FaLink className="w-4 h-4" />
                    </button>
                    {isCopied && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-md whitespace-nowrap z-50 animate-fade-in">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Display post image. */}
              <img
                src={post.fileUrl}
                alt={post.title}
                className="mb-6 sm:mb-8 h-auto w-full max-h-[min(50vh,28rem)] rounded-xl object-cover shadow-md sm:max-h-[24rem] md:max-h-[28rem] lg:rounded-2xl"
              />
              {/* Display post content, using dangerouslySetInnerHTML as content is HTML. */}
              <div
                className="post-content prose prose-sm max-w-none text-gray-800 sm:prose-base lg:prose-lg w-full"
                dangerouslySetInnerHTML={{ __html: normalizedPostContent }}
              />

              {/* Post Footer / Share Card */}
              <div className="mt-12 p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Enjoyed this article?</h3>
                  <p className="text-sm text-gray-500">Share it with your friends and network to help spread the word.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-11 h-11 text-white bg-orange-500 hover:bg-orange-600 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm"
                    title="Share Post"
                    aria-label="Share Post"
                  >
                    <IoShareOutline className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center w-11 h-11 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm"
                      title="Copy Link"
                      aria-label="Copy Link"
                    >
                      <FaLink className="w-5 h-5" />
                    </button>
                    {isCopied && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-md whitespace-nowrap z-50">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;