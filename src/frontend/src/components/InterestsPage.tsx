import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCreateOrUpdateProfile } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Check, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Domain } from "../backend";
import type { Interest, StudentProfile } from "../backend.d.ts";

interface InterestsPageProps {
  profile: StudentProfile;
}

const domainConfig: Record<
  Domain,
  { label: string; icon: string; desc: string; color: string }
> = {
  [Domain.software]: {
    label: "Software Engineering",
    icon: "💻",
    desc: "Full-stack development, system design, cloud & DevOps",
    color: "from-blue-600/20 to-indigo-600/20",
  },
  [Domain.dataScience]: {
    label: "Data Science",
    icon: "📊",
    desc: "ML, AI, data analytics, and statistical modeling",
    color: "from-purple-600/20 to-violet-600/20",
  },
  [Domain.design]: {
    label: "UI/UX Design",
    icon: "🎨",
    desc: "User experience, interface design, and visual systems",
    color: "from-pink-600/20 to-rose-600/20",
  },
  [Domain.research]: {
    label: "Research",
    icon: "🔬",
    desc: "Academic research, publications, and higher studies",
    color: "from-green-600/20 to-emerald-600/20",
  },
  [Domain.management]: {
    label: "Management",
    icon: "📋",
    desc: "Product management, consulting, and leadership",
    color: "from-orange-600/20 to-amber-600/20",
  },
  [Domain.hardware]: {
    label: "Hardware & IoT",
    icon: "⚙️",
    desc: "Embedded systems, VLSI, robotics, and IoT devices",
    color: "from-cyan-600/20 to-teal-600/20",
  },
  [Domain.other]: {
    label: "Other",
    icon: "🌐",
    desc: "Cybersecurity, blockchain, and emerging technologies",
    color: "from-slate-600/20 to-gray-600/20",
  },
};

const levelLabels = [
  "None",
  "Curious",
  "Interested",
  "Passionate",
  "Expert",
  "Devoted",
];

export function InterestsPage({ profile }: InterestsPageProps) {
  const [interests, setInterests] = useState<Map<Domain, number>>(
    new Map(profile.interests.map((i) => [i.domain, Number(i.level)])),
  );
  const mutation = useCreateOrUpdateProfile();

  useEffect(() => {
    setInterests(
      new Map(profile.interests.map((i) => [i.domain, Number(i.level)])),
    );
  }, [profile]);

  const toggleDomain = (domain: Domain) => {
    setInterests((prev) => {
      const next = new Map(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.set(domain, 3);
      }
      return next;
    });
  };

  const setLevel = (domain: Domain, level: number) => {
    setInterests((prev) => {
      const next = new Map(prev);
      next.set(domain, level);
      return next;
    });
  };

  const handleSave = async () => {
    const interestsArray: Interest[] = Array.from(interests.entries()).map(
      ([domain, level]) => ({ domain, level: BigInt(level) }),
    );
    try {
      await mutation.mutateAsync({
        name: profile.name,
        department: profile.department,
        year: profile.year,
        careerPathGoal: profile.careerPathGoal,
        bio: profile.bio,
        interests: interestsArray,
        skills: profile.skills,
        activities: profile.activities,
      });
      toast.success("Interests saved successfully!");
    } catch {
      toast.error("Failed to save interests.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            Select domains that interest you and rate your passion level. This
            shapes your Career Readiness Index.
          </p>
        </div>
        <Button
          onClick={() => void handleSave()}
          disabled={mutation.isPending}
          className="gap-2 flex-shrink-0"
        >
          {mutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(domainConfig).map(([domainKey, config], i) => {
          const domain = domainKey as Domain;
          const isSelected = interests.has(domain);
          const level = interests.get(domain) ?? 0;

          return (
            <motion.div
              key={domain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={cn(
                "rounded-xl border p-5 transition-all duration-200 cursor-pointer",
                isSelected
                  ? `border-primary/40 bg-gradient-to-br ${config.color}`
                  : "border-border bg-card hover:border-border/80",
              )}
              onClick={() => toggleDomain(domain)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-semibold text-sm">
                      {config.label}
                    </h3>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.desc}
                  </p>

                  {isSelected && (
                    <div
                      className="mt-4"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      role="presentation"
                    >
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted-foreground">
                          Interest Level
                        </span>
                        <span className="font-medium text-primary">
                          {levelLabels[level] ?? "Unknown"}
                        </span>
                      </div>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[level]}
                        onValueChange={([v]) => setLevel(domain, v)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Curious</span>
                        <span>Devoted</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        {interests.size} domain{interests.size !== 1 ? "s" : ""} selected •
        Click a card to toggle selection
      </div>
    </div>
  );
}
