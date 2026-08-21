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
  onSnapshot 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Conversation, Message, UserProfile } from "../types";

export async function createOrGetConversation(
  user1Id: string,
  user2Id: string,
  user1Name: string,
  user2Name: string,
  user1Avatar?: string,
  user2Avatar?: string
): Promise<Conversation> {
  const sortedIds = [user1Id, user2Id].sort();
  const conversationId = `conv_${sortedIds[0]}_${sortedIds[1]}`;

  const convDoc = await getDoc(doc(db, "conversations", conversationId));
  if (convDoc.exists()) {
    return convDoc.data() as Conversation;
  }

  const newConv: Conversation = {
    id: conversationId,
    participants: [user1Id, user2Id],
    participantNames: {
      [user1Id]: user1Name,
      [user2Id]: user2Name
    },
    participantAvatars: {
      [user1Id]: user1Avatar || "",
      [user2Id]: user2Avatar || ""
    },
    participantDetails: {
      [user1Id]: {
        displayName: user1Name,
        username: user1Name.toLowerCase().replace(/\s+/g, ""),
        avatar: user1Avatar
      },
      [user2Id]: {
        displayName: user2Name,
        username: user2Name.toLowerCase().replace(/\s+/g, ""),
        avatar: user2Avatar
      }
    },
    lastMessage: "",
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "conversations", conversationId), newConv);
  } catch (e) {
    console.error("Create conversation error:", e);
  }
  return newConv;
}

export async function getOrCreateConversation(
  currentUser: UserProfile, 
  otherUser: { uid: string; displayName: string; username: string; avatar?: string; verified?: boolean }
): Promise<string> {
  const conv = await createOrGetConversation(
    currentUser.uid, 
    otherUser.uid, 
    currentUser.displayName, 
    otherUser.displayName, 
    currentUser.avatar, 
    otherUser.avatar
  );
  return conv.id;
}

export function subscribeToConversations(userId: string, onUpdate: (conversations: Conversation[]) => void) {
  try {
    const convsRef = collection(db, "conversations");
    const q = query(
      convsRef, 
      where("participants", "array-contains", userId), 
      orderBy("updatedAt", "desc"), 
      limit(25)
    );

    return onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(d => d.data() as Conversation);
      onUpdate(convs);
    }, (error) => {
      console.warn("Conversations listener error:", error);
      onUpdate([]);
    });
  } catch (err) {
    onUpdate([]);
    return () => {};
  }
}

export const subscribeUserConversations = subscribeToConversations;

export function subscribeToMessages(conversationId: string, onUpdate: (messages: Message[]) => void) {
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(100));

    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => d.data() as Message);
      onUpdate(list);
    }, (error) => {
      console.warn("Messages listener error:", error);
      onUpdate([]);
    });
  } catch (err) {
    onUpdate([]);
    return () => {};
  }
}

export const subscribeMessages = subscribeToMessages;

export async function sendMessage(
  conversationId: string,
  sender: UserProfile | string,
  text: string,
  imagesOrType?: string[] | 'text' | 'image' | 'file',
  mediaUrl?: string
): Promise<Message> {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const senderId = typeof sender === "string" ? sender : sender.uid;
  const senderName = typeof sender === "string" ? undefined : sender.displayName;
  const senderAvatar = typeof sender === "string" ? undefined : sender.avatar;

  const images = Array.isArray(imagesOrType) ? imagesOrType : (mediaUrl ? [mediaUrl] : []);

  const msg: Message = {
    id: msgId,
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    text: text.trim(),
    type: images.length > 0 ? "image" : "text",
    images,
    imageUrl: images[0] || undefined,
    seen: false,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "conversations", conversationId, "messages", msgId), msg);
    await updateDoc(doc(db, "conversations", conversationId), {
      lastMessage: text.trim() || (images.length > 0 ? "[Hình ảnh]" : ""),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Send message error:", error);
  }
  return msg;
}
