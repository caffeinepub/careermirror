import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Activity,
  AggregateStats,
  CareerPathGoal,
  Interest,
  InterviewAttempt,
  InterviewDomain,
  InterviewQuestion,
  Skill,
  StudentProfile,
} from "../backend.d.ts";
import { useActor } from "./useActor";

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile[]>({
    queryKey: ["allProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAggregateStats() {
  const { actor, isFetching } = useActor();
  return useQuery<AggregateStats | null>({
    queryKey: ["aggregateStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAggregateStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQuestionsByDomain(domain: InterviewDomain | null) {
  const { actor, isFetching } = useActor();
  return useQuery<InterviewQuestion[]>({
    queryKey: ["questions", domain],
    queryFn: async () => {
      if (!actor || !domain) return [];
      return actor.getQuestionsByDomain(domain);
    },
    enabled: !!actor && !isFetching && !!domain,
  });
}

export function useMyInterviewAttempts() {
  const { actor, isFetching } = useActor();
  return useQuery<InterviewAttempt[]>({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyInterviewAttempts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      department: string;
      year: bigint;
      careerPathGoal: CareerPathGoal;
      bio: string;
      interests: Interest[];
      skills: Skill[];
      activities: Activity[];
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createOrUpdateProfile(
        params.name,
        params.department,
        params.year,
        params.careerPathGoal,
        params.bio,
        params.interests,
        params.skills,
        params.activities,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useSubmitInterviewAttempt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      questionText: string;
      domain: InterviewDomain;
      answerAttempt: string;
      selfRating: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitInterviewAttempt(
        params.questionText,
        params.domain,
        params.answerAttempt,
        params.selfRating,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
