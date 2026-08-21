export type UserRole = 'member' | 'moderator' | 'admin' | 'user';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'warned';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string; // e.g. @linh2005
  avatar?: string;
  cover?: string;
  coverImage?: string;
  bio?: string;
  interests: string[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  role: UserRole;
  verified: boolean;
  status: UserStatus;
  location?: string;
  website?: string;
  badges?: string[];
  createdAt: string; // ISO string
  updatedAt?: string;
}

export type PostCategory = 
  | 'Trend' 
  | 'Học tập' 
  | 'Định hướng' 
  | 'Giải trí' 
  | 'Công nghệ' 
  | 'Đời sống' 
  | 'Kiến thức' 
  | 'Sáng tạo' 
  | 'Startup' 
  | 'Tâm sự';

export type ReactionType = 'like' | 'love' | 'haha' | 'fire' | 'wow';

export type FeedFilterType = 'forYou' | 'following' | 'latest' | 'trending';

export interface PostReaction {
  userId: string;
  type: ReactionType;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorBadge?: string;
  authorRole?: UserRole;
  authorVerified?: boolean;
  content: string;
  images: string[];
  video?: string;
  category: PostCategory;
  hashtags: string[];
  likesCount: number;
  reactions?: Record<string, number>; // { 'love': 12, 'fire': 8, ... }
  userReaction?: ReactionType | null;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  communityId?: string;
  communityName?: string;
  visibility: 'public' | 'followers';
  createdAt: string;
  isPinned?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorBadge?: string;
  authorVerified?: boolean;
  content: string;
  parentId?: string | null; // For nested replies
  likesCount: number;
  likedBy?: string[];
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  cover?: string;
  coverImage?: string;
  topic?: string;
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  moderators?: string[];
  membersCount: number;
  postsCount: number;
  createdAt: string;
  isMember?: boolean;
  isJoined?: boolean;
  isPrivate?: boolean;
  ruleList?: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails?: Record<string, {
    displayName: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  }>;
  participantNames?: Record<string, string>;
  participantAvatars?: Record<string, string>;
  lastMessage?: string | {
    senderId: string;
    text: string;
    createdAt: string;
    seen: boolean;
  };
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  text: string;
  type?: 'text' | 'image' | 'file';
  images?: string[];
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  seen?: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'reply' 
  | 'mention' 
  | 'follow' 
  | 'community' 
  | 'system'
  | 'message';

export interface Notification {
  id: string;
  recipientId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  senderUsername?: string;
  type: NotificationType;
  title: string;
  message: string;
  targetUrl?: string;
  targetId?: string;
  read: boolean;
  createdAt: string;
}

export type ReportTargetType = 'post' | 'comment' | 'user' | 'community';

export type ReportReason = 
  | 'Spam' 
  | 'Quấy rối' 
  | 'Nội dung không phù hợp' 
  | 'Thông tin sai lệch' 
  | 'Lừa đảo' 
  | 'Khác';

export interface Report {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: ReportTargetType;
  targetId: string;
  targetContent?: string;
  targetAuthorName?: string;
  reason: ReportReason;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'resolved';
  createdAt: string;
  actionTaken?: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string;
  targetId: string;
  targetType: string;
  reason?: string;
  createdAt: string;
}

export interface TrendTag {
  tag: string;
  category: string;
  postsCount: number;
  growth: string;
  isHot?: boolean;
}

export interface TopicItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  postCount: number;
  color: string;
}
