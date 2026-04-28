import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase"; // adjust path if needed

import "../../App.css"
import { BsArrowLeft } from "react-icons/bs";
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaShareAlt } from "react-icons/fa";
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
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

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

  // Function to handle social sharing
  const handleShare = (platform) => {
    const postUrl = `${window.location.origin}/post/${id}`;
    const sharePreviewUrl = `${window.location.origin}/share/post/${id}`;
    const postTitle = post?.title || "Check out this post from Casted! Publications";
    const shareText = `${postTitle} - ${sharePreviewUrl}`;

    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(sharePreviewUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePreviewUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePreviewUrl)}`;
        break;
      case "whatsapp":
        // Keep only the link so WhatsApp reliably generates OG preview cards.
        shareUrl = `https://wa.me/?text=${encodeURIComponent(sharePreviewUrl)}`;
        break;
      case "native":
        if (navigator.share) {
          navigator.share({
            title: postTitle,
            text: post?.content ? stripHtml(post.content).substring(0, 100) : "",
            url: postUrl,
          }).catch(() => {});
        }
        return;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
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
          <article className="w-full min-w-0 max-w-full bg-white">
            {/* Display post title. */}
            <h1 className="text-2xl sm:text-3xl mt-10 md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 break-words">
              {post.title}
            </h1>
            <div className="mb-6 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-0 sm:text-base">
              {/* Display post author, defaulting to "Admin" if not available. */}
              <p>By {post.author || "Admin"}</p>
              {/* Display formatted creation date. */}
              <p>
                {post.createdAt?.toDate().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
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
          </article>
        )}
      </div>
    </div>
  );
};

export default SinglePost;