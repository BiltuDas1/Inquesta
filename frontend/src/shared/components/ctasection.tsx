import { useNavigate } from "react-router";

export function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-8">
      <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8 tracking-tight">
          Ready to build the future?
        </h2>
        <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">
          Join the next cohort of engineers mastering the intersection of AI and
          physical systems.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold text-xl glow-hover transition-all active:scale-95"
          >
            Start Your Journey
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="border border-outline-variant text-on-surface font-bold text-xl px-10 py-5 hover:bg-surface-container rounded-full transition-all"
          >
            Talk to an Advisor
          </button>
        </div>
      </div>
    </section>
  );
}
