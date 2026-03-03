import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InterviewQuestion {
    question: string;
    domain: InterviewDomain;
    answer: string;
}
export type AttemptSelfRating = bigint;
export interface InterviewAttempt {
    domain: InterviewDomain;
    selfRating: AttemptSelfRating;
    questionText: string;
    answerAttempt: string;
}
export interface StudentProfile {
    bio: string;
    cri: bigint;
    interests: Array<Interest>;
    name: string;
    year: bigint;
    activities: Array<Activity>;
    careerPathGoal: CareerPathGoal;
    department: string;
    skills: Array<Skill>;
}
export interface Activity {
    activityType: ActivityType;
    date: string;
    name: string;
    description: string;
}
export interface Skill {
    name: string;
    proficiency: ProficiencyLevel;
}
export interface AggregateStats {
    entrepreneurshipCount: bigint;
    totalStudents: bigint;
    higherStudiesCount: bigint;
    averageCRI: bigint;
    placementCount: bigint;
}
export interface Interest {
    domain: Domain;
    level: bigint;
}
export enum ActivityType {
    workshop = "workshop",
    hackathon = "hackathon",
    certification = "certification",
    competition = "competition",
    project = "project"
}
export enum CareerPathGoal {
    placement = "placement",
    higherStudies = "higherStudies",
    entrepreneurship = "entrepreneurship"
}
export enum Domain {
    other = "other",
    dataScience = "dataScience",
    research = "research",
    design = "design",
    hardware = "hardware",
    software = "software",
    management = "management"
}
export enum InterviewDomain {
    dataScience = "dataScience",
    design = "design",
    software = "software",
    management = "management"
}
export enum ProficiencyLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced",
    expert = "expert"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addInterviewQuestion(questionText: string, domain: InterviewDomain, answer: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(name: string, department: string, year: bigint, careerPathGoal: CareerPathGoal, bio: string, interests: Array<Interest>, skills: Array<Skill>, activities: Array<Activity>): Promise<void>;
    getAggregateStats(): Promise<AggregateStats>;
    getAllProfiles(): Promise<Array<StudentProfile>>;
    getCallerUserProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyInterviewAttempts(): Promise<Array<InterviewAttempt>>;
    getMyProfile(): Promise<StudentProfile>;
    getProfileByPrincipal(p: Principal): Promise<StudentProfile>;
    getQuestionsByDomain(domain: InterviewDomain): Promise<Array<InterviewQuestion>>;
    getUserProfile(user: Principal): Promise<StudentProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: StudentProfile): Promise<void>;
    submitInterviewAttempt(questionText: string, domain: InterviewDomain, answerAttempt: string, selfRating: AttemptSelfRating): Promise<void>;
}
