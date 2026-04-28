import React, { useState } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  reviews: number;
  hours: number;
  lectures: number;
  level: string;
  price: number;
  originalPrice: number;
  badges: string[];
  image: string;
}

interface StarRatingProps {
  rating: number;
}

interface BadgePillProps {
  label: string;
}

interface CourseCardProps {
  course: Course;
}

interface FilterSectionState {
  ratings: boolean;
  videoDuration: boolean;
  topic: boolean;
  subcategory: boolean;
  level: boolean;
}

interface SectionProps {
  label: string;
  sKey: keyof FilterSectionState;
  isOpen: boolean;
  toggle: (key: keyof FilterSectionState) => void;
  children: React.ReactNode;
}

interface FilterPanelProps {
  onClose?: () => void;
  isSidebar: boolean;
}

// --- Font Setup ---
const FontStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
    .font-headline { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
);

// --- Data ---
const courses: Course[] = [
  {
    id: 1,
    title: "The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert",
    description:
      "COMPLETELY REDONE! Master SQL, Work With Complex Databases, Build Reports, and More!",
    instructor: "Colt Steele",
    rating: 4.7,
    reviews: 108267,
    hours: 18,
    lectures: 337,
    level: "Beginner",
    price: 589,
    originalPrice: 3549,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/547598_f7ed_3.jpg",
  },
  {
    id: 2,
    title: "Complete C# Unity 2D Game Development (Updated To Unity 6)",
    description:
      "Build 4 playable 2D games in Unity 6 using C#. Learn real coding skills and master game dev fundamentals.",
    instructor: "GameDev.tv Team, Rick Davidson, Ahmed Nassef",
    rating: 4.8,
    reviews: 107973,
    hours: 17.5,
    lectures: 132,
    level: "All Levels",
    price: 699,
    originalPrice: 4229,
    badges: ["Premium", "Highest Rated"],
    image: "https://img-c.udemycdn.com/course/240x135/776760_f176_10.jpg",
  },
  {
    id: 3,
    title: "Modern React with Redux",
    description:
      "Master React and Redux. Apply modern design patterns to build apps with React Router, TailwindCSS, Context, and Hooks!",
    instructor: "Stephen Grider",
    rating: 4.6,
    reviews: 89035,
    hours: 75.5,
    lectures: 693,
    level: "All Levels",
    price: 679,
    originalPrice: 4089,
    badges: ["Premium"],
    image: "https://img-c.udemycdn.com/course/240x135/705264_caa9_13.jpg",
  },
  {
    id: 4,
    title: "Beginning C++ Programming - From Beginner to Beyond",
    description:
      "Obtain Modern C++ Object-Oriented Programming (OOP) and STL skills. C++14 and C++17 covered. C++20 info see below.",
    instructor:
      "Tim Buchalka's Learn Programming Academy, Dr. Frank Mitropoulos",
    rating: 4.6,
    reviews: 80599,
    hours: 46,
    lectures: 305,
    level: "All Levels",
    price: 579,
    originalPrice: 3459,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/1371462_e07e_3.jpg",
  },
  {
    id: 5,
    title: "C# Basics for Beginners: Learn C# Fundamentals by Coding",
    description:
      "Master C# fundamentals in 6 hours - The most popular course with 50,000+ students, packed with tips and exercises!",
    instructor: "Mosh Hamedani",
    rating: 4.6,
    reviews: 79087,
    hours: 5.5,
    lectures: 87,
    level: "Beginner",
    price: 729,
    originalPrice: 4359,
    badges: ["Premium"],
    image: "https://img-c.udemycdn.com/course/240x135/822444_b49a_2.jpg",
  },
  {
    id: 6,
    title: "Docker Mastery: with Kubernetes +Swarm from a Docker Captain",
    description:
      "Build, test, deploy containers with the best mega-course on Docker, Kubernetes, Compose, GitHub Actions CI using DevOps",
    instructor: "Bret Fisher, Docker Captain Program",
    rating: 4.6,
    reviews: 66764,
    hours: 23,
    lectures: 225,
    level: "All Levels",
    price: 699,
    originalPrice: 4229,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/1035000_c1ab_8.jpg",
  },
  {
    id: 7,
    title: "Vue - The Complete Guide (incl. Router & Composition API)",
    description:
      "Vue.js is an awesome JavaScript Framework for building Frontend Applications! VueJS mixes the Best of Angular + React!",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.7,
    reviews: 66550,
    hours: 32,
    lectures: 332,
    level: "All Levels",
    price: 709,
    originalPrice: 4269,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/995016_ebf4_3.jpg",
  },
];

