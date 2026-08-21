import React from "react";
import { 
  Flame, 
  BookOpen, 
  MessageSquare, 
  Compass, 
  Target, 
  Sparkles, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";
import { INITIAL_TRENDS, INITIAL_POSTS, INITIAL_COMMUNITIES } from "../../data/seedData";

interface LandingPageProps {
  onOpenAuth: (mode?: "login" | "register") => void;
  onExploreFeed: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreFeed }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-6 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>Nền tảng mạng xã hội thế hệ mới cho Gen Z Việt Nam</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Có người cùng gu, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600">
              mọi thứ vui hơn.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Kết nối với những người cùng sở thích, chia sẻ điều bạn biết và khám phá những xu hướng mới mỗi ngày trên <strong>CùngNè</strong>.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => onOpenAuth("register")}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 hover:scale-105"
            >
              <span>Tham gia CùngNè miễn phí</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onOpenAuth("login")}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-base transition-all duration-200 shadow-sm"
            >
              Đăng nhập
            </button>

            <button
              onClick={onExploreFeed}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors"
            >
              Xem trước bảng tin →
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Miễn phí 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Realtime Chat & Feed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Tích hợp AI Assistant</span>
            </div>
          </div>
        </div>

        {/* 5 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 py-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              🔥 Bắt trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cập nhật radar xu hướng nóng nhất về công nghệ, lối sống, du lịch và âm nhạc.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              📚 Học điều mới
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Learn Hub cô đọng kiến thức về AI, lập trình, tiếng Anh và kỹ năng mềm.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              💬 Kết nối cùng gu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Trò chuyện realtime, tìm bạn bè chung sở thích qua hệ thống matching thông minh.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              🧭 Khám phá
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tham gia cộng đồng mê cafe, nhiếp ảnh đường phố, lập trình viên và du lịch bụi.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              🎯 Định hướng nghề
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Career Hub tư vấn chọn ngành, review CV, kinh nghiệm phỏng vấn và tìm việc thực tập.
            </p>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Cộng đồng đang thảo luận sôi nổi
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hàng ngàn bạn trẻ đang chia sẻ những góc nhìn độc đáo trên CùngNè
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {INITIAL_POSTS.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {post.authorName}
                    </div>
                    <div className="text-xs text-slate-400">@{post.authorUsername} • {post.category}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                  {post.content}
                </p>
                {post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt=""
                    className="w-full h-48 object-cover rounded-2xl mb-3"
                  />
                )}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>❤️ {post.likesCount} Yêu thích</span>
                  <span>💬 {post.commentsCount} Bình luận</span>
                  <span>🔖 {post.bookmarksCount} Đã lưu</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
