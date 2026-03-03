import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAggregateStats, useAllProfiles } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  GraduationCap,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { CareerPathGoal } from "../backend";

const goalConfig: Record<
  CareerPathGoal,
  { label: string; color: string; icon: string }
> = {
  [CareerPathGoal.placement]: {
    label: "Placement",
    color: "bg-chart-2/15 text-chart-2 border-chart-2/30",
    icon: "🎯",
  },
  [CareerPathGoal.higherStudies]: {
    label: "Higher Studies",
    color: "bg-primary/15 text-primary border-primary/30",
    icon: "🎓",
  },
  [CareerPathGoal.entrepreneurship]: {
    label: "Entrepreneurship",
    color: "bg-chart-4/15 text-chart-4 border-chart-4/30",
    icon: "🚀",
  },
};

function CRIChip({ cri }: { cri: number }) {
  const color =
    cri < 40
      ? "bg-chart-5/15 text-chart-5 border-chart-5/30"
      : cri < 70
        ? "bg-chart-4/15 text-chart-4 border-chart-4/30"
        : "bg-chart-3/15 text-chart-3 border-chart-3/30";

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-bold tabular-nums", color)}
    >
      {cri}
    </Badge>
  );
}

export function AdminDashboard() {
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles();
  const { data: stats, isLoading: statsLoading } = useAggregateStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Aggregate stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statsLoading ? (
          ["s1", "s2", "s3", "s4", "s5"].map((k) => (
            <Skeleton key={k} className="h-24 rounded-xl" />
          ))
        ) : stats ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="col-span-2 md:col-span-1"
            >
              <Card className="bg-card border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Users size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl">
                        {String(stats.totalStudents)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Students
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-chart-3/15 flex items-center justify-center">
                      <TrendingUp size={16} className="text-chart-3" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl">
                        {String(stats.averageCRI)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg CRI
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-chart-2/15 flex items-center justify-center">
                      <Briefcase size={16} className="text-chart-2" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl">
                        {String(stats.placementCount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Placement
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                      <GraduationCap size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl">
                        {String(stats.higherStudiesCount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Higher Studies
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-chart-4/15 flex items-center justify-center">
                      <Rocket size={16} className="text-chart-4" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl">
                        {String(stats.entrepreneurshipCount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Entrepreneurship
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* Student table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">
            All Students ({profiles?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profilesLoading ? (
            <div className="space-y-3">
              {["r1", "r2", "r3", "r4", "r5"].map((k) => (
                <Skeleton key={k} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : !profiles || profiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No students registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Department
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Year
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      CRI
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Career Goal
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                      Skills
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                      Activities
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile, i) => {
                    const goal =
                      goalConfig[profile.careerPathGoal as CareerPathGoal];
                    return (
                      <motion.tr
                        key={`${profile.name}-${String(i)}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-border hover:bg-secondary/30 transition-colors"
                      >
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                              {profile.name.charAt(0).toUpperCase()}
                            </div>
                            {profile.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-32">
                          <span className="truncate block">
                            {profile.department}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          Year {String(profile.year)}
                        </TableCell>
                        <TableCell>
                          <CRIChip cri={Number(profile.cri)} />
                        </TableCell>
                        <TableCell>
                          {goal && (
                            <Badge
                              variant="outline"
                              className={cn("text-xs", goal.color)}
                            >
                              {goal.icon} {goal.label}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {profile.skills.length}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {profile.activities.length}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
