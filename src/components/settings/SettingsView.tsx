import React, { useState } from "react";
import { 
  Settings, 
  Moon, 
  Sun, 
  Shield, 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Trash2, 
  Check, 
  LogOut 
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface SettingsViewProps {
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { currentUser, userProfile, theme, setTheme, logout } = useAuth();
  const { showToast } = useToast();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  if (!currentUser || !userProfile) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <Settings className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Cài đặt tài khoản
        </h2>
        <p className="text-xs text-slate-500">
          Vui lòng đăng nhập để cấu hình tùy chọn cá nhân.
        </p>
        <button
          onClick={onOpenAuth}
          className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleSavePreferences = () => {
    showToast("Đã lưu các tùy chọn cài đặt! ✨", "success");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>Cài đặt hệ thống</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Quản lý tài khoản, thông báo và quyền riêng tư của bạn trên CùngNè.
        </p>
      </div>

      {/* Theme setting */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Giao diện & Trải nghiệm</span>
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Chế độ hiển thị</div>
            <div className="text-[11px] text-slate-400">Chọn giao diện Sáng hoặc Tối phù hợp với mắt của bạn</div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setTheme("light")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                theme === "light"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Sáng</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                theme === "dark"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Tối</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <span>Thông báo & Tin tức</span>
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Thông báo đẩy (Push Notifications)</div>
            <div className="text-[11px] text-slate-400">Nhận thông báo khi có người tương tác với bài viết của bạn</div>
          </div>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={(e) => setPushNotifications(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Thông báo Email định kỳ</div>
            <div className="text-[11px] text-slate-400">Nhận bản tin tổng hợp xu hướng thịnh hành mỗi tuần</div>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Privacy & Account settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Quyền riêng tư & Bảo mật</span>
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Tài khoản riêng tư</div>
            <div className="text-[11px] text-slate-400">Chỉ những người được bạn phê duyệt mới xem được bài viết</div>
          </div>
          <input
            type="checkbox"
            checked={privateAccount}
            onChange={(e) => setPrivateAccount(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleSavePreferences}
            className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
          >
            Lưu cài đặt
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};
