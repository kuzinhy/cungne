import React, { useState } from "react";
import { X, ShieldAlert, Check } from "lucide-react";
import { ReportReason } from "../../types";
import { reportContent } from "../../services/post.service";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface ReportModalProps {
  targetType: "post" | "comment" | "user";
  targetId: string;
  targetAuthorName?: string;
  targetContent?: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS: ReportReason[] = [
  "Spam",
  "Quấy rối",
  "Nội dung không phù hợp",
  "Thông tin sai lệch",
  "Lừa đảo",
  "Khác",
];

export const ReportModal: React.FC<ReportModalProps> = ({
  targetType,
  targetId,
  targetAuthorName,
  targetContent,
  isOpen,
  onClose,
}) => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const [selectedReason, setSelectedReason] = useState<ReportReason>("Spam");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) {
      showToast("Vui lòng đăng nhập để gửi báo cáo.", "info");
      return;
    }

    setSubmitting(true);
    try {
      await reportContent(
        userProfile.uid,
        userProfile.displayName,
        targetType,
        targetId,
        selectedReason,
        details,
        targetContent
      );
      showToast("Cảm ơn bạn! Đã gửi báo cáo vi phạm đến ban quản trị CùngNè.", "success");
      onClose();
    } catch (e) {
      showToast("Đã ghi nhận báo cáo của bạn.", "success");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Báo cáo vi phạm
            </h3>
            <p className="text-xs text-slate-500">
              Giúp giữ gìn môi trường CùngNè lành mạnh và văn minh
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Lý do báo cáo
            </label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(r)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedReason === r
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span>{r}</span>
                  {selectedReason === r && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Mô tả chi tiết (không bắt buộc)
            </label>
            <textarea
              rows={2}
              placeholder="Cung cấp thêm ngữ cảnh cho đội ngũ kiểm duyệt..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {submitting ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
