import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

export interface Enrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  qualification: string;
  title: string;
  transactionId: string;
  courseId: string; // Added to handle routing
}

interface RawEnrollmentData {
  course_id: string; // Added to query
  course_title: string;
  enrolled_at: number;
  transaction_id: string;
  user_email: string;
  user_firstname: string;
  user_id: string;
  user_lastname: string;
  user_phone_country_code: number;
  user_phone_number: string;
  user_qualification: string;
  user_whatsapp_country_code: number;
  user_whatsapp_number: string;
}

interface EnrollmentsResponse {
  getallEnrollments: {
    data: RawEnrollmentData[];
  };
}

interface EnrollmentTableProps {
  enrollments: Enrollment[];
}

// ==========================================
// 2. GRAPHQL QUERY
// ==========================================

const GET_ALL_ENROLLMENTS = gql`
  query getallEnrollments {
    getallEnrollments {
      data {
        course_id
        course_title
        enrolled_at
        transaction_id
        user_email
        user_firstname
        user_id
        user_lastname
        user_phone_country_code
        user_phone_number
        user_qualification
        user_whatsapp_country_code
        user_whatsapp_number
      }
    }
  }
`;

// ==========================================
// 3. TABLE COMPONENT
// ==========================================

function EnrollmentTable({ enrollments }: EnrollmentTableProps) {
  return (
    <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#181c22] border-b border-[#3b4a44]">
              {[
                "Student Info",
                "Contact Details",
                "Course Enrolled",
                "Transaction ID",
              ].map((h, i) => (
                <th
                  key={i}
                  className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3b4a44]">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-12 text-[#b9cac3]">
                  No enrollments found
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="group hover:bg-[#262a31] transition-colors"
                >
                  {/* Column 1: Name & Qualification */}
                  <td className="p-4 align-middle">
                    <div className="min-w-0">
                      <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate capitalize">
                        {enrollment.name}
                      </div>
                      <div className="text-[0.75rem] text-[#b9cac3] mt-[4px] flex items-center gap-1.5 truncate capitalize">
                        <span className="material-symbols-outlined text-[14px] text-[#84948e]">
                          school
                        </span>
                        {enrollment.qualification}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Contact Info (Email, Phone, WhatsApp) */}
                  <td className="p-4 align-middle">
                    <div className="min-w-0">
                      <div className="font-headline text-[0.875rem] text-[#dfe2eb] truncate">
                        {enrollment.email}
                      </div>
                      <div className="text-[0.75rem] text-[#b9cac3] mt-[4px] flex items-center gap-3 truncate">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-[#84948e]">
                            call
                          </span>
                          {enrollment.phone}
                        </span>

                        <span className="text-[#3b4a44]">|</span>

                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-[#6fffd9]">
                            forum
                          </span>
                          {enrollment.whatsapp}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Course Title with Redirect Icon */}
                  <td className="p-4 align-middle">
                    <a
                      href={`/course/${enrollment.courseId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#dfe2eb] hover:text-[#6fffd9] font-headline font-semibold text-[0.875rem] transition-colors group/link cursor-pointer"
                    >
                      <span className="truncate max-w-[200px]">
                        {enrollment.title}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#84948e] group-hover/link:text-[#6fffd9] transition-colors">
                        open_in_new
                      </span>
                    </a>
                  </td>

                  {/* Column 4: Transaction ID */}
                  <td className="p-4 align-middle">
                    <span className="bg-[#10141a] border border-[#3b4a44] text-[#84948e] font-mono text-[0.75rem] px-2 py-1 rounded">
                      {enrollment.transactionId}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN DASHBOARD COMPONENT (DEFAULT EXPORT)
// ==========================================

export default function EnrollmentsDashboard() {
  const { data, loading, error } = useQuery<EnrollmentsResponse>(
    GET_ALL_ENROLLMENTS,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const rawEnrollments = data?.getallEnrollments?.data || [];

  // Map the raw backend data into the clean format the Table expects
  const formattedEnrollments: Enrollment[] = rawEnrollments.map(
    (item: any) => ({
      id: item.transaction_id,
      name: `${item.user_firstname} ${item.user_lastname}`.trim(),
      email: item.user_email,
      phone: `+${item.user_phone_country_code} ${item.user_phone_number}`,
      whatsapp: `+${item.user_whatsapp_country_code} ${item.user_whatsapp_number}`,
      qualification: item.user_qualification,
      title: item.course_title,
      transactionId: item.transaction_id,
      courseId: item.course_id || item.course_title, // Fallback to title if course_id is missing
    }),
  );

  return (
    <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
      {loading ? (
        <div className="h-screen flex items-center justify-center text-[#6fffd9]">
          <span className="material-symbols-outlined animate-spin mr-2">
            autorenew
          </span>
          Loading Enrollments...
        </div>
      ) : error ? (
        <div className="h-screen flex items-center justify-center text-[#ffb4ab]">
          Error loading enrollments. Please try again.
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
                Enrollment Management
              </h1>
              <p className="text-[0.875rem] text-[#b9cac3] mt-1">
                View all students enrolled in your courses
              </p>
            </div>

            <div className="bg-[#1c2026] border border-[#3b4a44] rounded-lg px-4 py-2 flex flex-col items-end">
              <span className="text-[#84948e] text-[0.7rem] uppercase tracking-wider font-bold">
                Total Enrolled
              </span>
              <span className="text-[#6fffd9] font-black text-xl leading-none mt-1">
                {formattedEnrollments.length}
              </span>
            </div>
          </div>

          <EnrollmentTable enrollments={formattedEnrollments} />
        </div>
      )}
    </div>
  );
}
