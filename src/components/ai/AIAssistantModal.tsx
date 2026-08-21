import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Briefcase, 
  BookOpen, 
  HelpCircle, 
  RotateCcw,
  Copy,
  Check
} from "lucide-react";
import { askCungNeAI, AIMessage } from "../../services/ai/ai.service";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "general" | "career" | "study";
}

const SAMPLE_PROMPTS = {
  general: [
    "Gợi ý 5 địa điểm cafe chill làm việc tại Hà Nội/Sài Gòn",
    "Viết một bài chia sẻ ngắn về cách cân bằng deadline và cuộc sống cho Gen Z",
    "Giải thích khái niệm AI Agent bằng ví dụ dễ hiểu nhất"
  ],
  career: [
    "Cách viết CV chuẩn ATS cho sinh viên chưa có nhiều kinh nghiệm",
    "Chuẩn bị trả lời câu hỏi: 'Điểm yếu lớn nhất của bạn là gì?' theo mô hình STAR",
    "Lộ trình 6 tháng để chuyển ngành sang Data / AI Specialist"
  ],
  study: [
    "Cách áp dụng phương pháp Pomodoro và Active Recall để ôn thi 1 tuần",
    "Tóm tắt 3 quy tắc cốt lõi của kỹ thuật Feynman",
    "Gợi ý phương pháp luyện nghe tiếng Anh phản xạ tự nhiên"
  ]
};

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialType = "general"
}) => {
  const { userProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"general" | "career" | "study">(initialType);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: "assistant",
      content: "Xin chào! Mình là CùngNè AI 🤖✨ Mình có thể giúp bạn giải đáp kiến thức, tư vấn định hướng nghề nghiệp, gợi ý ý tưởng sáng tạo và phương pháp học tập thông minh. Bạn cần mình hỗ trợ điều gì hôm nay?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt.trim();
    if (!query || loading) return;

    const userMsg: AIMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt("");
    setLoading(true);

    try {
      const reply = await askCungNeAI(query, activeTab);
      const assistantMsg: AIMessage = {
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    showToast("Đã sao chép phản hồi của AI!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: "Đoạn hội thoại đã được đặt lại. Hãy đặt câu hỏi mới cho CùngNè AI nhé! ✨",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[85vh] max-h-[750px] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>CùngNè AI Assistant</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                  Gemini
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đồng hành cùng học tập, định hướng & sáng tạo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 transition-colors"
              title="Xóa lịch sử chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-role Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === "general"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Trợ lý Đa năng</span>
          </button>

          <button
            onClick={() => setActiveTab("career")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === "career"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>🎯 Cố vấn Hướng nghiệp</span>
          </button>

          <button
            onClick={() => setActiveTab("study")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === "study"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📚 Study Coach</span>
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, idx) => {
            const isMe = msg.role === "user";
            return (
              <div key={idx} className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  
                  {!isMe && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>CùngNè AI</span>
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="hover:text-indigo-600 flex items-center gap-1 font-semibold"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? "Đã chép" : "Sao chép"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isMe && (
                  <img
                    src={userProfile?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-3xl text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                <span>CùngNè AI đang suy nghĩ câu trả lời tốt nhất cho bạn...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts Carousel */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SAMPLE_PROMPTS[activeTab].map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            type="text"
            placeholder={
              activeTab === "career"
                ? "Hỏi về cách viết CV, kỹ năng, định hướng nghề nghiệp..."
                : activeTab === "study"
                ? "Hỏi về phương pháp học, tóm tắt tài liệu..."
                : "Hỏi CùngNè AI bất cứ điều gì bạn đang suy nghĩ..."
            }
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
          />

          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-40 shadow-md shadow-indigo-500/20 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
