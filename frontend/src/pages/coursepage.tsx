import { useQuery } from "@apollo/client/react";
import  { useState } from "react";
import { GET_COURSES } from "../graphql/coursesOps";

// --- Types ---
interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  level: "Beginner" | "Intermediate" | "Advanced"; // Added level type
  duration: string; // Added duration field
}

// Course GET Response type
interface CourseGetQueryResult {
  courseGet: {
    data: Course[];
  };
}

const ENROLLMENT_LINK="https://docs.google.com/forms/d/e/1FAIpQLScmHoRcvkyw7EEZYQIX-c5F6qwwb9VuEprHzjL3vPvkRlEI1Q/viewform?fbzx=-4420388597224411814"

// --- Course Card Component ---
function CourseCard({ course, onOpen }: { course: Course; onOpen: (c: Course) => void }) {
  const normalizedLevel=(course.level.charAt(0).toUpperCase()+course.level.slice(1).toLowerCase()) as Course["level"]

  // Logic for level tag colors
  const levelStyles = {
    Beginner: "bg-[#062d24] text-[#6fffd9] border-[#6fffd9]/30",
    Intermediate: "bg-[#0a0202] text-[#bdc2ff] border-[#bdc2ff]/30",
    Advanced: "bg-[#09090b] text-red-400 border-red-500/30",
  };

  return (
    <div className="group bg-[#1c2026] rounded-[24px] overflow-hidden border border-[#262a31] transition-all duration-300 hover:-translate-y-2 hover:border-[#6fffd9] hover:shadow-[0_20px_40px_-15px_rgba(111,255,217,0.15)] flex flex-col h-full relative">
      
      {/* Level Tag Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${levelStyles[normalizedLevel]}`}>
          {course.level}
        </span>
      </div>

      <div className="h-[180px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* --- DURATION  --- */}
        <div className="flex items-center gap-1.5 mb-2 text-[#84948e] text-[10px] font-bold uppercase tracking-[0.1em]">
          <svg className="w-3.5 h-3.5 text-[#6fffd9]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {course.duration}
        </div>

        <h3 className="text-[#dfe2eb] font-['Plus_Jakarta_Sans'] text-[18px] font-bold mb-3 leading-tight line-clamp-2 group-hover:text-[#6fffd9] transition-colors">
          {course.title}
        </h3>

        <p className="text-[#b9cac3] font-['Inter'] text-[13px] leading-relaxed line-clamp-3 mb-3">
          {course.description}
        </p>
        
        <button 
          onClick={() => onOpen(course)}
          className="text-[#6fffd9] text-[12px] font-bold hover:underline mb-5 w-fit"
        >
          View Details
        </button>

        <div className="mt-auto flex justify-between items-center pt-5 border-t border-[#262a31]">
          {/* --- UPDATED PRICE COLOR LOGIC --- */}
          <span className={`text-xl font-extrabold font-['Plus_Jakarta_Sans'] ${course.price === 0 ? 'text-[#ffb800]' : 'text-[#6fffd9]'}`}>
            {course.price === 0 ? "Free" : `₹ ${course.price.toLocaleString()}`}
          </span>
          <button onClick={() => window.open(ENROLLMENT_LINK, '_blank')} className="bg-[#6fffd9] text-[#00382c] rounded-xl px-5 py-2 text-[12px] font-bold hover:bg-[#00e5bc] transition-all">
            Enroll
          </button>
        </div>
      </div>
    </div>
  
  );
}


function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-[#1c2026] border border-[#262a31] w-full max-w-xl max-h-[85vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 text-[#84948e] hover:text-[#6fffd9] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10 flex flex-col flex-1 overflow-hidden">
          {/* Level and Duration in Modal */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#6fffd9] text-[10px] font-bold uppercase tracking-[0.2em]">
              {course.level} Level
            </span>
            <span className="w-1 h-1 rounded-full bg-[#3b4a44]" />
            <span className="text-[#84948e] text-[10px] font-bold uppercase tracking-[0.2em]">
              {course.duration}
            </span>
          </div>

          <h2 className="text-[#dfe2eb] font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-extrabold mb-6 leading-tight pr-8">
            {course.title}
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <p className="text-[#b9cac3] font-['Inter'] text-[16px] leading-[1.8] mb-4">
              {course.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#262a31] pt-8">
            <div className="text-center sm:text-left">
              <span className="text-[#84948e] text-[11px] uppercase font-bold tracking-[0.15em] mb-1 block">Course Price</span>
              <span className="text-[#6fffd9] text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
                ₹ {course.price.toLocaleString()}
              </span>
            </div>
            <button onClick={()=>window.open(ENROLLMENT_LINK,'_blank')} className="w-full sm:w-auto bg-[#6fffd9] text-[#00382c] rounded-2xl px-10 py-4 font-bold hover:bg-[#00e5bc] transition-all active:scale-95">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function CoursePage() {
  const {loading,error,data}=useQuery<CourseGetQueryResult>(GET_COURSES,{
   fetchPolicy: "network-only",  // ← always fetch fresh on mount
  notifyOnNetworkStatusChange: true,
  })
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses:Course[]=data?.courseGet.data||[]
   if (loading)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
        Error: {error.message}
      </div>
    );

  return (
    <div className="bg-[#10141a] min-h-screen py-16 px-6 relative font-['Inter']">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;700&display=swap');
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b4a44; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6fffd9; }
        `}
      </style>

      <div className="max-w-[1200px] mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-[#dfe2eb] font-['Plus_Jakarta_Sans'] text-4xl md:text-5xl font-extrabold mb-4">
            Master Your <span className="text-[#6fffd9]">Future</span>
          </h2>
          <p className="text-[#b9cac3] text-lg">Premium industry-ready courses designed for success.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={(c) => setSelectedCourse(c)} />
          ))}
        </div>
      </div>

      {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
}