import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Clock, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface Course {
  name: string;
  platform: string;
  duration: string;
  level: string;
  semester: number;
  tag: string;
}

interface DomainRoadmap {
  icon: string;
  title: string;
  courses: Course[];
}

const roadmaps: Record<string, DomainRoadmap> = {
  software: {
    icon: "💻",
    title: "Software Engineering",
    courses: [
      {
        name: "CS50: Introduction to Computer Science",
        platform: "edX / Harvard",
        duration: "12 weeks",
        level: "Beginner",
        semester: 1,
        tag: "Foundation",
      },
      {
        name: "Data Structures & Algorithms in Python",
        platform: "Coursera / UCSD",
        duration: "8 weeks",
        level: "Intermediate",
        semester: 2,
        tag: "Core",
      },
      {
        name: "Full-Stack Web Development with React",
        platform: "Udemy / Meta",
        duration: "10 weeks",
        level: "Intermediate",
        semester: 3,
        tag: "Specialization",
      },
      {
        name: "System Design: The Big Picture",
        platform: "Pluralsight",
        duration: "6 weeks",
        level: "Advanced",
        semester: 4,
        tag: "Advanced",
      },
      {
        name: "Microservices with Node.js and Docker",
        platform: "Udemy",
        duration: "8 weeks",
        level: "Advanced",
        semester: 5,
        tag: "Advanced",
      },
      {
        name: "LeetCode — Top 150 Interview Problems",
        platform: "LeetCode",
        duration: "Ongoing",
        level: "Advanced",
        semester: 6,
        tag: "Interview Prep",
      },
      {
        name: "Cloud Computing with AWS/GCP",
        platform: "Coursera / Google",
        duration: "12 weeks",
        level: "Expert",
        semester: 7,
        tag: "Placement",
      },
      {
        name: "Open Source Contribution Guide",
        platform: "GitHub / FOSS",
        duration: "Ongoing",
        level: "Expert",
        semester: 8,
        tag: "Portfolio",
      },
    ],
  },
  dataScience: {
    icon: "📊",
    title: "Data Science & ML",
    courses: [
      {
        name: "Python for Data Analysis",
        platform: "DataCamp",
        duration: "6 weeks",
        level: "Beginner",
        semester: 1,
        tag: "Foundation",
      },
      {
        name: "Statistics for Machine Learning",
        platform: "Khan Academy",
        duration: "8 weeks",
        level: "Beginner",
        semester: 2,
        tag: "Core Math",
      },
      {
        name: "Machine Learning Specialization",
        platform: "Coursera / Stanford",
        duration: "16 weeks",
        level: "Intermediate",
        semester: 3,
        tag: "Core ML",
      },
      {
        name: "Deep Learning Specialization",
        platform: "Coursera / deeplearning.ai",
        duration: "16 weeks",
        level: "Advanced",
        semester: 4,
        tag: "Deep Learning",
      },
      {
        name: "Applied Data Science with Pandas & Sklearn",
        platform: "Kaggle",
        duration: "4 weeks",
        level: "Intermediate",
        semester: 5,
        tag: "Applied",
      },
      {
        name: "NLP with Transformers (Hugging Face)",
        platform: "Hugging Face",
        duration: "6 weeks",
        level: "Advanced",
        semester: 6,
        tag: "NLP",
      },
      {
        name: "MLOps: Machine Learning in Production",
        platform: "Coursera / DeepLearning.AI",
        duration: "8 weeks",
        level: "Expert",
        semester: 7,
        tag: "Deployment",
      },
      {
        name: "Kaggle Competition Mastery",
        platform: "Kaggle",
        duration: "Ongoing",
        level: "Expert",
        semester: 8,
        tag: "Portfolio",
      },
    ],
  },
  design: {
    icon: "🎨",
    title: "UI/UX Design",
    courses: [
      {
        name: "Design Principles for Non-Designers",
        platform: "Skillshare",
        duration: "4 weeks",
        level: "Beginner",
        semester: 1,
        tag: "Foundation",
      },
      {
        name: "Figma UI Design — Zero to Hero",
        platform: "YouTube / DesignCourse",
        duration: "6 weeks",
        level: "Beginner",
        semester: 2,
        tag: "Tool Mastery",
      },
      {
        name: "User Experience Research & Design",
        platform: "Coursera / Michigan",
        duration: "8 weeks",
        level: "Intermediate",
        semester: 3,
        tag: "UX Process",
      },
      {
        name: "Interaction Design Foundation Certificate",
        platform: "IxDF",
        duration: "12 weeks",
        level: "Intermediate",
        semester: 4,
        tag: "Certification",
      },
      {
        name: "Design Systems with Figma & Tokens",
        platform: "Figma Community",
        duration: "4 weeks",
        level: "Advanced",
        semester: 5,
        tag: "Systems",
      },
      {
        name: "Motion Design with After Effects",
        platform: "Adobe",
        duration: "6 weeks",
        level: "Advanced",
        semester: 6,
        tag: "Motion",
      },
      {
        name: "Portfolio Design & Case Studies",
        platform: "Self-directed",
        duration: "Ongoing",
        level: "Expert",
        semester: 7,
        tag: "Portfolio",
      },
      {
        name: "Product Design Interviews",
        platform: "Exponent",
        duration: "4 weeks",
        level: "Expert",
        semester: 8,
        tag: "Interview",
      },
    ],
  },
  management: {
    icon: "📋",
    title: "Management & Product",
    courses: [
      {
        name: "Introduction to Business Strategy",
        platform: "Coursera / Yale",
        duration: "6 weeks",
        level: "Beginner",
        semester: 1,
        tag: "Foundation",
      },
      {
        name: "Product Management Fundamentals",
        platform: "Udemy / LinkedIn",
        duration: "8 weeks",
        level: "Beginner",
        semester: 2,
        tag: "PM Basics",
      },
      {
        name: "Agile Project Management Professional",
        platform: "Coursera / Google",
        duration: "6 weeks",
        level: "Intermediate",
        semester: 3,
        tag: "Methodology",
      },
      {
        name: "Business Analytics with Excel & Tableau",
        platform: "Coursera / PwC",
        duration: "8 weeks",
        level: "Intermediate",
        semester: 4,
        tag: "Analytics",
      },
      {
        name: "Growth Hacking & Digital Marketing",
        platform: "HubSpot Academy",
        duration: "4 weeks",
        level: "Advanced",
        semester: 5,
        tag: "Growth",
      },
      {
        name: "Financial Modeling for Product Managers",
        platform: "Wall Street Prep",
        duration: "6 weeks",
        level: "Advanced",
        semester: 6,
        tag: "Finance",
      },
      {
        name: "Case Interview Mastery (McKinsey/BCG)",
        platform: "CaseCoach",
        duration: "8 weeks",
        level: "Expert",
        semester: 7,
        tag: "Consulting",
      },
      {
        name: "MBA Prep: GMAT 700+ Strategy",
        platform: "GMAT Club",
        duration: "12 weeks",
        level: "Expert",
        semester: 8,
        tag: "Higher Studies",
      },
    ],
  },
};

