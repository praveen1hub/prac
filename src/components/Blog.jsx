// components/Blog.jsx
import React, { useState, useEffect } from "react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog posts from backend API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Get unique categories from fetched data
  const categories = ["all", ...new Set(blogPosts.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  if (loading) {
    return (
      <div className="container-center my-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-center my-6">
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">⚠️ Error loading blog posts</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-center my-6">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Ncart Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Latest news, tips, and insights about technology
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {category === "all" ? "All Posts" : category}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div 
            key={post._id || post.id} 
            className="rounded-xl border dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Blog+Image';
              }}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>{post.category}</span>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 dark:text-blue-400">Read More →</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">by {post.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedPost(null)} />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-4xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Blog+Image';
              }}
            />
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3 flex-wrap">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>by {selectedPost.author}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-medium">{selectedPost.excerpt}</p>
              <div className="prose dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedPost.content}</p>
              </div>
              
              <button 
                onClick={() => setSelectedPost(null)}
                className="mt-6 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No blog posts found in this category.</p>
        </div>
      )}
    </div>
  );
}