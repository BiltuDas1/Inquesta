import React, { useMemo } from "react";

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

interface ClassSession {
  id: string;
  subject: string;
  day: DayOfWeek;
  startHour: number;
  durationHours: number;
  colorClass: string;
  room?: string;
}

export default function SchedulePage() {
  const scheduleData: ClassSession[] = useMemo(
    () => [
      {
        id: "1",
        subject: "Assembly",
        day: "Monday",
        startHour: 8,
        durationHours: 1,
        colorClass: "bg-[#8774e1] text-white",
      },
      {
        id: "2",
        subject: "Mathematics",
        day: "Monday",
        startHour: 9,
        durationHours: 1,
        colorClass: "bg-[#1e619b] text-white",
      },
      {
        id: "3",
        subject: "English",
        day: "Monday",
        startHour: 11,
        durationHours: 1,
        colorClass: "bg-[#396d13] text-white",
      },
      {
        id: "4",
        subject: "Science",
        day: "Tuesday",
        startHour: 9,
        durationHours: 1,
        colorClass: "bg-[#12684e] text-white",
      },
      {
        id: "5",
        subject: "History",
        day: "Tuesday",
        startHour: 12,
        durationHours: 1,
        colorClass: "bg-[#814e13] text-white",
      },
      {
        id: "6",
        subject: "Mathematics",
        day: "Wednesday",
        startHour: 9,
        durationHours: 1,
        colorClass: "bg-[#1e619b] text-white",
      },
      {
        id: "7",
        subject: "Art",
        day: "Wednesday",
        startHour: 10,
        durationHours: 1,
        colorClass: "bg-[#8c3558] text-white",
      },
      {
        id: "8",
        subject: "PE",
        day: "Wednesday",
        startHour: 13,
        durationHours: 1,
        colorClass: "bg-[#5f5f5f] text-white",
      },
      {
        id: "9",
        subject: "Science",
        day: "Thursday",
        startHour: 9,
        durationHours: 1,
        colorClass: "bg-[#12684e] text-white",
      },
      {
        id: "10",
        subject: "English",
        day: "Thursday",
        startHour: 11,
        durationHours: 1,
        colorClass: "bg-[#396d13] text-white",
      },
      {
        id: "11",
        subject: "Mathematics",
        day: "Friday",
        startHour: 8,
        durationHours: 1,
        colorClass: "bg-[#1e619b] text-white",
      },
      {
        id: "12",
        subject: "History",
        day: "Friday",
        startHour: 10,
        durationHours: 1,
        colorClass: "bg-[#814e13] text-white",
      },
      {
        id: "13",
        subject: "Free period",
        day: "Friday",
        startHour: 12,
        durationHours: 1,
        colorClass: "bg-[#a6a6a6] text-gray-900",
      },
    ],
    [],
  );

  const days: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15];

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour} ${ampm}`;
  };

  return (
    // Added absolute inset-0 style constraints to guarantee this component doesn't exceed the viewport height
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a]">
      {/* Header Section */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">
          Schedule
        </h1>
        <p className="text-[#84948e] mt-1 font-body">
          Your full weekly class timetable
        </p>
      </div>

      {/* CRITICAL FIX: 
        min-h-0 prevents the flex child from growing infinitely. 
        overflow-auto places the scrollbar specifically on this div.
      */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-lg">
        <div className="min-w-[800px] grid grid-cols-[80px_repeat(5,1fr)] grid-rows-[50px_repeat(8,100px)] relative">
          {/* 1. Top-Left Empty Corner (Sticky on both axes) */}
          <div
            className="border-r border-b border-[#3b4a44] bg-[#1c2026] sticky top-0 left-0 z-[40]"
            style={{ gridColumn: 1, gridRow: 1 }}
          ></div>

          {/* 2. Day Headers (Sticky Top) */}
          {days.map((day, index) => (
            <div
              key={`header-${day}`}
              className="border-r border-b border-[#3b4a44] bg-[#1c2026] p-3 flex items-center justify-start sticky top-0 z-[30]"
              style={{ gridColumn: index + 2, gridRow: 1 }}
            >
              <span className="font-headline font-semibold text-[#dfe2eb] text-sm">
                {day}
              </span>
            </div>
          ))}

          {/* 3. Time Slots & Empty Background Cells */}
          {hours.map((hour, rowIndex) => {
            const gridRow = rowIndex + 2;

            return (
              <React.Fragment key={`row-${hour}`}>
                {/* Time Column (Sticky Left) */}
                <div
                  className="border-r border-b border-[#3b4a44] bg-[#1c2026] p-3 sticky left-0 z-[30] flex items-start justify-end"
                  style={{ gridColumn: 1, gridRow: gridRow }}
                >
                  <span className="text-xs font-medium text-[#84948e]">
                    {formatHour(hour)}
                  </span>
                </div>

                {/* Empty Grid Cells */}
                {days.map((day, colIndex) => (
                  <div
                    key={`cell-${day}-${hour}`}
                    className="border-r border-b border-[#3b4a44] bg-[#10141a]/50"
                    style={{ gridColumn: colIndex + 2, gridRow: gridRow }}
                  ></div>
                ))}
              </React.Fragment>
            );
          })}

          {/* --- Actual Class Blocks --- */}
          {scheduleData.map((cls) => {
            const columnIndex = days.indexOf(cls.day) + 2;
            const rowIndex = cls.startHour - 8 + 2;

            return (
              <div
                key={cls.id}
                style={{
                  gridColumn: columnIndex,
                  gridRow: `${rowIndex} / span ${cls.durationHours}`,
                }}
                className={`m-[2px] p-3 rounded-[6px] shadow-sm border border-black/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:brightness-110 cursor-pointer ${cls.colorClass} z-[10] overflow-hidden flex flex-col relative`}
              >
                <h4 className="font-headline font-semibold text-sm leading-tight">
                  {cls.subject}
                </h4>
                {cls.room && (
                  <span className="text-xs opacity-80 mt-1 font-medium">
                    Room {cls.room}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
