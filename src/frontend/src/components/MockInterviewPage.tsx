import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useMyInterviewAttempts,
  useQuestionsByDomain,
  useSubmitInterviewAttempt,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mic2,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { InterviewDomain } from "../backend";

const domainOptions = [
  {
    value: InterviewDomain.software,
    label: "Software Engineering",
    icon: "💻",
  },
  { value: InterviewDomain.dataScience, label: "Data Science", icon: "📊" },
  { value: InterviewDomain.design, label: "UI/UX Design", icon: "🎨" },
  { value: InterviewDomain.management, label: "Management", icon: "📋" },
];

const domainLabels: Record<InterviewDomain, string> = {
  [InterviewDomain.software]: "Software Engineering",
  [InterviewDomain.dataScience]: "Data Science",
  [InterviewDomain.design]: "UI/UX Design",
  [InterviewDomain.management]: "Management",
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={cn(
              "transition-colors",
              (hovered !== null ? star <= hovered : star <= value)
                ? "fill-chart-4 text-chart-4"
                : "text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function MockInterviewPage() {
  const [selectedDomain, setSelectedDomain] = useState<InterviewDomain | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selfRating, setSelfRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: questions, isLoading: questionsLoading } =
    useQuestionsByDomain(selectedDomain);
  const { data: attempts, isLoading: attemptsLoading } =
    useMyInterviewAttempts();
  const submitMutation = useSubmitInterviewAttempt();

  const currentQuestion = questions?.[currentIndex];

  const handleSubmit = async () => {
    if (!currentQuestion || !selectedDomain) return;
    if (!answer.trim()) {
      toast.error("Please write your answer before submitting");
      return;
    }
    try {
      await submitMutation.mutateAsync({
        questionText: currentQuestion.question,
        domain: selectedDomain,
        answerAttempt: answer,
        selfRating: BigInt(selfRating),
      });
      setSubmitted(true);
      toast.success("Answer submitted! Great practice session.");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  const handleNext = () => {
    if (!questions) return;
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
    setAnswer("");
    setSelfRating(3);
    setSubmitted(false);
    setShowAnswer(false);
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setAnswer("");
    setSelfRating(3);
    setSubmitted(false);
    setShowAnswer(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="practice">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="practice" className="gap-2">
            <Mic2 size={14} />
            Practice
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Brain size={14} />
            My Attempts ({attempts?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Practice Tab */}
        <TabsContent value="practice" className="mt-6">
          {!selectedDomain ? (
            // Domain selection
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold mb-1">
                  Choose a Domain
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select the area you'd like to practice interview questions for
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {domainOptions.map((d) => (
                  <motion.button
                    key={d.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedDomain(d.value);
                      setCurrentIndex(0);
                      setAnswer("");
                      setSelfRating(3);
                      setSubmitted(false);
                      setShowAnswer(false);
                    }}
                    className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                  >
                    <span className="text-3xl">{d.icon}</span>
                    <div>
                      <div className="font-display font-semibold">
                        {d.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Technical & behavioral questions
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="ml-auto text-muted-foreground"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            // Question practice
            <div className="space-y-4">
              {/* Domain header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDomain(null)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft size={12} />
                    Change domain
                  </button>
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary"
                  >
                    {domainLabels[selectedDomain]}
                  </Badge>
                </div>
                {questions && questions.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} / {questions.length}
                  </span>
                )}
              </div>

              {questionsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                </div>
              ) : !questions || questions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Mic2 size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    No questions available for this domain yet.
                  </p>
                  <p className="text-xs mt-1">
                    Check back soon as more questions are added.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSelectedDomain(null)}
                  >
                    Choose another domain
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Question card */}
                    <div className="glass rounded-xl p-6">
                      <div className="text-xs text-muted-foreground mb-3 font-medium">
                        QUESTION {currentIndex + 1}
                      </div>
                      <p className="text-base font-medium leading-relaxed">
                        {currentQuestion?.question}
                      </p>
                    </div>

                    {/* Answer area */}
                    {!submitted ? (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="answer-textarea"
                            className="text-xs text-muted-foreground mb-1.5 block"
                          >
                            Your Answer
                          </label>
                          <Textarea
                            id="answer-textarea"
                            placeholder="Type your answer here. Think out loud, structure your response..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="bg-secondary/50 resize-none min-h-32"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2 font-medium">
                            Self-Rating
                          </p>
                          <StarRating
                            value={selfRating}
                            onChange={setSelfRating}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {
                              [
                                "",
                                "Poor",
                                "Fair",
                                "Good",
                                "Very Good",
                                "Excellent",
                              ][selfRating]
                            }
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => void handleSubmit()}
                            disabled={
                              submitMutation.isPending || !answer.trim()
                            }
                            className="gap-2"
                          >
                            {submitMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                            Submit Answer
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAnswer(!showAnswer)}
                          >
                            {showAnswer ? "Hide" : "See"} Model Answer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="bg-chart-3/10 border border-chart-3/30 rounded-xl p-4 flex items-start gap-3">
                          <Check
                            size={18}
                            className="text-chart-3 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-chart-3">
                              Answer submitted!
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              You rated yourself {selfRating}/5 stars
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowAnswer(!showAnswer)}
                        >
                          {showAnswer ? "Hide" : "See"} Model Answer
                        </Button>
                      </motion.div>
                    )}

                    {/* Model answer reveal */}
                    <AnimatePresence>
                      {showAnswer && currentQuestion && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                            <div className="text-xs font-medium text-primary mb-2">
                              MODEL ANSWER
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90">
                              {currentQuestion.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="gap-2"
                      >
                        <ChevronLeft size={14} />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={currentIndex === (questions?.length ?? 1) - 1}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          {attemptsLoading ? (
            <div className="space-y-3">
              {["h1", "h2", "h3"].map((k) => (
                <Skeleton key={k} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : !attempts || attempts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Brain size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No attempts yet.</p>
              <p className="text-xs mt-1">
                Practice some questions to see your history here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...attempts].reverse().map((attempt, i) => (
                <motion.div
                  key={`${attempt.questionText.slice(0, 20)}-${String(i)}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/30 text-primary"
                        >
                          {domainLabels[attempt.domain]}
                        </Badge>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={cn(
                                star <= Number(attempt.selfRating)
                                  ? "fill-chart-4 text-chart-4"
                                  : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {attempt.questionText}
                      </p>
                      {attempt.answerAttempt && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                          {attempt.answerAttempt}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
