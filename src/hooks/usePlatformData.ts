import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import {
  getUserPlatformProfiles,
  linkPlatform,
  unlinkPlatform,
  triggerSync,
  getLeaderboard,
  getUserScore,
  getUserSnapshots,
} from "@/lib/api";
import { toast } from "sonner";

export function usePlatformProfiles() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["platform-profiles", user?.id],
    queryFn: () => getUserPlatformProfiles(user!.id),
    enabled: !!user,
  });
}

export function useLinkPlatform() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ platform, handle }: { platform: string; handle: string }) =>
      linkPlatform(user!.id, platform, handle),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-profiles"] });
      toast.success("Platform linked successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUnlinkPlatform() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (platform: string) => unlinkPlatform(user!.id, platform),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-profiles"] });
      toast.success("Platform unlinked");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSync() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (platform?: string) => triggerSync(platform),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-profiles"] });
      qc.invalidateQueries({ queryKey: ["user-score"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
      qc.invalidateQueries({ queryKey: ["snapshots"] });
      toast.success("Data synced successfully");
    },
    onError: (err: Error) => {
      if (err.message.includes("Cooldown")) {
        toast.error("Please wait a few minutes before syncing again");
      } else {
        toast.error(err.message);
      }
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    refetchInterval: 60000,
  });
}

export function useUserScore() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["user-score", user?.id],
    queryFn: () => getUserScore(user!.id),
    enabled: !!user,
  });
}

export function useSnapshots() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["snapshots", user?.id],
    queryFn: () => getUserSnapshots(user!.id),
    enabled: !!user,
  });
}
