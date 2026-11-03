import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CourseDetails from "./pages/CourseDetails";
import CourseEnquiry from "./pages/CourseEnquiry";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminLayout from "./components/admin/AdminLayout";
import Gallery from "./pages/Gallery";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/course-details"
          element={<CourseDetails />}
        />

        <Route
          path="/course-enquiry"
          element={<CourseEnquiry />}
        />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="gallery" element={<AdminGallery />} />
        </Route>
         <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;