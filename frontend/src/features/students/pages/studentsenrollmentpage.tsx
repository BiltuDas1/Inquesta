import { Link } from "react-router"; 

// Mock data: Replace this with your actual GraphQL Query data later
const enrolledCourses = [
  {
    id: "1",
    title: "Advanced React Patterns & Performance",
    instructor: "Sarah Drasner",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500&auto=format&fit=crop",
    progress: 75,
    lastAccessed: "2 days ago",
  },
  {
    id: "2",
    title: "UI/UX Design Systems in Figma",
    instructor: "Gary Simon",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500&auto=format&fit=crop",
    progress: 30,
    lastAccessed: "Just now",
  },
  {
    id: "3",
    title: "Full-Stack GraphQL with Apollo",
    instructor: "Eve Porcello",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop",
    progress: 100,
    lastAccessed: "1 week ago",
  },
];

export default function StudentEnrollmentsTablePage() {
  return (
    <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full">
      {/* Header Section */}
      <div className="mb-8 border-b border-[#3b4a44] pb-6">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb] mb-2">
          My Enrollments
        </h1>
        <p className="text-[#b9cac3] text-sm">
          Pick up right where you left off. You are enrolled in {enrolledCourses.length} courses.
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-[#1c2026] rounded-2xl border border-[#3b4a44] overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#181c22] border-b border-[#3b4a44]">
                <th className="py-4 px-6 text-[#b9cac3] font-headline text-xs font-semibold uppercase tracking-wider">
                  Course
                </th>
                <th className="py-4 px-6 text-[#b9cac3] font-headline text-xs font-semibold uppercase tracking-wider">
                  Instructor
                </th>
                <th className="py-4 px-6 text-[#b9cac3] font-headline text-xs font-semibold uppercase tracking-wider">
                  Last Accessed
                </th>
                <th className="py-4 px-6 text-[#b9cac3] font-headline text-xs font-semibold uppercase tracking-wider">
                  Progress
                </th>
                <th className="py-4 px-6 text-right text-[#b9cac3] font-headline text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-[#3b4a44]">
              {enrolledCourses.map((course) => (
                <tr 
                  key={course.id} 
                  className="hover:bg-[#262a31]/50 transition-colors duration-200 group"
                >
                  {/* Course Thumbnail & Title */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-12 h-12 rounded-lg object-cover border border-[#3b4a44]" 
                      />
                      <span className="text-[#dfe2eb] font-headline font-semibold text-sm sm:text-base group-hover:text-[#6fffd9] transition-colors line-clamp-1">
                        {course.title}
                      </span>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="py-4 px-6 text-[#84948e] text-sm font-medium">
                    {course.instructor}
                  </td>

                  {/* Last Accessed */}
                  <td className="py-4 px-6 text-[#84948e] text-sm">
                    {course.lastAccessed}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[#b9cac3] text-xs font-medium w-10">
                        {course.progress}%
                      </span>
                      <div className="w-24 h-1.5 bg-[#181c22] rounded-full overflow-hidden border border-[#3b4a44]/50">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${course.progress}%`,
                            backgroundColor: course.progress === 100 ? "#00e5bc" : "#6fffd9",
                            boxShadow: course.progress > 0 ? "0 0 8px rgba(111,255,217,0.3)" : "none"
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/students/learn/${course.id}`}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                        course.progress === 100
                          ? "bg-[#262a31] text-[#dfe2eb] hover:bg-[#31353c] border border-[#3b4a44]"
                          : "bg-[#6fffd9] text-[#00382c] hover:bg-[#00e5bc]"
                      }`}
                    >
                      {course.progress === 100 ? (
                        <>
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          Review
                        </>
                      ) : course.progress === 0 ? (
                        <>
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                          Start
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">continue</span>
                          Continue
                        </>
                      )}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}