import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

interface ClassSession {
  id: string;
  subject: string;
  day: DayOfWeek;
  startHour: number;
  durationHours: number;
  colorClass: string;
  room?: string;
  isCustom?: boolean;
}

// --- GraphQL Queries and Mutations ---
const GET_TIMETABLE = gql`
  query GetTimetable {
    getTimetable {
      success
      message
      data {
        id
        subject
        day
        startHour
        durationHours
        room
        colorClass
      }
    }
  }
`;

const ADD_TIMETABLE_ENTRY = gql`
  mutation AddTimetableEntry(
    $subject: String!
    $day: String!
    $startHour: Int!
    $durationHours: Int
    $room: String
    $colorClass: String
  ) {
    addTimetableEntry(
      subject: $subject
      day: $day
      startHour: $startHour
      durationHours: $durationHours
      room: $room
      colorClass: $colorClass
    ) {
      success
      message
    }
  }
`;

const DELETE_TIMETABLE_ENTRY = gql`
  mutation DeleteTimetableEntry($id: String!) {
    deleteTimetableEntry(id: $id) {
      success
      message
    }
  }
`;

interface TimetableGQL {
  id: string;
  subject: string;
  day: string;
  startHour: number;
  durationHours: number;
  room: string | null;
  colorClass: string | null;
}

interface GetTimetableResponse {
  getTimetable: {
    success: boolean;
    message: string;
    data: TimetableGQL[] | null;
  };
}

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState<DayOfWeek>("Monday");
  const [startHour, setStartHour] = useState(9);
  const [durationHours, setDurationHours] = useState(1);
  const [room, setRoom] = useState("");
  const [colorClass, setColorClass] = useState("bg-[#1e619b] text-white");

  // GraphQL integration
  const { data, loading, refetch } = useQuery<GetTimetableResponse>(GET_TIMETABLE, {
    fetchPolicy: "cache-and-network",
  });
  const [addTimetableEntry] = useMutation<any>(ADD_TIMETABLE_ENTRY);
  const [deleteTimetableEntry] = useMutation<any>(DELETE_TIMETABLE_ENTRY);

  const defaultScheduleData: ClassSession[] = useMemo(
    () => [],
    [],
  );

  const combinedScheduleData = useMemo(() => {
    const dbEntries = data?.getTimetable?.data || [];
    const customSessions = dbEntries.map((item: any) => ({
      id: item.id,
      subject: item.subject,
      day: item.day as DayOfWeek,
      startHour: item.startHour,
      durationHours: item.durationHours,
      colorClass: item.colorClass || "bg-[#1e619b] text-white",
      room: item.room || undefined,
      isCustom: true,
    }));
    return [...defaultScheduleData, ...customSessions];
  }, [data, defaultScheduleData]);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      const response = await addTimetableEntry({
        variables: {
          subject,
          day,
          startHour,
          durationHours,
          room: room.trim() || null,
          colorClass,
        },
      });

      if (response.data?.addTimetableEntry?.success) {
        toast.success("Timetable entry added successfully");
        setIsModalOpen(false);
        setSubject("");
        setRoom("");
        refetch();
      } else {
        toast.error(response.data?.addTimetableEntry?.message || "Failed to add entry");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class entry?")) {
      return;
    }
    try {
      const response = await deleteTimetableEntry({
        variables: { id },
      });

      if (response.data?.deleteTimetableEntry?.success) {
        toast.success("Timetable entry deleted successfully");
        refetch();
      } else {
        toast.error(response.data?.deleteTimetableEntry?.message || "Failed to delete entry");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const colorOptions = [
    { name: "Blue", value: "bg-[#1e619b] text-white" },
    { name: "Purple", value: "bg-[#8774e1] text-white" },
    { name: "Green", value: "bg-[#396d13] text-white" },
    { name: "Teal", value: "bg-[#12684e] text-white" },
    { name: "Orange", value: "bg-[#814e13] text-white" },
    { name: "Magenta", value: "bg-[#8c3558] text-white" },
    { name: "Gray", value: "bg-[#5f5f5f] text-white" },
  ];

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a]">
      {/* Header Section */}
      <div className="mb-6 shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">
            Schedule
          </h1>
          <p className="text-[#84948e] mt-1 font-body">
            Your full weekly class timetable
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00e5bc]/20 text-[#00e5bc] border border-[#00e5bc]/30 px-4 py-2 rounded-lg font-medium hover:bg-[#00e5bc]/30 hover:text-white transition-all duration-200 text-sm shadow-[0_0_15px_rgba(0,229,188,0.1)] flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4.5 w-4.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Class
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-lg">
        {loading && combinedScheduleData.length === defaultScheduleData.length ? (
          <div className="p-8 text-center text-[#84948e]">Loading schedule...</div>
        ) : (
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
            {combinedScheduleData.map((cls) => {
              const columnIndex = days.indexOf(cls.day) + 2;
              const rowIndex = cls.startHour - 8 + 2;

              return (
                <div
                  key={cls.id}
                  style={{
                    gridColumn: columnIndex,
                    gridRow: `${rowIndex} / span ${cls.durationHours}`,
                  }}
                  className={`m-[2px] p-3 rounded-[6px] shadow-sm border border-black/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:brightness-110 cursor-pointer ${cls.colorClass} z-[10] overflow-hidden flex flex-col relative group`}
                >
                  <h4 className="font-headline font-semibold text-sm leading-tight pr-5">
                    {cls.subject}
                  </h4>
                  {cls.room && (
                    <span className="text-xs opacity-80 mt-1 font-medium">
                      Room {cls.room}
                    </span>
                  )}
                  {cls.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cls.id);
                      }}
                      className="absolute top-2 right-2 text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/20"
                      title="Delete entry"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Timetable Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="bg-[#262a31] border-b border-[#3b4a44] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline text-[#dfe2eb]">Add Custom Class</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#84948e] hover:text-[#dfe2eb] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 font-body">
              <div>
                <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Lab, Study Group"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] placeholder-[#5f756c] focus:outline-none focus:border-[#00e5bc] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Day of Week</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] focus:outline-none focus:border-[#00e5bc] text-sm"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Room (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 102"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] placeholder-[#5f756c] focus:outline-none focus:border-[#00e5bc] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Start Time</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] focus:outline-none focus:border-[#00e5bc] text-sm"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {formatHour(h)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Duration (Hours)</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] focus:outline-none focus:border-[#00e5bc] text-sm"
                  >
                    {[1, 2, 3].map((dur) => (
                      <option key={dur} value={dur}>
                        {dur} {dur === 1 ? "Hour" : "Hours"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#b9cac3] mb-2">Display Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColorClass(opt.value)}
                      className={`h-7 px-3 rounded text-xs font-semibold border transition-all ${
                        colorClass === opt.value
                          ? "border-white ring-1 ring-white/50 scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                      } ${opt.value.split(" ")[0]}`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#3b4a44] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00e5bc] text-[#10141a] hover:bg-[#00e5bc]/95 hover:shadow-[0_0_15px_rgba(0,229,188,0.3)] px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
