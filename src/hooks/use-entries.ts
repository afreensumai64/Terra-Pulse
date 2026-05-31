import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type CarbonEntry = Tables<"carbon_entries">;

export function useEntries(userId: string | undefined) {
  return useQuery({
    queryKey: ["entries", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [] as CarbonEntry[];
      const { data, error } = await supabase
        .from("carbon_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CarbonEntry[];
    },
    staleTime: 30_000,
  });
}
