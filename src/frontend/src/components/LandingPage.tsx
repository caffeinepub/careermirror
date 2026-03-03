import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

const features = [
  {
    icon: Target,
    title: "Interest Tracking",
    desc: "Monitor how your career interests evolve across every semester",
  },
  {
    icon: TrendingUp,
    title: "Career Readiness Index",
    desc: "Your real-time CRI score reflects practical skill growth",
  },
  {
    icon: BrainCircuit,
    title: "AI Mock Interviews",
    desc: "Practice domain-specific interviews with instant feedback",
  },
  {
    icon: Zap,
    title: "Smart Roadmaps",
    desc: "Curated learning paths aligned with your career goals",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    dept: "CSE, 3rd Year",
    text: "CareerMirror helped me realize I was more passionate about Data Science than core development. My CRI went from 42 to 78 in two semesters!",
  },
  {
    name: "Rahul Mehta",
    dept: "ECE, 4th Year",
    text: "The mock interview system completely transformed my confidence. I cleared my Google interview after 3 weeks of practice.",
  },
  {
    name: "Ananya Patel",
    dept: "IT, 2nd Year",
    text: "Starting career tracking from first year was the best decision. I have a clear roadmap to get into IISc for my Masters.",
  },
];

export function LandingPage({ onLogin, isLoggingIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 animate-spin-slow"
          style={{
            background:
              "conic-gradient(from 0deg, oklch(0.62 0.21 260), oklch(0.7 0.18 200), oklch(0.62 0.21 260))",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-primary" size={18} />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              CareerMirror
            </span>
          </div>
          <Button
            onClick={onLogin}
            disabled={isLoggingIn}
            size="sm"
            className="gap-2"
          >
            {isLoggingIn ? (
              "Connecting..."
            ) : (
              <>
                Sign In <ArrowRight size={14} />
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Star size={12} fill="currentColor" />
            Career-first development from Day 1
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            <span className="text-foreground">Your career, </span>
            <span className="text-gradient">reflected clearly</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
            CareerMirror is an intelligent, longitudinal career guidance
            platform that accompanies you from semester one through placement —
            turning academic effort into measurable industry readiness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="gap-2 text-base px-8"
            >
              {isLoggingIn ? "Connecting..." : "Begin Your Journey"}
              <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Students Tracked", value: "12,400+" },
            { label: "Avg CRI Improvement", value: "+34 pts" },
            { label: "Interview Sessions", value: "48,000+" },
            { label: "Placement Rate", value: "87%" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Everything you need to stay ahead
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Built specifically for undergraduate engineering students navigating
            their path to industry or higher education.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-hover rounded-xl bg-card border border-border p-6 flex gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl font-bold mb-12">
            Students who reflected, and grew
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {["st1", "st2", "st3", "st4", "st5"].map((k) => (
                  <Star
                    key={k}
                    size={12}
                    className="text-accent"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                "{t.text}"
              </p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.dept}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <h2 className="font-display text-4xl font-bold mb-4">
            Start tracking on Day 1
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Don't wait until final year. Build your Career Readiness Index from
            your first semester and graduate job-ready.
          </p>
          <Button
            size="lg"
            onClick={onLogin}
            disabled={isLoggingIn}
            className="gap-2 text-base"
          >
            {isLoggingIn ? "Connecting..." : "Get Started Free"}
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-primary" />
            <span>CareerMirror</span>
          </div>
          <span>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
