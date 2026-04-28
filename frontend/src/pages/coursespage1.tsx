import Navbar from "../components/layout/navbar";
import CourseListingPage from "../components/layout/courselistingpage";
import { Footer } from "../components/layout/footer";

export const CoursesPage1 = () => {
  return (
    <>
      <Navbar></Navbar>
      <CourseListingPage></CourseListingPage>
      <Footer></Footer>
    </>
  );
};
