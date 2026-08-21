import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AppHeader } from "./components/layout/AppHeader";
import { Sidebar } from "./components/layout/Sidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import { MobileNavigation } from "./components/layout/MobileNavigation";
import { LandingPage } from "./components/layout/LandingPage";
import { AuthModal } from "./components/auth/AuthModal";
import { OnboardingModal } from "./components/auth/OnboardingModal";
import { FeedView } from "./components/feed/FeedView";
import { ExploreView } from "./components/explore/ExploreView";
import { LearnHubView } from "./components/learn/LearnHubView";
import { CareerHubView } from "./components/career/CareerHubView";
import { CommunitiesView } from "./components/communities/CommunitiesView";
import { CommunityDetailView } from "./components/communities/CommunityDetailView";
import { ChatView } from "./components/chat/ChatView";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { ProfileView } from "./components/profile/ProfileView";
import { SettingsView } from "./components/settings/SettingsView";
import { AdminDashboardView } from "./components/admin/AdminDashboardView";
import { AIAssistantModal } from "./components/ai/AIAssistantModal";
import { PostComposer } from "./components/feed/PostComposer";
import { X } from "lucide-react";

function MainApp() {
  const { currentUser, userProfile, loading } = useAuth();

  // Navigation State
  const [activeView, setActiveView] = useState<string>("feed");
  const [viewParams, setViewParams] = useState<any>({});
  
  // Show Landing Page for first-time guest visitors
  const [showLanding, setShowLanding] = useState<boolean>(!currentUser && !localStorage.getItem("cungne_visited"));

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [aiModalType, setAiModalType] = useState<"general" | "career" | "study">("general");

  const handleNavigate = (view: string, param?: any) => {
    setActiveView(view);
    setViewParams(param || {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleOpenAI = (type: "general" | "career" | "study" = "general") => {
    setAiModalType(type);
    setShowAIModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-2xl animate-pulse shadow-xl shadow-indigo-500/20 mb-4">
          C
        </div>
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is guest and landing is enabled
  if (!currentUser && showLanding) {
    return (
      <>
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onExploreFeed={() => {
            setShowLanding(false);
            localStorage.setItem("cungne_visited", "true");
          }}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Fixed Header */}
      <AppHeader
        onOpenAuth={handleOpenAuth}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
        onOpenAI={() => handleOpenAI("general")}
        onNavigate={handleNavigate}
        activeView={activeView}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6">
        
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenCreatePost={() => setShowCreatePostModal(true)}
          onOpenAI={() => handleOpenAI("general")}
        />

        {/* Central Dynamic View */}
        <section className="flex-1 min-w-0 pb-20 lg:pb-8">
          {activeView === "feed" && (
            <FeedView
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
              onOpenAI={() => handleOpenAI("general")}
            />
          )}

          {activeView === "explore" && (
            <ExploreView
              initialHashtag={viewParams.hashtag}
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          )}

          {activeView === "learn" && (
            <LearnHubView
              onOpenAI={() => handleOpenAI("study")}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === "career" && (
            <CareerHubView
              onOpenAI={() => handleOpenAI("career")}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === "communities" && (
            <CommunitiesView
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          )}

          {activeView === "community-detail" && (
            <CommunityDetailView
              communityId={viewParams.communityId}
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          )}

          {activeView === "messages" && (
            <ChatView
              onOpenAuth={() => handleOpenAuth("login")}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === "notifications" && (
            <NotificationsView
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          )}

          {activeView === "profile" && (
            <ProfileView
              username={viewParams.username || userProfile?.username}
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          )}

          {activeView === "settings" && (
            <SettingsView
              onNavigate={handleNavigate}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          )}

          {activeView === "admin" && (
            <AdminDashboardView
              onNavigate={handleNavigate}
            />
          )}
        </section>

        {/* Right Desktop Sidebar (Trends, Suggestions, Communities) */}
        {activeView !== "messages" && (
          <RightSidebar
            onNavigate={handleNavigate}
            onOpenAuth={() => handleOpenAuth("login")}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
        onOpenAuth={() => handleOpenAuth("login")}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      <OnboardingModal />

      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        initialType={aiModalType}
      />

      {/* Floating Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Tạo bài viết mới
              </h2>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <PostComposer
              onPostCreated={() => {
                setShowCreatePostModal(false);
                handleNavigate("feed");
              }}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
