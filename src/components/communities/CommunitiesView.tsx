import React, { useState, useEffect } from "react";
import { Users, Search, Plus, Check, ExternalLink, Sparkles, Filter } from "lucide-react";
import { Community } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { getCommunities, joinCommunity, leaveCommunity, createCommunity } from "../../services/community.service";
import { useToast } from "../../contexts/ToastContext";

interface CommunitiesViewProps {
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Công nghệ");
  const [avatar, setAvatar] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getCommunities(userProfile?.uid);
      setCommunities(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userProfile]);

  const handleToggleJoin = async (comm: Community) => {
    if (!currentUser || !userProfile) {
      onOpenAuth();
      return;
    }

    try {
      if (comm.isJoined) {
        await leaveCommunity(comm.id, userProfile.uid);
        setCommunities(prev => prev.map(c => c.id === comm.id ? { ...c, isJoined: false, membersCount: c.membersCount - 1 } : c));
        showToast(`Đã rời cộng đồng ${comm.name}`, "info");
      } else {
        await joinCommunity(comm.id, userProfile.uid);
        setCommunities(prev => prev.map(c => c.id === comm.id ? { ...c, isJoined: true, membersCount: c.membersCount + 1 } : c));
        showToast(`Đã tham gia cộng đồng ${comm.name}! 🎉`, "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) {
      onOpenAuth();
      return;
    }
    if (!name.trim() || !description.trim()) return;

    setCreating(true);
    try {
      const newComm = await createCommunity({
        name: name.trim(),
        description: description.trim(),
        avatar: avatar.trim() || `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150`,
        coverImage: `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800`,
        ownerId: userProfile.uid,
        tags: [category, "GenZ", "CùngNè"],
        isPrivate: false
      });

      setCommunities(prev => [newComm, ...prev]);
      setShowCreateModal(false);
      setName("");
      setDescription("");
      showToast(`Tạo cộng đồng "${name}" thành công! 🎉`, "success");
    } catch (e) {
      console.error(e);
      showToast("Không thể tạo cộng đồng. Vui lòng thử lại.", "error");
    } finally {
      setCreating(false);
    }
  };

  const tagsList = ["all", "Công nghệ", "AI", "GenZ", "Cafe", "Du lịch", "Học tập", "Nghề nghiệp"];

  const filteredCommunities = communities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = selectedTag === "all" || c.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    return matchSearch && matchTag;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5 text-purple-200" />
            <span>Cộng đồng CùngNè</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Tìm hội cùng gu – Chia sẻ đam mê
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            Khám phá và tham gia các nhóm học tập, lập trình, nhiếp ảnh, du lịch và khởi nghiệp của giới trẻ.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else setShowCreateModal(true);
          }}
          className="shrink-0 flex items-center gap-2 py-3 px-5 rounded-2xl bg-white text-purple-700 font-bold text-xs shadow-md hover:bg-purple-50 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo cộng đồng mới</span>
        </button>
      </div>

      {/* Search & Tags */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm cộng đồng theo tên hoặc sở thích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tagsList.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === t
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {t === "all" ? "Tất cả" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommunities.map((comm) => (
          <div
            key={comm.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between"
          >
            {/* Cover & Avatar Header */}
            <div>
              <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                {comm.coverImage && (
                  <img src={comm.coverImage} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="p-5 pt-0 relative">
                <div className="flex items-end justify-between -mt-8 mb-3">
                  <img
                    src={comm.avatar}
                    alt={comm.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 bg-white"
                  />

                  <button
                    onClick={() => handleToggleJoin(comm)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                      comm.isJoined
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                    }`}
                  >
                    {comm.isJoined ? "Đang tham gia ✓" : "Tham gia"}
                  </button>
                </div>

                <button
                  onClick={() => onNavigate("community-detail", { communityId: comm.id })}
                  className="font-extrabold text-base text-slate-900 dark:text-white hover:text-purple-600 text-left block"
                >
                  {comm.name}
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {comm.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {comm.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">{comm.membersCount.toLocaleString()} thành viên</span>
              <button
                onClick={() => onNavigate("community-detail", { communityId: comm.id })}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
              >
                Ghé thăm nhóm →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Tạo cộng đồng mới
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Xây dựng không gian riêng cho bạn bè cùng sở thích
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Tên cộng đồng
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hội Mê Chụp Ảnh Phim Hà Nội"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mô tả cộng đồng
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Giới thiệu về mục tiêu, sở thích và hoạt động của nhóm..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Chủ đề chính
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Công nghệ">💻 Công nghệ & Lập trình</option>
                  <option value="AI">🤖 AI & Tương lai</option>
                  <option value="Du lịch">✈️ Du lịch & Phượt</option>
                  <option value="Cafe">☕ Cafe & Check-in</option>
                  <option value="Học tập">📚 Học tập & Thi cử</option>
                  <option value="Khởi nghiệp">🚀 Khởi nghiệp / Startup</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  {creating ? "Đang tạo..." : "Tạo cộng đồng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
