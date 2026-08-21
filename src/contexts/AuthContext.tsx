import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "../types";
import { getUserProfile, logout as apiLogout, SUPER_ADMIN_EMAIL } from "../services/auth.service";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isOnboarding: boolean;
  setIsOnboarding: (val: boolean) => void;
  isAdmin: boolean;
  isStaff: boolean;
  followingIds: string[];
  bookmarkedPostIds: string[];
  refreshProfile: () => Promise<void>;
  toggleFollowUser: (targetUserId: string) => Promise<boolean>;
  isFollowing: (targetUserId: string) => boolean;
  logout: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("cungne_theme") as 'light' | 'dark' | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemDark ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem("cungne_theme", t);
    if (t === 'dark') {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const refreshProfile = async () => {
    if (!currentUser) return;
    try {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        // Enforce super admin if matching user email
        if (currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && profile.role !== 'admin') {
          profile.role = 'admin';
          profile.verified = true;
          try {
            await updateDoc(doc(db, "users", currentUser.uid), { role: 'admin', verified: true });
          } catch (_) {}
        }
        setUserProfile(profile);
        if (!profile.interests || profile.interests.length === 0) {
          setIsOnboarding(true);
        }
      }
    } catch (e) {
      console.warn("Failed to refresh profile:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            if (fbUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && profile.role !== 'admin') {
              profile.role = 'admin';
              profile.verified = true;
            }
            setUserProfile(profile);
            if (!profile.interests || profile.interests.length === 0) {
              setIsOnboarding(true);
            }
          }
        } catch (err) {
          console.warn("Error fetching profile on auth state change:", err);
        }
      } else {
        setUserProfile(null);
        setIsOnboarding(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isFollowing = (targetUserId: string) => {
    return followingIds.includes(targetUserId);
  };

  const toggleFollowUser = async (targetUserId: string): Promise<boolean> => {
    if (!currentUser || !userProfile) return false;
    const followId = `${currentUser.uid}_${targetUserId}`;
    const followDocRef = doc(db, "follows", followId);

    const isCurrentlyFollowing = followingIds.includes(targetUserId);

    try {
      if (isCurrentlyFollowing) {
        setFollowingIds(prev => prev.filter(id => id !== targetUserId));
        await deleteDoc(followDocRef);
        await updateDoc(doc(db, "users", currentUser.uid), { followingCount: increment(-1) });
        await updateDoc(doc(db, "users", targetUserId), { followersCount: increment(-1) });
        return false;
      } else {
        setFollowingIds(prev => [...prev, targetUserId]);
        await setDoc(followDocRef, {
          followerId: currentUser.uid,
          followingId: targetUserId,
          createdAt: new Date().toISOString()
        });
        await updateDoc(doc(db, "users", currentUser.uid), { followingCount: increment(1) });
        await updateDoc(doc(db, "users", targetUserId), { followersCount: increment(1) });
        return true;
      }
    } catch (e) {
      // Optimistic fallback
      if (isCurrentlyFollowing) {
        setFollowingIds(prev => prev.filter(id => id !== targetUserId));
        return false;
      } else {
        setFollowingIds(prev => [...prev, targetUserId]);
        return true;
      }
    }
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === "admin" || currentUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const isStaff = isAdmin || userProfile?.role === "moderator";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isOnboarding,
        setIsOnboarding,
        isAdmin,
        isStaff,
        followingIds,
        bookmarkedPostIds,
        refreshProfile,
        toggleFollowUser,
        isFollowing,
        logout,
        setTheme,
        theme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
