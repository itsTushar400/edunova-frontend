import { useCallback, useEffect, useState } from "react";
import "../../styles/admin/AdminNotices.css";

// Local development aur live deployment dono ke liye
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/notices`;

const emptyForm = {
  title: "",
  category: "General",
  date: "",
  description: "",
  status: "Published",
};

const categories = [
  "General",
  "Admission",
  "Exam",
  "Holiday",
  "Event",
  "Placement",
];

function formatDate(value) {
  if (!value) return "";

  const date = String(value).slice(0, 10);

  // Date ko input[type=date] ke liye YYYY-MM-DD rakho
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "";

  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, "0"),
    String(parsed.getDate()).padStart(2, "0"),
  ].join("-");
}

function displayDate(value) {
  if (!value) return "—";

  const date = formatDate(value);
  if (!date) return String(value);

  const [year, month, day] = date.split("-");
  const parsed = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeNotice(row) {
  return {
    ...row,
    id: row.id,
    title: row.title || "",
    category: row.category || "General",
    date: formatDate(row.notice_date || row.date || row.created_at),
    description: row.description || "",
    status: row.status || "Published",
  };
}

function extractNotices(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.notices)) return payload.notices;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Database se notices load karo
  const loadNotices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.message || "Notices load nahi ho sake."
        );
      }

      setNotices(extractNotices(payload).map(normalizeNotice));
    } catch (err) {
      setError(
        err.message ||
          "Backend se connection nahi ho pa raha hai."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const openAddModal = () => {
    setEditingNotice(null);
    setForm({ ...emptyForm });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);

    setForm({
      title: notice.title,
      category: notice.category,
      date: formatDate(notice.date),
      description: notice.description,
      status: notice.status,
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingNotice(null);
    setForm({ ...emptyForm });
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add ya update notice
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError("Notice title aur description bharna zaroori hai.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      notice_date: form.date || null,
      status: form.status,
    };

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingNotice);

      const response = await fetch(
        isEditing
          ? `${API_URL}/${editingNotice.id}`
          : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Notice save nahi ho saka."
        );
      }

      setShowModal(false);
      setEditingNotice(null);
      setForm({ ...emptyForm });

      await loadNotices();
    } catch (err) {
      setError(
        err.message ||
          "Notice save karte waqt error aa gaya."
      );
    } finally {
      setSaving(false);
    }
  };

  // Notice delete
  const deleteNotice = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is notice ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Notice delete nahi ho saka."
        );
      }

      await loadNotices();
    } catch (err) {
      setError(err.message || "Delete karte waqt error aaya.");
    }
  };

  // Published / Draft toggle
  const toggleStatus = async (notice) => {
    const nextStatus =
      notice.status === "Published" ? "Draft" : "Published";

    setError("");

    try {
      const response = await fetch(`${API_URL}/${notice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: notice.title,
          category: notice.category,
          description: notice.description,
          notice_date: notice.date || null,
          status: nextStatus,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Notice status update nahi hua."
        );
      }

      await loadNotices();
    } catch (err) {
      setError(err.message || "Status update nahi ho saka.");
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const searchableText = [
      notice.title,
      notice.category,
      notice.description,
      notice.status,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  const publishedCount = notices.filter(
    (notice) => notice.status === "Published"
  ).length;

  const draftCount = notices.filter(
    (notice) => notice.status === "Draft"
  ).length;

  return (
    <div className="admin-notices-page">
      {/* PAGE HEADER */}
      <div className="notices-header">
        <div>
          <div className="breadcrumb">
            Admin <span>/</span> Notices
          </div>

          <h1>Notice Management</h1>

          <p>
            Create, manage and publish important institute notices.
          </p>
        </div>

        <button
          className="add-notice-btn"
          onClick={openAddModal}
          type="button"
        >
          <span>+</span> Add Notice
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && !showModal && (
        <div
          role="alert"
          style={{
            padding: "12px 16px",
            marginBottom: "18px",
            borderRadius: "8px",
            background: "#fff0f0",
            color: "#b42318",
          }}
        >
          {error}
          <button
            type="button"
            onClick={loadNotices}
            style={{
              marginLeft: "12px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* STAT CARDS */}
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
            <h3>{publishedCount}</h3>
            <p>Published</p>
          </div>
        </div>

        <div className="notice-stat-card">
          <div className="notice-stat-icon orange">📝</div>
          <div>
            <h3>{draftCount}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      {/* NOTICE CONTENT */}
      <div className="notices-card">
        <div className="notices-toolbar">
          <div>
            <h2>All Notices</h2>
            <span>{filteredNotices.length} notices found</span>
          </div>

          <div className="notice-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
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
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading notices...
                  </td>
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
                            {notice.description.length > 65
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

                    <td className="notice-date">
                      {displayDate(notice.date)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`status-badge ${
                          notice.status === "Published"
                            ? "published"
                            : "draft"
                        }`}
                        onClick={() => toggleStatus(notice)}
                        title="Click to change status"
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