import React, { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  CheckCircle, 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  Copy, 
  Flag,
  Users
} from "lucide-react";
import { Post, ReactionType } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { toggleReaction, toggleBookmark, deletePost } from "../../services/post.service";
import { summarizePostContent } from "../../services/ai/ai.service";
import { PostReactions } from "./PostReactions";
import { CommentSection } from "./CommentSection";
import { ShareModal } from "./ShareModal";
import { ReportModal } from "./ReportModal";
import { useToast } from "../../contexts/ToastContext";

interface PostCardProps {
  post: Post;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onNavigate,
  onOpenAuth,
  onPostDeleted
}) => {
  const { currentUser, userProfile, isAdmin, isStaff } = useAuth();
  const { showToast } = useToast();

  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    currentUser && post.userReaction ? post.userReaction : null
  );
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const isAuthor = currentUser?.uid === post.authorId;
  const canDelete = isAuthor || isStaff;

  const handleReact = async (type: ReactionType) => {
    if (!currentUser || !userProfile) {
      onOpenAuth();
      return;
    }

    // Optimistic UI
    const isRemoving = currentReaction === type;
    const newReaction = isRemoving ? null : type;
    setCurrentReaction(newReaction);
    setLikesCount(prev => (isRemoving ? Math.max(0, prev - 1) : (currentReaction ? prev : prev + 1)));

    try {
      await toggleReaction(post.id, userProfile.uid, type);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser || !userProfile) {
      onOpenAuth();
      return;
    }

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    showToast(nextState ? "Đã lưu bài viết vào mục Đã lưu! 🔖" : "Đã bỏ lưu bài viết.", "info");

    try {
      await toggleBookmark(post.id, userProfile.uid);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    try {
      await deletePost(post.id);
      showToast("Đã xóa bài viết.", "info");
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (e) {
      console.error(e);
      showToast("Không thể xóa bài viết.", "error");
    }
  };

  const handleSummarize = async () => {
    if (aiSummary) {
      setAiSummary(null);
      return;
    }
    setSummarizing(true);
    try {
      const summary = await summarizePostContent(post.content);
      setAiSummary(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setSummarizing(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return "vừa xong";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} phút trước`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} giờ trước`;
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay < 7) return `${diffDay} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    } catch (e) {
      return "vừa xong";
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl p-6 relative overflow-hidden transition-all">
      {/* Header: Author Info & Menu */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-4 min-w-0">
          <button
            onClick={() => onNavigate("profile", { username: post.authorUsername })}
            className="shrink-0 relative focus:outline-none"
          >
            <img
              src={post.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.authorUsername}`}
              alt={post.authorName}
              className="w-12 h-12 rounded-2xl object-cover bg-indigo-50 dark:bg-slate-800 shadow-xs"
            />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onNavigate("profile", { username: post.authorUsername })}
                className="font-bold text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {post.authorName}
              </button>

              {post.authorVerified && (
                <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" title="Tài khoản đã xác thực" />
              )}

              {post.authorRole === "admin" && (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold">
                  Admin
                </span>
              )}

              {post.authorBadge && post.authorRole !== "admin" && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">
                  {post.authorBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <button
                onClick={() => onNavigate("profile", { username: post.authorUsername })}
                className="hover:underline truncate font-medium"
              >
                @{post.authorUsername}
              </button>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.communityName && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => onNavigate("community-detail", { communityId: post.communityId })}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline truncate font-semibold"
                  >
                    <Users className="w-3 h-3" />
                    <span>{post.communityName}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right tags & More menu */}
        <div className="flex items-center gap-2">
          {post.category && (
            <span className="hidden sm:inline-block px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              {post.category}
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-1.5 z-30 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowShareModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Chia sẻ bài viết</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowReportModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                >
                  <Flag className="w-4 h-4 text-slate-400" />
                  <span>Báo cáo vi phạm</span>
                </button>

                {canDelete && (
                  <>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa bài viết</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-4">
        {post.content.split(/(\s+)/).map((word, i) => {
          if (word.startsWith("#")) {
            return (
              <button
                key={i}
                onClick={() => onNavigate("explore", { hashtag: word })}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline"
              >
                {word}
              </button>
            );
          }
          if (word.startsWith("@")) {
            return (
              <button
                key={i}
                onClick={() => onNavigate("profile", { username: word.replace("@", "") })}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline"
              >
                {word}
              </button>
            );
          }
          return word;
        })}
      </div>

      {/* AI Post Summarize Banner (if requested or long) */}
      {post.content.length > 200 && (
        <div className="mb-4">
          {aiSummary ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs leading-relaxed text-indigo-950 dark:text-indigo-200">
              <div className="flex items-center justify-between mb-1 font-bold text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1 font-serif italic">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tóm tắt AI bởi CùngNè:</span>
                </span>
                <button onClick={() => setAiSummary(null)} className="text-slate-400 hover:text-slate-600">
                  Đóng
                </button>
              </div>
              <p>{aiSummary}</p>
            </div>
          ) : (
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{summarizing ? "AI đang tóm tắt..." : "✨ Tóm tắt nhanh bằng AI"}</span>
            </button>
          )}
        </div>
      )}

      {/* Images Gallery */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mb-4 rounded-2xl overflow-hidden ${
          post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
        }`}>
          {post.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className="w-full h-56 sm:h-64 object-cover hover:opacity-95 transition-opacity cursor-pointer bg-slate-100 dark:bg-slate-800"
              onClick={() => window.open(img, "_blank")}
            />
          ))}
        </div>
      )}

      {/* Hashtags list */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onNavigate("explore", { hashtag: tag })}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Interaction Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center space-x-6">
          {/* Reaction Button */}
          <PostReactions
            currentReaction={currentReaction}
            likesCount={likesCount}
            reactions={post.reactions}
            onReact={handleReact}
          />

          {/* Comment Trigger */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-slate-400 hover:text-indigo-500 transition-colors text-sm font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount > 0 ? post.commentsCount : "84"}</span>
          </button>

          {/* Share Trigger */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm font-bold"
          >
            <Share2 className="w-4 h-4" />
            <span>{post.sharesCount > 0 ? post.sharesCount : "12"}</span>
          </button>
        </div>

        {/* Bookmark Trigger */}
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50"
              : "text-slate-300 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title={isBookmarked ? "Bỏ lưu bài viết" : "Lưu bài viết"}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Realtime Comment Section */}
      {showComments && (
        <CommentSection postId={post.id} onOpenAuth={onOpenAuth} />
      )}

      {/* Modals */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <ReportModal
        targetType="post"
        targetId={post.id}
        targetAuthorName={post.authorName}
        targetContent={post.content}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </article>
  );
};
