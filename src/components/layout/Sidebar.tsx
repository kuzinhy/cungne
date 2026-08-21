import React from "react";
import { 
  Home, 
  Flame, 
  Compass, 
  BookOpen, 
  Target, 
  Users, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  ShieldCheck, 
  PlusCircle,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenCreatePost: () => void;
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenCreatePost,
  onOpenAI
}) => {
  const { currentUser, userProfile, isStaff } = useAuth();

  const navigationItems = [
    { id: "feed", label: "Trang chủ", icon: Home },
    { id: "explore", label: "Xu hướng", icon: Flame, badge: "Hot" },
    { id: "learn", label: "Học tập", icon: BookOpen },
    { id: "career", label: "Định hướng", icon: Target },
    { id: "communities", label: "Cộng đồng", icon: Users },
    { id: "messages", label: "Tin nhắn", icon: MessageSquare },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "profile", label: "Hồ sơ cá nhân", icon: User, param: { username: userProfile?.username } },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pr-3">
      <div className="flex flex-col h-full justify-between pb-6">
        <div className="space-y-1">
          {/* Main Navigation links */}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id, item.param)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors group ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-indigo-200/60 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" : "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin link if user has admin/moderator role */}
          {isStaff && (
            <button
              onClick={() => onNavigate("admin")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors group ${
                activeView === "admin"
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold"
                  : "text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-rose-500" />
                <span>Admin Quản trị</span>
              </div>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300">
                Staff
              </span>
            </button>
          )}

          {/* AI Banner */}
          <div className="pt-2">
            <button
              onClick={onOpenAI}
              className="w-full text-left p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/80 dark:border-indigo-800/80 hover:border-indigo-400 transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-serif italic font-bold">CùngNè AI Assistant</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Tư vấn hướng nghiệp, chữa bài, tóm tắt kiến thức và bắt trend thông minh.
              </p>
            </button>
          </div>
        </div>

        {/* Bottom User Capsule or Create Post CTA */}
        <div className="pt-4 space-y-3">
          <button
            onClick={onOpenCreatePost}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Chia sẻ bài viết</span>
          </button>

          {currentUser && userProfile && (
            <div className="bg-slate-900 text-white p-3.5 rounded-3xl flex items-center justify-between shadow-md">
              <button
                onClick={() => onNavigate("profile", { username: userProfile.username })}
                className="flex items-center space-x-2.5 min-w-0 text-left group"
              >
                <img
                  src={userProfile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile.username}`}
                  alt=""
                  className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-white object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate group-hover:text-indigo-300 transition-colors">
                    @{userProfile.username}
                  </span>
                  <span className="text-[10px] opacity-70 truncate">
                    {userProfile.interests?.[0] ? `${userProfile.interests[0]} • ${userProfile.displayName}` : userProfile.displayName}
                  </span>
                </div>
              </button>
              <button
                onClick={() => onNavigate("settings")}
                className="text-xs opacity-60 hover:opacity-100 transition-opacity p-1 text-slate-300"
                title="Cài đặt tài khoản"
              >
                ⚙️
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
