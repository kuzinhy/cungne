import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  MapPin, 
  Globe, 
  Calendar, 
  Edit3, 
  Bookmark, 
  Grid, 
  Image as ImageIcon, 
  MessageSquare, 
  UserPlus, 
  UserCheck, 
  Sparkles,
  Share2,
  X,
  Camera
} from "lucide-react";
import { UserProfile, Post } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { getUserProfileByUsername, updateUserProfile, uploadMedia } from "../../services/auth.service";
import { subscribeToFeed } from "../../services/post.service";
import { PostCard } from "../feed/PostCard";
import { useToast } from "../../contexts/ToastContext";

interface ProfileViewProps {
  username?: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ username, onNavigate, onOpenAuth }) => {
  const { currentUser, userProfile: myProfile, refreshProfile, isFollowing, toggleFollowUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "media" | "bookmarks">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const isMe = !username || username === myProfile?.username;

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (isMe) {
        setProfile(myProfile);
      } else if (username) {
        const p = await getUserProfileByUsername(username);
        setProfile(p);
      }
      setLoading(false);
    }
    load();
  }, [username, isMe, myProfile]);

  useEffect(() => {
    const unsub = subscribeToFeed("latest", [], (allPosts) => {
      if (profile) {
        setPosts(allPosts.filter(p => p.authorUsername === profile.username || p.authorId === profile.uid));
      }
    });
    return () => unsub();
  }, [profile]);

  const handleOpenEdit = () => {
    if (!profile) return;
    setEditDisplayName(profile.displayName || "");
    setEditBio(profile.bio || "");
    setEditLocation(profile.location || "");
    setEditWebsite(profile.website || "");
    setEditInterests(profile.interests || []);
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentUser) return;
    setSavingProfile(true);
    try {
      await updateUserProfile(profile.uid, {
        displayName: editDisplayName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        website: editWebsite.trim(),
        interests: editInterests
      });
      await refreshProfile();
      setProfile(prev => prev ? {
        ...prev,
        displayName: editDisplayName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        website: editWebsite.trim(),
        interests: editInterests
      } : null);
      setShowEditModal(false);
      showToast("Cập nhật hồ sơ thành công! 🎉", "success");
    } catch (e) {
      showToast("Không thể cập nhật hồ sơ.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !profile) return;
    try {
      const file = files[0];
      const url = await uploadMedia(file, `avatars/${profile.uid}/${Date.now()}_${file.name}`);
      await updateUserProfile(profile.uid, { avatar: url });
      await refreshProfile();
      setProfile(prev => prev ? { ...prev, avatar: url } : null);
      showToast("Đã đổi ảnh đại diện!", "success");
    } catch (e) {
      showToast("Không thể đổi avatar.", "error");
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !profile) {
      onOpenAuth();
      return;
    }
    const followed = await toggleFollowUser(profile.uid);
    showToast(followed ? `Đã theo dõi ${profile.displayName}` : `Đã bỏ theo dõi ${profile.displayName}`, "info");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">Không tìm thấy người dùng này.</p>
      </div>
    );
  }

  const isUserFollowing = isFollowing(profile.uid);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 relative">
          {profile.coverImage && (
            <img src={profile.coverImage} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 gap-3 mb-4">
            <div className="relative inline-block">
              <img
                src={profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
                alt={profile.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 bg-white shadow-lg"
              />
              {isMe && (
                <label className="absolute bottom-1 right-1 p-2 rounded-2xl bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 transition-colors shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                </label>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isMe ? (
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center gap-1.5 py-2.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Chỉnh sửa hồ sơ</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-1.5 py-2.5 px-6 rounded-2xl text-xs font-bold transition-all ${
                      isUserFollowing
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    }`}
                  >
                    {isUserFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isUserFollowing ? "Đang theo dõi" : "Theo dõi"}</span>
                  </button>

                  <button
                    onClick={() => onNavigate("messages")}
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Nhắn tin"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profile.displayName}
                </h1>
                {profile.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" title="Tài khoản đã xác thực" />
                )}
                {profile.role === "admin" && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">@{profile.username}</p>
            </div>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{profile.website}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Tham gia {new Date(profile.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <strong className="text-slate-900 dark:text-white font-extrabold text-sm mr-1">
                  {profile.followingCount || 0}
                </strong>
                <span className="text-slate-400">Đang theo dõi</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white font-extrabold text-sm mr-1">
                  {profile.followersCount || 0}
                </strong>
                <span className="text-slate-400">Người theo dõi</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white font-extrabold text-sm mr-1">
                  {profile.postsCount || posts.length}
                </strong>
                <span className="text-slate-400">Bài viết</span>
              </div>
            </div>

            {/* Interests tags */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {profile.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Bài viết / Media / Đã lưu */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "posts"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Bài viết ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "media"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Hình ảnh & Video</span>
        </button>

        {isMe && (
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "bookmarks"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Đã lưu</span>
          </button>
        )}
      </div>

      {/* Posts Content */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">Chưa có bài viết nào.</p>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Chỉnh sửa hồ sơ cá nhân
              </h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  required
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Tiểu sử (Bio)
                </label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu đôi nét về bản thân, phong cách sống, ngành học..."
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Địa điểm (Tỉnh / Thành phố)
                </label>
                <input
                  type="text"
                  placeholder="Hà Nội, TP. Hồ Chí Minh..."
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Website / Portfolio
                </label>
                <input
                  type="text"
                  placeholder="github.com/username hoặc portfolio..."
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
