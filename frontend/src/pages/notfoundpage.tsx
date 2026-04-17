import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background font-body antialiased px-6 lg:px-12">
      
      {/* 1. Homepage Background Elements (Grid & Glows) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-outline-variant) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-container/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* 2. Main Content Layout (Side-by-Side) */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Text & Call to Action */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1 space-y-6">
          <h1 className="text-8xl md:text-9xl font-headline font-extrabold text-on-surface tracking-tighter drop-shadow-md">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary uppercase tracking-widest">
            Page Not Found
          </h2>
          
          <p className="text-base md:text-lg text-on-surface-variant max-w-md font-body leading-relaxed">
            The page you're looking for isn't available. Try to search again or use the go back button below.
          </p>
          
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-on-primary rounded-full font-headline font-bold text-base transition-transform hover:scale-105 hover:shadow-[0_0_25px_rgba(111,255,217,0.3)] glow-hover"
            >
              Go back home
            </Link>
          </div>
        </div>

        {/* Right Column: Visual / Illustration */}
        <div className="flex justify-center items-center order-1 lg:order-2 relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
          
          <img src="/assets/empty.jpg" alt="404 Illustration" className="w-full max-w-md object-contain animate-float" /> 
          {/* NOTE: If you have the image from your screenshot (like a PNG), you can replace this entire div below with:
          */}

        </div>
      </div>
    </main>
  );
}