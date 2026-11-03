
import { useCallback, useEffect, useState } from "react";
import "../../styles/admin/AdminNotices.css";

const API_URL = "http://localhost:5000/api/notices";

const emptyForm = {
  title: "",
  category: "General",
  date: "",
  description: "",
  status: "Published",
};

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadNotices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load notices");
      }

      setNotices(
        data.notices.map((notice) => ({
          ...notice,
          date: notice.notice_date
            ? String(notice.notice_date).slice(0, 10)
            : "",
          status: notice.status || "Draft",
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Notices load nahi hue. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const filteredNotices = notices.filter((notice) =>
    `${notice.title} ${notice.category} ${notice.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingNotice(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title || "",
      category: notice.category || "General",
      date: notice.date || "",
      description: notice.description || "",
      status: notice.status || "Draft",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNotice(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill in the title and description.");
      return;
    }

    try {
      setSaving(true);

      const url = editingNotice
        ? `${API_URL}/${editingNotice.id}`
        : API_URL;

      const response = await fetch(url, {
        method: editingNotice ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save notice");
      }

      closeModal();
      await loadNotices();
      alert(editingNotice ? "Notice updated successfully!" : "Notice saved successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Notice save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete notice");
      }

      await loadNotices();
      alert("Notice deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Notice delete nahi hua.");
    }
  };

  const toggleStatus = async (notice) => {
    const nextStatus =
      notice.status === "Published" ? "Draft" : "Published";

    try {
      const response = await fetch(`${API_URL}/${notice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: notice.title,
          description: notice.description || "",
          category: notice.category || "General",
          date: notice.date || "",
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update status");
      }

      await loadNotices();
    } catch (error) {
      console.error(error);
      alert(error.message || "Notice status update nahi hua.");
    }
  };

  return (
    <div className="admin-notices-page">
      <div className="notices-header">
        <div>
          <div className="breadcrumb">
            Admin <span>/</span> Notices
          </div>
          <h1>Notice Management</h1>
          <p>Create, manage and publish important institute notices.</p>
        </div>

        <button className="add-notice-btn" onClick={openAddModal}>
          <span>+</span> Add Notice
        </button>
      </div>

      <div className="notice-stats">
        <div className="notice-stat-card">
          <div className="notice-stat-icon blue">📢</div>
          <div>
            <h3>{notices.length}</h3>
            <p>Total Notices</p>
          </div>
        </div>

        <div className="notice-stat-card">
          <div className="notice-stat-icon green">✓</div>
          <div>
            <h3>
              {notices.filter((notice) => notice.status === "Published").length}
            </h3>
            <p>Published</p>
          </div>
        </div>

        <div className="notice-stat-card">
          <div className="notice-stat-icon orange">📝</div>
          <div>
            <h3>
              {notices.filter((notice) => notice.status === "Draft").length}
            </h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      <div className="notice-search">
        <input
          type="text"
          placeholder="Search notices..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="notice-table-wrapper">
        <table className="notice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Notice</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading notices...</td>
              </tr>
            ) : filteredNotices.length > 0 ? (
              filteredNotices.map((notice, index) => (
                <tr key={notice.id}>
                  <td className="notice-number">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td>
                    <div className="notice-title-box">
                      <div className="notice-icon">📢</div>
                      <div>
                        <strong>{notice.title}</strong>
                        <p>
                          {(notice.description || "").length > 65
                            ? `${notice.description.substring(0, 65)}...`
                            : notice.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-badge">
                      {notice.category}
                    </span>
                  </td>

                  <td className="notice-date">{notice.date || "—"}</td>

                  <td>
                    <button
                      type="button"
                      className={`status-badge ${
                        notice.status === "Published" ? "published" : "draft"
                      }`}
                      onClick={() => toggleStatus(notice)}
                    >
                      <span></span>
                      {notice.status}
                    </button>
                  </td>

                  <td>
                    <div className="notice-actions">
                      <button
                        type="button"
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => openEditModal(notice)}
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => deleteNotice(notice.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="no-notices">
                    <div className="empty-icon">📢</div>
                    <h3>No notices found</h3>
                    <p>Try changing your search or create a new notice.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="notice-modal-overlay">
          <div className="notice-modal">
            <div className="modal-header">
              <div>
                <h2>{editingNotice ? "Edit Notice" : "Create New Notice"}</h2>
                <p>
                  {editingNotice
                    ? "Update notice information."
                    : "Add a new notice for students."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Notice Title <span>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter notice title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>General</option>
                    <option>Admission</option>
                    <option>Exam</option>
                    <option>Holiday</option>
                    <option>Event</option>
                    <option>Placement</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Description <span>*</span>
                </label>
                <textarea
                  name="description"
                  rows="5"
                  placeholder="Write notice details..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-notice-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingNotice
                    ? "Update Notice"
                    : "Save Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotices;
