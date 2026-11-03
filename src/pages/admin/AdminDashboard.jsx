import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminDashboard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    courses: 0,
    enquiries: 0,
    faculty: 0,
    notices: 0,
  });

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin/login", { replace: true });
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [coursesRes, enquiriesRes] = await Promise.all([
        fetch(`${API_URL}/api/courses`),
        fetch(`${API_URL}/api/enquiries`),
      ]);

      const coursesData = await coursesRes.json();
      const enquiriesData = await enquiriesRes.json();

      const courses = coursesData?.data || [];
      const enquiryList = enquiriesData?.data || [];

      setStats({
        courses: courses.length,
        enquiries: enquiryList.length,
        faculty: 4,
        notices: 0,
      });

      setEnquiries(enquiryList.slice(0, 6));
    } catch (error) {
      console.error("Dashboard Error:", error);

      setStats({
        courses: 0,
        enquiries: 0,
        faculty: 4,
        notices: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-dashboard-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <div className="admin-logo-box">E</div>

          <div>
            <h2>EduNova</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button className="admin-nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/courses")}
          >
            <span>📚</span>
            Courses
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/enquiries")}
          >
            <span>📩</span>
            Enquiries
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/faculty")}
          >
            <span>👨‍🏫</span>
            Faculty
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/notices")}
          >
            <span>📢</span>
            Notices
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/gallery")}
          >
            <span>🖼️</span>
            Gallery
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <button
            className="admin-nav-item website-btn"
            onClick={() => navigate("/")}
          >
            <span>🌐</span>
            View Website
          </button>

          <button
            className="admin-nav-item logout-btn"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-topbar">

          <div>
            <p className="admin-welcome">WELCOME BACK 👋</p>
            <h1>Admin Dashboard</h1>
          </div>

          <div className="admin-profile">

            <div className="admin-profile-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Super Admin</span>
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <section className="admin-content">

          {/* STATS */}
          <div className="admin-stats-grid">

            <div className="admin-stat-card purple">
              <div className="admin-stat-icon">📚</div>

              <div>
                <span>Total Courses</span>
                <strong>
                  {loading ? "—" : stats.courses}
                </strong>
              </div>

              <small>Active courses</small>
            </div>

            <div className="admin-stat-card blue">
              <div className="admin-stat-icon">📩</div>

              <div>
                <span>Total Enquiries</span>
                <strong>
                  {loading ? "—" : stats.enquiries}
                </strong>
              </div>

              <small>Student enquiries</small>
            </div>

            <div className="admin-stat-card green">
              <div className="admin-stat-icon">👨‍🏫</div>

              <div>
                <span>Faculty Members</span>
                <strong>{stats.faculty}</strong>
              </div>

              <small>Teaching staff</small>
            </div>

            <div className="admin-stat-card orange">
              <div className="admin-stat-icon">📢</div>

              <div>
                <span>Total Notices</span>
                <strong>{stats.notices}</strong>
              </div>

              <small>Published notices</small>
            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="admin-section-heading">
            <div>
              <span>MANAGEMENT</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-quick-grid">

            <button
              onClick={() => navigate("/admin/courses")}
              className="admin-quick-card"
            >
              <div className="quick-icon purple-bg">📚</div>
              <div>
                <strong>Manage Courses</strong>
                <span>Add, edit or delete courses</span>
              </div>
              <b>→</b>
            </button>

            <button
              onClick={() => navigate("/admin/enquiries")}
              className="admin-quick-card"
            >
              <div className="quick-icon blue-bg">📩</div>
              <div>
                <strong>View Enquiries</strong>
                <span>Check student enquiries</span>
              </div>
              <b>→</b>
            </button>

            <button
              onClick={() => navigate("/admin/faculty")}
              className="admin-quick-card"
            >
              <div className="quick-icon green-bg">👨‍🏫</div>
              <div>
                <strong>Manage Faculty</strong>
                <span>Manage teaching staff</span>
              </div>
              <b>→</b>
            </button>

            <button
              onClick={() => navigate("/admin/notices")}
              className="admin-quick-card"
            >
              <div className="quick-icon orange-bg">📢</div>
              <div>
                <strong>Manage Notices</strong>
                <span>Publish institute notices</span>
              </div>
              <b>→</b>
            </button>

          </div>

          {/* RECENT ENQUIRIES */}
          <div className="admin-section-heading enquiries-heading">

            <div>
              <span>STUDENT ACTIVITY</span>
              <h2>Recent Enquiries</h2>
            </div>

            <button
              onClick={() => navigate("/admin/enquiries")}
              className="view-all-btn"
            >
              View All →
            </button>

          </div>

          <div className="admin-table-card">

            {loading ? (
              <div className="admin-empty">
                Loading enquiries...
              </div>
            ) : enquiries.length === 0 ? (
              <div className="admin-empty">
                <div>📭</div>
                <h3>No enquiries yet</h3>
                <p>
                  Student enquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Phone</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {enquiries.map((item) => (
                      <tr key={item.id}>

                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {item.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>

                            <div>
                              <strong>{item.name}</strong>
                              <span>
                                {item.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {item.phone || "—"}
                        </td>

                        <td>
                          <span className="course-pill">
                            {item.course || "General Enquiry"}
                          </span>
                        </td>

                        <td>
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString("en-IN")
                            : "—"}
                        </td>

                        <td>
                          <span className="status-badge">
                            New
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="admin-footer">
            <span>EduNova Admin Panel</span>
            <span>© 2026 Tushar Chauhan</span>
          </footer>

        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;