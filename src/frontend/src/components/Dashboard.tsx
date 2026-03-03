import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyInterviewAttempts } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  Activity,
  Calendar,
  ChevronRight,
  Lightbulb,
  Mic2,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import type { ActivityType, StudentProfile } from "../backend.d.ts";
import { CRIGauge } from "./CRIGauge";

interface DashboardProps {
  profile: StudentProfile;
  onNavigate: (page: string) => void;
}

const activityTypeColors: Record<string, string> = {
  hackathon: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  workshop: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  certification: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  competition: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  project: "bg-primary/15 text-primary border-primary/30",
};

const goalLabels: Record<string, string> = {
  placement: "🎯 Targeting Placement",
  higherStudies: "🎓 Higher Studies",
  entrepreneurship: "🚀 Entrepreneurship",
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number | string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "rounded-xl bg-card border border-border p-4 flex items-center gap-4",
        onClick && "cursor-pointer card-hover",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          color,
        )}
      >
        <Icon size={18} />
      </div>
      <div>
        <div className="font-display font-bold text-2xl leading-none">
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
      {onClick && (
        <ChevronRight size={16} className="ml-auto text-muted-foreground" />
      )}
    </motion.div>
  );
}

export function Dashboard({ profile, onNavigate }: DashboardProps) {
  const { data: attempts, isLoading: attemptsLoading } =
    useMyInterviewAttempts();

  const cri = Number(profile.cri);
  const recentActivities = [...profile.activities].slice(-3).reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CRI Hero */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* CRI Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1 glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
        >
          <CRIGauge value={cri} size={180} />
          <Badge
            variant="outline"
            className="text-xs border-primary/30 text-primary"
          >
            {goalLabels[profile.careerPathGoal] ?? profile.careerPathGoal}
          </Badge>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl flex-shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">
                {profile.department}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Year {String(profile.year)}
                </Badge>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp size={12} />
                  {cri < 40
                    ? "Building foundation"
                    : cri < 70
                      ? "Good progress"
                      : "Excellent readiness"}
                </span>
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* Top skills */}
          {profile.skills.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">
                TOP SKILLS
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 5).map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="outline"
                    className="text-xs border-border bg-secondary/50"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {profile.skills.length > 5 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    +{profile.skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {profile.skills.length === 0 && (
            <button
              type="button"
              onClick={() => onNavigate("skills")}
              className="w-full text-left px-4 py-3 rounded-lg border border-dashed border-primary/30 text-sm text-primary hover:bg-primary/5 transition-colors"
            >
              + Add your first skills →
            </button>
          )}
        </motion.div>
      </div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <StatCard
          icon={Wrench}
          label="Skills"
          value={profile.skills.length}
          color="bg-primary/15 text-primary"
          onClick={() => onNavigate("skills")}
        />
        <StatCard
          icon={Activity}
          label="Activities"
          value={profile.activities.length}
          color="bg-chart-2/15 text-chart-2"
          onClick={() => onNavigate("activities")}
        />
        <StatCard
          icon={Lightbulb}
          label="Interests"
          value={profile.interests.length}
          color="bg-chart-4/15 text-chart-4"
          onClick={() => onNavigate("interests")}
        />
        <StatCard
          icon={Mic2}
          label="Interviews"
          value={attemptsLoading ? "..." : (attempts?.length ?? 0)}
          color="bg-chart-3/15 text-chart-3"
          onClick={() => onNavigate("interview")}
        />
      </motion.div>

      {/* Recent Activities + CRI Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center justify-between">
                <span>Recent Activities</span>
                <button
                  type="button"
                  onClick={() => onNavigate("activities")}
                  className="text-xs text-primary font-normal hover:underline"
                >
                  View all
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onNavigate("activities")}
                  className="w-full text-center py-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  No activities yet. Log your first one →
                </button>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={`${activity.name}-${activity.date}`}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={cn(
                          "mt-0.5 px-2 py-0.5 rounded text-xs font-medium border",
                          activityTypeColors[activity.activityType as string] ??
                            "bg-secondary text-foreground border-border",
                        )}
                      >
                        {activity.activityType}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {activity.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Calendar size={10} />
                          {activity.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* CRI Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Target size={16} />
                Readiness Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Skills Coverage",
                  value: Math.min(100, profile.skills.length * 10),
                  color: "bg-primary",
                },
                {
                  label: "Activity Score",
                  value: Math.min(100, profile.activities.length * 12),
                  color: "bg-chart-2",
                },
                {
                  label: "Interest Clarity",
                  value: Math.min(100, profile.interests.length * 14),
                  color: "bg-chart-4",
                },
                {
                  label: "Interview Practice",
                  value: attemptsLoading
                    ? 0
                    : Math.min(100, (attempts?.length ?? 0) * 10),
                  color: "bg-chart-3",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: "easeOut",
                      }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="md:col-span-2 h-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["sk1", "sk2", "sk3", "sk4"].map((k) => (
          <Skeleton key={k} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
