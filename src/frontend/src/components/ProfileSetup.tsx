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
import { ArrowRight, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CareerPathGoal } from "../backend";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState<string>("");
  const [goal, setGoal] = useState<CareerPathGoal | "">("");
  const [bio, setBio] = useState("");

  const mutation = useCreateOrUpdateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
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
        careerPathGoal: goal as CareerPathGoal,
        bio,
        interests: [],
        skills: [],
        activities: [],
      });
      toast.success("Profile created! Welcome to CareerMirror 🎓");
      onComplete();
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            Set up your profile
          </h1>
          <p className="text-muted-foreground text-sm">
            This is your career mirror. Let's make it accurate.
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Arjun Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-sm font-medium">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                placeholder="e.g. Computer Science & Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-secondary/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Current Year <span className="text-destructive">*</span>
                </Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select year" />
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
                <Label className="text-sm font-medium">
                  Career Goal <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={goal}
                  onValueChange={(v) => setGoal(v as CareerPathGoal)}
                >
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select goal" />
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
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your interests, and your aspirations..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-secondary/50 resize-none h-24"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating your profile...
                </>
              ) : (
                <>
                  Launch My Career Journey
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
