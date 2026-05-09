import type { Level } from "../types/courses";
import { formatLevel } from "../utils/courseutils";


export default function LevelBadge({ level }: { level: Level }) {
  const displayLevel = formatLevel(level);
  const styles: Record<Level, string> = {
    Beginner: "bg-[#0d2a20] text-[#6fffd9]",
    Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
    Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
  };
  return (
    <span
      className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
    >
      {displayLevel}
    </span>
  );
}