// --- Components ---

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < full ? "text-yellow-400" : i === full && half ? "text-yellow-400" : "text-[#3b4a44]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {i < full ? (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          ) : i === full && half ? (
            <>
              <defs>
                <clipPath id={`half-${i}`}>
                  <rect x="0" y="0" width="50%" height="100%" />
                </clipPath>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill="#3b4a44"
              />
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                clipPath={`url(#half-${i})`}
              />
            </>
          ) : (
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill="#3b4a44"
            />
          )}
        </svg>
      ))}
    </div>
  );
};

const BadgePill: React.FC<BadgePillProps> = ({ label }) => {
  const styles: Record<string, string> = {
    Premium: "bg-[#343d96] text-[#bdc2ff]",
    Bestseller: "bg-[#00e5bc] text-[#00382c]",
    "Highest Rated": "bg-[#6fffd9] text-[#00382c]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${styles[label] || "bg-[#31353c] text-[#dfe2eb]"}`}
    >
      {label === "Premium" && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {label}
    </span>
  );
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-44 md:h-28 overflow-hidden rounded">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.background = "#1c2026";
            e.currentTarget.src =
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
          {course.title}
        </h3>
        <p className="hidden md:block text-xs text-[#b9cac3] mt-1 line-clamp-2">
          {course.description}
        </p>
        <p className="text-xs text-[#b9cac3] mt-1">{course.instructor}</p>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs font-bold text-[#6fffd9]">
            {course.rating}
          </span>
          <StarRating rating={course.rating} />
          <span className="text-xs text-[#84948e]">
            ({course.reviews.toLocaleString()})
          </span>
        </div>

        <p className="text-xs text-[#84948e] mt-0.5">
          {course.hours} total hours · {course.lectures} lectures ·{" "}
          {course.level}
        </p>

        {/* Price row - mobile shows here */}
        <div className="flex items-center gap-2 mt-1 md:hidden">
          <span className="text-sm font-bold text-[#dfe2eb]">
            ₹{course.price}
          </span>
          <span className="text-xs text-[#84948e] line-through">
            ₹{course.originalPrice}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {course.badges.map((b: string) => (
            <BadgePill key={b} label={b} />
          ))}
        </div>

        {/* Add to cart - mobile */}
        <button className="mt-3 md:hidden w-full border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors">
          Add to cart
        </button>
      </div>

      {/* Price - desktop */}
      <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-24">
        <span className="text-lg font-bold text-[#dfe2eb]">
          ₹{course.price}
        </span>
        <span className="text-sm text-[#84948e] line-through">
          ₹{course.originalPrice}
        </span>
      </div>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({
  label,
  sKey,
  isOpen,
  toggle,
  children,
}) => (
  <div className="border-b border-[#3b4a44] py-3">
    <button
      onClick={() => toggle(sKey)}
      className="w-full flex items-center justify-between text-sm font-semibold text-[#dfe2eb]"
    >
      <span>{label}</span>
      <svg
        className={`w-4 h-4 text-[#84948e] transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    {isOpen && <div className="mt-3 space-y-2">{children}</div>}
  </div>
);

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, isSidebar }) => {
  const [openSections, setOpenSections] = useState<FilterSectionState>({
    ratings: true,
    videoDuration: true,
    topic: false,
    subcategory: false,
    level: false,
  });

  const toggle = (key: keyof FilterSectionState) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ratings = [
    { val: "4.5", label: "4.5 & up", count: "10,000" },
    { val: "4.0", label: "4.0 & up", count: "10,000" },
    { val: "3.5", label: "3.5 & up", count: "10,000" },
    { val: "3.0", label: "3.0 & up", count: "10,000" },
  ];
  const durations = [
    { label: "0-1 Hour", count: "3,591" },
    { label: "1-3 Hours", count: "10,000" },
    { label: "3-6 Hours", count: "9,475" },
    { label: "6-17 Hours", count: "10,000" },
  ];

  return (
    <div className={isSidebar ? "px-4 py-2" : "px-2"}>
      {isSidebar && onClose && (
        <div className="flex items-center justify-between py-3 border-b border-[#3b4a44]">
          <span className="text-sm font-semibold text-[#dfe2eb]">
            10,000 results
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#31353c] text-[#b9cac3]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <Section
        label="Ratings"
        sKey="ratings"
        isOpen={openSections.ratings}
        toggle={toggle}
      >
        {ratings.map((r) => (
          <label
            key={r.val}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="rating"
              className="accent-[#6fffd9] w-4 h-4 bg-[#1c2026] border-[#84948e]"
            />
            <div className="flex items-center gap-1">
              <StarRating rating={parseFloat(r.val)} />
              <span className="text-sm text-[#dfe2eb]">{r.label}</span>
              <span className="text-xs text-[#84948e]">({r.count})</span>
            </div>
          </label>
        ))}
        <button className="text-xs text-[#6fffd9] font-semibold hover:underline mt-1">
          Show more ∨
        </button>
      </Section>

      <Section
        label="Video Duration"
        sKey="videoDuration"
        isOpen={openSections.videoDuration}
        toggle={toggle}
      >
        {durations.map((d) => (
          <label
            key={d.label}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="accent-[#6fffd9] w-4 h-4 rounded bg-[#1c2026] border-[#84948e]"
            />
            <span className="text-sm text-[#dfe2eb]">{d.label}</span>
            <span className="text-xs text-[#84948e]">({d.count})</span>
          </label>
        ))}
        <button className="text-xs text-[#6fffd9] font-semibold hover:underline mt-1">
          Show more ∨
        </button>
      </Section>

      <Section
        label="Topic"
        sKey="topic"
        isOpen={openSections.topic}
        toggle={toggle}
      >
        <p className="text-xs text-[#84948e]">Filter options...</p>
      </Section>
      <Section
        label="Subcategory"
        sKey="subcategory"
        isOpen={openSections.subcategory}
        toggle={toggle}
      >
        <p className="text-xs text-[#84948e]">Filter options...</p>
      </Section>
      <Section
        label="Level"
        sKey="level"
        isOpen={openSections.level}
        toggle={toggle}
      >
        <p className="text-xs text-[#84948e]">Filter options...</p>
      </Section>

      {isSidebar && onClose && (
        <div className="sticky bottom-0 bg-[#1c2026] pt-3 pb-4 border-t border-[#3b4a44]">
          <button
            onClick={onClose}
            className="w-full bg-[#00e5bc] text-[#00382c] font-bold py-3 rounded text-sm hover:bg-[#6fffd9] transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};


// --- Main Page Component ---
export default function CourseListingPage() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false); // Mobile modal state
  const [desktopFilterOpen, setDesktopFilterOpen] = useState<boolean>(true); // Desktop sidebar state
  const [sortBy, setSortBy] = useState<string>("Most Popular");

  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] pb-12">
      <FontStyles />

      {/* Mobile Filter Sidebar Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-[#1c2026] shadow-2xl overflow-y-auto">
            <FilterPanel
              onClose={() => setFilterOpen(false)}
              isSidebar={true}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#dfe2eb] mb-4 font-headline">
          All courses
        </h1>

        {/* Filter + Sort bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Mobile Filter Button (Unchanged) */}
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 border border-[#84948e] text-[#dfe2eb] text-sm font-semibold px-4 py-2 rounded hover:bg-[#181c22] transition-colors lg:hidden"
          >
            <span className="material-symbols-outlined">filter_list</span>
            Filter
          </button>

          {/* Desktop Filter Button (NEW: Moved to the top row) */}
          <button
            onClick={() => setDesktopFilterOpen(!desktopFilterOpen)}
            className="hidden lg:flex items-center gap-2 border border-[#84948e] text-[#dfe2eb] text-sm font-bold px-4 py-[9px] rounded hover:bg-[#181c22] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              filter_list
            </span>
            Filter
          </button>

          {/* Sort By Dropdown */}
          <div className="flex flex-col relative">
            <label className="text-xs text-[#84948e] absolute -top-2 left-2 bg-[#10141a] px-1 font-medium z-10">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#84948e] text-sm text-[#dfe2eb] font-bold rounded px-4 py-2.5 focus:outline-none focus:border-[#6fffd9] bg-[#10141a] cursor-pointer appearance-none pr-10 relative z-0"
            >
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
            </select>
            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#84948e] z-10">
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </div>
          </div>

          <span className="ml-auto text-sm text-[#84948e] font-medium hidden sm:block">
            10,000 results
          </span>
        </div>

        {/* Main Content Area 
          Note: Changed from 'flex gap-8' to just 'flex'. 
          The gap is now handled dynamically via 'mr-8' on the aside to allow smooth width animations.
        */}
        <div className="flex overflow-hidden">
          {/* Desktop Sidebar Filters */}
          <aside
            className={`hidden lg:block flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              desktopFilterOpen ? "w-64 mr-8 opacity-100" : "w-0 mr-0 opacity-0"
            }`}
          >
            {/* Inner fixed-width div ensures content doesn't text-wrap/squish while the outer aside is shrinking */}
            <div className="w-64">
              <div className="sticky top-6">
                <FilterPanel isSidebar={false} />
              </div>
            </div>
          </aside>

          {/* Course List */}
          <main className="flex-1 min-w-0">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-10">
              {[
                { label: "‹", page: null },
                { label: "1", page: 1 },
                { label: "2", page: 2, active: true },
                { label: "3", page: 3 },
                { label: "...", page: null },
                { label: "625", page: 625 },
                { label: "›", page: null },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors
                    ${item.active ? "bg-[#00e5bc] text-[#00382c] font-bold" : "text-[#dfe2eb] font-medium hover:bg-[#1c2026]"}
                    ${!item.page ? "cursor-default text-[#84948e] hover:bg-transparent" : "cursor-pointer"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}