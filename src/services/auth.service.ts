import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage, googleProvider, handleFirestoreError, OperationType } from "../lib/firebase";
import { UserProfile, UserRole } from "../types";

export const SUPER_ADMIN_EMAIL = "nguyenhuy.thudaumot@gmail.com";

export async function checkUsernameUnique(username: string): Promise<boolean> {
  const cleanUsername = username.toLowerCase().replace(/^@/, "").trim();
  if (!cleanUsername) return false;
  
  try {
    const usernameDoc = await getDoc(doc(db, "usernames", cleanUsername));
    return !usernameDoc.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `usernames/${cleanUsername}`);
  }
}

export async function registerWithEmail(
  email: string, 
  pass: string, 
  displayName: string, 
  username: string
): Promise<UserProfile> {
  const cleanUsername = username.toLowerCase().replace(/^@/, "").trim();
  const isUnique = await checkUsernameUnique(cleanUsername);
  if (!isUnique) {
    throw new Error("Username này đã được sử dụng. Vui lòng chọn username khác.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  await updateProfile(fbUser, { displayName });

  const role: UserRole = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? "admin" : "member";
  
  const userProfile: UserProfile = {
    uid: fbUser.uid,
    email: fbUser.email || email,
    displayName: displayName.trim(),
    username: cleanUsername,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    bio: "Xin chào! Mình vừa gia nhập mạng xã hội CùngNè ✨",
    interests: [],
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    role,
    verified: role === "admin",
    status: "active",
    badges: role === "admin" ? ["Admin", "Super Creator"] : ["Thành viên mới"],
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "users", fbUser.uid), userProfile);
    await setDoc(doc(db, "usernames", cleanUsername), { uid: fbUser.uid, email });
    if (role === "admin") {
      await setDoc(doc(db, "admins", fbUser.uid), { email, assignedAt: serverTimestamp() });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
  }

  return userProfile;
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const profile = await getUserProfile(userCredential.user.uid);
  if (!profile) {
    throw new Error("Không tìm thấy thông tin tài khoản.");
  }
  if (profile.status === "banned") {
    await signOut(auth);
    throw new Error("Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng.");
  }
  return profile;
}

export async function loginWithGoogle(): Promise<{ profile: UserProfile; isNewUser: boolean }> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const fbUser = userCredential.user;

  let profile = await getUserProfile(fbUser.uid);
  let isNew = false;

  if (!profile) {
    isNew = true;
    const baseUsername = (fbUser.email?.split("@")[0] || `user_${fbUser.uid.slice(0, 6)}`).toLowerCase().replace(/[^a-z0-9_]/g, "");
    let finalUsername = baseUsername;
    let counter = 1;
    while (!(await checkUsernameUnique(finalUsername))) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    const role: UserRole = (fbUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) ? "admin" : "member";

    profile = {
      uid: fbUser.uid,
      email: fbUser.email || "",
      displayName: fbUser.displayName || `Thành viên ${finalUsername}`,
      username: finalUsername,
      avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${finalUsername}`,
      cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      bio: "Chào bạn bè CùngNè! Mình tham gia bằng Google ✨",
      interests: [],
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      role,
      verified: role === "admin",
      status: "active",
      badges: role === "admin" ? ["Admin", "Super Creator"] : ["Thành viên mới"],
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", fbUser.uid), profile);
      await setDoc(doc(db, "usernames", finalUsername), { uid: fbUser.uid, email: fbUser.email });
      if (role === "admin") {
        await setDoc(doc(db, "admins", fbUser.uid), { email: fbUser.email, assignedAt: serverTimestamp() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
    }
  }

  if (profile.status === "banned") {
    await signOut(auth);
    throw new Error("Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng.");
  }

  return { profile, isNewUser: isNew || profile.interests.length === 0 };
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const cleanUsername = username.toLowerCase().replace(/^@/, "").trim();
  try {
    const q = query(collection(db, "users"), where("username", "==", cleanUsername));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "users");
  }
}

export async function updateUserInterests(uid: string, interests: string[]): Promise<void> {
  try {
    await updateDoc(doc(db, "users", uid), {
      interests,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export const getUserProfileByUsername = getUserByUsername;

export async function uploadMedia(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    // If storage is not yet active or fails, safely convert file to Base64 Data URL so user is never blocked!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
