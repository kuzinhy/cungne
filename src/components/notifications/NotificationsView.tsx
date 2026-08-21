import React, { useState, useEffect } from "react";
import { Bell, Heart, MessageSquare, UserPlus, Sparkles, Check, CheckCheck } from "lucide-react";
import { Notification } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { subscribeNotifications, markNotificationAsRead } from "../../services/notification.service";

interface NotificationsViewProps {
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { currentUser, userProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeNotifications(currentUser.uid, (list) => {
      setNotifications(list);
    });
    return () => unsub();
  }, [currentUser]);

  if (!currentUser || !userProfile) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Bell className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Trung tâm thông báo
        </h2>
        <p className="text-xs text-slate-500">
          Đăng nhập để nhận thông báo về tương tác bài viết, bạn bè mới và tin nổi bật.
        </p>
        <button
          onClick={onOpenAuth}
          className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => filter === "all" || !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-rose-500" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Thông báo
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cập nhật hoạt động mới nhất của bạn trên CùngNè
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Đánh dấu tất cả đã đọc</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
          }`}
        >
          Tất cả thông báo ({notifications.length})
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            filter === "unread"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
          }`}
        >
          Chưa đọc ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notification items */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Bạn đã xem hết tất cả thông báo! ✨</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.read) markNotificationAsRead(item.id);
                if (item.senderUsername) onNavigate("profile", { username: item.senderUsername });
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.read
                  ? "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
                  : "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 ring-1 ring-indigo-500/10"
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {item.message}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
