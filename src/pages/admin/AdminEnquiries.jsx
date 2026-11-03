import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminEnquiries.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function AdminEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigate("/admin/login", { replace: true });
      return;
    }

    fetchEnquiries();
  }, [navigate]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/enquiries`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load enquiries");
      }

      setEnquiries(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/enquiries/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setEnquiries((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setSelectedEnquiry(null);
    } catch (err) {
      console.error(err);
      alert("Unable to delete enquiry.");
    }
  };

  const filteredEnquiries = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return enquiries;

    return enquiries.filter((item) =>
      [
        item.name,
        item.phone,
        item.email,
        item.course,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [enquiries, search]);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-enquiries-page">

      {/* SIDEBAR */}
      <aside className="enquiry-sidebar">

        <div className="enquiry-brand">
          <div className="enquiry-logo">E</div>

          <div>
            <h2>EduNova</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="enquiry-nav">

          <button
            onClick={() => navigate("/admin/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/courses")}
          >
            <span>📚</span>
            Courses
          </button>

          <button className="active">
            <span>📩</span>
            Enquiries
          </button>

          <button
            onClick={() => navigate("/admin/faculty")}
          >
            <span>👨‍🏫</span>
            Faculty
          </button>

          <button
            onClick={() => navigate("/admin/notices")}
          >
            <span>📢</span>
            Notices
          </button>

          <button
            onClick={() => navigate("/admin/gallery")}
          >
            <span>🖼️</span>
            Gallery
          </button>

        </nav>

        <div className="enquiry-sidebar-bottom">

          <button onClick={() => navigate("/")}>
            <span>🌐</span>
            View Website
          </button>

          <button
            className="logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="enquiry-main">

        {/* HEADER */}
        <header className="enquiry-header">

          <div>
            <p>STUDENT MANAGEMENT</p>
            <h1>Enquiries</h1>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchEnquiries}
          >
            ↻ Refresh
          </button>

        </header>

        <section className="enquiry-content">

          {/* TOP STATS */}
          <div className="enquiry-stats">

            <div className="enquiry-stat">
              <div className="enquiry-stat-icon purple">
                📩
              </div>

              <div>
                <span>Total Enquiries</span>
                <strong>{enquiries.length}</strong>
              </div>
            </div>

            <div className="enquiry-stat">
              <div className="enquiry-stat-icon blue">
                🔎
              </div>

              <div>
                <span>Search Results</span>
                <strong>
                  {filteredEnquiries.length}
                </strong>
              </div>
            </div>

            <div className="enquiry-stat">
              <div className="enquiry-stat-icon green">
                🆕
              </div>

              <div>
                <span>Latest Enquiry</span>
                <strong>
                  {enquiries.length > 0 ? "New" : "—"}
                </strong>
              </div>
            </div>

          </div>

          {/* TABLE CARD */}
          <div className="enquiry-card">

            <div className="enquiry-card-top">

              <div>
                <span>ALL SUBMISSIONS</span>
                <h2>Student Enquiries</h2>
              </div>

              <div className="enquiry-search">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search name, phone, email or course..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}
              </div>

            </div>

            {error && (
              <div className="enquiry-error">
                ⚠ {error}
              </div>
            )}

            {loading ? (
              <div className="enquiry-empty">
                <div className="loading-circle" />
                <p>Loading enquiries...</p>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="enquiry-empty">

                <div className="empty-icon">
                  📭
                </div>

                <h3>
                  {search
                    ? "No matching enquiries"
                    : "No enquiries yet"}
                </h3>

                <p>
                  {search
                    ? "Try another search term."
                    : "New student enquiries will appear here."}
                </p>

              </div>
            ) : (
              <div className="enquiry-table-wrapper">

                <table className="enquiry-table">

                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Contact</th>
                      <th>Course</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredEnquiries.map((item) => (

                      <tr key={item.id}>

                        <td>
                          <div className="enquiry-student">

                            <div className="student-avatar">
                              {item.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>

                            <div>
                              <strong>
                                {item.name || "Unknown"}
                              </strong>

                              <small>
                                #{item.id}
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          <div className="contact-info">

                            <span>
                              📱 {item.phone || "—"}
                            </span>

                            <span>
                              ✉ {item.email || "—"}
                            </span>

                          </div>
                        </td>

                        <td>
                          <span className="course-tag">
                            {item.course ||
                              "General Enquiry"}
                          </span>
                        </td>

                        <td>
                          <div className="message-preview">
                            {item.message
                              ? item.message.length > 55
                                ? `${item.message.substring(
                                    0,
                                    55
                                  )}...`
                                : item.message
                              : "No message"}
                          </div>
                        </td>

                        <td>
                          <span className="date-text">
                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}
                          </span>
                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="view-btn"
                              title="View enquiry"
                              onClick={() =>
                                setSelectedEnquiry(item)
                              }
                            >
                              👁
                            </button>

                            <button
                              className="delete-btn"
                              title="Delete enquiry"
                              onClick={() =>
                                deleteEnquiry(item.id)
                              }
                            >
                              🗑
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          <footer className="enquiry-footer">
            <span>EduNova Admin Panel</span>
            <span>© 2026 Tushar Chauhan</span>
          </footer>

        </section>

      </main>

      {/* DETAILS MODAL */}
      {selectedEnquiry && (

        <div
          className="enquiry-modal-overlay"
          onClick={() => setSelectedEnquiry(null)}
        >

          <div
            className="enquiry-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <span>ENQUIRY DETAILS</span>
                <h2>Student Information</h2>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
              >
                ×
              </button>

            </div>

            <div className="modal-student">

              <div className="modal-avatar">
                {selectedEnquiry.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </div>

              <div>
                <h3>{selectedEnquiry.name}</h3>
                <span>
                  Enquiry #{selectedEnquiry.id}
                </span>
              </div>

            </div>

            <div className="modal-info-grid">

              <div>
                <label>Phone</label>
                <p>
                  {selectedEnquiry.phone || "Not provided"}
                </p>
              </div>

              <div>
                <label>Email</label>
                <p>
                  {selectedEnquiry.email || "Not provided"}
                </p>
              </div>

              <div>
                <label>Course</label>
                <p>
                  {selectedEnquiry.course ||
                    "General Enquiry"}
                </p>
              </div>

              <div>
                <label>Date</label>
                <p>
                  {selectedEnquiry.created_at
                    ? new Date(
                        selectedEnquiry.created_at
                      ).toLocaleString("en-IN")
                    : "Not available"}
                </p>
              </div>

            </div>

            <div className="modal-message">

              <label>Message</label>

              <p>
                {selectedEnquiry.message ||
                  "No message provided."}
              </p>

            </div>

            <div className="modal-actions">

              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
              >
                Close
              </button>

              <button
                className="modal-delete-btn"
                onClick={() =>
                  deleteEnquiry(selectedEnquiry.id)
                }
              >
                🗑 Delete Enquiry
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminEnquiries;