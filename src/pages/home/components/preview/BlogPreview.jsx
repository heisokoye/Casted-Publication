import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, increment, query, orderBy } from "firebase/firestore";
import { db } from "../../../../Firebase";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";

// Custom Hook to manage Like and Share logic across all card types
const usePostActions = (post) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    if (!post) return;
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    if (likedPosts.includes(post.id)) setIsLiked(true);
    setLikeCount(post.likes || 0);
  }, [post]);

  const handleLike = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!post) return;

    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    const isCurrentlyLiked = likedPosts.includes(post.id);

    setIsLiked(!isCurrentlyLiked);
    setLikeCount((prev) => (isCurrentlyLiked ? prev - 1 : prev + 1));

    if (!isCurrentlyLiked) {
      setExplode(true);
      setTimeout(() => setExplode(false), 800);
    }

    const newLikedPosts = isCurrentlyLiked
      ? likedPosts.filter((id) => id !== post.id)
      : [...likedPosts, post.id];
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));

    const postRef = doc(db, "posts", post.id);
    try {
      await updateDoc(postRef, {
        likes: increment(isCurrentlyLiked ? -1 : 1),
      });
    } catch (error) {
      console.error("Error updating like count in Firebase: ", error);
      setIsLiked(isCurrentlyLiked);
      setLikeCount((prev) => (isCurrentlyLiked ? prev + 1 : prev - 1));
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }
  };

  const handleShare = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!post) return;
    
    // Corrected to share the exact post URL
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: shareUrl
      }).catch(console.error);
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
      window.open(whatsappUrl, '_blank', 'width=600,height=600');
    }
  };

  return { isLiked, likeCount, explode, handleLike, handleShare };
};

