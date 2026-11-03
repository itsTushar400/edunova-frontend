import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminCourses.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const emptyForm = {
  title: "",
  description: "",
  duration: "",
  fees: "",
  image: "",
  sort_order: "",
};

function AdminCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modules and Projects manager state
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentCourse, setContentCourse] = useState(null);
  const [contentTab, setContentTab] = useState("modules");
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentError, setContentError] = useState("");
  const contentFormHeadingRef = useRef(null);

  const emptyModule = {
    title: "",
    description: "",
    topics: "",
    sort_order: 1,
  };

  const emptyProject = {
    title: "",
    description: "",
    technologies: "",
    project_url: "",
    sort_order: 0,
  };

  const [moduleForm, setModuleForm] = useState(emptyModule);
  const [projectForm, setProjectForm] = useState(emptyProject);

  useEffect(() => {
    if (editingContent) {
      contentFormHeadingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingContent]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigate("/admin/login", { replace: true });
      return;
    }

    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/courses`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load courses");
      }

      setCourses(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return courses;
    }

    return courses.filter((course) =>
      [
        course.title,
        course.description,
        course.duration,
        course.fees,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [courses, search]);

  const openAddModal = () => {
    setEditingCourse(null);

    setForm({
      ...emptyForm,
      sort_order: courses.length + 1,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);

    setForm({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      fees: course.fees ?? "",
      image: course.image || "",
      sort_order: course.sort_order ?? "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCourse(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        duration: form.duration.trim(),
        fees: form.fees === "" ? null : Number(form.fees),
        image: form.image.trim(),
        sort_order:
          form.sort_order === ""
            ? courses.length + 1
            : Number(form.sort_order),
      };

      const url = editingCourse
        ? `${API_URL}/api/courses/${editingCourse.id}`
        : `${API_URL}/api/courses`;

      const method = editingCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save course");
      }

      await fetchCourses();

      setSuccess(
        editingCourse
          ? "Course updated successfully."
          : "Course added successfully."
      );

      setTimeout(() => {
        setShowModal(false);
        setEditingCourse(null);
        setForm(emptyForm);
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    const confirmDelete = window.confirm(
      `Delete "${course.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/courses/${course.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete course");
      }

      setCourses((previous) =>
        previous.filter((item) => item.id !== course.id)
      );

      setSuccess("Course deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to delete course.");
    }
  };

  // =====================================
  // COURSE MODULES & PROJECTS MANAGEMENT
  // =====================================

  const fetchCourseContent = async (courseId) => {
    try {
      setContentLoading(true);
      setContentError("");

      const [moduleResponse, projectResponse] = await Promise.all([
        fetch(`${API_URL}/api/courses/${courseId}/modules`),
        fetch(`${API_URL}/api/courses/${courseId}/projects`),
      ]);

      const [moduleData, projectData] = await Promise.all([
        moduleResponse.json(),
        projectResponse.json(),
      ]);

      if (!moduleResponse.ok) {
        throw new Error(moduleData.message || "Unable to load modules");
      }
      if (!projectResponse.ok) {
        throw new Error(projectData.message || "Unable to load projects");
      }

      const loadedModules = moduleData.data || [];

      setModules(loadedModules);
      setProjects(projectData.data || []);

      // Automatically assign the next display order for a new module.
      setModuleForm((previous) => ({
        ...emptyModule,
        sort_order: loadedModules.length + 1,
      }));
    } catch (err) {
      console.error("Fetch Course Content Error:", err);
      setContentError(err.message || "Unable to load course content.");
    } finally {
      setContentLoading(false);
    }
  };

  const openContentManager = async (course) => {
    setContentCourse(course);
    setContentTab("modules");
    setEditingContent(null);
    setModuleForm(emptyModule);
    setProjectForm(emptyProject);
    setModules([]);
    setProjects([]);
    setContentError("");
    setShowContentModal(true);
    await fetchCourseContent(course.id);
  };

  const closeContentManager = () => {
    if (contentSaving) return;
    setShowContentModal(false);
    setContentCourse(null);
    setEditingContent(null);
    setModules([]);
    setProjects([]);
    setModuleForm(emptyModule);
    setProjectForm(emptyProject);
    setContentError("");
  };

  const saveModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) {
      setContentError("Module title is required.");
      return;
    }

    try {
      setContentSaving(true);
      setContentError("");
      const isEditing = Boolean(editingContent);
      const url = isEditing
        ? `${API_URL}/api/courses/${contentCourse.id}/modules/${editingContent.id}`
        : `${API_URL}/api/courses/${contentCourse.id}/modules`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...moduleForm,
          sort_order: Number(moduleForm.sort_order) || 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save module");

      setModuleForm(emptyModule);
      setEditingContent(null);
      await fetchCourseContent(contentCourse.id);
    } catch (err) {
      console.error("Save Module Error:", err);
      setContentError(err.message || "Unable to save module.");
    } finally {
      setContentSaving(false);
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      setContentError("Project title is required.");
      return;
    }

    try {
      setContentSaving(true);
      setContentError("");
      const isEditing = Boolean(editingContent);
      const url = isEditing
        ? `${API_URL}/api/courses/${contentCourse.id}/projects/${editingContent.id}`
        : `${API_URL}/api/courses/${contentCourse.id}/projects`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          sort_order: Number(projectForm.sort_order) || 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save project");

      setProjectForm(emptyProject);
      setEditingContent(null);
      await fetchCourseContent(contentCourse.id);
    } catch (err) {
      console.error("Save Project Error:", err);
      setContentError(err.message || "Unable to save project.");
    } finally {
      setContentSaving(false);
    }
  };

  const editModule = (module) => {
    setContentTab("modules");
    setEditingContent(module);
    setModuleForm({
      title: module.title || "",
      description: module.description || "",
      topics: module.topics || "",
      sort_order: module.sort_order ?? 0,
    });
    setContentError("");
  };

  const editProject = (project) => {
    setContentTab("projects");
    setEditingContent(project);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      project_url: project.project_url || "",
      sort_order: project.sort_order ?? 0,
    });
    setContentError("");
  };

  const deleteContent = async (type, item) => {
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;

    try {
      setContentError("");
      const endpoint = type === "module"
        ? `modules/${item.id}`
        : `projects/${item.id}`;
      const response = await fetch(
        `${API_URL}/api/courses/${contentCourse.id}/${endpoint}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete item");
      await fetchCourseContent(contentCourse.id);
      if (editingContent?.id === item.id) {
        setEditingContent(null);
        setModuleForm(emptyModule);
        setProjectForm(emptyProject);
      }
    } catch (err) {
      console.error("Delete Content Error:", err);
      setContentError(err.message || "Unable to delete item.");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-courses-page">

      {/* SIDEBAR */}
      <aside className="courses-sidebar">

        <div className="courses-brand">
          <div className="courses-logo">E</div>

          <div>
            <h2>EduNova</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="courses-nav">

          <button
            onClick={() => navigate("/admin/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button className="active">
            <span>📚</span>
            Courses
          </button>

          <button
            onClick={() => navigate("/admin/enquiries")}
          >
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

        <div className="courses-sidebar-bottom">

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
      <main className="courses-main">

        {/* HEADER */}
        <header className="courses-header">

          <div>
            <p>COURSE MANAGEMENT</p>
            <h1>Courses</h1>
          </div>

          <button
            className="add-course-btn"
            onClick={openAddModal}
          >
            <span>＋</span>
            Add New Course
          </button>

        </header>

        <section className="courses-content">

          {/* TOP STATS */}
          <div className="course-stats">

            <div className="course-stat-card">
              <div className="course-stat-icon purple">
                📚
              </div>

              <div>
                <span>Total Courses</span>
                <strong>{courses.length}</strong>
              </div>
            </div>

            <div className="course-stat-card">
              <div className="course-stat-icon blue">
                🔎
              </div>

              <div>
                <span>Search Results</span>
                <strong>
                  {filteredCourses.length}
                </strong>
              </div>
            </div>

            <div className="course-stat-card">
              <div className="course-stat-icon green">
                ✓
              </div>

              <div>
                <span>Active Courses</span>
                <strong>{courses.length}</strong>
              </div>
            </div>

          </div>

          {/* ALERTS */}
          {error && (
            <div className="course-alert error">
              ⚠ {error}
            </div>
          )}

          {success && (
            <div className="course-alert success">
              ✓ {success}
            </div>
          )}

          {/* COURSE CARD */}
          <div className="courses-card">

            <div className="courses-card-header">

              <div>
                <span>COURSE CATALOGUE</span>
                <h2>Manage Courses</h2>
              </div>

              <div className="course-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

            {loading ? (
              <div className="course-loading">
                <div className="course-spinner" />
                <p>Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="course-empty">

                <div>📚</div>

                <h3>
                  {search
                    ? "No courses found"
                    : "No courses available"}
                </h3>

                <p>
                  {search
                    ? "Try a different search term."
                    : "Add your first course to get started."}
                </p>

                {!search && (
                  <button onClick={openAddModal}>
                    ＋ Add Course
                  </button>
                )}

              </div>
            ) : (
              <div className="courses-table-wrapper">

                <table className="courses-table">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Fees</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredCourses.map(
                      (course, index) => (
                        <tr key={course.id}>

                          <td>
                            <span className="course-number">
                              {index + 1}
                            </span>
                          </td>

                          <td>

                            <div className="course-table-info">

                              <div className="course-image">

                                {course.image ? (
                                  <img
                                    src={
                                      course.image.startsWith(
                                        "http"
                                      )
                                        ? course.image
                                        : `/images/${course.image
                                            .split("/")
                                            .pop()}`
                                    }
                                    alt={course.title}
                                    onError={(e) => {
                                      e.currentTarget.style.display =
                                        "none";
                                      e.currentTarget.parentElement.classList.add(
                                        "image-fallback"
                                      );
                                    }}
                                  />
                                ) : (
                                  <span>📚</span>
                                )}

                              </div>

                              <div>
                                <strong>
                                  {course.title}
                                </strong>

                                <p>
                                  {course.description ||
                                    "No description available"}
                                </p>
                              </div>

                            </div>

                          </td>

                          <td>
                            <span className="duration-badge">
                              ⏱ {course.duration || "—"}
                            </span>
                          </td>

                          <td>
                            <strong className="fee-text">
                              {course.fees !== null &&
                              course.fees !== undefined &&
                              course.fees !== ""
                                ? `₹${Number(
                                    course.fees
                                  ).toLocaleString("en-IN")}`
                                : "Free"}
                            </strong>
                          </td>

                          <td>
                            <span className="order-badge">
                              {course.sort_order ??
                                index + 1}
                            </span>
                          </td>

                          <td>

                            <div className="course-actions">

                              <button
                                type="button"
                                className="edit-course-btn"
                                title="Manage Modules & Projects"
                                onClick={() => openContentManager(course)}
                              >
                                📖
                              </button>

                              <button
                                className="edit-course-btn"
                                title="Edit Course"
                                onClick={() =>
                                  openEditModal(course)
                                }
                              >
                                ✏️
                              </button>

                              <button
                                className="delete-course-btn"
                                title="Delete Course"
                                onClick={() =>
                                  handleDelete(course)
                                }
                              >
                                🗑️
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          <footer className="courses-footer">
            <span>EduNova Admin Panel</span>
            <span>© 2026 Tushar Chauhan</span>
          </footer>

        </section>

      </main>

      {/* ADD / EDIT MODAL */}
      {showModal && (

        <div
          className="course-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="course-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="course-modal-header">

              <div>
                <span>
                  {editingCourse
                    ? "EDIT COURSE"
                    : "NEW COURSE"}
                </span>

                <h2>
                  {editingCourse
                    ? "Update Course"
                    : "Add New Course"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="course-form-group full">
                  <label>
                    Course Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Web Development"
                    required
                  />
                </div>

                <div className="course-form-group full">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter course description..."
                    rows="4"
                  />
                </div>

                <div className="course-form-group">
                  <label>
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 6 Months"
                  />
                </div>

                <div className="course-form-group">
                  <label>
                    Fees
                  </label>

                  <input
                    type="number"
                    name="fees"
                    min="0"
                    value={form.fees}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                  />
                </div>

                <div className="course-form-group">
                  <label>
                    Image
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="course_full_stack_web_development.png"
                  />

                  <small>
                    Use image filename from public/images
                  </small>
                </div>

                <div className="course-form-group">
                  <label>
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    min="1"
                    value={form.sort_order}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>

              </div>

              {error && (
                <div className="modal-form-error">
                  ⚠ {error}
                </div>
              )}

              <div className="course-modal-actions">

                <button
                  type="button"
                  className="cancel-course-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-course-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCourse
                    ? "Update Course"
                    : "Add Course"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* MODULES & PROJECTS MANAGER */}
      {showContentModal && contentCourse && (
        <div
          className="course-modal-overlay"
          onClick={closeContentManager}
        >
          <div
            className="course-modal content-manager-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="course-modal-header">
              <div>
                <span>COURSE CONTENT MANAGEMENT</span>
                <h2>{contentCourse.title}</h2>
                <small>Manage syllabus modules and practical projects</small>
              </div>
              <button type="button" onClick={closeContentManager}>×</button>
            </div>

            <div className="content-manager-tabs">
              <button
                type="button"
                className={contentTab === "modules" ? "active" : ""}
                onClick={() => {
                  setContentTab("modules");
                  setEditingContent(null);
                  setModuleForm(emptyModule);
                  setContentError("");
                }}
              >
                📚 Modules ({modules.length})
              </button>
              <button
                type="button"
                className={contentTab === "projects" ? "active" : ""}
                onClick={() => {
                  setContentTab("projects");
                  setEditingContent(null);
                  setProjectForm(emptyProject);
                  setContentError("");
                }}
              >
                💻 Projects ({projects.length})
              </button>
            </div>

            <div className="content-manager-body">
              {contentError && (
                <div className="course-alert error">⚠ {contentError}</div>
              )}

              {contentLoading ? (
                <div className="course-loading">
                  <div className="course-spinner" />
                  <p>Loading course content...</p>
                </div>
              ) : (
                <>
                  {contentTab === "modules" && (
                    <>
                      <h3 ref={contentFormHeadingRef}>
                        {editingContent ? "Update Module" : "Add New Module"}
                      </h3>
                      <form onSubmit={saveModule}>
                        <div className="form-grid">
                          <div className="course-form-group full">
                            <label>Module Title *</label>
                            <input
                              value={moduleForm.title}
                              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                              placeholder="e.g. HTML Fundamentals"
                              required
                            />
                          </div>
                          <div className="course-form-group full">
                            <label>Description</label>
                            <textarea
                              rows="2"
                              value={moduleForm.description}
                              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                              placeholder="Enter module description"
                            />
                          </div>
                          <div className="course-form-group full">
                            <label>Topics</label>
                            <textarea
                              rows="3"
                              value={moduleForm.topics}
                              onChange={(e) => setModuleForm({ ...moduleForm, topics: e.target.value })}
                              placeholder="HTML, CSS, Forms, Tables..."
                            />
                          </div>
                          <div className="course-form-group">
                            <label>Display Order</label>
                            <input
                              type="number"
                              min="0"
                              value={moduleForm.sort_order}
                              onChange={(e) => setModuleForm({ ...moduleForm, sort_order: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="course-modal-actions">
                          {editingContent && (
                            <button
                              type="button"
                              className="cancel-course-btn"
                              onClick={() => { setEditingContent(null); setModuleForm(emptyModule); }}
                            >Cancel Edit</button>
                          )}
                          <button type="submit" className="save-course-btn" disabled={contentSaving}>
                            {contentSaving ? "Saving..." : editingContent ? "Update Module" : "Add Module"}
                          </button>
                        </div>
                      </form>

                      <div className="content-list-heading">
                        <h3>Existing Modules</h3>
                        <span>{modules.length} total</span>
                      </div>
                      {modules.length === 0 ? (
                        <div className="content-empty">No modules added yet.</div>
                      ) : modules.map((module) => (
                        <div className="content-item" key={module.id}>
                          <div className="content-item-info">
                            <strong>{module.title}</strong>
                            {module.description && <p>{module.description}</p>}
                            {module.topics && <small>Topics: {module.topics}</small>}
                          </div>
                          <div className="content-item-actions">
                            <button type="button" title="Edit module" onClick={() => editModule(module)}>✏️</button>
                            <button type="button" title="Delete module" onClick={() => deleteContent("module", module)}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {contentTab === "projects" && (
                    <>
                      <h3 ref={contentFormHeadingRef}>
                        {editingContent ? "Update Project" : "Add New Project"}
                      </h3>
                      <form onSubmit={saveProject}>
                        <div className="form-grid">
                          <div className="course-form-group full">
                            <label>Project Title *</label>
                            <input
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              placeholder="e.g. Student Management System"
                              required
                            />
                          </div>
                          <div className="course-form-group full">
                            <label>Description</label>
                            <textarea
                              rows="3"
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              placeholder="Enter project description"
                            />
                          </div>
                          <div className="course-form-group full">
                            <label>Technologies</label>
                            <input
                              value={projectForm.technologies}
                              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                              placeholder="React, Node.js, MySQL"
                            />
                          </div>
                          <div className="course-form-group full">
                            <label>Project URL</label>
                            <input
                              type="url"
                              value={projectForm.project_url}
                              onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
                              placeholder="https://example.com"
                            />
                          </div>
                          <div className="course-form-group">
                            <label>Display Order</label>
                            <input
                              type="number"
                              min="0"
                              value={projectForm.sort_order}
                              onChange={(e) => setProjectForm({ ...projectForm, sort_order: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="course-modal-actions">
                          {editingContent && (
                            <button
                              type="button"
                              className="cancel-course-btn"
                              onClick={() => { setEditingContent(null); setProjectForm(emptyProject); }}
                            >Cancel Edit</button>
                          )}
                          <button type="submit" className="save-course-btn" disabled={contentSaving}>
                            {contentSaving ? "Saving..." : editingContent ? "Update Project" : "Add Project"}
                          </button>
                        </div>
                      </form>

                      <div className="content-list-heading">
                        <h3>Existing Projects</h3>
                        <span>{projects.length} total</span>
                      </div>
                      {projects.length === 0 ? (
                        <div className="content-empty">No projects added yet.</div>
                      ) : projects.map((project) => (
                        <div className="content-item" key={project.id}>
                          <div className="content-item-info">
                            <strong>{project.title}</strong>
                            {project.description && <p>{project.description}</p>}
                            {project.technologies && <small>Technologies: {project.technologies}</small>}
                            {project.project_url && (
                              <a href={project.project_url} target="_blank" rel="noreferrer">View project</a>
                            )}
                          </div>
                          <div className="content-item-actions">
                            <button type="button" title="Edit project" onClick={() => editProject(project)}>✏️</button>
                            <button type="button" title="Delete project" onClick={() => deleteContent("project", project)}>🗑️</button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            <div className="course-modal-actions content-manager-footer">
              <button type="button" className="cancel-course-btn" onClick={closeContentManager}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminCourses;
