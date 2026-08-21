import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  BadgeCheck, 
  Ban, 
  Check, 
  RefreshCw,
  Settings,
  Sun,
  Moon,
  Bell,
  Shield,
  Sliders,
  Sparkles,
  Globe,
  Lock,
  LogOut
} from "lucide-react";
import { UserProfile, Report, UserRole, UserStatus } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { 
  getAdminStats, 
  getAllUsers, 
  getReports, 
  updateUserRole, 
  updateUserStatus, 
  toggleUserVerified, 
  resolveReport 
} from "../../services/admin.service";
import { useToast } from "../../contexts/ToastContext";

interface AdminDashboardViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { userProfile, isStaff, theme, setTheme, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "settings" | "ai-config">(isStaff ? "overview" : "settings");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [aiModelMode, setAiModelMode] = useState("gemini-2.5-flash");

  const loadAll = async () => {
    if (!isStaff) return;
    setLoading(true);
    try {
      const [s, u, r] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getReports()
      ]);
      setStats(s);
      setUsers(u);
      setReports(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff) {
      loadAll();
    }
  }, [isStaff]);

  const handleToggleVerified = async (targetUser: UserProfile) => {
    if (!userProfile) return;
    const nextVal = !targetUser.verified;
    try {
      await toggleUserVerified(userProfile, targetUser.uid, nextVal);
      setUsers(prev => prev.map(u => u.uid === targetUser.uid ? { ...u, verified: nextVal } : u));
      showToast(nextVal ? `Đã cấp tích xanh cho ${targetUser.displayName}` : `Đã hủy tích xanh của ${targetUser.displayName}`, "success");
    } catch (e) {
      showToast("Lỗi khi cập nhật tích xanh.", "error");
    }
  };

  const handleUpdateRole = async (targetUser: UserProfile, role: UserRole) => {
    if (!userProfile) return;
    try {
      await updateUserRole(userProfile, targetUser.uid, role);
      setUsers(prev => prev.map(u => u.uid === targetUser.uid ? { ...u, role } : u));
      showToast(`Đã thay đổi quyền của ${targetUser.displayName} thành ${role}`, "success");
    } catch (e) {
      showToast("Lỗi khi đổi quyền.", "error");
    }
  };

  const handleUpdateStatus = async (targetUser: UserProfile, status: UserStatus) => {
    if (!userProfile) return;
    try {
      await updateUserStatus(userProfile, targetUser.uid, status);
      setUsers(prev => prev.map(u => u.uid === targetUser.uid ? { ...u, status } : u));
      showToast(`Đã cập nhật trạng thái ${status} cho ${targetUser.displayName}`, "info");
    } catch (e) {
      showToast("Lỗi cập nhật trạng thái.", "error");
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    if (!userProfile) return;
    try {
      await resolveReport(userProfile, reportId, status, status === 'resolved' ? "Đã xử lý nội dung vi phạm" : "Bỏ qua báo cáo");
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
      showToast(`Đã cập nhật báo cáo thành ${status}`, "success");
    } catch (e) {
      showToast("Lỗi cập nhật báo cáo.", "error");
    }
  };

  const handleSaveSettings = () => {
    showToast("Đã lưu các tùy chọn cài đặt hệ thống thành công! ✨", "success");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Google AI Studio Style Glowing Header Banner */}
      <div className="google-studio-border shadow-2xl">
        <div className="google-studio-content p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>CùngNè Control & Settings Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Quản trị Hệ thống & Cài đặt
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Trung tâm điều phối cộng đồng, kiểm duyệt nội dung, tùy chỉnh trải nghiệm giao diện và cấu hình AI Studio.
            </p>
          </div>

          {isStaff && (
            <button
              onClick={loadAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Làm mới dữ liệu</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {isStaff && (
          <>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tổng quan số liệu</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Thành viên ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === "reports"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>Báo cáo vi phạm ({reports.filter(r => r.status === 'pending').length})</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "settings"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Cài đặt cá nhân & Giao diện</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-config")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "ai-config"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Cấu hình AI Studio</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] text-emerald-500 font-bold">+{stats.newUsersToday} hôm nay</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalUsers}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Tổng người dùng</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] text-blue-500 font-bold">Hoạt động</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalPosts}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Tổng bài viết</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Flag className="w-5 h-5 text-rose-500" />
                <span className="text-[10px] text-rose-500 font-bold">{stats.totalReports} báo cáo</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalReports}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Báo cáo vi phạm</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] text-emerald-500 font-bold">Online</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.estimatedOnline}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Đang trực tuyến</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Danh sách thành viên hệ thống
            </h2>
            <span className="text-xs text-slate-400">Hiển thị {users.length} tài khoản</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Người dùng</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Tích xanh</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{u.displayName}</span>
                          {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <div className="text-slate-400">@{u.username} • {u.email}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role || "user"}
                        onChange={(e) => handleUpdateRole(u, e.target.value as UserRole)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 border-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="user">Thành viên (User)</option>
                        <option value="moderator">Kiểm duyệt viên (Mod)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === "banned"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          : u.status === "warned"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      }`}>
                        {u.status || "active"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleVerified(u)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          u.verified
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-950/60"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                        title="Bật/Tắt tích xanh"
                      >
                        <BadgeCheck className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      {u.status !== "banned" ? (
                        <button
                          onClick={() => handleUpdateStatus(u, "banned")}
                          className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition-colors"
                        >
                          Khóa tài khoản
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u, "active")}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-[11px] transition-colors"
                        >
                          Mở khóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === "reports" && (
        <div className="space-y-3.5">
          {reports.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Không có báo cáo vi phạm nào cần xử lý! 🛡️</p>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 text-xs font-bold">
                      {r.reason}
                    </span>
                    <span className="text-xs text-slate-400">
                      Báo cáo bởi <strong>{r.reporterName}</strong> • {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  {r.targetContent && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded-xl mt-1">
                      "{r.targetContent}"
                    </p>
                  )}
                  <div className="text-[11px] text-slate-400">
                    Trạng thái: <strong className="uppercase">{r.status}</strong>
                  </div>
                </div>

                {r.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolveReport(r.id, "resolved")}
                      className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs"
                    >
                      Xử lý vi phạm
                    </button>
                    <button
                      onClick={() => handleResolveReport(r.id, "dismissed")}
                      className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      Bỏ qua
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Settings (Integrated) */}
      {activeTab === "settings" && (
        <div className="space-y-5">
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
              <span>Quyền riêng tư & Bảo mật tài khoản</span>
            </h2>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Tài khoản riêng tư</div>
                <div className="text-[11px] text-slate-400">Chỉ những người theo dõi mới xem được hoạt động chi tiết của bạn</div>
              </div>
              <input
                type="checkbox"
                checked={privateAccount}
                onChange={(e) => setPrivateAccount(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
              Lưu thay đổi cài đặt
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: AI Studio Configuration */}
      {activeTab === "ai-config" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Cấu hình mô hình AI & Quota
              </h2>
              <p className="text-xs text-slate-400">Tùy chỉnh thông số trợ lý trí tuệ nhân tạo tích hợp sẵn trên CùngNè.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Chọn mô hình Gemini AI cốt lõi
              </label>
              <select
                value={aiModelMode}
                onChange={(e) => setAiModelMode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Tốc độ cực nhanh, tối ưu tương tác)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Phân tích sâu, logic & lập trình chuyên sâu)</option>
                <option value="gemini-3.7-flash">Gemini 3.7 Flash (Mô hình tiên tiến nhất, đa phương thức)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Trạng thái kết nối Google AI Studio</span>
              </div>
              <p className="text-[11px] opacity-85">
                Hệ thống đang kết nối trực tiếp qua khóa API bảo mật phía server. Mọi yêu cầu sinh mã, tóm tắt và phân tích học tập đều được mã hóa an toàn.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => showToast("Đã cập nhật cấu hình AI thành công!", "success")}
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
              Lưu cấu hình AI
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
