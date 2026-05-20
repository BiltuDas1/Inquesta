export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb]">
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <section className="pt-32 pb-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6fffd9] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#6fffd9] text-xs font-bold tracking-widest uppercase mb-4 block">
            Our Purpose
          </span>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Driven by a <span className="text-[#6fffd9]">Clear</span> Purpose
          </h1>
          <p className="text-[#b9cac3] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything we do at Inquesta is anchored in two foundational
            commitments.
          </p>
        </div>
      </section>

      {/* ==========================================
          TWO COMMITMENTS SECTION
          ========================================== */}
      <section className="pb-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commitment 1 */}
          <div className="bg-gradient-to-br from-[#1c2026] to-[#181c22] border border-[#3b4a44] rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#343d96] opacity-10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            <div className="bg-[#262a31] w-12 h-12 flex items-center justify-center rounded-xl text-[#bdc2ff] mb-8">
              <span className="material-symbols-outlined text-[24px]">
                public
              </span>
            </div>
            <span className="text-[#84948e] text-xs font-bold tracking-widest uppercase mb-2 block">
              Commitment 1
            </span>
            <h3 className="font-headline text-2xl font-bold text-white mb-4">
              The Most Trusted Experiential Learning Destination
            </h3>
            <p className="text-[#b9cac3] leading-relaxed">
              To be the most trusted experiential learning destination,
              inspiring the next generation of innovators through hands-on
              exploration of emerging science and technology.
            </p>
          </div>

          {/* Commitment 2 */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6fffd9] opacity-5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            <div className="bg-[#262a31] w-12 h-12 flex items-center justify-center rounded-xl text-[#6fffd9] mb-8">
              <span className="material-symbols-outlined text-[24px]">
                architecture
              </span>
            </div>
            <span className="text-[#84948e] text-xs font-bold tracking-widest uppercase mb-2 block">
              Commitment 2
            </span>
            <h3 className="font-headline text-2xl font-bold text-white mb-4">
              Bridging Education & Real-World Innovation
            </h3>
            <p className="text-[#b9cac3] leading-relaxed">
              To build a multidisciplinary, hands-on learning ecosystem that is
              affordable for students and professionals of all ages, bridging
              the gap between academic education and real-world innovation, one
              experience at a time.
            </p>
          </div>
        </div>
      </section>


      {/* ==========================================
          WHO WE ARE (SPLIT LAYOUT)
          ========================================== */}
      <section className="py-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-6">
            <span className="text-[#6fffd9] text-xs font-bold tracking-widest uppercase block">
              Who We Are
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white leading-tight">
              An Innovation Platform Built for{" "}
              <span className="text-[#6fffd9]">Real Learners</span>
            </h2>
            <div className="space-y-4 text-[#b9cac3] text-lg leading-relaxed">
              <p>
                Inquesta Solutions LLP is an interdisciplinary educational and
                innovation platform focused on experiential learning in emerging
                scientific and technological domains. Based in Behala, south
                Kolkata, we bridge the gap between academic learning and
                real-world applications through hands-on workshops, internships,
                demonstrations, and project-oriented learning.
              </p>
              <p>
                Programs are designed to be affordable and accessible,
                year-round — with after-school, weekend, and special summer
                cohorts — targeted at students and families who believe
                world-class learning should be within everyone's reach.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full space-y-4">
            {/* Certifications List */}
            {[
              {
                icon: "domain",
                title: "DPIIT Recognised Startup",
                desc: "Department for Promotion of Industry & Internal Trade, Govt. of India",
              },
              {
                icon: "workspace_premium",
                title: "MSME Certified Enterprise",
                desc: "Ministry of Micro, Small and Medium Enterprises, Govt. of India",
              },
              {
                icon: "assignment_turned_in",
                title: "GST Registered Organisation",
                desc: "Fully compliant, transparent, and accountable to our learners",
              },
            ].map((cert, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl shadow-sm hover:border-[#6fffd9] transition-colors group"
              >
                <div className="bg-[#262a31] p-3 rounded-lg text-[#84948e] group-hover:text-[#6fffd9] transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    {cert.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-[#dfe2eb] text-sm md:text-base">
                    {cert.title}
                  </h4>
                  <p className="text-[#84948e] text-xs mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY INQUESTA IS DIFFERENT (GRID)
          ========================================== */}
      <section className="py-24 bg-[#181c22] border-t border-[#3b4a44] px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
              Why <span className="text-[#6fffd9]">Inquesta</span> is Different
            </h2>
            <p className="text-[#b9cac3] max-w-2xl mx-auto">
              We're not another coaching centre. Here's what genuinely makes our
              approach unique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: "menu_book",
                title: "Strong Interdisciplinary Approach",
                desc: "We integrate biology, engineering, computation, and design so learners develop a holistic, connected understanding of science and technology — not siloed knowledge.",
              },
              {
                num: "02",
                icon: "build",
                title: "Hands-On, Experiential Learning",
                desc: "Every program is built around doing. Participants work with real tools, software, and hardware used in professional and research environments — not simulations.",
              },
              {
                num: "03",
                icon: "memory",
                title: "Real-World Tools & Workflows",
                desc: "Participants use the same equipment found in hospitals, research labs, and engineering firms — giving them a head-start no textbook can match.",
              },
              {
                num: "04",
                icon: "lightbulb",
                title: "Innovation & Prototyping Focus",
                desc: "Programs actively encourage creativity, problem-solving, and prototype development — skills increasingly valued in higher education and careers.",
              },
              {
                num: "05",
                icon: "corporate_fare",
                title: "Industry-Academia Integration",
                desc: "Designed with real-world applicability in mind, not just academic theory. This keeps our programs relevant, impactful, and ahead of the curve.",
              },
              {
                num: "06",
                icon: "savings",
                title: "Affordable & Accessible Pricing",
                desc: "World-class experiential learning should not be a privilege. Programs are priced to be genuinely accessible to middle-class families in Behala and south Kolkata.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#1c2026] border border-[#3b4a44] p-8 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -top-4 -right-4 text-[100px] font-black text-[#181c22] group-hover:text-[#262a31] transition-colors z-0 select-none">
                  {feature.num}
                </div>
                <div className="relative z-10">
                  <div className="text-[#6fffd9] mb-4">
                    <span className="material-symbols-outlined text-[28px]">
                      {feature.icon}
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-white mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-[#84948e] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          LEARNING FOR EVERY STAGE (DARKER BANNER)
          ========================================== */}
      <section className="py-24 bg-gradient-to-r from-[#10141a] via-[#181c22] to-[#10141a] border-y border-[#3b4a44] px-4 md:px-8 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#84948e] text-xs font-bold tracking-widest uppercase mb-2 block">
            Who We Serve
          </span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-12">
            Learning For <span className="text-[#ffb4ab]">Every Stage</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                icon: "menu_book",
                title: "School Students",
                desc: "Class 8 and above\nCurious minds, early starters",
              },
              {
                icon: "school",
                title: "College Students",
                desc: "Undergrads & postgrads\nDeepening real-world skills",
              },
              {
                icon: "work",
                title: "Professionals",
                desc: "Career pivoters & upskillers\nStaying ahead in emerging fields",
              },
              {
                icon: "group",
                title: "Families",
                desc: "Affordable, trusted learning\nFor Behala & south Kolkata",
              },
            ].map((stage, i) => (
              <div
                key={i}
                className="bg-[#1c2026] border border-[#3b4a44] p-6 rounded-xl w-full sm:w-[220px] text-center hover:border-[#84948e] transition-colors"
              >
                <div className="bg-[#262a31] w-12 h-12 mx-auto flex items-center justify-center rounded-lg text-[#bdc2ff] mb-4">
                  <span className="material-symbols-outlined text-[24px]">
                    {stage.icon}
                  </span>
                </div>
                <h4 className="font-headline font-bold text-[#dfe2eb] mb-2">
                  {stage.title}
                </h4>
                <p className="text-[#84948e] text-xs whitespace-pre-line">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          LOCATION & REACH (FOOTER PRE-SECTION)
          ========================================== */}
      <section className="py-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto bg-[#1c2026] border border-[#3b4a44] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="bg-[#262a31] w-16 h-16 flex items-center justify-center rounded-full shrink-0 border border-[#3b4a44]">
            <span className="material-symbols-outlined text-[32px] text-[#6fffd9]">
              location_on
            </span>
          </div>

          <div className="flex-grow">
            <span className="text-[#84948e] text-xs font-bold tracking-widest uppercase mb-1 block">
              Our Home
            </span>
            <h3 className="font-headline text-2xl font-bold text-white mb-3">
              Rooted in Behala, Reaching Beyond
            </h3>
            <p className="text-[#b9cac3] text-sm md:text-base mb-6 max-w-3xl">
              Inquesta operates year-round from Behala, south Kolkata — one of
              the city's most vibrant and densely populated neighbourhoods. We
              run after-school programs, weekend workshops, and special summer
              vacation cohorts, making it easy for families nearby to access
              world-class experiential education without travelling far.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#181c22] border border-[#3b4a44] px-4 py-2 rounded-full text-xs font-medium text-[#dfe2eb]">
                <span className="material-symbols-outlined text-[14px] text-[#bdc2ff]">
                  calendar_month
                </span>{" "}
                Year-Round Programs
              </div>
              <div className="flex items-center gap-2 bg-[#181c22] border border-[#3b4a44] px-4 py-2 rounded-full text-xs font-medium text-[#dfe2eb]">
                <span className="material-symbols-outlined text-[14px] text-[#6fffd9]">
                  schedule
                </span>{" "}
                After-School Sessions
              </div>
              <div className="flex items-center gap-2 bg-[#181c22] border border-[#3b4a44] px-4 py-2 rounded-full text-xs font-medium text-[#dfe2eb]">
                <span className="material-symbols-outlined text-[14px] text-[#bdc2ff]">
                  calendar_month
                </span>{" "}
                Weekend Workshops
              </div>
              <div className="flex items-center gap-2 bg-[#181c22] border border-[#3b4a44] px-4 py-2 rounded-full text-xs font-medium text-[#dfe2eb]">
                <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">
                  light_mode
                </span>{" "}
                Summer Cohorts
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
