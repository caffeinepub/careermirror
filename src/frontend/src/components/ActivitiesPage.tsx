import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrUpdateProfile } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  Activity as ActivityIcon,
  Calendar,
  Loader2,
  Plus,
  Save,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ActivityType } from "../backend";
import type { Activity, StudentProfile } from "../backend.d.ts";

interface ActivitiesPageProps {
  profile: StudentProfile;
}

const activityConfig: Record<
  ActivityType,
  { label: string; icon: string; color: string }
> = {
  [ActivityType.hackathon]: {
    label: "Hackathon",
    icon: "⚡",
    color: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  },
  [ActivityType.workshop]: {
    label: "Workshop",
    icon: "📚",
    color: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  },
  [ActivityType.certification]: {
    label: "Certification",
    icon: "🏆",
    color: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  },
  [ActivityType.competition]: {
    label: "Competition",
    icon: "🥇",
    color: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  },
  [ActivityType.project]: {
    label: "Project",
    icon: "🛠️",
    color: "bg-primary/15 text-primary border-primary/30",
  },
};

export function ActivitiesPage({ profile }: ActivitiesPageProps) {
  const [activities, setActivities] = useState<Activity[]>(profile.activities);
  const [name, setName] = useState("");
  const [type, setType] = useState<ActivityType>(ActivityType.project);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const mutation = useCreateOrUpdateProfile();

  useEffect(() => {
    setActivities(profile.activities);
  }, [profile]);

  const addActivity = () => {
    if (!name.trim() || !date.trim()) {
      toast.error("Name and date are required");
      return;
    }
    const newActivity: Activity = {
      name: name.trim(),
      activityType: type,
      date: date.trim(),
      description: description.trim(),
    };
    setActivities((prev) => [newActivity, ...prev]);
    setName("");
    setDate("");
    setDescription("");
    setShowForm(false);
    toast.success("Activity added! Remember to save.");
  };

  const handleSave = async () => {
    try {
      await mutation.mutateAsync({
        name: profile.name,
        department: profile.department,
        year: profile.year,
        careerPathGoal: profile.careerPathGoal,
        bio: profile.bio,
        interests: profile.interests,
        skills: profile.skills,
        activities,
      });
      toast.success("Activities saved!");
    } catch {
      toast.error("Failed to save activities.");
    }
  };

  const sortedActivities = [...activities].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {activities.length} activit{activities.length !== 1 ? "ies" : "y"}{" "}
          logged
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus size={14} />
            Add Activity
          </Button>
          <Button
            size="sm"
            onClick={() => void handleSave()}
            disabled={mutation.isPending}
            className="gap-2"
          >
            {mutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-sm">
                New Activity
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Activity Name *
                  </Label>
                  <Input
                    placeholder="e.g. Smart India Hackathon 2024"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as ActivityType)}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(activityConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>
                          {cfg.icon} {cfg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Date *
                  </Label>
                  <Input
                    placeholder="e.g. Mar 2024 or 2024-03-15"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Brief description of what you did..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary/50 resize-none h-20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addActivity} size="sm" className="gap-2">
                  <Plus size={14} />
                  Add to list
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      {sortedActivities.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ActivityIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No activities logged yet.</p>
          <p className="text-xs mt-1">
            Click "Add Activity" to start tracking your journey.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4 pl-10">
            <AnimatePresence>
              {sortedActivities.map((activity, i) => {
                const cfg =
                  activityConfig[activity.activityType as ActivityType];
                return (
                  <motion.div
                    key={`${activity.name}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute -left-10 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center text-xs",
                        "top-1/2 -translate-y-1/2",
                      )}
                      style={{ background: "oklch(0.62 0.21 260)" }}
                    />

                    <div className="bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{cfg?.icon ?? "📌"}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">
                              {activity.name}
                            </span>
                            <span
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full border",
                                cfg?.color ??
                                  "bg-secondary border-border text-foreground",
                              )}
                            >
                              {cfg?.label ?? activity.activityType}
                            </span>
                          </div>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {activity.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                            <Calendar size={10} />
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
