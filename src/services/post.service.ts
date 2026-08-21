import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  increment 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Post, Comment, ReactionType, ReportReason, FeedFilterType } from "../types";
import { INITIAL_POSTS } from "../data/seedData";

const POSTS_COLLECTION = "posts";

export async function createPost(postData: Omit<Post, "id" | "likesCount" | "commentsCount" | "sharesCount" | "bookmarksCount" | "createdAt">): Promise<Post> {
  const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const newPost: Post = {
    ...postData,
    id: postId,
    likesCount: 0,
    reactions: {},
    commentsCount: 0,
    sharesCount: 0,
    bookmarksCount: 0,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, POSTS_COLLECTION, postId), newPost);
    try {
      await updateDoc(doc(db, "users", postData.authorId), {
        postsCount: increment(1)
      });
    } catch (_) {}
    return newPost;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${POSTS_COLLECTION}/${postId}`);
    return newPost;
  }
}

export function calculateRecommendationScore(post: Post, userInterests: string[] = [], followingIds: string[] = []): number {
  let score = 0;
  if (userInterests.some(interest => 
    post.category.toLowerCase().includes(interest.toLowerCase()) || 
    post.hashtags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
  )) {
    score += 40;
  }

  if (followingIds.includes(post.authorId)) {
    score += 50;
  }

  const engagement = (post.likesCount * 2) + (post.commentsCount * 3) + (post.sharesCount * 5);
  score += Math.min(engagement, 100);

  const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
  const freshness = Math.max(0, 100 - (ageInHours * 4));
  score += freshness * 0.3;

  return score;
}

export async function fetchPosts(
  tab: FeedFilterType | 'forYou' | 'following' | 'latest' | 'trending' = 'forYou',
  currentUserId?: string,
  userInterests: string[] = [],
  followingIds: string[] = []
): Promise<Post[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    let q = query(postsRef, orderBy("createdAt", "desc"), limit(30));

    const snapshot = await getDocs(q);
    let posts: Post[] = [];

    if (!snapshot.empty) {
      posts = snapshot.docs.map(doc => doc.data() as Post);
    } else {
      posts = [...INITIAL_POSTS];
    }

    if (tab === 'following') {
      if (followingIds.length > 0) {
        posts = posts.filter(p => followingIds.includes(p.authorId) || p.authorId === currentUserId);
      }
    } else if (tab === 'forYou') {
      posts.sort((a, b) => {
        const scoreA = calculateRecommendationScore(a, userInterests, followingIds);
        const scoreB = calculateRecommendationScore(b, userInterests, followingIds);
        return scoreB - scoreA;
      });
    } else if (tab === 'trending') {
      posts.sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount));
    }

    return posts;
  } catch (error) {
    return [...INITIAL_POSTS];
  }
}

export function subscribeToFeed(
  tab: FeedFilterType | 'forYou' | 'following' | 'latest' | 'trending',
  param2: string | string[] | undefined,
  param3: string[] | ((posts: Post[]) => void),
  param4?: string[] | ((posts: Post[]) => void),
  param5?: (posts: Post[]) => void
) {
  let currentUserId: string | undefined;
  let userInterests: string[] = [];
  let followingIds: string[] = [];
  let onUpdate: (posts: Post[]) => void;

  if (typeof param3 === "function") {
    // Called as subscribeToFeed(tab, interestsOrId, onUpdate)
    if (typeof param2 === "string") currentUserId = param2;
    else if (Array.isArray(param2)) userInterests = param2;
    onUpdate = param3;
  } else if (typeof param4 === "function") {
    // Called as subscribeToFeed(tab, currentUserId, userInterests, onUpdate)
    currentUserId = typeof param2 === "string" ? param2 : undefined;
    userInterests = Array.isArray(param3) ? param3 : [];
    onUpdate = param4;
  } else {
    currentUserId = typeof param2 === "string" ? param2 : undefined;
    userInterests = Array.isArray(param3) ? param3 : [];
    followingIds = Array.isArray(param4) ? param4 : [];
    onUpdate = param5 || (() => {});
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(40));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_POSTS);
        return;
      }

      let posts: Post[] = snapshot.docs.map(doc => doc.data() as Post);

      if (tab === 'following') {
        if (followingIds.length > 0) {
          posts = posts.filter(p => followingIds.includes(p.authorId) || p.authorId === currentUserId);
        }
      } else if (tab === 'forYou') {
        posts.sort((a, b) => {
          const scoreA = calculateRecommendationScore(a, userInterests, followingIds);
          const scoreB = calculateRecommendationScore(b, userInterests, followingIds);
          return scoreB - scoreA;
        });
      } else if (tab === 'trending') {
        posts.sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount));
      }

      onUpdate(posts);
    }, (error) => {
      onUpdate(INITIAL_POSTS);
    });
  } catch (error) {
    onUpdate(INITIAL_POSTS);
    return () => {};
  }
}

export function subscribeToCommunityPosts(communityId: string, onUpdate: (posts: Post[]) => void) {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, where("communityId", "==", communityId), orderBy("createdAt", "desc"), limit(40));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        const fallback = INITIAL_POSTS.filter(p => p.communityId === communityId);
        onUpdate(fallback);
        return;
      }
      const posts = snapshot.docs.map(d => d.data() as Post);
      onUpdate(posts);
    }, (err) => {
      const fallback = INITIAL_POSTS.filter(p => p.communityId === communityId);
      onUpdate(fallback);
    });
  } catch (e) {
    const fallback = INITIAL_POSTS.filter(p => p.communityId === communityId);
    onUpdate(fallback);
    return () => {};
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${POSTS_COLLECTION}/${postId}`);
  }
}

