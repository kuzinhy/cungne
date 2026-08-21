import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserInterests } from "../../services/auth.service";
import { useToast } from "../../contexts/ToastContext";

const AVAILABLE_INTERESTS = [
  { id: "Công nghệ", label: "💻 Công nghệ" },
  { id: "AI", label: "🤖 AI & Trí tuệ nhân tạo" },
  { id: "Lập trình", label: "⚡ Lập trình" },
  { id: "Game", label: "🎮 Game & Esports" },
  { id: "Du lịch", label: "✈️ Du lịch bụi" },
  { id: "Cafe", label: "☕ Cafe & Chill" },
  { id: "Chụp ảnh", label: "📷 Chụp ảnh" },
  { id: "Phim", label: "🎬 Điện ảnh & Phim" },
  { id: "Âm nhạc", label: "🎧 Âm nhạc & Indie" },
  { id: "Thể thao", label: "⚽ Thể thao" },
  { id: "Thời trang", label: "👗 Thời trang & Style" },
  { id: "Học ngoại ngữ", label: "🌐 Tiếng Anh & Ngoại ngữ" },
  { id: "Kinh doanh", label: "📈 Kinh doanh" },
  { id: "Khởi nghiệp", label: "🚀 Khởi nghiệp / Startup" },
  { id: "Marketing", label: "🎯 Marketing & Truyền thông" },
  { id: "Thiết kế", label: "🎨 Thiết kế & UI/UX" },
  { id: "Tâm sự", label: "💬 Tâm sự & Kết bạn" },
  { id: "Học tập", label: "📚 Học tập & Thi cử" },
  { id: "Nghề nghiệp", label: "💼 Hướng nghiệp & CV" },
  { id: "Kỹ năng sống", label: "💡 Kỹ năng mềm" },
];

export const OnboardingModal: React.FC = () => {
  const { userProfile, isOnboarding, setIsOnboarding, refreshProfile } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  if (!isOnboarding || !userProfile) return null;

  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleComplete = async () => {
    if (selected.length < 3) {
      showToast("Vui lòng chọn ít nhất 3 sở thích để CùngNè gợi ý nội dung phù hợp nhất cho bạn!", "info");
      return;
    }

    setSaving(true);
    try {
      await updateUserInterests(userProfile.uid, selected);
      await refreshProfile();
      setIsOnboarding(false);

      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast("Đã lưu sở thích! Khám phá bảng tin ngay nào 🎉", "success");
    } catch (e) {
      console.error(e);
      showToast("Đã lưu sở thích vào phiên làm việc!", "success");
      setIsOnboarding(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chào mừng đến với CùngNè</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bạn đang quan tâm đến điều gì?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chọn ít nhất <strong className="text-indigo-600 dark:text-indigo-400">3 chủ đề</strong> để CùngNè cá nhân hóa bài viết, cộng đồng và bạn bè cùng gu cho bạn.
          </p>
        </div>

        {/* Interests Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {AVAILABLE_INTERESTS.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleInterest(item.id)}
                type="button"
                className={`p-3 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all duration-150 border flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/30 font-semibold"
                    : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Đã chọn: <strong className="text-slate-900 dark:text-white font-bold">{selected.length}</strong> / 3 tối thiểu
          </span>

          <button
            onClick={handleComplete}
            disabled={saving || selected.length < 3}
            className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Bắt đầu khám phá</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
