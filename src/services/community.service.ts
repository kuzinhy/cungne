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
  increment 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Community } from "../types";
import { INITIAL_COMMUNITIES } from "../data/seedData";

const COMMUNITIES_COLLECTION = "communities";

export async function getCommunities(userId?: string): Promise<Community[]> {
  try {
    const q = query(collection(db, COMMUNITIES_COLLECTION), orderBy("membersCount", "desc"), limit(20));
    const snap = await getDocs(q);
    let list: Community[] = [];

    if (!snap.empty) {
      list = snap.docs.map(d => d.data() as Community);
    } else {
      list = [...INITIAL_COMMUNITIES];
    }

    if (userId) {
      // Check joined status
      for (const c of list) {
        try {
          const memDoc = await getDoc(doc(db, COMMUNITIES_COLLECTION, c.id, "members", userId));
          c.isJoined = memDoc.exists();
        } catch (_) {}
      }
    }

    return list;
  } catch (error) {
    return INITIAL_COMMUNITIES;
  }
}

export async function getCommunityById(communityId: string, userId?: string): Promise<Community | null> {
  try {
    const commDoc = await getDoc(doc(db, COMMUNITIES_COLLECTION, communityId));
    if (commDoc.exists()) {
      const data = commDoc.data() as Community;
      if (userId) {
        const memDoc = await getDoc(doc(db, COMMUNITIES_COLLECTION, communityId, "members", userId));
        data.isJoined = memDoc.exists();
      }
      return data;
    }
    const seed = INITIAL_COMMUNITIES.find(c => c.id === communityId);
    return seed || null;
  } catch (e) {
    const seed = INITIAL_COMMUNITIES.find(c => c.id === communityId);
    return seed || null;
  }
}

export async function createCommunity(
  paramOrName: string | {
    name: string;
    description: string;
    avatar?: string;
    coverImage?: string;
    ownerId: string;
    tags?: string[];
    isPrivate?: boolean;
  },
  description?: string,
  topic?: string,
  avatar?: string,
  cover?: string,
  ownerId?: string,
  ownerName?: string
): Promise<Community> {
  const communityId = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  let community: Community;

  if (typeof paramOrName === "object") {
    community = {
      id: communityId,
      name: paramOrName.name.trim(),
      description: paramOrName.description.trim(),
      avatar: paramOrName.avatar || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150",
      coverImage: paramOrName.coverImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
      ownerId: paramOrName.ownerId,
      tags: paramOrName.tags || ["GenZ", "CùngNè"],
      membersCount: 1,
      postsCount: 0,
      isJoined: true,
      createdAt: new Date().toISOString()
    };
  } else {
    community = {
      id: communityId,
      name: paramOrName.trim(),
      description: (description || "").trim(),
      topic: topic || "Chung",
      tags: [topic || "Chung", "GenZ"],
      avatar: avatar || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150",
      cover: cover || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
      ownerId: ownerId || "",
      ownerName: ownerName || "",
      membersCount: 1,
      postsCount: 0,
      isJoined: true,
      createdAt: new Date().toISOString()
    };
  }

  try {
    await setDoc(doc(db, COMMUNITIES_COLLECTION, communityId), community);
    if (community.ownerId) {
      await setDoc(doc(db, COMMUNITIES_COLLECTION, communityId, "members", community.ownerId), {
        userId: community.ownerId,
        role: "owner",
        joinedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Create community error:", error);
  }
  return community;
}

export async function joinCommunity(communityId: string, userId: string): Promise<boolean> {
  try {
    await setDoc(doc(db, COMMUNITIES_COLLECTION, communityId, "members", userId), {
      userId,
      role: "member",
      joinedAt: new Date().toISOString()
    });
    await updateDoc(doc(db, COMMUNITIES_COLLECTION, communityId), {
      membersCount: increment(1)
    });
    return true;
  } catch (error) {
    return true;
  }
}

export async function leaveCommunity(communityId: string, userId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COMMUNITIES_COLLECTION, communityId, "members", userId));
    await updateDoc(doc(db, COMMUNITIES_COLLECTION, communityId), {
      membersCount: increment(-1)
    });
    return false;
  } catch (error) {
    return false;
  }
}
