import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import DashboardPage from "./features/admin1/courses/coursespage";
import ProtectedRoute from "./shared/routes/protectedroute";
import PublicRoute from "./shared/routes/publicroute";
import NotFoundPage from "./shared/pages/notfoundpage";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { client } from "./providers/apolloclient";
import UserDataCollectionForm from "./features/students/pages/userdatacollectionform";
import OnboardingRoute from "./shared/routes/onboardingroute";
import EnrollmentsDashboard from "./components/admin/students/enrollmenttable";
import CourseListingPage from "./features/courses/pages/courselistingpage";
import CoursesLayout from "./layouts/courseslayout";
import CourseDetails from "./features/courses/pages/coursedetails";
import LoginPage from "./features/auth/pages/loginpage";
import SignupPage from "./features/auth/pages/signuppage";
import GoogleLogin from "./features/auth/pages/googleloginpage";
import VerifyEmailPage from "./features/auth/pages/verifyemailpage";
import CheckEmailPage from "./features/auth/pages/checkemailpage";
import DashboardLayout from "./components/admin/layout/adminlayout";
import StudentsDashboardLayout from "./layouts/studentsdashboardlayout";
import StudentEnrollmentsPage from "./features/students/pages/studentenrollmentpage";
import StudentDashboardPage from "./features/students/pages/studentdashboardpage";
import ParentDashboardLayout from "./components/parent/layout/parentdashboardlayout";
import NoticePage from "./features/admin1/setting/notice/noticepage";
import ContactPage from "./shared/pages/contactpage";
import HomePageLayout from "./layouts/homepagelayout";
import AboutPage from "./shared/pages/aboutpage";
import { HeroSectionSettings } from "./features/admin1/setting/herosection/herosectionsettingpage";
import CourseCartPage from "./features/courses/pages/coursecartpage";
import SchedulePage from "./features/students/schedule/pages/schedulepage";
import AssignmentsPage from "./features/students/assignment/pages/assignmentspage";
import GradesPage from "./features/students/grades/pages/gradespages";
import StudentAttendancePage from "./features/students/attendance/attendancepage";
import NotificationsPage from "./shared/pages/notificationspage";
import NotificationDetailPage from "./shared/pages/notificationdetailpage";
import StudentCourseReportPage from "./features/students/pages/coursereportpage";
import DashboardOverview from "./features/parent/dashboard/dashboardoverview";
import ReportsPage from "./features/parent/reports/reportspage";
import FeesPage from "./features/parent/fees/feespage";
import AttendancePage from "./features/parent/attendance/attendancepage";
import MessagesPage from "./features/parent/message/messagesPage";
import TeachersDashboardLayout from "./components/teacher/layout/teachersdashboardlayout";
import TeacherDashboard from "./features/teacher/myclass/teacherdashboard";
import TeacherAssignmentsPage from "./features/teacher/assignments/assignmentspage";
import CurriculumPage from "./features/teacher/curriculum/curriculumpage";
import TimetablePage from "./features/teacher/timetable/timetablepage";
import TeacherAttendancePage from "./features/teacher/attendance/attendancepage";
import AdminDashboardPage from "./features/admin1/dashboard/admindashboardpage";
import ApprovalsPage from "./features/admin1/approvals/approvalspage";
import OrganisationReportsPage from "./features/admin1/reports/reportspage";
import TeacherRegistration from "./features/admin1/teacher-registration/teacherregistration";
import TeacherOnboarding from "./components/teacher/onboarding/teacheronboarding";
import { seoRoutes } from "./shared/svg/utils/helper";


const GlobalSessionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSessionExpired = async () => {
      await client.clearStore();

      // Check if trying to access ANY protected portal
      const protectedPaths = [
        "/admin",
        "/teacher",
        "/student",
        "/dashboard",
        "/parent",
      ];
      const isProtected = protectedPaths.some((path) =>
        location.pathname.startsWith(path),
      );

      if (isProtected) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, [navigate, location]);

  return null;
};
function App() {
  return (
    <>
      {/* For toast message */}
      <Toaster position="top-right"></Toaster>

      <GlobalSessionHandler />
      <Routes>
        {/*  PUBLIC ROUTES (No auth needed) */}
        <Route path="/" element={<HomePageLayout />}>
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        <Route element={<CoursesLayout />}>
          <Route path="/courses" element={<CourseListingPage />} />
          <Route path="/course/:slug" element={<CourseDetails />} />
          <Route path="/cart" element={<CourseCartPage />} />
        </Route>

        {/* 2. AUTH ROUTES (Blocked if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/auth/google" element={<GoogleLogin />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
          <Route path="/email/verify" element={<VerifyEmailPage />} />
        </Route>

        {/* 3. ONBOARDING ROUTE */}
        <Route element={<OnboardingRoute />}>
          <Route path="/onboard" element={<UserDataCollectionForm />} />
        </Route>

      <Route path="onboard-teacher/details/:teacherId" element={<TeacherOnboarding />} />
        {/* =========================================
             STUDENT DASHBOARD
             Base URL: /students
        ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["user", "student"]} />}>
          <Route path="/students" element={<StudentsDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* The actual dashboard page */}
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="courses" element={<StudentEnrollmentsPage />} />

            {/* Coming Soon pages */}
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="schedule" element={<SchedulePage></SchedulePage>} />
            <Route
              path="assignments"
              element={<AssignmentsPage></AssignmentsPage>}
            />
            <Route path="grades" element={<GradesPage></GradesPage>} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="notifications/:id" element={<NotificationDetailPage />} />
            <Route path="course-report" element={<StudentCourseReportPage />} />
            <Route
              path="resources"
              element={
                <div>
                  This feature is currently under development. Check back soon!
                </div>
              }
            />
          </Route>
        </Route>

        {/* =========================================
                      PARENT DASHBOARD
                      Base URL: /parent
          ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
          <Route path="/parent" element={<ParentDashboardLayout />}>
            {/* Default redirect to dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Main dashboard for multiple children */}
            <Route
              path="dashboard"
              element={<DashboardOverview></DashboardOverview>}
            />
            <Route path="reports" element={<ReportsPage></ReportsPage>} />
            <Route path="fees" element={<FeesPage></FeesPage>} />
            <Route
              path="attendance"
              element={<AttendancePage></AttendancePage>}
            />

            <Route path="messages" element={<MessagesPage></MessagesPage>} />
          </Route>
        </Route>

        {/* =========================================
                      PARENT DASHBOARD
                      Base URL: /teacher
          ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<TeachersDashboardLayout />}>
            {/* Default redirect to dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard"
              element={<TeacherDashboard></TeacherDashboard>}
            />
            <Route
              path="assignments"
              element={<TeacherAssignmentsPage></TeacherAssignmentsPage>}
            />
            <Route
              path="curriculum"
              element={<CurriculumPage></CurriculumPage>}
            />

            <Route path="timetable" element={<TimetablePage></TimetablePage>} />
            <Route
              path="attendance"
              element={<TeacherAttendancePage></TeacherAttendancePage>}
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="notifications/:id" element={<NotificationDetailPage />} />
          </Route>
        </Route>

        {/* =========================================
             ADMIN PROTECTED ROUTES
             Base URL: /admin
        ========================================= */}
        {/* Added ['admin'] to strictly protect this wrapper */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            {/* Auto-redirects /admin to /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* The actual dashboard page */}
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="courses" element={<DashboardPage />} />
            <Route path="students" element={<EnrollmentsDashboard />} />

            <Route
              path="teacher-registration"
              element={
              <TeacherRegistration></TeacherRegistration>
              }
            />

            <Route path="approvals" element={<ApprovalsPage></ApprovalsPage>} />

            <Route
              path="reports"
              element={<OrganisationReportsPage></OrganisationReportsPage>}
            />

            <Route path="settings">
              <Route index element={<Navigate to="notice" replace />} />
              <Route path="notice" element={<NoticePage />} />
              <Route
                path="hero-section"
                element={<HeroSectionSettings></HeroSectionSettings>}
              />
            </Route>
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="notifications/:id" element={<NotificationDetailPage />} />
          </Route>
        </Route>

        {/* 5. CATCH-ALL */}
        {seoRoutes}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;