const levelColors: Record<string, string> = {
  Beginner: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Intermediate: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Advanced: "bg-primary/15 text-primary border-primary/30",
  Expert: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

const semesterGroups = [
  { label: "Year 1", semesters: [1, 2] },
  { label: "Year 2", semesters: [3, 4] },
  { label: "Year 3", semesters: [5, 6] },
  { label: "Year 4", semesters: [7, 8] },
];

function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="text-xs border-border bg-secondary/50 flex-shrink-0"
            >
              {course.tag}
            </Badge>
          </div>
          <h4 className="font-display font-semibold text-sm leading-snug">
            {course.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {course.platform}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={10} />
              {course.duration}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${levelColors[course.level] ?? ""}`}
            >
              {course.level}
            </span>
          </div>
        </div>
        <ExternalLink
          size={14}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
        />
      </div>
    </motion.div>
  );
}

export function RoadmapPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart2 size={14} />
        Curated semester-wise learning paths for each career domain
      </div>

      <Tabs defaultValue="software">
        <TabsList className="bg-secondary/50 flex-wrap h-auto gap-1 p-1">
          {Object.entries(roadmaps).map(([key, roadmap]) => (
            <TabsTrigger key={key} value={key} className="text-xs gap-1.5">
              <span>{roadmap.icon}</span>
              <span className="hidden sm:inline">{roadmap.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(roadmaps).map(([key, roadmap]) => (
          <TabsContent key={key} value={key} className="mt-6 space-y-8">
            <div>
              <h2 className="font-display font-bold text-xl mb-1">
                {roadmap.icon} {roadmap.title} Roadmap
              </h2>
              <p className="text-sm text-muted-foreground">
                Semester-progressive curriculum designed for 4-year
                undergraduate engineering programs
              </p>
            </div>

            {semesterGroups.map((group) => {
              const groupCourses = roadmap.courses.filter((c) =>
                group.semesters.includes(c.semester),
              );
              if (groupCourses.length === 0) return null;

              return (
                <div key={group.label}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-display">
                      {group.label}
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {groupCourses.length} courses
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {groupCourses.map((course, i) => (
                      <CourseCard key={course.name} course={course} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
