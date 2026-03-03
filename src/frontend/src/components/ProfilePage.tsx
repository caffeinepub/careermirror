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
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrUpdateProfile } from "@/hooks/useBackend";
import { Loader2, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CareerPathGoal } from "../backend";
import type { StudentProfile } from "../backend.d.ts";
import { CRIGauge } from "./CRIGauge";

interface ProfilePageProps {
  profile: StudentProfile;
}

const goalLabels: Record<CareerPathGoal, string> = {
  [CareerPathGoal.placement]: "Placement",
  [CareerPathGoal.higherStudies]: "Higher Studies",
  [CareerPathGoal.entrepreneurship]: "Entrepreneurship",
};

export function ProfilePage({ profile }: ProfilePageProps) {
  const [name, setName] = useState(profile.name);
  const [department, setDepartment] = useState(profile.department);
  const [year, setYear] = useState(String(profile.year));
  const [goal, setGoal] = useState<CareerPathGoal>(profile.careerPathGoal);
  const [bio, setBio] = useState(profile.bio);
  const mutation = useCreateOrUpdateProfile();

  useEffect(() => {
    setName(profile.name);
    setDepartment(profile.department);
    setYear(String(profile.year));
    setGoal(profile.careerPathGoal);
    setBio(profile.bio);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department || !year || !goal) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await mutation.mutateAsync({
        name,
        department,
        year: BigInt(year),
        careerPathGoal: goal,
        bio,
        interests: profile.interests,
        skills: profile.skills,
        activities: profile.activities,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-3xl flex-shrink-0">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display font-bold text-xl">{profile.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile.department}
          </p>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start flex-wrap">
            <Badge variant="secondary" className="text-xs">
              Year {String(profile.year)}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary"
            >
              {goalLabels[profile.careerPathGoal]}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs border-border bg-secondary/50"
            >
              {profile.skills.length} Skills
            </Badge>
          </div>
        </div>
        <CRIGauge value={Number(profile.cri)} size={120} />
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-display font-semibold mb-5 flex items-center gap-2">
          <User size={16} className="text-primary" />
          Edit Profile
        </h3>
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Full Name *
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Department *
              </Label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-secondary/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Year *</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Career Goal *
              </Label>
              <Select
                value={goal}
                onValueChange={(v) => setGoal(v as CareerPathGoal)}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CareerPathGoal.placement}>
                    Placement
                  </SelectItem>
                  <SelectItem value={CareerPathGoal.higherStudies}>
                    Higher Studies
                  </SelectItem>
                  <SelectItem value={CareerPathGoal.entrepreneurship}>
                    Entrepreneurship
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-secondary/50 resize-none h-24"
              placeholder="Tell us about yourself and your aspirations..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="gap-2"
            >
              {mutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
