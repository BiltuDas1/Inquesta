import { Link } from "react-router";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-none shadow-2xl shadow-black/40">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto font-headline tracking-tight">
          <div className="text-2xl font-bold tracking-tighter text-on-surface">inquesta<span className="text-gradient">.org</span></div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Courses</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Programs</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Community</a>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-on-surface-variant hover:text-on-surface transition-colors font-medium">Login</button>
            <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-primary-container/20">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[800px] flex items-center overflow-hidden px-8">
          {/* <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full" />
          </div> */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-surface-container-low/50 border border-outline-variant px-4 py-2 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-on-surface-variant">INDIA'S #1 STEM EDTECH PLATFORM</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1]">
                Learn. <br /> Build. <br/><span className="text-gradient">Innovate.</span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
                Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-bold text-lg glow-hover transition-all flex items-center justify-center group">
                  Start Learning
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button className="border border-outline-variant text-on-surface px-8 py-4 rounded-full font-bold text-lg hover:bg-surface-container transition-all">
                  Explore
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card rounded-[2rem] p-4 border border-outline-variant shadow-2xl relative overflow-hidden group">
                <img alt="Advanced Robotics" className="w-full h-[500px] object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity" src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" />
                
                {/* Floating Data Card */}
                <div className="absolute bottom-10 left-10 glass-card p-6 rounded-2xl border border-primary/20 shadow-xl max-w-[240px]">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">kid_star</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant">Average Rating</p>
                      <p className="font-bold text-primary">4.8 / 5</p>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="py-20 bg-surface-container-low/30">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {[ 
              { val: "50K+", label: "Students" },
              { val: "1200+", label: "Schools Partnered" },
              { val: "120+", label: "Courses & Kits" }
            ].map((stat, i) => (
              <div key={i} className={`text-center px-4 ${i < 2 ? 'md:border-r border-outline-variant' : ''}`}>
                <p className="text-5xl font-headline font-extrabold text-on-surface mb-2 tracking-tighter">{stat.val}</p>
                <p className="text-on-surface-variant font-medium tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Courses Bento Grid */}
        <section className="py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">Latest Architectures</h2>
                <p className="text-on-surface-variant text-lg">Next-gen technical modules updated this week.</p>
              </div>
              <button className="flex items-center space-x-2 text-primary font-bold hover:opacity-80 transition-opacity">
                <span>View All Modules</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Featured Course */}
              <div className="md:col-span-8 group cursor-pointer relative h-[450px] rounded-3xl overflow-hidden bg-surface-container border border-outline-variant">
                <img className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-0 p-10">
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 inline-block">New Release</span>
                  <h3 className="text-4xl font-headline font-bold mb-4">Embedded Systems Engineering</h3>
                  <p className="text-on-surface-variant max-w-lg mb-6 line-clamp-2">Deep dive into real-time operating systems (RTOS) and the architecture of power-efficient microcontroller units for industrial applications.</p>
                  <div className="flex items-center space-x-6 text-on-surface-variant">
                    <div className="flex items-center space-x-2"><span className="material-symbols-outlined text-primary text-sm">schedule</span><span className="text-sm">42 Hours</span></div>
                    <div className="flex items-center space-x-2"><span className="material-symbols-outlined text-primary text-sm">signal_cellular_alt</span><span className="text-sm">Advanced</span></div>
                  </div>
                </div>
              </div>
              
              {/* Side Course */}
              <div className="md:col-span-4 group cursor-pointer relative h-[450px] rounded-3xl overflow-hidden bg-surface-container border border-outline-variant">
                <img className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-2xl font-headline font-bold mb-3">Neural Networks with TensorFlow</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Build predictive models from the ground up for edge computing environments.</p>
                  <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </button>
                </div>
              </div>

              {/* Bottom Wide Course */}
              <div className="md:col-span-12 group cursor-pointer relative h-[300px] rounded-3xl overflow-hidden bg-surface-container border border-outline-variant flex items-center px-12">
                <img className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv4SdMF4Haf_XtQ0yCeyfRnJJ9-SHu99huT6KupQRv3seTPF6L3nL2m-4l5aO1ihXWzgmvjNZBeCEGuzvPpYOTqNxpGbmptfDH5ztz3r-SKVfES2jX-H5M2Z0pKau9hbkmYBPX4JzcXR1F4Y2b9G8JPV58VHqCpNCALssdHhvt0VRSr_icEQuio_7i33C1Bq4pgsqZ9a0pysHfkq-tPjexOAKdXE3zZ_hH6EJMkxExrjryV1aqFTQAhPLRcljCdIZBogDTN8Kg7Afu" alt="" />
                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-2xl">
                    <h3 className="text-3xl font-headline font-bold mb-4">Next-Gen Edge Computing Platforms</h3>
                    <p className="text-on-surface-variant">Deploying distributed AI at the edge to reduce latency and increase security in decentralized networks.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant"><span className="material-symbols-outlined text-primary text-3xl">developer_board</span></div>
                    <div className="h-16 w-16 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant"><span className="material-symbols-outlined text-primary text-3xl">cloud_sync</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Laboratory Section with SVG Pattern */}
        <section className="py-32 bg-surface-container-low relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-6">Learn in a Digital Laboratory Environment</h2>
              <p className="text-on-surface-variant text-lg">Our proprietary platform mimics top-tier industrial R&D labs, giving you direct access to hardware without the overhead.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "code_blocks", title: "Cloud-Integrated IDE", desc: "Write, compile, and deploy code directly to virtualized hardware clusters from your browser." },
                { icon: "view_in_ar", title: "Virtual Digital Twins", desc: "Interact with 1:1 digital replicas of industrial robotics and IoT sensors to test edge cases safely." },
                { icon: "group_work", title: "Collaborative Sandboxes", desc: "Pair program in real-time on complex architectural problems with peers and industry mentors." }
              ].map((f, i) => (
                <div key={i} className="glass-card p-10 rounded-3xl border border-outline-variant hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-primary">
                    <span className="material-symbols-outlined text-4xl">{f.icon}</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4">{f.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* SVG Background Wave Pattern */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="#6fffd9" strokeWidth="0.1" />
              <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="#6fffd9" strokeWidth="0.1" />
            </svg>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8">
          <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 tracking-tight">Ready to build the future?</h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">Join the next cohort of engineers mastering the intersection of AI and physical systems.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold text-xl glow-hover transition-all">Start Your Journey</button>
              <button className="text-on-surface font-bold text-xl px-10 py-5 hover:bg-surface-container rounded-full transition-all">Talk to an Advisor</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-background border-t border-outline-variant text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto space-y-8 md:space-y-0">
          <div className="text-xl font-bold text-on-surface">Inquesta</div>
          <div className="flex flex-wrap justify-center gap-8 text-on-surface-variant">
            {["Terms of Service", "Privacy Policy", "Twitter", "LinkedIn", "GitHub"].map(link => (
              <a key={link} className="hover:text-primary transition-colors" href="#">{link}</a>
            ))}
          </div>
          <p className="text-on-surface-variant">© {currentYear} Inquesta. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}