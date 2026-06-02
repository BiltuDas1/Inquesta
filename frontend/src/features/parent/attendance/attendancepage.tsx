import React from "react";

// --- Types ---
type AttendanceStatus = "Present" | "Absent" | "Late" | "Holiday" | "Empty";

interface CalendarDay {
  date: number | null;
  status: AttendanceStatus;
}

export default function AttendancePage() {
  // --- Calendar Data (Mapped from May 2026 image) ---
  // May 2026 starts on a Friday (Index 4, where Mon is 0)
  const days: CalendarDay[] = [
    { date: null, status: "Empty" },
    { date: null, status: "Empty" },
    { date: null, status: "Empty" },
    { date: null, status: "Empty" },
    { date: 1, status: "Present" },
    { date: 2, status: "Present" },
    { date: 3, status: "Present" },
    { date: 4, status: "Holiday" },
    { date: 5, status: "Present" },
    { date: 6, status: "Present" },
    { date: 7, status: "Present" },
    { date: 8, status: "Present" },
    { date: 9, status: "Present" },
    { date: 10, status: "Holiday" },
    { date: 11, status: "Holiday" },
    { date: 12, status: "Present" },
    { date: 13, status: "Present" },
    { date: 14, status: "Late" },
    { date: 15, status: "Present" },
    { date: 16, status: "Present" },
    { date: 17, status: "Holiday" },
    { date: 18, status: "Holiday" },
    { date: 19, status: "Absent" },
    { date: 20, status: "Present" },
    { date: 21, status: "Present" },
    { date: 22, status: "Present" },
    { date: 23, status: "Present" },
    { date: 24, status: "Holiday" },
    { date: 25, status: "Holiday" },
    { date: 26, status: "Present" },
    { date: 27, status: "Present" },
    { date: 28, status: "Present" },
    { date: 29, status: "Present" },
    { date: 30, status: "Present" },
    { date: 31, status: "Present" },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper function to style cells based on attendance status
  const getCellStyles = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-[#00e5bc]/5 text-[#6fffd9]"; // Subtle tint, primary text
      case "Absent":
        return "bg-[#ffb4ab]/10 text-[#ffb4ab]"; // Error brand colors
      case "Late":
        return "bg-[#f59e0b]/10 text-[#f59e0b]"; // Amber/Yellow
      case "Holiday":
        return "bg-[#262a31] text-[#84948e]"; // Surface container high, muted text
      case "Empty":
      default:
        return "bg-[#1c2026] text-transparent"; // Standard surface, invisible text
    }
  };

  return (
    <div className="min-h-screen bg-[#10141a] p-4 md:p-6 lg:p-8 font-body text-[#dfe2eb]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
            Attendance
          </h1>
          <p className="text-sm text-[#b9cac3] mt-1">
            Monthly attendance calendar
          </p>
        </div>

        {/* --- Sub-header & Legend --- */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-[13px] font-semibold text-[#6fffd9] uppercase tracking-wide">
            Attendance calendar — May 2026 <span className="mx-1 text-[#84948e]">(Arjun)</span>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#b9cac3]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#00e5bc]/20 border border-[#00e5bc]/50"></span>
              Present
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#ffb4ab]/20 border border-[#ffb4ab]/50"></span>
              Absent
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#f59e0b]/20 border border-[#f59e0b]/50"></span>
              Late
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#262a31] border border-[#3b4a44]"></span>
              Holiday
            </div>
          </div>
        </div>

        {/* --- Calendar Grid --- */}
        <div className="mt-4 bg-[#3b4a44] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
          {/* 
            Using a grid with a 1px gap and a background color on the wrapper 
            is a clean trick to create perfect 1px inner borders for the calendar. 
          */}
          <div className="grid grid-cols-7 gap-[1px]">
            
            {/* Weekday Headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-[#262a31] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#b9cac3]"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}

            {/* Calendar Cells */}
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] p-2 sm:p-3 transition-colors ${getCellStyles(
                  day.status
                )}`}
              >
                {day.date && (
                  <span className="text-sm sm:text-base font-bold">
                    {day.date}
                  </span>
                )}
                
                {/* Optional visual indicator dot for mobile views (if wanted) */}
                {day.date && day.status !== "Holiday" && day.status !== "Present" && (
                   <div className="block sm:hidden w-1.5 h-1.5 rounded-full bg-current mt-1"></div>
                )}
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}