import { useState } from "react";

// --- Types ---
interface InboxItem {
  id: string;
  sender: string;
  subject: string;
  time: string;
  isUnread: boolean;
  indicatorColor: string;
}

interface ChatMessage {
  id: string;
  sender: "teacher" | "parent";
  text: string;
  senderName?: string;
}

export default function MessagesPage() {
  // --- State for Mobile Responsiveness ---
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState<boolean>(false);

  // --- Mock Data ---
  const inboxData: InboxItem[] = [
    {
      id: "1",
      sender: "Ms. Sharma",
      subject: "Math assignment graded",
      time: "Today 9:15 AM",
      isUnread: true,
      indicatorColor: "bg-[#00e5bc]", // primary-container
    },
    {
      id: "2",
      sender: "Mr. Iyer",
      subject: "Field trip consent needed",
      time: "Yesterday",
      isUnread: true,
      indicatorColor: "bg-[#f59e0b]", // warning/amber
    },
    {
      id: "3",
      sender: "Admin Office",
      subject: "Term fee reminder",
      time: "2 days ago",
      isUnread: false,
      indicatorColor: "bg-[#31353c]", // surface-container-highest
    },
    {
      id: "4",
      sender: "Ms. Pillai",
      subject: "Reading list for Term 3",
      time: "3 days ago",
      isUnread: false,
      indicatorColor: "bg-[#343d96]", // secondary-container
    },
    {
      id: "5",
      sender: "Mr. Khan",
      subject: "History project feedback",
      time: "5 days ago",
      isUnread: false,
      indicatorColor: "bg-[#31353c]",
    },
  ];

  const chatHistory: ChatMessage[] = [
    {
      id: "m1",
      sender: "teacher",
      senderName: "Ms. Sharma",
      text: "Arjun's work on problem set 3 was excellent. He showed clear working and scored 88/100. Well done!",
    },
    {
      id: "m2",
      sender: "parent",
      senderName: "You (Parent)",
      text: "Thank you for the feedback! We will keep working on the quadratic section.",
    },
    {
      id: "m3",
      sender: "teacher",
      senderName: "Ms. Sharma",
      text: "Absolutely. Problem set 4 is due 8 May — please ensure he attempts all parts.",
    },
  ];

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsMobileChatOpen(true); // Slide into chat view on mobile
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#10141a] p-4 md:p-6 lg:p-8 font-body text-[#dfe2eb] flex flex-col">
      {/* --- Header Section --- */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
          Messages
        </h1>
        <p className="text-sm text-[#b9cac3] mt-1">
          Messages from teachers and school admin
        </p>
      </div>

      {/* --- Main Layout Grid --- */}
      <div className="flex-1 flex overflow-hidden gap-6 relative">
        {/* --- Left Column: Inbox List --- */}
        <div
          className={`w-full lg:w-1/3 bg-[#1c2026] border border-[#3b4a44] rounded-xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMobileChatOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-[#3b4a44] bg-[#262a31]/50 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#84948e]">
              Inbox
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {inboxData.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectChat(item.id)}
                className={`w-full text-left p-4 border-b border-[#3b4a44]/50 hover:bg-[#262a31] transition-colors flex items-center justify-between group focus:outline-none ${
                  activeChatId === item.id ? "bg-[#262a31]" : ""
                }`}
              >
                <div className="pr-4">
                  <h3
                    className={`text-sm ${
                      item.isUnread
                        ? "font-bold text-[#dfe2eb]"
                        : "font-medium text-[#b9cac3]"
                    }`}
                  >
                    {item.sender}
                  </h3>
                  <p className="text-[13px] text-[#b9cac3] mt-0.5 truncate max-w-[200px]">
                    {item.subject}
                  </p>
                  <p className="text-[11px] text-[#84948e] mt-1.5">
                    {item.time}
                  </p>
                </div>
                {/* Status Indicator Dot */}
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.indicatorColor}`}
                ></div>
              </button>
            ))}
          </div>
        </div>

        {/* --- Right Column: Active Chat View --- */}
        <div
          className={`w-full lg:w-2/3 bg-[#1c2026] border border-[#3b4a44] rounded-xl flex flex-col overflow-hidden transition-all duration-300 ${
            !isMobileChatOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-[#3b4a44] shrink-0 bg-[#262a31]/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="lg:hidden mr-1 text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none flex items-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_back
                  </span>
                </button>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#84948e]">
                  MS. SHARMA — MATHEMATICS
                </h2>
              </div>
              <p className="text-[13px] text-[#b9cac3] mt-1.5 font-medium ml-7 lg:ml-0">
                Regarding: Problem set 4 grading
              </p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[#10141a]/30">
            {chatHistory.map((msg) => {
              const isTeacher = msg.sender === "teacher";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isTeacher ? "items-start" : "items-end"
                  }`}
                >
                  <span className="text-[11px] text-[#84948e] mb-1 px-1">
                    {msg.senderName}
                  </span>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      isTeacher
                        ? "bg-[#262a31] text-[#dfe2eb] rounded-tl-sm border border-[#3b4a44]/50"
                        : "bg-[#343d96] text-[#dfe2eb] rounded-tr-sm border border-[#343d96]" // Using secondary container for parent
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-[#3b4a44] bg-[#1c2026] shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] placeholder-[#84948e] text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
              />
              <button className="bg-[#6fffd9] hover:bg-[#5cebc5] text-[#00382c] font-bold py-3 px-6 rounded-lg transition-colors text-sm shadow-[0_0_15px_rgba(111,255,217,0.15)] flex items-center justify-center focus:outline-none">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