const getPreviewText = (html, limit = 150) => {
  if (!html) return "";
  // Faster alternative to DOMParser for stripping HTML tags
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ").trim();
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

// ----------------------------------------------------
// MOBILE VIEW CARD (Original Design)
// ----------------------------------------------------
const PostCard = ({ post, index }) => {
  const { isLiked, likeCount, explode, handleLike, handleShare } = usePostActions(post);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <Link to={`/post/${post.id}`} key={post.id} className="block group">
      <div
        className="flex mb-12 rounded-2xl border border-gray-200 flex-col h-[23.75rem] cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        variants={itemVariants}
      >
        <div className="relative w-full h-48 flex-shrink-0">
          <img
            src={post.fileUrl}
            srcSet={`${post.fileUrl}?w=400 400w, ${post.fileUrl}?w=800 800w`}
            sizes="(max-width: 640px) 100vw, 400px"
            alt={post.title}
            className="w-full h-full object-cover mb-2 transition-transform duration-500 group-hover:scale-105"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={index === 0 ? "high" : "auto"}
          />
        </div>
        <div className="flex flex-col flex-grow px-3 py-3">
            <p className="font-medium text-[13px] text-gray-500 mb-1">
            {post.createdAt?.toDate().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
            </p>
            <h3 className="font-medium text-gray-900 text-[17px] line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
              {React.useMemo(() => getPreviewText(post.content, 100), [post.content])}
            </p>
            <div className="flex items-center justify-between px-1 pt-3 mt-auto border-t border-gray-100 relative">
                <button
                    onClick={handleLike}
                    className="flex items-center text-gray-500 hover:text-red-500 focus:outline-none z-10 p-1"
                    aria-label={isLiked ? "Unlike post" : "Like post"}
                >
                    {isLiked ? <FaHeart className="text-orange-500" /> : <FaRegHeart />}
                    <span className="ml-2 font-medium">{likeCount}</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center text-gray-500 hover:text-orange-500 focus:outline-none z-10 p-1 transition-colors duration-300"
                    aria-label="Share Post"
                    title="Share Post"
                >
                    <IoShareOutline size={20} className="cursor-pointer"/>
                </button>
                {explode && (
                    <>
                    {[...Array(20)].map((_, i) => (
                        <motion.span
                        key={i}
                        className="absolute text-orange-500"
                        style={{ top: '50%', left: '10%' }}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{
                            opacity: 0,
                            scale: 1.5,
                            y: -30,
                            x: (Math.random() - 0.5) * 60,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                        <FaHeart />
                        </motion.span>
                    ))}
                    </>
                )}
            </div>
        </div>
      </div>
    </Link>
  );
};

// ----------------------------------------------------
// DESKTOP VIEW CARDS (SaaS Design)
// ----------------------------------------------------
const DesktopMainCard = ({ post }) => {
  const { isLiked, likeCount, handleLike, handleShare } = usePostActions(post);
  
  if (!post) return null;

  return (
    <div className="w-full lg:w-[65%]">
        <Link to={`/post/${post.id}`} className="block relative h-[450px] w-full rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow">
        <img src={post.fileUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
            <div className="w-[85%]">
            <span className="inline-block border border-white/60 text-white/90 text-xs px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                Featured
            </span>
            <h3 className="text-white text-3xl xl:text-4xl font-bold leading-tight line-clamp-2">
                {post.title}
            </h3>
            <div className="text-gray-300 text-sm mt-3 flex items-center gap-2">
                <img src="/orangeLogo.webp" alt="Admin" className="w-6 h-6 rounded-full object-cover" />
                <span>{post.author || "Admin"}</span>
                <span>•</span>
                <span>{new Date(post.createdAt?.toDate()).toLocaleDateString()}</span>
            </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-4 text-white/80 z-10 items-center">
                <button onClick={handleLike} className="flex flex-col items-center hover:text-orange-500 transition-colors bg-black/40 p-2.5 rounded-full backdrop-blur-md">
                    {isLiked ? <FaHeart className="text-orange-500 text-lg" /> : <FaRegHeart className="text-lg" />}
                    <span className="text-xs font-medium mt-1">{likeCount}</span>
                </button>
                <button onClick={handleShare} className="hover:text-orange-500 transition-colors bg-black/40 p-2.5 rounded-full backdrop-blur-md">
                    <IoShareOutline size={20} />
                </button>
            </div>
        </div>
        </Link>
    </div>
  )
}

const DesktopSideCard = ({ post }) => {
  const { isLiked, likeCount, handleLike, handleShare } = usePostActions(post);

  return (
    <Link to={`/post/${post.id}`} className="flex gap-4 items-center group border-b border-gray-200 pb-5 last:border-0 last:pb-0 relative bg-transparent hover:bg-gray-50/50 p-2 rounded-xl transition-colors">
      <div className="w-[100px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
        <img src={post.fileUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
      </div>
      <div className="flex flex-col justify-center h-full pr-14 w-full">
        <h4 className="font-bold text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {post.title}
        </h4>
        <p className="text-xs font-medium text-gray-500 mt-1.5">{new Date(post.createdAt?.toDate()).toLocaleDateString()}</p>
      </div>
      {/* Action Buttons */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 text-gray-400 z-10 items-center">
         <button onClick={handleLike} className="hover:text-orange-500 transition-colors flex flex-col items-center group/btn">
            {isLiked ? <FaHeart className="text-orange-500 text-sm" /> : <FaRegHeart className="text-sm" />}
            <span className="text-[10px] font-medium leading-none mt-1 group-hover/btn:text-orange-500">{likeCount}</span>
          </button>
          <button onClick={handleShare} className="hover:text-orange-500 transition-colors">
            <IoShareOutline size={16} />
          </button>
      </div>
    </Link>
  )
}

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
const BlogPreview = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(postsList);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const desktopMain = posts[0];
  const desktopSide = posts.slice(1, 5); // Take next 4 for sidebar to make 5 total

  return (
    <div className="py-20 border-b border-gray-300 w-full relative z-10">
      {/* 80% width and centered margin for desktop explicitly as requested */}
      <div className="mx-auto w-[90%] lg:w-[80%] ">
        <h2 className="justify-center lg:justify-start flex gap-2 text-3xl font-medium py-8 mb-4">
          <span className="text-gray-900">Featured</span>
          <span className="text-orange-500">Posts</span>
        </h2>

        {isLoading ? (
          <>
            {/* Mobile Skeleton */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex border border-gray-200 rounded-2xl flex-col h-[23.75rem] animate-pulse bg-white overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 mb-4"></div>
                  <div className="px-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop Skeleton */}
            <div className="hidden lg:flex flex-row gap-10 animate-pulse">
                <div className="w-[65%] h-[450px] bg-gray-200 rounded-2xl"></div>
                <div className="w-[35%] flex flex-col gap-6">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center border-b border-gray-100 pb-4">
                            <div className="w-[100px] h-[72px] bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="w-full h-4 bg-gray-200 rounded"></div>
                                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile View (Displays 4 standard cards) */}
            <motion.section
              className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.slice(0, 4).map((post, index) => (
                <PostCard post={post} key={post.id} index={index} />
              ))}
            </motion.section>

            {/* Desktop View (Displays 1 main feature + 4 sidebar features) */}
            {posts.length > 0 && (
                <motion.section 
                    className="hidden lg:flex flex-row gap-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <DesktopMainCard post={desktopMain} />
                    
                    {/* Wrap sidebar inside a white rounded box to look good against default transparent/image background */}
                    <div className="w-[35%] flex flex-col bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Latest Updates</h3>
                            <Link to="/blog" className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">View all</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {desktopSide.map((post) => (
                                <DesktopSideCard post={post} key={post.id} />
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPreview;
