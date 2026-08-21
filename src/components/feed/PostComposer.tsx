import React, { useState, useRef } from "react";
import { 
  Image, 
  Video, 
  Sparkles, 
  Hash, 
  X, 
  Send, 
  Smile, 
  Link as LinkIcon,
  CheckCircle,
  Plus
} from "lucide-react";
import { PostCategory } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { createPost } from "../../services/post.service";
import { uploadMedia } from "../../services/auth.service";
import { generateSmartHashtags } from "../../services/ai/ai.service";
import { useToast } from "../../contexts/ToastContext";

interface PostComposerProps {
  onPostCreated?: () => void;
  onOpenAuth?: () => void;
  communityId?: string;
  communityName?: string;
}

const CATEGORIES: { id: PostCategory; label: string; icon: string }[] = [
  { id: "Trend", label: "🔥 Trend", icon: "🔥" },
  { id: "Học tập", label: "📚 Học tập", icon: "📚" },
  { id: "Định hướng", label: "🧭 Định hướng", icon: "🧭" },
  { id: "Giải trí", label: "🎮 Giải trí", icon: "🎮" },
  { id: "Công nghệ", label: "💻 Công nghệ", icon: "💻" },
  { id: "Đời sống", label: "☕ Đời sống", icon: "☕" },
  { id: "Kiến thức", label: "💡 Kiến thức", icon: "💡" },
  { id: "Sáng tạo", label: "🎨 Sáng tạo", icon: "🎨" },
  { id: "Startup", label: "🚀 Startup", icon: "🚀" },
  { id: "Tâm sự", label: "💬 Tâm sự", icon: "💬" },
];

export const PostComposer: React.FC<PostComposerProps> = ({
  onPostCreated,
  onOpenAuth,
  communityId,
  communityName
}) => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("Trend");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAiGeneratingTags, setIsAiGeneratingTags] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddHashtag = () => {
    let tag = hashtagInput.trim();
    if (!tag) return;
    if (!tag.startsWith("#")) tag = `#${tag}`;
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
    setHashtagInput("");
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(t => t !== tagToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadMedia(file, `posts/${currentUser.uid}/${Date.now()}_${file.name}`);
      setImages(prev => [...prev, uploadedUrl]);
      showToast("Đã tải ảnh lên thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Không thể tải ảnh lên, vui lòng thử lại.", "error");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput("");
      setShowImageUrlInput(false);
    }
  };

  const handleGenerateAiTags = async () => {
    if (!content.trim()) {
      showToast("Hãy viết nội dung bài viết trước để AI gợi ý hashtag!", "info");
      return;
    }
    setIsAiGeneratingTags(true);
    try {
      const tags = await generateSmartHashtags(content);
      setHashtags(Array.from(new Set([...hashtags, ...tags])));
      showToast("AI đã thêm các hashtag bắt trend phù hợp! ✨", "success");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGeneratingTags(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const activeProfile = userProfile || {
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: currentUser.displayName || "Thành viên CùngNè",
      username: currentUser.email?.split("@")[0] || `user_${currentUser.uid.slice(0, 6)}`,
      avatar: currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`,
      role: currentUser.email?.toLowerCase() === "nguyenhuy.thudaumot@gmail.com" ? "admin" : "member" as const,
      verified: currentUser.email?.toLowerCase() === "nguyenhuy.thudaumot@gmail.com",
      status: "active" as const,
      interests: []
    };

    if (!content.trim() && images.length === 0) {
      showToast("Vui lòng nhập nội dung bài viết hoặc đính kèm ảnh.", "info");
      return;
    }

    setSubmitting(true);
    try {
      // Extract any inline hashtags from content automatically
      const inlineTags = content.match(/#[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || [];
      const allTags = Array.from(new Set([...hashtags, ...inlineTags]));

      await createPost({
        authorId: activeProfile.uid,
        authorName: activeProfile.displayName,
        authorUsername: activeProfile.username,
        authorAvatar: activeProfile.avatar,
        authorBadge: activeProfile.badges?.[0] || (activeProfile.role === "admin" ? "Admin" : undefined),
        authorVerified: activeProfile.verified,
        authorRole: activeProfile.role,
        content: content.trim(),
        images,
        category,
        hashtags: allTags,
        communityId,
        communityName,
        visibility: "public"
      });

      setContent("");
      setImages([]);
      setHashtags([]);
      setIsExpanded(false);
      showToast("Đã đăng bài viết mới thành công! 🎉", "success");
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      console.error("Create post error:", err);
      showToast("Không thể đăng bài. Vui lòng thử lại.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs transition-all mb-6">
      <form onSubmit={handleSubmit}>
        {/* Top: Avatar & Textarea */}
        <div className="flex space-x-4 items-start">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 via-pink-400 to-indigo-400 p-0.5 shadow-sm shrink-0">
            <img
              src={userProfile?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=guest"}
              alt={userProfile?.displayName || "Guest"}
              className="w-full h-full rounded-2xl object-cover bg-white dark:bg-slate-900"
            />
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              placeholder={
                currentUser 
                  ? (communityName ? `Chia sẻ điều gì đó với cộng đồng ${communityName}...` : "Bạn đang nghĩ gì?")
                  : "Đăng nhập để chia sẻ suy nghĩ và kết nối bạn bè..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => {
                if (!currentUser && onOpenAuth) {
                  onOpenAuth();
                } else {
                  setIsExpanded(true);
                }
              }}
              rows={isExpanded ? 3 : 2}
              className="w-full bg-transparent border-none focus:ring-0 text-base sm:text-lg resize-none text-slate-900 dark:text-white placeholder-slate-400 leading-relaxed outline-none"
            />
          </div>
        </div>

        {/* Uploaded Images Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-3 pl-0 sm:pl-16">
            {images.map((img, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden group aspect-video bg-slate-200 dark:bg-slate-800">
                <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image URL Input Form */}
        {showImageUrlInput && (
          <div className="flex items-center gap-2 my-3 pl-0 sm:pl-16">
            <input
              type="url"
              placeholder="Dán link ảnh (https://...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => setShowImageUrlInput(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Category & Hashtags Selection (when expanded) */}
        {isExpanded && (
          <div className="space-y-3 pt-4 pl-0 sm:pl-16 border-t border-slate-200/60 dark:border-slate-800 my-2">
            
            {/* Category Selector Pill Carousel */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                Chủ đề bài viết
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      category === cat.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hashtag Editor */}
            <div className="flex flex-wrap items-center gap-1.5">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveHashtag(tag)}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Thêm hashtag (#AI, #GenZ)"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* AI Smart Hashtags Button */}
              <button
                type="button"
                onClick={handleGenerateAiTags}
                disabled={isAiGeneratingTags}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold transition-colors"
                title="Dùng AI tự động gợi ý hashtag"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>{isAiGeneratingTags ? "AI đang tạo..." : "AI Hashtags"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Toolbar & Post Action */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            {/* Image Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>🖼️</span>
              <span className="hidden sm:inline">Ảnh</span>
            </button>

            {/* Image URL */}
            <button
              type="button"
              onClick={() => setShowImageUrlInput(!showImageUrlInput)}
              className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>📹</span>
              <span className="hidden sm:inline">Video / Link</span>
            </button>

            {/* Expand / Tag Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>🏷️</span>
              <span className="hidden sm:inline">Chủ đề</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting || (!content.trim() && images.length === 0)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-indigo-950/40 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Đăng bài</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