export async function togglePostReaction(postId: string, userId: string, reaction: ReactionType): Promise<{ hasReacted: boolean; newCount: number }> {
  try {
    const reactionRef = doc(db, "reactions", `${postId}_${userId}`);
    const reactionDoc = await getDoc(reactionRef);

    const postRef = doc(db, POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);

    if (reactionDoc.exists()) {
      const currentReaction = reactionDoc.data().type;
      if (currentReaction === reaction) {
        await deleteDoc(reactionRef);
        await updateDoc(postRef, {
          likesCount: increment(-1),
          [`reactions.${reaction}`]: increment(-1)
        });
        return { hasReacted: false, newCount: Math.max(0, (postDoc.data()?.likesCount || 1) - 1) };
      } else {
        await setDoc(reactionRef, {
          postId,
          userId,
          type: reaction,
          createdAt: new Date().toISOString()
        });
        await updateDoc(postRef, {
          [`reactions.${currentReaction}`]: increment(-1),
          [`reactions.${reaction}`]: increment(1)
        });
        return { hasReacted: true, newCount: postDoc.data()?.likesCount || 1 };
      }
    } else {
      await setDoc(reactionRef, {
        postId,
        userId,
        type: reaction,
        createdAt: new Date().toISOString()
      });
      await updateDoc(postRef, {
        likesCount: increment(1),
        [`reactions.${reaction}`]: increment(1)
      });
      return { hasReacted: true, newCount: (postDoc.data()?.likesCount || 0) + 1 };
    }
  } catch (error) {
    return { hasReacted: true, newCount: 1 };
  }
}

export const toggleReaction = togglePostReaction;

export async function addComment(
  postId: string, 
  authorId: string, 
  authorName: string, 
  authorUsername: string, 
  authorAvatar: string | undefined, 
  content: string, 
  parentId?: string | null
): Promise<Comment> {
  const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const comment: Comment = {
    id: commentId,
    postId,
    authorId,
    authorName,
    authorUsername,
    authorAvatar,
    content: content.trim(),
    parentId: parentId || null,
    likesCount: 0,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, POSTS_COLLECTION, postId, "comments", commentId), comment);
    await updateDoc(doc(db, POSTS_COLLECTION, postId), {
      commentsCount: increment(1)
    });
    return comment;
  } catch (error) {
    return comment;
  }
}

export function subscribeToComments(postId: string, onUpdate: (comments: Comment[]) => void) {
  try {
    const commentsRef = collection(db, POSTS_COLLECTION, postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => d.data() as Comment);
      onUpdate(list);
    }, (err) => {
      onUpdate([]);
    });
  } catch (e) {
    onUpdate([]);
    return () => {};
  }
}

export async function reportContent(
  reporterId: string,
  reporterName: string,
  targetType: 'post' | 'comment' | 'user' | 'community',
  targetId: string,
  reason: ReportReason,
  details?: string,
  targetContent?: string
): Promise<void> {
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  try {
    await setDoc(doc(db, "reports", reportId), {
      id: reportId,
      reporterId,
      reporterName,
      targetType,
      targetId,
      targetContent: targetContent || "",
      reason,
      details: details || "",
      status: "pending",
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Report content error:", error);
  }
}

export async function toggleBookmark(postId: string, userId: string): Promise<boolean> {
  try {
    const bookmarkRef = doc(db, "bookmarks", `${userId}_${postId}`);
    const bookmarkSnap = await getDoc(bookmarkRef);

    if (bookmarkSnap.exists()) {
      await deleteDoc(bookmarkRef);
      await updateDoc(doc(db, POSTS_COLLECTION, postId), {
        bookmarksCount: increment(-1)
      });
      return false;
    } else {
      await setDoc(bookmarkRef, {
        userId,
        postId,
        createdAt: new Date().toISOString()
      });
      await updateDoc(doc(db, POSTS_COLLECTION, postId), {
        bookmarksCount: increment(1)
      });
      return true;
    }
  } catch (error) {
    return true;
  }
}
