import React from "react";
import { X, Copy, Check, Share2, Facebook, MessageCircle, Send } from "lucide-react";
import { Post } from "../../types";
import { useToast } from "../../contexts/ToastContext";

interface ShareModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !post) return null;

  const shareUrl = `${window.location.origin}/post/${post.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast("Đã sao chép liên kết bài viết vào clipboard! 📋", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Chia sẻ bài viết
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lan tỏa nội dung thú vị của {post.authorName} đến bạn bè
          </p>
        </div>

        {/* Copy link bar */}
        <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4">
          <span className="text-xs text-slate-600 dark:text-slate-300 truncate flex-1 font-mono">
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Đã copy" : "Copy"}</span>
          </button>
        </div>

        {/* Quick External Share Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleShareFacebook}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Gửi tin nhắn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
