import React from "react";
import { TrendingUp, Users, Sparkles, Check, Plus, ExternalLink } from "lucide-react";
import { INITIAL_TRENDS, INITIAL_COMMUNITIES, SUGGESTED_USERS } from "../../data/seedData";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface RightSidebarProps {
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate, onOpenAuth }) => {
  const { currentUser, isFollowing, toggleFollowUser } = useAuth();
  const { showToast } = useToast();

  const handleFollow = async (userId: string, userName: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const followed = await toggleFollowUser(userId);
    if (followed) {
      showToast(`Đã theo dõi ${userName} ✨`, "success");
    } else {
      showToast(`Đã bỏ theo dõi ${userName}`, "info");
    }
  };

  return (
    <aside className="w-80 shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pl-3 pb-8 space-y-6">
      
      {/* 1. Mọi người đang nói gì? (Trending Radar) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50">
              RADAR
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Mọi người đang nói gì?
            </h3>
          </div>
          <button
            onClick={() => onNavigate("explore")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Tất cả
          </button>
        </div>

        <div className="space-y-3.5">
          {INITIAL_TRENDS.slice(0, 5).map((trend) => (
            <button
              key={trend.tag}
              onClick={() => onNavigate("explore", { hashtag: trend.tag })}
              className="w-full flex items-center justify-between text-left p-1.5 -mx-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {trend.tag}
                </div>
                <div className="text-[11px] text-slate-400">
                  {trend.postsCount.toLocaleString()} bài viết
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg">
                  {trend.growth}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Có thể bạn sẽ hợp với họ (Friend / People Discovery) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Hợp gu với bạn</span>
          </h3>
          <button
            onClick={() => onNavigate("explore")}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          >
            Làm mới
          </button>
        </div>

        <div className="space-y-4">
          {SUGGESTED_USERS.map((user) => {
            const following = isFollowing(user.uid);
            return (
              <div key={user.uid} className="flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigate("profile", { username: user.username })}
                  className="flex items-center space-x-3 text-left min-w-0 group"
                >
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-2xl object-cover bg-indigo-50 dark:bg-slate-800 shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                      {user.displayName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      @{user.username}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleFollow(user.uid, user.displayName)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    following
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                      : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100"
                  }`}
                >
                  {following ? "Đang theo dõi" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Career Hub Gradient Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[32px] text-white relative overflow-hidden group shadow-lg shadow-indigo-500/20">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
        <h3 className="font-bold text-lg mb-1 relative z-10 font-serif italic">
          Career Hub
        </h3>
        <p className="text-xs text-indigo-100 mb-4 relative z-10 leading-relaxed">
          Định hướng nghề nghiệp, lộ trình CV cùng AI Assistant & kết nối mentor Gen Z.
        </p>
        <button
          onClick={() => onNavigate("career")}
          className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-xl relative z-10 hover:bg-slate-100 transition-colors shadow-sm"
        >
          Khám phá ngay
        </button>
      </div>

      {/* 4. Cộng đồng nổi bật */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Cộng đồng sôi nổi</span>
          </h3>
          <button
            onClick={() => onNavigate("communities")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Tất cả
          </button>
        </div>

        <div className="space-y-3.5">
          {INITIAL_COMMUNITIES.slice(0, 3).map((comm) => (
            <div key={comm.id} className="flex items-center justify-between gap-3">
              <button
                onClick={() => onNavigate("community-detail", { communityId: comm.id })}
                className="flex items-center space-x-3 min-w-0 text-left p-1.5 -mx-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group flex-1"
              >
                <img
                  src={comm.avatar}
                  alt={comm.name}
                  className="w-10 h-10 rounded-2xl object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                    {comm.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {comm.membersCount.toLocaleString()} thành viên
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigate("community-detail", { communityId: comm.id });
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                title="Ghé thăm cộng đồng"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <footer className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 font-medium">
          <a href="#about" className="hover:underline">Giới thiệu</a>
          <a href="#terms" className="hover:underline">Điều khoản</a>
          <a href="#privacy" className="hover:underline">Quyền riêng tư</a>
          <a href="#help" className="hover:underline">Trợ giúp</a>
          <a href="#rules" className="hover:underline">Quy tắc cộng đồng</a>
        </div>
        <p>© 2026 CùngNè. Kết nối thế hệ trẻ Việt Nam.</p>
      </footer>
    </aside>
  );
};
