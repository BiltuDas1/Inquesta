import type { Level } from "../types/courses";

export const PER_PAGE = 10;
export const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

export const formatLevel = (l: string): Level => {
  const normalized = l.toLowerCase();
  return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
};
