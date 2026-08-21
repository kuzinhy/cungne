import React, { useState } from "react";
import { X, Mail, Lock, User, AtSign, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { registerWithEmail, loginWithEmail, loginWithGoogle, resetPassword } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser, refreshProfile, setIsOnboarding } = useAuth();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (currentUser && isOpen) {
      onClose();
    }
  }, [currentUser, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (!displayName.trim()) throw new Error("Vui lòng nhập tên hiển thị.");
        if (!username.trim()) throw new Error("Vui lòng nhập username (ví dụ: linh2005).");
        if (password.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");

        await registerWithEmail(email, password, displayName, username);
        await refreshProfile();
        setIsOnboarding(true);
        showToast("Đăng ký tài khoản thành công! 🎉 Chào mừng bạn đến với CùngNè!", "success");
        onClose();
      } else if (mode === "login") {
        await loginWithEmail(email, password);
        await refreshProfile();
        showToast("Đăng nhập thành công! Chúc bạn có trải nghiệm vui vẻ.", "success");
        onClose();
      } else if (mode === "forgot") {
        if (!email.trim()) throw new Error("Vui lòng nhập email của bạn.");
        await resetPassword(email);
        showToast("Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!", "info");
        setMode("login");
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password") || msg.includes("auth/invalid-credential")) {
        msg = "Email hoặc mật khẩu không chính xác.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = "Email này đã được đăng ký tài khoản trước đó.";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Định dạng email không hợp lệ.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { isNewUser } = await loginWithGoogle();
      await refreshProfile();
      if (isNewUser) {
        setIsOnboarding(true);
        showToast("Đăng nhập Google thành công! Hãy chọn sở thích của bạn.", "success");
      } else {
        showToast("Đăng nhập thành công! Chào mừng bạn quay lại.", "success");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Không thể đăng nhập bằng Google.";
      if (msg.includes("auth/unauthorized-domain") || msg.includes("unauthorized-domain")) {
        msg = "Tên miền hiện tại chưa được cấp quyền trong Firebase Authentication Authorized Domains. Vui lòng đăng nhập bằng Email/Mật khẩu bên dưới.";
      } else if (msg.includes("popup-closed-by-user") || msg.includes("cancelled-popup-request")) {
        msg = "Cửa sổ đăng nhập Google đã bị đóng.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-black text-xl shadow-md shadow-indigo-500/20 mb-3">
            C
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {mode === "login" && "Đăng nhập vào CùngNè"}
            {mode === "register" && "Tạo tài khoản CùngNè"}
            {mode === "forgot" && "Khôi phục mật khẩu"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {mode === "login" && "Chào mừng bạn quay lại với cộng đồng Gen Z"}
            {mode === "register" && "Kết nối sở thích – Chia sẻ kiến thức – Bắt nhịp xu hướng"}
            {mode === "forgot" && "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Login Button */}
        {mode !== "forgot" && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all duration-150 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
                hoặc
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Tên hiển thị
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Phương Anh"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Username (duy nhất)
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="phuonganh2005"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 ml-1">Chỉ gồm chữ thường, số và dấu gạch dưới.</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="tenban@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Mật khẩu
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === "login" && "Đăng nhập"}
                  {mode === "register" && "Bắt đầu cùng CùngNè"}
                  {mode === "forgot" && "Gửi liên kết khôi phục"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === "login" && (
            <p>
              Chưa có tài khoản?{" "}
              <button
                onClick={() => { setMode("register"); setError(null); }}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          )}
          {mode === "register" && (
            <p>
              Đã có tài khoản CùngNè?{" "}
              <button
                onClick={() => { setMode("login"); setError(null); }}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Quay lại{" "}
              <button
                onClick={() => { setMode("login"); setError(null); }}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
