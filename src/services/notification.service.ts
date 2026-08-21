import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Notification, NotificationType } from "../types";

export function subscribeNotifications(userId: string, onUpdate: (notifications: Notification[]) => void) {
  try {
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(30)
    );

    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => d.data() as Notification);
      onUpdate(list);
    }, (err) => {
      console.warn("Notifications subscription error:", err);
      onUpdate(getMockNotifications(userId));
    });
  } catch (error) {
    onUpdate(getMockNotifications(userId));
    return () => {};
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "notifications", notificationId), { read: true });
  } catch (error) {}
}

export async function sendNotification(
  recipientId: string,
  type: NotificationType,
  title: string,
  message: string,
  targetUrl?: string,
  senderInfo?: { uid: string; displayName: string; username: string; avatar?: string }
): Promise<void> {
  const notifId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const notif: Notification = {
    id: notifId,
    recipientId,
    type,
    title,
    message,
    targetUrl,
    senderId: senderInfo?.uid,
    senderName: senderInfo?.displayName,
    senderUsername: senderInfo?.username,
    senderAvatar: senderInfo?.avatar,
    read: false,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "notifications", notifId), notif);
  } catch (error) {}
}

function getMockNotifications(userId: string): Notification[] {
  return [
    {
      id: "notif_welcome",
      recipientId: userId,
      type: "system",
      title: "Chào mừng bạn đến với CùngNè! 🎉",
      message: "Hãy hoàn thiện hồ sơ và khám phá các chủ đề thú vị nhé!",
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "notif_trend",
      recipientId: userId,
      type: "community",
      title: "Xu hướng mới nổi hôm nay",
      message: "Chủ đề #AI và #GenZ đang có hơn 1.4K lượt thảo luận sôi nổi.",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    }
  ];
}
