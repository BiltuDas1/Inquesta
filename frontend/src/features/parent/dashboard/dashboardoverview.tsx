export default function DashboardOverview() {
  // --- Dummy Data Models ---
  const stats = [
    { label: "Attendance", value: "94%", sub: "This month" },
    { label: "Avg grade", value: "B+", sub: "All subjects" },
    { label: "Pending fees", value: "₹0", sub: "All clear" },
    { label: "Unread messages", value: "3", sub: "From teachers" },
  ];

  const subjects = [
    { name: "Mathematics", score: 82, color: "bg-[#00e5bc]" }, // primary-container
    { name: "Science", score: 76, color: "bg-[#343d96]" }, // secondary-container
    { name: "English", score: 91, color: "bg-[#a8afff]" }, // on-secondary-container
    { name: "History", score: 68, color: "bg-[#ffb4ab]" }, // error
  ];

  const messages = [
    {
      title: "Math: Assignment graded",
      time: "Today, 9:15 AM",
      indicatorColor: "bg-[#343d96]",
    },
    {
      title: "Science: Field trip consent needed",
      time: "Yesterday",
      indicatorColor: "bg-[#ffb4ab]",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Welcome back
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Monitoring 2 children — last updated today
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl flex flex-col justify-between shadow-sm"
          >
            <span className="text-[#b9cac3] text-sm font-medium">{s.label}</span>
            <span className="text-3xl font-bold text-[#dfe2eb] my-3">
              {s.value}
            </span>
            <span className="text-[#84948e] text-xs">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Main Content Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Subject Performance */}
        <div className="lg:col-span-7 bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-6 uppercase">
            Subject Performance (Arjun)
          </h2>
          <div className="space-y-6">
            {subjects.map((sub) => (
              <div key={sub.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#dfe2eb] font-medium">{sub.name}</span>
                  <span className="text-[#b9cac3]">{sub.score}%</span>
                </div>
                <div className="w-full bg-[#31353c] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${sub.color}`}
                    style={{ width: `${sub.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Messages, Alerts, Actions */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          
          {/* Teacher Messages */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm">
            <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-4 uppercase">
              Teacher Messages
            </h2>
            <div className="space-y-4 divide-y divide-[#3b4a44]/50">
              {messages.map((msg, i) => (
                <div key={i} className="pt-4 first:pt-0 flex items-start gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm ${msg.indicatorColor}`}
                  ></div>
                  <div>
                    <p className="text-[#dfe2eb] text-sm font-medium">
                      {msg.title}
                    </p>
                    <p className="text-[#84948e] text-xs mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-[#262a31] border-l-4 border-[#ffb4ab] rounded-r-lg p-4 flex items-center shadow-sm">
            <span className="text-[#ffb4ab] text-sm font-medium">
              Attendance: May fall below 95% — needs attention
            </span>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm mt-auto">
            <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-4 uppercase">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 bg-[#262a31] hover:bg-[#31353c] text-[#6fffd9] border border-[#3b4a44] hover:border-[#6fffd9]/50 rounded-full text-sm font-medium transition-all">
                Message teacher
              </button>
              <button className="px-5 py-2.5 bg-[#262a31] hover:bg-[#31353c] text-[#bdc2ff] border border-[#3b4a44] hover:border-[#bdc2ff]/50 rounded-full text-sm font-medium transition-all">
                View report card
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}