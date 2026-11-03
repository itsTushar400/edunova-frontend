import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const closeMobile = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${
          mobileOpen ? "admin-sidebar-open" : ""
        }`}
      >

        {/* LOGO */}
        <div className="admin-sidebar-logo">

          <div className="admin-logo-box">
            E
          </div>

          <div className="admin-logo-content">
            <h2>EduNova</h2>
            <span>ADMIN PANEL</span>
          </div>

          {/* MOBILE CLOSE */}
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>

        </div>


        {/* NAVIGATION */}
        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin/dashboard"
            onClick={closeMobile}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">▦</span>
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/admin/courses"
            onClick={closeMobile}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">📚</span>
            <span>Courses</span>
          </NavLink>


          <NavLink
            to="/admin/enquiries"
            onClick={closeMobile}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">📩</span>
            <span>Enquiries</span>
          </NavLink>


          <NavLink
            to="/admin/faculty"
            onClick={closeMobile}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">🧑‍🏫</span>
            <span>Faculty</span>
          </NavLink>


          <NavLink
            to="/admin/notices"
            onClick={closeMobile}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">📢</span>
            <span>Notices</span>
          </NavLink>


          <NavLink
            to="/admin/gallery"
            onClick={closeMobile}
            className={({ isActive }) =>
              `admin-sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">🖼️</span>
            <span>Gallery</span>
          </NavLink>

        </nav>


        {/* BOTTOM */}
        <div className="admin-sidebar-bottom">

          <a
            href="/"
            className="admin-sidebar-link"
            onClick={closeMobile}
          >
            <span className="sidebar-icon">🌐</span>
            <span>View Website</span>
          </a>


          <button
            className="admin-sidebar-link logout-link"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;