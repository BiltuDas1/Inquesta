// --- Types ---
type EventType =
  | "blue"
  | "purple"
  | "red"
  | "brown"
  | "gray"
  | "green"
  | "maroon";

interface TimetableEvent {
  day: string;
  time: string;
  title: string;
  type: EventType;
}

export default function TimetablePage() {
  // --- Grid Data ---
  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "1:00",
    "2:00",
    "3:00",
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  // --- Mock Data (Based on the image) ---
  const events: TimetableEvent[] = [
    { day: "Mon", time: "8:00", title: "8A — Algebra", type: "blue" },
    { day: "Wed", time: "8:00", title: "8A — Algebra", type: "blue" },
    { day: "Fri", time: "8:00", title: "8A — Test", type: "red" },

    { day: "Tue", time: "9:00", title: "8B — Fractions", type: "blue" },
    { day: "Thu", time: "9:00", title: "8B — Fractions", type: "blue" },

    { day: "Wed", time: "10:00", title: "9A — Revision", type: "purple" },
    { day: "Fri", time: "10:00", title: "9A — Revision", type: "purple" },

    { day: "Mon", time: "11:00", title: "9B — Geometry", type: "purple" },
    { day: "Thu", time: "11:00", title: "9B — Geometry", type: "purple" },

    { day: "Tue", time: "12:00", title: "10A — Statistics", type: "brown" },
    { day: "Fri", time: "12:00", title: "10A — Statistics", type: "brown" },

    { day: "Mon", time: "1:00", title: "Staff meeting", type: "gray" },
    { day: "Thu", time: "1:00", title: "Extra coaching", type: "green" },

    { day: "Wed", time: "2:00", title: "Parent-teacher", type: "maroon" },
  ];

  // Helper function to map event types to Luminary Brand colors
  const getEventStyle = (type: EventType) => {
    switch (type) {
      case "blue":
        // Secondary Container
        return "bg-[#343d96] text-[#dfe2eb] border border-[#a8afff]/20";
      case "purple":
        // On-Secondary
        return "bg-[#1b247f] text-[#bdc2ff] border border-[#a8afff]/20";
      case "red":
        // Error Container
        return "bg-[#93000a] text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "green":
        // On-Primary Container
        return "bg-[#00614f] text-[#6fffd9] border border-[#00e5bc]/20";
      case "gray":
        // Surface Container Highest
        return "bg-[#31353c] text-[#dfe2eb] border border-[#84948e]/20";
      case "maroon":
        // On-Error
        return "bg-[#690005] text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "brown":
      default:
        // Warning/Amber tone for contrast (maintaining consistency with previous chats)
        return "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30";
    }
  };

  // Helper to find an event for a specific cell
  const getEventForCell = (day: string, time: string) => {
    return events.find((e) => e.day === day && e.time === time);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Timetable
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Your full weekly teaching timetable
        </p>
      </div>

      {/* ── Timetable Grid ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm mt-6">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] bg-[#262a31] border-b border-[#3b4a44]">
              <div className="py-3 px-2"></div> {/* Empty corner cell */}
              {days.map((day) => (
                <div
                  key={day}
                  className="py-3 px-4 text-[#b9cac3] font-bold text-sm border-l border-[#3b4a44]/50"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Time Rows */}
            <div className="divide-y divide-[#3b4a44]/50">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[60px_repeat(5,1fr)] hover:bg-[#262a31]/30 transition-colors"
                >
                  {/* Time Label */}
                  <div className="py-3 pr-4 text-right text-xs font-medium text-[#84948e] self-start mt-1">
                    {hour}
                  </div>

                  {/* Day Cells */}
                  {days.map((day) => {
                    const event = getEventForCell(day, hour);
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="min-h-[80px] border-l border-[#3b4a44]/50 p-1.5"
                      >
                        {event && (
                          <div
                            className={`w-full h-full rounded-md p-2 shadow-sm transition-transform hover:scale-[1.02] cursor-default flex flex-col justify-start ${getEventStyle(
                              event.type,
                            )}`}
                          >
                            <span className="text-[13px] font-semibold leading-tight">
                              {event.title}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
