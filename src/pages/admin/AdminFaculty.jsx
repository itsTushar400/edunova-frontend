import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/admin/AdminFaculty.css";


const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");


const emptyForm = {
  name: "",
  designation: "",
  qualification: "",
  experience: "",
  image: "",
};

const getFacultyImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/uploads/")) return `${API_URL}${image}`;

  return `/images/${image.split("/").pop()}`;
};


function AdminFaculty() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [faculty, setFaculty] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingFaculty, setEditingFaculty] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!imagePreview.startsWith("blob:")) return undefined;

    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);


  // =====================================================
  // AUTH + LOAD
  // =====================================================

  useEffect(() => {

    window.scrollTo(0, 0);

    if (
      localStorage.getItem("adminLoggedIn") !==
      "true"
    ) {
      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    fetchFaculty();

  }, [navigate]);


  // =====================================================
  // GET FACULTY
  // =====================================================

  const fetchFaculty = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await fetch(
        `${API_URL}/api/faculty`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load faculty"
        );
      }

      setFaculty(data.data || []);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load faculty."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredFaculty = useMemo(() => {

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return faculty;
    }

    return faculty.filter((person) =>
      [
        person.name,
        person.designation,
        person.qualification,
        person.experience,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value)
    );

  }, [faculty, search]);


  // =====================================================
  // ADD MODAL
  // =====================================================

  const openAddModal = () => {

    setEditingFaculty(null);

    setForm({
      ...emptyForm,
    });

    setSelectedImage(null);
    setImagePreview("");

    setError("");

    setSuccess("");

    setShowModal(true);
  };


  // =====================================================
  // EDIT MODAL
  // =====================================================

  const openEditModal = (person) => {

    setEditingFaculty(person);

    setForm({
      name: person.name || "",
      designation:
        person.designation || "",
      qualification:
        person.qualification || "",
      experience:
        person.experience || "",
      image:
        person.image || "",
    });

    setSelectedImage(null);
    setImagePreview(getFacultyImageUrl(person.image));

    setError("");

    setSuccess("");

    setShowModal(true);
  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    if (saving) return;

    setShowModal(false);

    setEditingFaculty(null);

    setForm({
      ...emptyForm,
    });

    setSelectedImage(null);
    setImagePreview("");

    setError("");
  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };


  // =====================================================
  // ADD / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name.trim()) {

      setError(
        "Faculty name is required."
      );

      return;
    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("designation", form.designation.trim());
      payload.append("qualification", form.qualification.trim());
      payload.append("experience", form.experience.trim());
      payload.append("image", selectedImage || form.image.trim());


      const url = editingFaculty

        ? `${API_URL}/api/faculty/${editingFaculty.id}`

        : `${API_URL}/api/faculty`;


      const method =
        editingFaculty
          ? "PUT"
          : "POST";


      const response = await fetch(
        url,
        {
          method,

          body: payload,
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to save faculty"
        );
      }


      await fetchFaculty();


      setSuccess(
        editingFaculty
          ? "Faculty updated successfully."
          : "Faculty added successfully."
      );


      setTimeout(() => {

        setShowModal(false);

        setEditingFaculty(null);

        setForm({
          ...emptyForm,
        });

        setSelectedImage(null);
        setImagePreview("");

        setSuccess("");

      }, 700);


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to save faculty."
      );

    } finally {

      setSaving(false);

    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    person
  ) => {

    const confirmDelete =
      window.confirm(
        `Delete "${person.name}"?\n\nThis action cannot be undone.`
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setError("");

      setSuccess("");


      const response =
        await fetch(
          `${API_URL}/api/faculty/${person.id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to delete faculty"
        );
      }


      setFaculty(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== person.id
          )
      );


      setSuccess(
        "Faculty deleted successfully."
      );


      setTimeout(() => {

        setSuccess("");

      }, 2500);


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to delete faculty."
      );
    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  };


  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="admin-faculty-page">


      {/* SIDEBAR */}

      <aside className="faculty-sidebar">


        <div className="faculty-brand">

          <div className="faculty-logo">
            E
          </div>

          <div>

            <h2>EduNova</h2>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </div>


        <nav className="faculty-nav">


          <button
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            <span>▦</span>
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate(
                "/admin/courses"
              )
            }
          >
            <span>📚</span>
            Courses
          </button>


          <button
            onClick={() =>
              navigate(
                "/admin/enquiries"
              )
            }
          >
            <span>📩</span>
            Enquiries
          </button>


          <button className="active">
            <span>👨‍🏫</span>
            Faculty
          </button>


          <button
            onClick={() =>
              navigate(
                "/admin/notices"
              )
            }
          >
            <span>📢</span>
            Notices
          </button>


          <button
            onClick={() =>
              navigate(
                "/admin/gallery"
              )
            }
          >
            <span>🖼️</span>
            Gallery
          </button>


        </nav>


        <div className="faculty-sidebar-bottom">


          <button
            onClick={() =>
              navigate("/")
            }
          >
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

      <main className="faculty-main">


        {/* HEADER */}

        <header className="faculty-header">

          <div>

            <p>
              FACULTY MANAGEMENT
            </p>

            <h1>Faculty</h1>

          </div>


          <button
            className="add-faculty-btn"
            onClick={openAddModal}
          >
            <span>＋</span>
            Add Faculty
          </button>

        </header>


        <section className="faculty-content">


          {/* STATS */}

          <div className="faculty-stats">


            <div className="faculty-stat-card">

              <div className="faculty-stat-icon purple">
                👨‍🏫
              </div>

              <div>

                <span>
                  Total Faculty
                </span>

                <strong>
                  {faculty.length}
                </strong>

              </div>

            </div>


            <div className="faculty-stat-card">

              <div className="faculty-stat-icon blue">
                🔎
              </div>

              <div>

                <span>
                  Search Results
                </span>

                <strong>
                  {filteredFaculty.length}
                </strong>

              </div>

            </div>


            <div className="faculty-stat-card">

              <div className="faculty-stat-icon green">
                ✓
              </div>

              <div>

                <span>
                  Active Faculty
                </span>

                <strong>
                  {faculty.length}
                </strong>

              </div>

            </div>


          </div>


          {/* ALERT */}

          {error && (

            <div className="faculty-alert error">
              ⚠ {error}
            </div>

          )}


          {success && (

            <div className="faculty-alert success">
              ✓ {success}
            </div>

          )}


          {/* CARD */}

          <div className="faculty-card">


            <div className="faculty-card-header">

              <div>

                <span>
                  FACULTY DIRECTORY
                </span>

                <h2>
                  Manage Faculty
                </h2>

              </div>


              <div className="faculty-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />


                {search && (

                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    ×
                  </button>

                )}

              </div>

            </div>


            {/* LOADING */}

            {loading ? (

              <div className="faculty-loading">

                <div className="faculty-spinner" />

                <p>
                  Loading faculty...
                </p>

              </div>


            ) : filteredFaculty.length === 0 ? (

              <div className="faculty-empty">

                <div>👨‍🏫</div>

                <h3>
                  {search
                    ? "No faculty found"
                    : "No faculty available"}
                </h3>

                <p>
                  {search
                    ? "Try a different search term."
                    : "Add your first faculty member."}
                </p>


                {!search && (

                  <button
                    onClick={
                      openAddModal
                    }
                  >
                    ＋ Add Faculty
                  </button>

                )}

              </div>


            ) : (

              <div className="faculty-table-wrapper">

                <table className="faculty-table">


                  <thead>

                    <tr>

                      <th>#</th>

                      <th>
                        Faculty
                      </th>

                      <th>
                        Designation
                      </th>

                      <th>
                        Qualification
                      </th>

                      <th>
                        Experience
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredFaculty.map(
                      (person, index) => (

                        <tr
                          key={person.id}
                        >

                          <td>

                            <span className="faculty-number">
                              {index + 1}
                            </span>

                          </td>


                          <td>

                            <div className="faculty-table-info">

                              <div className="faculty-image">

                                {person.image ? (

                                  <img
                                    src={
                                      getFacultyImageUrl(person.image)
                                    }
                                    alt={
                                      person.name
                                    }
                                    onError={(
                                      e
                                    ) => {

                                      e.currentTarget.style.display =
                                        "none";

                                      e.currentTarget.parentElement.classList.add(
                                        "image-fallback"
                                      );

                                    }}
                                  />

                                ) : (

                                  <span>
                                    {person.name
                                      ?.charAt(
                                        0
                                      )
                                      ?.toUpperCase() ||
                                      "F"}
                                  </span>

                                )}

                              </div>


                              <div>

                                <strong>
                                  {
                                    person.name
                                  }
                                </strong>

                                <p>
                                  Faculty Member
                                </p>

                              </div>

                            </div>

                          </td>


                          <td>

                            <span className="designation-badge">

                              {
                                person.designation ||
                                "—"
                              }

                            </span>

                          </td>


                          <td>

                            <span className="qualification-text">

                              {
                                person.qualification ||
                                "—"
                              }

                            </span>

                          </td>


                          <td>

                            <span className="qualification-text">

                              {
                                person.experience ||
                                "—"
                              }

                            </span>

                          </td>


                          <td>

                            <div className="faculty-actions">


                              <button
                                className="edit-faculty-btn"
                                title="Edit Faculty"
                                onClick={() =>
                                  openEditModal(
                                    person
                                  )
                                }
                              >
                                ✏️
                              </button>


                              <button
                                className="delete-faculty-btn"
                                title="Delete Faculty"
                                onClick={() =>
                                  handleDelete(
                                    person
                                  )
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


          <footer className="faculty-footer">

            <span>
              EduNova Admin Panel
            </span>

            <span>
              © 2026 Tushar Chauhan
            </span>

          </footer>


        </section>


      </main>


      {/* MODAL */}

      {showModal && (

        <div
          className="faculty-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="faculty-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <div className="faculty-modal-header">

              <div>

                <span>
                  {editingFaculty
                    ? "EDIT FACULTY"
                    : "NEW FACULTY"}
                </span>

                <h2>
                  {editingFaculty
                    ? "Update Faculty"
                    : "Add Faculty"}
                </h2>

              </div>


              <button
                type="button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
            >

              <div className="faculty-form-grid">


                <div className="faculty-form-group full">

                  <label>
                    Faculty Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Dr. Rajesh Kumar"
                    required
                  />

                </div>


                <div className="faculty-form-group">

                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={
                      form.designation
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Senior Faculty"
                  />

                </div>


                <div className="faculty-form-group">

                  <label>
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={
                      form.qualification
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. MCA, M.Tech"
                  />

                </div>


                <div className="faculty-form-group">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={
                      form.experience
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 12+ Years Experience"
                  />

                </div>


                <div className="faculty-form-group">

                  <label>
                    Image
                  </label>

                  <input
                    type="file"
                    name="image"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageChange}
                    disabled={saving}
                  />

                  <small>JPG, PNG, WEBP or GIF; maximum 5 MB.</small>

                  {imagePreview && (
                    <div className="faculty-image-preview">
                      <img src={imagePreview} alt="Selected faculty" />
                      <span>
                        {selectedImage?.name || "Current faculty image"}
                      </span>
                    </div>
                  )}

                </div>


              </div>


              {error && (

                <div className="faculty-modal-error">
                  ⚠ {error}
                </div>

              )}


              <div className="faculty-modal-actions">


                <button
                  type="button"
                  className="cancel-faculty-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-faculty-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingFaculty
                    ? "Update Faculty"
                    : "Add Faculty"}
                </button>


              </div>


            </form>


          </div>

        </div>

      )}


    </div>
  );
}


export default AdminFaculty;