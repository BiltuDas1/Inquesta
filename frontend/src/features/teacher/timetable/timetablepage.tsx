import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";

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
  id?: string;
  day: string;
  time: string;
  title: string;
  type: EventType;
  isCustom?: boolean;
}

// --- GraphQL Queries & Mutations ---
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
        eventType
      }
    }
  }
`;

const ADD_TIMETABLE_ENTRY = gql`
  mutation AddTimetableEntry(
    $subject: String!
    $day: String!
    $startHour: Int!
    $eventType: String
  ) {
    addTimetableEntry(
      subject: $subject
      day: $day
      startHour: $startHour
      eventType: $eventType
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
  eventType: string | null;
}

interface GetTimetableResponse {
  getTimetable: {
    success: boolean;
    message: string;
    data: TimetableGQL[] | null;
  };
}

export default function TimetablePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Mon");
  const [startHour, setStartHour] = useState(8);
  const [eventType, setEventType] = useState<EventType>("blue");

  // GraphQL integration
  const { data, refetch } = useQuery<GetTimetableResponse>(GET_TIMETABLE, {
    fetchPolicy: "cache-and-network",
  });
  const [addTimetableEntry] = useMutation<any>(ADD_TIMETABLE_ENTRY);
  const [deleteTimetableEntry] = useMutation<any>(DELETE_TIMETABLE_ENTRY);

  // --- Grid Data ---
  const hoursMapping = [
    { label: "8:00", hour: 8 },
    { label: "9:00", hour: 9 },
    { label: "10:00", hour: 10 },
    { label: "11:00", hour: 11 },
    { label: "12:00", hour: 12 },
    { label: "1:00", hour: 13 },
    { label: "2:00", hour: 14 },
    { label: "3:00", hour: 15 },
  ];

  const hours = hoursMapping.map((h) => h.label);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  // Mapping from abbreviation to db name and vice-versa
  const dayMapToDb: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
  };

  const dayMapFromDb: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
  };

  const defaultEvents: TimetableEvent[] = useMemo(
    () => [],
    [],
  );

  const combinedEvents = useMemo(() => {
    const dbEntries = data?.getTimetable?.data || [];
    const customEvents = dbEntries.map((item: any) => {
      const labelItem = hoursMapping.find((h) => h.hour === item.startHour);
      const dayAbbr = dayMapFromDb[item.day] || item.day;
      return {
        id: item.id,
        day: dayAbbr,
        time: labelItem ? labelItem.label : "8:00",
        title: item.subject,
        type: (item.eventType as EventType) || "blue",
        isCustom: true,
      };
    });
    return [...defaultEvents, ...customEvents];
  }, [data, defaultEvents]);

  // Helper function to map event types to Luminary Brand colors
  const getEventStyle = (type: EventType) => {
    switch (type) {
      case "blue":
        return "bg-[#343d96] text-[#dfe2eb] border border-[#a8afff]/20";
      case "purple":
        return "bg-[#1b247f] text-[#bdc2ff] border border-[#a8afff]/20";
      case "red":
        return "bg-[#93000a] text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "green":
        return "bg-[#00614f] text-[#6fffd9] border border-[#00e5bc]/20";
      case "gray":
        return "bg-[#31353c] text-[#dfe2eb] border border-[#84948e]/20";
      case "maroon":
        return "bg-[#690005] text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "brown":
      default:
        return "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30";
    }
  };

  // Helper to find an event for a specific cell
  const getEventForCell = (day: string, time: string) => {
    return combinedEvents.find((e) => e.day === day && e.time === time);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Title / Subject is required");
      return;
    }

    try {
      const dbDay = dayMapToDb[day] || day;
      const response = await addTimetableEntry({
        variables: {
          subject: subject.trim(),
          day: dbDay,
          startHour,
          eventType,
        },
      });

      if (response.data?.addTimetableEntry?.success) {
        toast.success("Timetable slot added successfully");
        setIsModalOpen(false);
        setSubject("");
        refetch();
      } else {
        toast.error(response.data?.addTimetableEntry?.message || "Failed to add slot");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class slot?")) {
      return;
    }
    try {
      const response = await deleteTimetableEntry({
        variables: { id },
      });

      if (response.data?.deleteTimetableEntry?.success) {
        toast.success("Slot deleted successfully");
        refetch();
      } else {
        toast.error(response.data?.deleteTimetableEntry?.message || "Failed to delete slot");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const colorOptions: { name: string; value: EventType }[] = [
    { name: "Blue", value: "blue" },
    { name: "Purple", value: "purple" },
    { name: "Red", value: "red" },
    { name: "Green", value: "green" },
    { name: "Gray", value: "gray" },
    { name: "Maroon", value: "maroon" },
    { name: "Amber/Brown", value: "brown" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
            Timetable
          </h1>
          <p className="text-[#b9cac3] text-sm mt-1">
            Your full weekly teaching timetable
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
          Add Slot
        </button>
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
                            className={`w-full h-full rounded-md p-2 shadow-sm transition-transform hover:scale-[1.02] cursor-default flex flex-col justify-between relative group ${getEventStyle(
                              event.type,
                            )}`}
                          >
                            <span className="text-[13px] font-semibold leading-tight pr-5">
                              {event.title}
                            </span>
                            {event.isCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (event.id) handleDelete(event.id);
                                }}
                                className="absolute top-1 right-1 text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-black/20"
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

      {/* Add Timetable Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="bg-[#262a31] border-b border-[#3b4a44] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline text-[#dfe2eb]">Add Custom Teaching Slot</h3>
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
                <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Class / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8A — Algebra, Office Hours"
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
                    onChange={(e) => setDay(e.target.value)}
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
                  <label className="block text-sm font-semibold text-[#b9cac3] mb-1">Time Slot</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] focus:outline-none focus:border-[#00e5bc] text-sm"
                  >
                    {hoursMapping.map((h) => (
                      <option key={h.hour} value={h.hour}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#b9cac3] mb-2">Display Color / Category</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEventType(opt.value)}
                      className={`h-7 px-3 rounded text-xs font-semibold border transition-all ${
                        eventType === opt.value
                          ? "border-white ring-1 ring-white/50 scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                      } ${getEventStyle(opt.value).split(" ")[0]}`}
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
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
