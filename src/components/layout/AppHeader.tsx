import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Bell, 
  MessageSquare, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  Sparkles, 
  Hash, 
  Users, 
  X,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { INITIAL_TRENDS, INITIAL_COMMUNITIES } from "../../data/seedData";

interface AppHeaderProps {
  onOpenAuth: (mode?: "login" | "register") => void;
  onOpenCreatePost: () => void;
  onOpenAI: () => void;
  onNavigate: (view: string, param?: any) => void;
  activeView: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenAuth,
  onOpenCreatePost,
  onOpenAI,
  onNavigate,
  activeView
}) => {
  const { currentUser, userProfile, isAdmin, isStaff, logout, theme, setTheme } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTrends = INITIAL_TRENDS.filter(t => 
    t.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = INITIAL_COMMUNITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearchItem = (type: string, item: any) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    if (type === "trend") {
      onNavigate("explore", { hashtag: item.tag });
    } else if (type === "community") {
      onNavigate("community-detail", { communityId: item.id });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("feed")}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">C</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tighter leading-none">
                CùngNè
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-1 hidden sm:inline">
                Kết nối sở thích
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng, hashtag, chủ đề..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500/40 rounded-2xl py-2.5 pl-10 pr-9 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Xu hướng thịnh hành</span>
              </div>
              <div className="space-y-1 mb-3">
                {filteredTrends.slice(0, 4).map((trend) => (
                  <button
                    key={trend.tag}
                    onClick={() => handleSelectSearchItem("trend", trend)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        #
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{trend.tag}</div>
                        <div className="text-[11px] text-slate-400">{trend.category} • {trend.postsCount} bài viết</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{trend.growth}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Cộng đồng nổi bật</span>
              </div>
              <div className="space-y-1">
                {filteredCommunities.slice(0, 3).map((comm) => (
                  <button
                    key={comm.id}
                    onClick={() => handleSelectSearchItem("community", comm)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <img src={comm.avatar} alt={comm.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div className="truncate">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{comm.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{comm.membersCount} thành viên</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* CùngNè AI Assistant quick launch button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/60 dark:to-blue-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-105 transition-all"
            title="Mở trợ lý CùngNè AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden sm:inline">CùngNè AI</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === "dark" ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <>
              {/* Create Post Button */}
              <button
                onClick={onOpenCreatePost}
                className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-500/30 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>

              {/* Messages Icon */}
              <button
                onClick={() => onNavigate("messages")}
                className={`relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  activeView === "messages" ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600" : ""
                }`}
                title="Tin nhắn"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
              </button>

              {/* Notifications Icon */}
              <button
                onClick={() => onNavigate("notifications")}
                className={`relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  activeView === "notifications" ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600" : ""
                }`}
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </button>

              {/* User Avatar & Dropdown */}
              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full border-2 border-transparent hover:border-indigo-500 transition-all focus:outline-none"
                >
                  <img
                    src={userProfile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile?.username || 'me'}`}
                    alt={userProfile?.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover bg-indigo-50"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User info preview */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <img
                          src={userProfile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile?.username || 'me'}`}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="truncate">
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 truncate">
                            <span>{userProfile?.displayName}</span>
                            {userProfile?.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                          </div>
                          <div className="text-xs text-slate-400">@{userProfile?.username}</div>
                        </div>
                      </div>
                      {userProfile?.role === "admin" && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Quản trị viên CùngNè</span>
                        </div>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1 space-y-0.5 text-sm">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onNavigate("profile", { username: userProfile?.username });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Trang cá nhân</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onNavigate("settings");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Cài đặt tài khoản</span>
                      </button>

                      {isStaff && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onNavigate("admin");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-semibold transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-indigo-500" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth("login")}
                className="py-2 px-3.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="py-2 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-500/25 transition-all hover:scale-105"
              >
                Tham gia CùngNè
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
