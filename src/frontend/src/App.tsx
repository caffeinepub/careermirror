import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { ActivitiesPage } from "./components/ActivitiesPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { AppShell, type Page } from "./components/AppShell";
import { Dashboard, DashboardSkeleton } from "./components/Dashboard";
import { InterestsPage } from "./components/InterestsPage";
import { LandingPage } from "./components/LandingPage";
import { MockInterviewPage } from "./components/MockInterviewPage";
import { ProfilePage } from "./components/ProfilePage";
import { ProfileSetup } from "./components/ProfileSetup";
import { RoadmapPage } from "./components/RoadmapPage";
import { SkillsPage } from "./components/SkillsPage";
import { useIsAdmin, useMyProfile } from "./hooks/useBackend";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      <div className="relative z-10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading CareerMirror...</p>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: isAdmin } = useIsAdmin();

  // Redirect to profile setup if no profile
  if (profileLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <ProfileSetup
        onComplete={() => {
          // Profile will be refetched automatically via React Query
        }}
      />
    );
  }

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      isAdmin={isAdmin ?? false}
      profile={profile}
    >
      {currentPage === "dashboard" && (
        <Dashboard
          profile={profile}
          onNavigate={(p) => setCurrentPage(p as Page)}
        />
      )}
      {currentPage === "profile" && <ProfilePage profile={profile} />}
      {currentPage === "interests" && <InterestsPage profile={profile} />}
      {currentPage === "skills" && <SkillsPage profile={profile} />}
      {currentPage === "activities" && <ActivitiesPage profile={profile} />}
      {currentPage === "roadmap" && <RoadmapPage />}
      {currentPage === "interview" && <MockInterviewPage />}
      {currentPage === "admin" && (isAdmin ? <AdminDashboard /> : null)}
    </AppShell>
  );
}

export default function App() {
  const { identity, isInitializing, isLoggingIn, login } =
    useInternetIdentity();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onLogin={login} isLoggingIn={isLoggingIn} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <>
      <AuthenticatedApp />
      <Toaster richColors position="top-right" />
    </>
  );
}
