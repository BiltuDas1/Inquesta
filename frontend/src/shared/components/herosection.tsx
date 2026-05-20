import { useNavigate } from "react-router";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[550px] md:min-h-[650px] flex items-center overflow-hidden px-8 pt-24">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-surface-container-low/50 border border-outline-variant px-4 py-2 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-on-surface-variant">
              REGISTRATION IS CURRENTLY GOING ON
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1]">
            Learn. <br /> Build. <br />
            <span className="text-gradient">Innovate.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
            Hands-on STEM Courses for K-12 students across India. From PictoBlox
            to Arduino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-bold text-lg glow-hover transition-all flex items-center justify-center group active:scale-95"
            >
              Start Learning
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="border border-outline-variant text-on-surface px-8 py-4 rounded-full font-bold text-lg hover:bg-surface-container transition-all"
            >
              Explore
            </button>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <div className="glass-card rounded-[2rem] p-4 border border-outline-variant shadow-2xl relative overflow-hidden group">
            <img
              alt="Advanced Robotics"
              className="w-full h-[500px] object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity"
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
