import React, { useState, useEffect } from "react";
import { Sparkles, Users, Flame, Clock, Filter, RefreshCw } from "lucide-react";
import { Post, FeedFilterType, PostCategory } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { subscribeToFeed } from "../../services/post.service";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";

interface FeedViewProps {
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
  onOpenAI: () => void;
}

const CATEGORY_CHIPS: { label: string; value: string }[] = [
  { label: "Tất cả", value: "all" },
  { label: "🔥 Trend", value: "Trend" },
  { label: "📚 Học tập", value: "Học tập" },
  { label: "🧭 Định hướng", value: "Định hướng" },
  { label: "💻 Công nghệ", value: "Công nghệ" },
  { label: "🎮 Giải trí", value: "Giải trí" },
  { label: "☕ Đời sống", value: "Đời sống" },
  { label: "💡 Kiến thức", value: "Kiến thức" },
  { label: "🚀 Startup", value: "Startup" },
];

export const FeedView: React.FC<FeedViewProps> = ({ onNavigate, onOpenAuth, onOpenAI }) => {
  const { currentUser, followingIds } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedFilterType>("for-you");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = () => {
    setLoading(true);
    const unsub = subscribeToFeed(activeTab, followingIds, (fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return unsub;
  };

  useEffect(() => {
    const unsub = loadFeed();
    return () => unsub();
  }, [activeTab, followingIds]);

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const filteredPosts = posts.filter(p => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Feed Tabs: Dành cho bạn / Đang theo dõi / Thịnh hành / Mới nhất */}
      <div className="flex items-center space-x-6 sm:space-x-8 border-b border-slate-200/80 dark:border-slate-800 mb-6 px-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`pb-3.5 border-b-2 font-bold whitespace-nowrap text-sm sm:text-base transition-colors ${
            activeTab === "for-you"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          }`}
        >
          Dành cho bạn
        </button>

        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuth();
            } else {
              setActiveTab("following");
            }
          }}
          className={`pb-3.5 border-b-2 font-bold whitespace-nowrap text-sm sm:text-base transition-colors ${
            activeTab === "following"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          }`}
        >
          Đang theo dõi
        </button>

        <button
          onClick={() => setActiveTab("trending")}
          className={`pb-3.5 border-b-2 font-bold whitespace-nowrap text-sm sm:text-base transition-colors ${
            activeTab === "trending"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          }`}
        >
          Thịnh hành
        </button>

        <button
          onClick={() => setActiveTab("latest")}
          className={`pb-3.5 border-b-2 font-bold whitespace-nowrap text-sm sm:text-base transition-colors ${
            activeTab === "latest"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          }`}
        >
          Mới nhất
        </button>
      </div>

      {/* Category horizontal filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setSelectedCategory(chip.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === chip.value
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Post Composer Box */}
      <PostComposer
        onPostCreated={() => loadFeed()}
        onOpenAuth={onOpenAuth}
      />

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/6" />
                </div>
              </div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {activeTab === "following" ? "Chưa có bài viết từ người bạn theo dõi" : "Chưa có bài viết trong danh mục này"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === "following"
              ? "Hãy khám phá và bấm 'Theo dõi' những người dùng thú vị để cập nhật bài viết mới của họ tại đây!"
              : "Hãy là người đầu tiên đăng bài viết và mở đầu cuộc thảo luận sôi nổi này!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onNavigate={onNavigate}
              onOpenAuth={onOpenAuth}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};
