import React, { useState } from "react";
import { BookOpen, Sparkles, Brain, CheckCircle2, Award, Clock, ArrowRight, Play } from "lucide-react";

interface LearnHubViewProps {
  onOpenAI: () => void;
  onNavigate: (view: string, param?: any) => void;
}

const LEARN_TOPICS = [
  {
    id: "ai-prompting",
    title: "Làm chủ AI & Prompt Engineering",
    category: "Công nghệ",
    time: "15 phút",
    level: "Cơ bản",
    icon: "🤖",
    description: "Cách viết câu lệnh (prompt) chuẩn chỉnh với mô hình AI Gemini & GPT để tự động hóa 70% việc học tập và nghiên cứu.",
    keyPoints: [
      "Nguyên tắc 5 thành phần của 1 prompt hoàn hảo: Role, Task, Context, Constraint, Output format.",
      "Kỹ thuật Few-Shot Prompting để tạo kết quả chính xác.",
      "Ứng dụng AI vào tóm tắt tài liệu 50 trang trong 3 phút."
    ]
  },
  {
    id: "feynman-method",
    title: "Phương pháp Feynman: Học sâu nhớ lâu",
    category: "Kỹ năng học",
    time: "10 phút",
    level: "Mọi cấp độ",
    icon: "💡",
    description: "Bí quyết học bất kỳ kiến thức phức tạp nào bằng cách đơn giản hóa và giảng lại cho một đứa trẻ 10 tuổi.",
    keyPoints: [
      "Bước 1: Chọn một khái niệm và viết tên lên đầu trang giấy.",
      "Bước 2: Giải thích bằng từ ngữ đơn giản, không dùng biệt ngữ.",
      "Bước 3: Xác định lỗ hổng kiến thức và đọc lại tài liệu nguồn.",
      "Bước 4: Sử dụng phép loại suy (analogy) gần gũi."
    ]
  },
  {
    id: "english-speaking",
    title: "Nói Tiếng Anh trôi chảy theo phương pháp Shadowing",
    category: "Ngoại ngữ",
    time: "20 phút",
    level: "Trung cấp",
    icon: "🌐",
    description: "Luyện phát âm chuẩn bản xứ và phản xạ tự nhiên thông qua việc nhại lại âm điệu của các video TED Talks ngắn.",
    keyPoints: [
      "Nghe 1 lần để nắm ý chính.",
      "Đọc theo transcript và đánh dấu trọng âm, ngữ điệu.",
      "Nói đè (shadow) theo giọng người nói với độ trễ 0.5s."
    ]
  },
  {
    id: "uiux-basics",
    title: "Tư duy Thiết kế UI/UX hiện đại cho Gen Z",
    category: "Thiết kế",
    time: "25 phút",
    level: "Nhập môn",
    icon: "🎨",
    description: "Nắm vững nguyên lý về Contrast, Hierarchy, Spacing math và Typography để tự thiết kế giao diện ứng dụng đẹp mắt.",
    keyPoints: [
      "Công thức padding: Inside Radius = Outside Radius - Padding.",
      "Quy luật tỷ lệ vàng và bước nhảy chữ 1.25x - 1.33x.",
      "Thiết kế thân thiện cho ngón tay trên di động (44px touch target)."
    ]
  }
];

export const LearnHubView: React.FC<LearnHubViewProps> = ({ onOpenAI, onNavigate }) => {
  const [selectedTopic, setSelectedTopic] = useState(LEARN_TOPICS[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const handleMarkDone = (id: string) => {
    if (!completedTopics.includes(id)) {
      setCompletedTopics([...completedTopics, id]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-emerald-200" />
            <span>CùngNè Learn Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Học điều mới mỗi ngày cùng CùngNè
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mb-4">
            Kho kiến thức cô đọng, bài học ngắn gọn 10-15 phút và có AI Study Coach đồng hành giải đáp thắc mắc 24/7.
          </p>

          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Mở Huấn luyện viên học tập AI</span>
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {LEARN_TOPICS.map((topic) => {
          const isSelected = selectedTopic.id === topic.id;
          const isDone = completedTopics.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`p-5 rounded-3xl text-left border transition-all duration-150 relative ${
                isSelected
                  ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{topic.icon}</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topic.time}</span>
                </span>
              </div>

              <div className="font-bold text-base text-slate-900 dark:text-white mb-1">
                {topic.title}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {topic.description}
              </p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  {topic.category}
                </span>

                {isDone ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã hoàn thành</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <span>Xem bài học</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Lesson Detail View */}
      {selectedTopic && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedTopic.icon}</span>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedTopic.title}
                </h2>
                <div className="text-xs text-slate-400">
                  Thời lượng: {selectedTopic.time} • Cấp độ: {selectedTopic.level}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleMarkDone(selectedTopic.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                completedTopics.includes(selectedTopic.id)
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
              }`}
            >
              {completedTopics.includes(selectedTopic.id) ? "✓ Đã học xong" : "Đánh dấu hoàn thành"}
            </button>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedTopic.description}
          </p>

          {/* Key Takeaways */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              📌 Điểm cốt lõi cần nhớ:
            </h3>
            <ul className="space-y-2">
              {selectedTopic.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive AI Question button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Có điều gì chưa hiểu trong bài này?
            </span>
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hỏi CùngNè AI về bài học này</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
