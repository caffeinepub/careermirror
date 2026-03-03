import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Activity,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Map as MapIcon,
  Menu,
  Mic2,
  ShieldCheck,
  User,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { StudentProfile } from "../backend.d.ts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export type Page =
  | "dashboard"
  | "profile"
  | "interests"
  | "skills"
  | "activities"
  | "roadmap"
  | "interview"
  | "admin";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "interests", label: "Interests", icon: Lightbulb },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "activities", label: "Activities", icon: Activity },
  { id: "roadmap", label: "Learning Roadmap", icon: MapIcon },
  { id: "interview", label: "Mock Interview", icon: Mic2 },
  { id: "admin", label: "Admin Panel", icon: ShieldCheck, adminOnly: true },
];

interface AppShellProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
  profile: StudentProfile | null;
  children: React.ReactNode;
}

export function AppShell({
  currentPage,
  onNavigate,
  isAdmin,
  profile,
  children,
}: AppShellProps) {
  const { clear } = useInternetIdentity();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const SidebarContent = () => (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <GraduationCap size={18} className="text-primary" />
          </div>
          <span className="font-display font-bold text-base text-sidebar-foreground">
            CareerMirror
          </span>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              setSidebarOpen(false);
            }}
            className={cn(
              "sidebar-link w-full text-left",
              currentPage === item.id && "active",
              item.adminOnly && "border border-primary/20 bg-primary/5",
            )}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* User section */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        {profile && (
          <div className="px-3 py-2 mb-2">
            <div className="text-xs font-semibold text-sidebar-foreground truncate">
              {profile.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {profile.department} • Year {String(profile.year)}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => clear()}
          className="sidebar-link w-full text-left text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>

          <div className="flex-1">
            <h1 className="font-display font-bold text-lg">
              {visibleItems.find((i) => i.id === currentPage)?.label ??
                "CareerMirror"}
            </h1>
          </div>

          {profile && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {profile.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  CRI: {String(profile.cri)}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
