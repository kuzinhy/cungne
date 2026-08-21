import React from "react";
import { Home, Compass, Plus, MessageSquare, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface MobileNavigationProps {
  activeView: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenCreatePost: () => void;
  onOpenAuth: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeView,
  onNavigate,
  onOpenCreatePost,
  onOpenAuth
}) => {
  const { currentUser, userProfile } = useAuth();

  const handleProfileClick = () => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      onNavigate("profile", { username: userProfile?.username });
    }
  };

  const handleMessagesClick = () => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      onNavigate("messages");
    }
  };

  const handleCreateClick = () => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      onOpenCreatePost();
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
      <button
        onClick={() => onNavigate("feed")}
        className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
          activeView === "feed"
            ? "text-indigo-600 dark:text-indigo-400 font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Trang chủ</span>
      </button>

      <button
        onClick={() => onNavigate("explore")}
        className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
          activeView === "explore"
            ? "text-indigo-600 dark:text-indigo-400 font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Khám phá</span>
      </button>

      {/* Central Create Button */}
      <button
        onClick={handleCreateClick}
        className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
        title="Đăng bài mới"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={handleMessagesClick}
        className={`flex flex-col items-center gap-0.5 p-1.5 relative transition-colors ${
          activeView === "messages"
            ? "text-indigo-600 dark:text-indigo-400 font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px]">Tin nhắn</span>
      </button>

      <button
        onClick={handleProfileClick}
        className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
          activeView === "profile"
            ? "text-indigo-600 dark:text-indigo-400 font-bold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        {currentUser && userProfile?.avatar ? (
          <img
            src={userProfile.avatar}
            alt=""
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px]">Hồ sơ</span>
      </button>
    </nav>
  );
};
