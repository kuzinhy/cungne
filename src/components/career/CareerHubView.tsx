import React, { useState } from "react";
import { Target, Sparkles, Briefcase, FileText, MessageSquare, CheckCircle, ArrowRight, UserCheck } from "lucide-react";

interface CareerHubViewProps {
  onOpenAI: () => void;
  onNavigate: (view: string, param?: any) => void;
}

const CAREER_TRACKS = [
  {
    id: "tech-ai",
    title: "AI Engineer & Data Specialist",
    growth: "Tăng trưởng +45%",
    salary: "15 - 40 triệu/tháng",
    skills: ["Python", "Machine Learning", "Prompt Engineering", "SQL"],
    desc: "Ngành nghề hot nhất hiện nay với nhu cầu tuyển dụng khổng lồ từ các công ty công nghệ và doanh nghiệp chuyển đổi số."
  },
  {
    id: "marketing-creator",
    title: "Digital Marketing & Content Creator",
    growth: "Tăng trưởng +30%",
    salary: "10 - 30 triệu/tháng",
    skills: ["SEO/SEM", "TikTok Growth", "Copywriting", "Canva/CapCut"],
    desc: "Xây dựng thương hiệu cá nhân, lên kịch bản video viral và quản lý các chiến dịch truyền thông đa nền tảng."
  },
  {
    id: "product-design",
    title: "Product Designer (UI/UX)",
    growth: "Tăng trưởng +25%",
    salary: "12 - 35 triệu/tháng",
    skills: ["Figma", "User Research", "Prototyping", "Design System"],
    desc: "Thiết kế trải nghiệm người dùng tối ưu cho các sản phẩm app di động và web hiện đại."
  },
  {
    id: "business-dev",
    title: "Business Development & Startup Founder",
    growth: "Tăng trưởng +20%",
    salary: "Thoả thuận / Cổ phần",
    skills: ["Giao tiếp", "Phân tích tài chính", "Sales B2B", "Pitching"],
    desc: "Tìm kiếm cơ hội hợp tác, mở rộng tệp khách hàng và xây dựng mô hình kinh doanh bứt phá."
  }
];

export const CareerHubView: React.FC<CareerHubViewProps> = ({ onOpenAI, onNavigate }) => {
  const [selectedTrack, setSelectedTrack] = useState(CAREER_TRACKS[0]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
            <Target className="w-3.5 h-3.5 text-blue-200" />
            <span>CùngNè Career Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Định hướng nghề nghiệp & Phát triển tương lai
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-4">
            Khám phá ngành nghề xu hướng, cách viết CV chuẩn ATS, chuẩn bị phỏng vấn và nhận tư vấn trực tiếp từ AI Career Advisor.
          </p>

          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Tư vấn hướng nghiệp cùng AI</span>
          </button>
        </div>
      </div>

      {/* 3 Interactive Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Bí quyết viết CV ấn tượng
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Áp dụng công thức Google XYZ: "Accomplished [X] as measured by [Y] by doing [Z]".
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Phỏng vấn STAR Method
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Trả lời câu hỏi hành vi theo 4 bước: Tình huống (S), Nhiệm vụ (T), Hành động (A), Kết quả (R).
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Networking & Mentor
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kết nối với các anh chị đi trước trong các cộng đồng chuyên môn trên CùngNè.
          </p>
        </div>
      </div>

      {/* Career Tracks Explorer */}
      <div className="space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>Lộ trình các ngành nghề triển vọng</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {CAREER_TRACKS.map((track) => {
            const isSelected = selectedTrack.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`p-5 rounded-3xl text-left border transition-all duration-150 ${
                  isSelected
                    ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                    {track.growth}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {track.salary}
                  </span>
                </div>

                <div className="font-extrabold text-base text-slate-900 dark:text-white mb-1.5">
                  {track.title}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {track.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {track.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
