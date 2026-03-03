import { Badge } from "@/components/ui/badge";
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
import { useCreateOrUpdateProfile } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Save, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProficiencyLevel } from "../backend";
import type { Skill, StudentProfile } from "../backend.d.ts";

interface SkillsPageProps {
  profile: StudentProfile;
}

const proficiencyConfig: Record<
  ProficiencyLevel,
  { label: string; color: string }
> = {
  [ProficiencyLevel.beginner]: {
    label: "Beginner",
    color: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  },
  [ProficiencyLevel.intermediate]: {
    label: "Intermediate",
    color: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  },
  [ProficiencyLevel.advanced]: {
    label: "Advanced",
    color: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  },
  [ProficiencyLevel.expert]: {
    label: "Expert",
    color: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  },
};

const proficiencyOrder = [
  ProficiencyLevel.beginner,
  ProficiencyLevel.intermediate,
  ProficiencyLevel.advanced,
  ProficiencyLevel.expert,
];

export function SkillsPage({ profile }: SkillsPageProps) {
  const [skills, setSkills] = useState<Skill[]>(profile.skills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>(
    ProficiencyLevel.intermediate,
  );
  const mutation = useCreateOrUpdateProfile();

  useEffect(() => {
    setSkills(profile.skills);
  }, [profile]);

  const addSkill = () => {
    if (!newSkillName.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    if (
      skills.some((s) => s.name.toLowerCase() === newSkillName.toLowerCase())
    ) {
      toast.error("This skill already exists");
      return;
    }
    setSkills((prev) => [
      ...prev,
      { name: newSkillName.trim(), proficiency: newSkillLevel },
    ]);
    setNewSkillName("");
  };

  const removeSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
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
        skills,
        activities: profile.activities,
      });
      toast.success("Skills saved successfully!");
    } catch {
      toast.error("Failed to save skills.");
    }
  };

  // Group by proficiency
  const grouped = proficiencyOrder.reduce(
    (acc, level) => {
      acc[level] = skills.filter((s) => s.proficiency === level);
      return acc;
    },
    {} as Record<ProficiencyLevel, Skill[]>,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Add skill form */}
      <div className="glass rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-primary" />
          Add New Skill
        </h3>
        <div className="flex gap-3 flex-wrap md:flex-nowrap">
          <div className="flex-1 min-w-48">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Skill Name
            </Label>
            <Input
              placeholder="e.g. React, Python, Figma..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSkill();
              }}
              className="bg-secondary/50"
            />
          </div>
          <div className="w-48">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Proficiency
            </Label>
            <Select
              value={newSkillLevel}
              onValueChange={(v) => setNewSkillLevel(v as ProficiencyLevel)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proficiencyOrder.map((level) => (
                  <SelectItem key={level} value={level}>
                    {proficiencyConfig[level].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={addSkill} className="gap-2">
              <Plus size={16} />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Skills grid by proficiency */}
      {skills.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Wrench size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No skills added yet.</p>
          <p className="text-xs mt-1">Add your first skill above.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {proficiencyOrder
            .filter((level) => grouped[level].length > 0)
            .map((level) => (
              <div key={level}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", proficiencyConfig[level].color)}
                  >
                    {proficiencyConfig[level].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {grouped[level].length} skill
                    {grouped[level].length !== 1 ? "s" : ""}
                  </span>
                </div>
                <AnimatePresence mode="popLayout">
                  <div className="flex flex-wrap gap-2">
                    {grouped[level].map((skill) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border font-medium",
                          proficiencyConfig[skill.proficiency].color,
                        )}
                      >
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.name)}
                          className="hover:opacity-60 transition-opacity"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ))}
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => void handleSave()}
          disabled={mutation.isPending}
          className="gap-2"
        >
          {mutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Skills
        </Button>
      </div>
    </div>
  );
}
