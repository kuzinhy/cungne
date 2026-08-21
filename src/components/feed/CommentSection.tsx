import React, { useState, useEffect } from "react";
import { Send, Heart, Reply, X, User } from "lucide-react";
import { Comment } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { addComment, subscribeToComments } from "../../services/post.service";
import { useToast } from "../../contexts/ToastContext";

interface CommentSectionProps {
  postId: string;
  onOpenAuth?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, onOpenAuth }) => {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeToComments(postId, (list) => {
      setComments(list);
    });
    return () => unsub();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await addComment(
        postId,
        userProfile.uid,
        userProfile.displayName,
        userProfile.username,
        userProfile.avatar,
        text,
        replyTo?.id
      );
      setComments(prev => [...prev, newComment]);
      setText("");
      setReplyTo(null);
      showToast("Đã gửi bình luận!", "success");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
      {/* Existing Comments List */}
      <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-3 italic">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ! 💬
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 text-xs">
              <img
                src={comment.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.authorUsername}`}
                alt={comment.authorName}
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
              />
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {comment.authorName}{" "}
                    <span className="font-normal text-slate-400">@{comment.authorUsername}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Vừa xong</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                  {comment.content}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="hover:text-indigo-600 transition-colors flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    <span>Trả lời</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply indicator banner */}
      {replyTo && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs">
          <span>Đang trả lời <strong>@{replyTo.authorUsername}</strong></span>
          <button onClick={() => setReplyTo(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder={currentUser ? (replyTo ? `Trả lời @${replyTo.authorUsername}...` : "Viết bình luận của bạn...") : "Đăng nhập để bình luận..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!currentUser && !onOpenAuth}
          className="flex-1 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition-all placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
