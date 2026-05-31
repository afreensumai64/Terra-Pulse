import { useCallback, useEffect, useState } from "react";

const DEFAULT_GOAL = 300; // kg CO2 per month

function key(userId: string) {
  return `terrapulse:goal:${userId}`;
}

export function useGoal(userId: string | undefined) {
  const [goal, setGoalState] = useState<number>(DEFAULT_GOAL);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    const raw = window.localStorage.getItem(key(userId));
    if (raw) {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) setGoalState(n);
    } else {
      setGoalState(DEFAULT_GOAL);
    }
  }, [userId]);

  const setGoal = useCallback((n: number) => {
    if (!userId) return;
    const v = Math.max(1, Math.round(n));
    setGoalState(v);
    try { window.localStorage.setItem(key(userId), String(v)); } catch {}
  }, [userId]);

  return { goal, setGoal };
}
