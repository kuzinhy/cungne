import React, { useState } from "react";
import { TrendingUp, Flame, Search, Hash, ArrowUpRight, Sparkles, Filter } from "lucide-react";
import { INITIAL_TRENDS, INITIAL_POSTS } from "../../data/seedData";
import { PostCard } from "../feed/PostCard";

interface ExploreViewProps {
  initialHashtag?: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialHashtag,
  onNavigate,
  onOpenAuth
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(initialHashtag || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrends = INITIAL_TRENDS.filter(t => {
    const matchSearch = t.tag.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "all" || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const displayPosts = INITIAL_POSTS.filter(p => {
    if (selectedTag === "all") return true;
    return p.hashtags?.includes(selectedTag) || p.content.includes(selectedTag);
  });

  const categories = ["all", "Công nghệ", "AI", "Du lịch", "GenZ", "Cafe", "Học tập", "Nhiếp ảnh"];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-indigo-500/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Radar Xu hướng CùngNè</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Khám phá điều giới trẻ Việt đang quan tâm
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Nắm bắt những chủ đề hot nhất về công nghệ, lối sống, xu hướng sáng tạo và chia sẻ góc nhìn cùng cộng đồng.
          </p>
        </div>
      </div>

      {/* Search & Category filter */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hashtag, từ khóa, sự kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {c === "all" ? "Tất cả chủ đề" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Top 6 Trending Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Top Hashtags thịnh hành</span>
          </h2>
          {selectedTag !== "all" && (
            <button
              onClick={() => setSelectedTag("all")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Hiển thị tất cả
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTrends.map((trend) => {
            const isSelected = selectedTag === trend.tag;
            return (
              <button
                key={trend.tag}
                onClick={() => setSelectedTag(isSelected ? "all" : trend.tag)}
                className={`p-4 rounded-3xl text-left border transition-all duration-150 group ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {trend.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{trend.growth}</span>
                  </span>
                </div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {trend.tag}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {trend.postsCount.toLocaleString()} lượt thảo luận
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag Selected Notice */}
      {selectedTag !== "all" && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 font-semibold">
          <span>Đang lọc các bài viết có gắn thẻ <strong>{selectedTag}</strong></span>
          <button
            onClick={() => setSelectedTag("all")}
            className="hover:underline text-indigo-600 dark:text-indigo-400"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Trending Posts Feed */}
      <div className="space-y-4 pt-2">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
          Bài viết nổi bật
        </h2>
        {displayPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onNavigate={onNavigate}
            onOpenAuth={onOpenAuth}
          />
        ))}
      </div>
    </div>
  );
};
