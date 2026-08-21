import React, { useState, useEffect } from "react";
import { ArrowLeft, Users, Plus, Check, Share2, Sparkles } from "lucide-react";
import { Community, Post } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { getCommunityById, joinCommunity, leaveCommunity } from "../../services/community.service";
import { subscribeToCommunityPosts } from "../../services/post.service";
import { PostComposer } from "../feed/PostComposer";
import { PostCard } from "../feed/PostCard";
import { useToast } from "../../contexts/ToastContext";

interface CommunityDetailViewProps {
  communityId: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const CommunityDetailView: React.FC<CommunityDetailViewProps> = ({
  communityId,
  onNavigate,
  onOpenAuth
}) => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComm() {
      setLoading(true);
      const data = await getCommunityById(communityId, userProfile?.uid);
      setCommunity(data);
      setLoading(false);
    }
    fetchComm();

    const unsub = subscribeToCommunityPosts(communityId, (commPosts) => {
      setPosts(commPosts);
    });

    return () => unsub();
  }, [communityId, userProfile]);

  const handleToggleJoin = async () => {
    if (!currentUser || !userProfile || !community) {
      onOpenAuth();
      return;
    }

    try {
      if (community.isJoined) {
        await leaveCommunity(community.id, userProfile.uid);
        setCommunity({ ...community, isJoined: false, membersCount: community.membersCount - 1 });
        showToast(`Đã rời cộng đồng ${community.name}`, "info");
      } else {
        await joinCommunity(community.id, userProfile.uid);
        setCommunity({ ...community, isJoined: true, membersCount: community.membersCount + 1 });
        showToast(`Đã tham gia cộng đồng ${community.name}! 🎉`, "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">Không tìm thấy cộng đồng này.</p>
        <button
          onClick={() => onNavigate("communities")}
          className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
        >
          Quay lại danh sách cộng đồng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back button */}
      <button
        onClick={() => onNavigate("communities")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tất cả cộng đồng</span>
      </button>

      {/* Community Banner & Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="h-36 sm:h-44 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative">
          {community.coverImage && (
            <img src={community.coverImage} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-3 mb-4">
            <img
              src={community.avatar}
              alt={community.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 bg-white shadow-md"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleJoin}
                className={`py-2.5 px-5 rounded-2xl text-xs font-bold transition-all ${
                  community.isJoined
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                    : "bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                }`}
              >
                {community.isJoined ? "Đang tham gia ✓" : "+ Tham gia nhóm"}
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {community.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            {community.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              👥 {community.membersCount.toLocaleString()} thành viên
            </span>
            <div className="flex items-center gap-1.5">
              {community.tags.map((t) => (
                <span key={t} className="text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Composer for Community */}
      <PostComposer
        communityId={community.id}
        communityName={community.name}
        onOpenAuth={onOpenAuth}
      />

      {/* Community Feed Posts */}
      <div className="space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
          Thảo luận trong nhóm
        </h2>
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">Chưa có bài viết nào trong cộng đồng này. Hãy mở đầu thảo luận nhé!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onNavigate={onNavigate}
              onOpenAuth={onOpenAuth}
            />
          ))
        )}
      </div>
    </div>
  );
};
