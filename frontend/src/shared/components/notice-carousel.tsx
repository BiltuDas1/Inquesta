// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";

// // Sample Data for the Carousel
// const carouselSlides = [
//   {
//     id: 1,
//     image:
//       "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
//     badge: "Trending",
//     title: "Embedded Systems Engineering",
//     desc: "Deep dive into real-time operating systems (RTOS) and the architecture of power-efficient microcontroller units for industrial applications.",
//   },
//   {
//     id: 2,
//     image:
//       "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200",
//     badge: "Advanced",
//     title: "Neural Networks with TensorFlow",
//     desc: "Build predictive models from the ground up for edge computing environments and automated systems.",
//   },
//   {
//     id: 3,
//     image:
//       "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
//     badge: "Beginner Friendly",
//     title: "Robotics & Kinematics Foundations",
//     desc: "Hands-on introduction to sensor integration, actuator control, and autonomous pathfinding.",
//   },
// ];

// export function CourseCarousel() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();

//   // Carousel Auto-play logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === carouselSlides.length - 1 ? 0 : prev + 1,
//       );
//     }, 5000); // Slides every 5 seconds

//     return () => clearInterval(timer); // Cleanup on unmount
//   }, []);

//   // Carousel Navigation Handlers
//   const nextSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === carouselSlides.length - 1 ? 0 : prev + 1,
//     );
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === 0 ? carouselSlides.length - 1 : prev - 1,
//     );
//   };

//   return (
//     <section className="py-20 px-8 relative z-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">
//               Featured Programs
//             </h2>
//             <p className="text-on-surface-variant text-lg">
//               Explore our most popular next-generation modules.
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/courses")}
//             className="flex items-center space-x-2 text-primary font-bold hover:opacity-80 transition-opacity"
//           >
//             <span>View All Modules</span>
//             <span className="material-symbols-outlined">chevron_right</span>
//           </button>
//         </div>

//         {/* Carousel Container */}
//         <div className="relative group rounded-[2rem] overflow-hidden border border-outline-variant bg-surface-container shadow-2xl h-[400px] w-full">
//           {/* Inner Slides Wrapper */}
//           <div
//             className="flex w-full h-full transition-transform duration-700 ease-in-out"
//             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//           >
//             {carouselSlides.map((slide) => (
//               <div
//                 key={slide.id}
//                 className="min-w-full h-full relative flex-shrink-0"
//               >
//                 <img
//                   src={slide.image}
//                   alt={slide.title}
//                   className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

//                 {/* Slide Content */}
//                 <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4">
//                   <span className="bg-primary text-on-primary px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider mb-6 inline-block">
//                     {slide.badge}
//                   </span>
//                   <h3 className="text-3xl md:text-5xl font-headline font-bold mb-4 leading-tight text-white shadow-black">
//                     {slide.title}
//                   </h3>
//                   <p className="text-on-surface-variant text-base md:text-xl max-w-2xl line-clamp-3 md:line-clamp-none">
//                     {slide.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Navigation Arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-on-primary hover:border-primary active:scale-90"
//           >
//             <span className="material-symbols-outlined">chevron_left</span>
//           </button>

//           <button
//             onClick={nextSlide}
//             className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-on-primary hover:border-primary active:scale-90"
//           >
//             <span className="material-symbols-outlined">chevron_right</span>
//           </button>

//           {/* Pagination Dots */}
//           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
//             {carouselSlides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`h-2.5 rounded-full transition-all duration-300 ${
//                   currentSlide === index
//                     ? "w-8 bg-primary"
//                     : "w-2.5 bg-outline-variant hover:bg-primary/50"
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// --- 1. GraphQL Query ---
// Adjust the field names inside 'data' if your backend uses different names!
const GET_NOTICES = gql`
  query getNotices {
    getNotices {
      data {
        badge
        description
        id
        imagePath
        isActive
        title
      }
    }
  }
`;

// Define the shape of the Notice data
interface Notice {
  id: string | number;
  imagePath: string;
  badge: string;
  title: string;
  description: string;
}

interface GetNoticesResponse {
  getNotices: {
    success: boolean;
    message: string;
    data: Notice[];
  };
}

export function CourseCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // --- 2. Fetch Data ---
  const { data, loading, error } = useQuery<GetNoticesResponse>(GET_NOTICES, {
    fetchPolicy: "cache-and-network",
  });

  // Extract the array of notices, defaulting to an empty array if loading fails
  const carouselSlides = data?.getNotices?.data || [];

  // --- 3. Carousel Auto-play logic ---
  useEffect(() => {
    // Only run the timer if we actually have slides to show
    if (carouselSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselSlides.length - 1 ? 0 : prev + 1,
      );
    }, 5000); // Slides every 5 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, [carouselSlides.length]); // Re-run effect if the number of slides changes

  // --- 4. Carousel Navigation Handlers ---
  const nextSlide = () => {
    if (carouselSlides.length <= 1) return;
    setCurrentSlide((prev) =>
      prev === carouselSlides.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    if (carouselSlides.length <= 1) return;
    setCurrentSlide((prev) =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1,
    );
  };

  // --- 5. Loading / Error States ---
  if (loading) {
    return (
      <section className="py-20 px-8 relative z-10 flex justify-center">
        <div className="animate-pulse bg-surface-container w-full max-w-7xl h-[400px] rounded-[2rem]"></div>
      </section>
    );
  }

  if (error || carouselSlides.length === 0) {
    console.log(error);
    return null; // Or return a fallback UI if there are no notices to display
  }

  return (
    <section className="py-20 px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">
              Featured Programs
            </h2>
            <p className="text-on-surface-variant text-lg">
              Explore our most popular next-generation modules.
            </p>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center space-x-2 text-primary font-bold hover:opacity-80 transition-opacity"
          >
            <span>View All Modules</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative group rounded-[2rem] overflow-hidden border border-outline-variant bg-surface-container shadow-2xl h-[400px] w-full">
          {/* Inner Slides Wrapper */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide) => (
              <div
                key={slide.id}
                className="min-w-full h-full relative flex-shrink-0"
              >
                <img
                  src={slide.imagePath}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                {/* Slide Content */}
                <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4">
                  {/* Only show badge if it exists in the DB */}
                  {slide.badge && (
                    <span className="bg-primary text-on-primary px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider mb-6 inline-block">
                      {slide.badge}
                    </span>
                  )}
                  <h3 className="text-3xl md:text-5xl font-headline font-bold mb-4 leading-tight text-white shadow-black">
                    {slide.title}
                  </h3>
                  <p className="text-on-surface-variant text-base md:text-xl max-w-2xl line-clamp-3 md:line-clamp-none">
                    {slide.description}
                    {/* {slide.image} */}
                  </p>
                  {/* <p>{slide.image}</p> */}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Only show if more than 1 slide) */}
          {carouselSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-on-primary hover:border-primary active:scale-90"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-on-primary hover:border-primary active:scale-90"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </>
          )}

          {/* Pagination Dots (Only show if more than 1 slide) */}
          {carouselSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-outline-variant hover:bg-primary/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
