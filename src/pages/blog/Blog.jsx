import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../Firebase";
import { Link } from "react-router-dom";

const Blog = () => {
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

  const getPreviewText = (html, limit = 100) => {
    if (!html) return "";
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const text = (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const mainFeatured = posts[0];
  const sideFeatured = posts.slice(1, 6);
  const recentPosts = posts.slice(6);

  return (
    <div className="bg-white min-h-screen py-16 font-sans">
      <div className="mx-auto w-[90%] md:w-[80%] max-w-7xl">
        
        {isLoading ? (
          // Skeleton Loader Matches New Layout
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-10 mb-16">
              <div className="w-full lg:w-[65%] h-[350px] md:h-[450px] bg-gray-200 rounded-2xl"></div>
              <div className="w-full lg:w-[35%] flex flex-col gap-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center border-b border-gray-100 pb-4">
                    <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="w-full h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Top Section */}
            {posts.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-10 mb-16">
                {/* Main Feature */}
                <div className="w-full lg:w-[65%]">
                  {mainFeatured && (
                    <Link to={`/post/${mainFeatured.id}`} className="block relative h-[350px] md:h-[450px] w-full rounded-2xl overflow-hidden group">
                      <img 
                        src={mainFeatured.fileUrl} 
                        alt={mainFeatured.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      {/* Content over image */}
                      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <span className="inline-block border border-white/60 text-white/90 text-xs px-4 py-1.5 rounded-full mb-4">
                          Featured
                        </span>
                        <h2 className="text-white text-3xl md:text-4xl font-medium leading-tight line-clamp-2 md:w-[85%]">
                          {mainFeatured.title}
                        </h2>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Side Featured */}
                <div className="w-full lg:w-[35%] flex flex-col">
                  <h3 className="text-2xl font-medium text-gray-900 mb-6">Other featured posts</h3>
                  <div className="flex flex-col gap-6">
                    {sideFeatured.length > 0 ? sideFeatured.map((post) => (
                      <Link to={`/post/${post.id}`} key={post.id} className="flex gap-4 items-center group border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={post.fileUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <h4 className="font-medium text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {post.title}
                        </h4>
                      </Link>
                    )) : (
                      <p className="text-gray-500 text-sm">More featured posts coming soon.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Section - Recent Posts */}
            {(recentPosts.length > 0 || posts.length > 1) && (
              <div className="mt-20">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-3xl font-medium text-gray-900">Recent Posts</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {(posts.length > 6 ? recentPosts : posts.slice(1)).map((post) => (
                    <Link to={`/post/${post.id}`} key={post.id} className="flex flex-col group">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-gray-100">
                        <img 
                          src={post.fileUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-[22px] font-medium text-gray-900 leading-snug mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-[15px] mb-5 line-clamp-2 leading-relaxed flex-grow">
                        {getPreviewText(post.content, 120)}
                      </p>
                      <div className="flex items-center text-xs text-gray-600 font-medium mt-auto">
                        <img 
                          src="/castedicon.png" 
                          alt={post.author || "Admin"} 
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-gray-900">{post.author || "Admin"}</span>
                        <span className="mx-2">•</span>
                        <span>3 min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {posts.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 py-20">
                No posts found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
