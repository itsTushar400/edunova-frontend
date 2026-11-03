import { useEffect, useState } from "react";
import "../../styles/admin/AdminGallery.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");


/* =========================================================
   IMAGE URL
========================================================= */

const getImageUrl = (image) => {
  if (!image) {
    return "/images/gallery_campus.png";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  if (image.startsWith("/images/")) {
    return image;
  }

  return `/images/${image.split("/").pop()}`;
};


/* =========================================================
   ADMIN GALLERY
========================================================= */

function AdminGallery() {

  /* =======================================================
     STATES
  ======================================================= */

  const [gallery, setGallery] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [viewerImage, setViewerImage] = useState("");

  const [viewerTitle, setViewerTitle] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Campus",
  });


  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = [
    "All",
    "Campus",
    "Facilities",
    "Events",
    "Students",
    "Other",
  ];


  /* =======================================================
     LOAD GALLERY
  ======================================================= */

  useEffect(() => {
    loadGallery();
  }, []);


  const loadGallery = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/gallery`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load gallery"
        );
      }

      setGallery(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.error(
        "Gallery Load Error:",
        error
      );

      alert(
        "Gallery load nahi ho paayi. Backend check karo."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredGallery = gallery.filter((item) => {

    const text =
      search.trim().toLowerCase();

    const title =
      item.title?.toLowerCase() || "";

    const itemCategory =
      item.category?.toLowerCase() || "";

    const matchesSearch =
      !text ||
      title.includes(text) ||
      itemCategory.includes(text);

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });


  /* =======================================================
     ADD MODAL
  ======================================================= */

  const openAddModal = () => {

    setEditingItem(null);

    setForm({
      title: "",
      category: "Campus",
    });

    setSelectedImage(null);

    setImagePreview("");

    setShowModal(true);
  };


  /* =======================================================
     EDIT MODAL
  ======================================================= */

  const openEditModal = (item) => {

    setEditingItem(item);

    setForm({
      title: item.title || "",
      category: item.category || "Campus",
    });

    setSelectedImage(null);

    setImagePreview(
      getImageUrl(item.image)
    );

    setShowModal(true);
  };


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingItem(null);

    setSelectedImage(null);

    setImagePreview("");

    setForm({
      title: "",
      category: "Campus",
    });
  };


  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =======================================================
     IMAGE SELECT
  ======================================================= */

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];


    if (!allowedTypes.includes(file.type)) {

      alert(
        "Only JPG, PNG, WEBP or GIF images are allowed."
      );

      e.target.value = "";

      return;
    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Image size maximum 5 MB honi chahiye."
      );

      e.target.value = "";

      return;
    }


    setSelectedImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };


  /* =======================================================
     ADD / UPDATE
  ======================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!form.title.trim()) {

      alert(
        "Please enter image title."
      );

      return;
    }


    if (
      !editingItem &&
      !selectedImage
    ) {

      alert(
        "Please select an image."
      );

      return;
    }


    try {

      setSaving(true);

      const payload =
        new FormData();


      payload.append(
        "title",
        form.title.trim()
      );


      payload.append(
        "category",
        form.category
      );


      if (selectedImage) {

        payload.append(
          "image",
          selectedImage
        );
      }


      const url = editingItem
        ? `${API_URL}/api/gallery/${editingItem.id}`
        : `${API_URL}/api/gallery`;


      const method = editingItem
        ? "PUT"
        : "POST";


      const response =
        await fetch(url, {
          method,
          body: payload,
        });


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Unable to save image"
        );
      }


      alert(
        editingItem
          ? "Image updated successfully! ✅"
          : "Image uploaded successfully! ✅"
      );


      closeModal();

      await loadGallery();

    } catch (error) {

      console.error(
        "Gallery Save Error:",
        error
      );

      alert(
        error.message ||
        "Unable to save image."
      );

    } finally {

      setSaving(false);

    }
  };


  /* =======================================================
     DELETE
  ======================================================= */

  const deleteImage = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/api/gallery/${id}`,
          {
            method: "DELETE",
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Delete failed"
        );
      }


      alert(
        "Image deleted successfully! 🗑️"
      );


      await loadGallery();

    } catch (error) {

      console.error(
        "Delete Error:",
        error
      );

      alert(
        error.message ||
        "Unable to delete image."
      );
    }
  };


  /* =======================================================
     VIEW IMAGE
  ======================================================= */

  const viewImage = (
    image,
    title
  ) => {

    setViewerImage(
      getImageUrl(image)
    );

    setViewerTitle(
      title || "Gallery Image"
    );
  };


  /* =======================================================
     CLOSE VIEWER
  ======================================================= */

  const closeImageViewer = () => {

    setViewerImage("");

    setViewerTitle("");
  };


  /* =======================================================
     ESC KEY
  ======================================================= */

  useEffect(() => {

    const handleEscape = (event) => {

      if (event.key === "Escape") {
        closeImageViewer();
      }
    };


    if (viewerImage) {

      document.addEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";
    }


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "";
    };

  }, [viewerImage]);


  /* =======================================================
     CATEGORY COLOR
  ======================================================= */

  const getCategoryStyle = (itemCategory) => {

    if (itemCategory === "Facilities") {

      return {
        background: "#dcfce7",
        color: "#16a34a",
      };
    }


    if (itemCategory === "Events") {

      return {
        background: "#ffedd5",
        color: "#ea580c",
      };
    }


    if (itemCategory === "Students") {

      return {
        background: "#f3e8ff",
        color: "#9333ea",
      };
    }


    if (itemCategory === "Other") {

      return {
        background: "#f1f5f9",
        color: "#475569",
      };
    }


    return {
      background: "#dbeafe",
      color: "#2563eb",
    };
  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="admin-gallery-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="gallery-page-header">

        <div>

          <h1>
            Gallery Management
          </h1>

          <p>
            Manage institute photos,
            events and campus images.
          </p>

        </div>


        <button
          type="button"
          className="add-gallery-btn"
          onClick={openAddModal}
        >

          <span>＋</span>

          Add Image

        </button>

      </div>



      {/* =================================================
          STATS
      ================================================= */}

      <div className="gallery-stats">


        <div className="gallery-stat-card">

          <div className="gallery-stat-icon blue">
            🖼️
          </div>

          <div>

            <h3>
              {gallery.length}
            </h3>

            <p>
              Total Images
            </p>

          </div>

        </div>



        <div className="gallery-stat-card">

          <div className="gallery-stat-icon purple">
            🏫
          </div>

          <div>

            <h3>
              {
                gallery.filter(
                  (item) =>
                    item.category ===
                    "Campus"
                ).length
              }
            </h3>

            <p>
              Campus Photos
            </p>

          </div>

        </div>



        <div className="gallery-stat-card">

          <div className="gallery-stat-icon orange">
            🎉
          </div>

          <div>

            <h3>
              {
                gallery.filter(
                  (item) =>
                    item.category ===
                    "Events"
                ).length
              }
            </h3>

            <p>
              Event Photos
            </p>

          </div>

        </div>

      </div>



      {/* =================================================
          MAIN
      ================================================= */}

      <div className="gallery-main-card">


        {/* TOOLBAR */}

        <div className="gallery-toolbar">

          <div>

            <h2>
              All Images
            </h2>

            <span>
              {filteredGallery.length} images found
            </span>

          </div>


          <div className="gallery-toolbar-right">

            <div className="gallery-search">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            <select
              className="gallery-filter"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              {categories.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>

        </div>



        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="gallery-empty">

            <div className="gallery-empty-icon">
              ⏳
            </div>

            <h3>
              Loading Gallery...
            </h3>

            <p>
              Please wait...
            </p>

          </div>


        ) : filteredGallery.length === 0 ? (

          /* EMPTY */

          <div className="gallery-empty">

            <div className="gallery-empty-icon">
              🖼️
            </div>

            <h3>
              No Images Found
            </h3>

            <p>
              Try changing your search
              or add a new image.
            </p>

            <button
              type="button"
              className="empty-add-btn"
              onClick={openAddModal}
            >
              ＋ Add Image
            </button>

          </div>


        ) : (

          /* =================================================
             GRID
          ================================================= */

          <div className="gallery-grid">

            {filteredGallery.map(
              (item) => {

                const categoryStyle =
                  getCategoryStyle(
                    item.category
                  );


                return (

                  <div
                    key={item.id}
                    className="gallery-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      minHeight: "275px",
                      height: "auto",
                      overflow: "hidden",
                      background: "#ffffff",
                    }}
                  >


                    {/* =====================================
                        IMAGE
                    ===================================== */}

                    <div
                      className="gallery-image-wrapper"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "190px",
                        minHeight: "190px",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >

                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={
                          item.title ||
                          "Gallery Image"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/gallery_campus.png";
                        }}
                      />


                      {/* VIEW */}

                      <div
                        className="gallery-image-overlay"
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "rgba(15,23,42,0.48)",
                          opacity: 0,
                          transition:
                            "opacity .25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "0";
                        }}
                      >

                        <button
                          type="button"
                          className="gallery-view-btn"
                          onClick={() =>
                            viewImage(
                              item.image,
                              item.title
                            )
                          }
                        >
                          👁️ View
                        </button>

                      </div>

                    </div>



                    {/* =====================================
                        CARD DETAILS
                        UNIQUE CLASS - NO OLD CSS CONFLICT
                    ===================================== */}

                    <div
                      className="gallery-card-details"
                      style={{
                        display: "flex",
                        width: "100%",
                        minHeight: "85px",
                        height: "85px",
                        padding: "14px",
                        boxSizing: "border-box",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        background: "#ffffff",
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 10,
                      }}
                    >


                      {/* TITLE */}

                      <div
                        className="gallery-card-text"
                        style={{
                          display: "block",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >

                        <h3
                          style={{
                            display: "block",
                            margin: "0 0 8px",
                            padding: 0,
                            color: "#111827",
                            fontSize: "16px",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title ||
                            "Untitled Image"}
                        </h3>


                        {/* CATEGORY */}

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding:
                              "5px 11px",
                            borderRadius:
                              "999px",
                            fontSize: "12px",
                            fontWeight: 700,
                            ...categoryStyle,
                          }}
                        >
                          {item.category ||
                            "Campus"}
                        </span>

                      </div>



                      {/* =================================
                          ACTION BUTTONS
                      ================================= */}

                      <div
                        className="gallery-card-actions"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "flex-end",
                          gap: "8px",
                          flexShrink: 0,
                          position:
                            "relative",
                          zIndex: 50,
                        }}
                      >


                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              item
                            )
                          }
                          title="Edit Image"
                          aria-label="Edit Image"
                          style={{
                            width: "42px",
                            height: "42px",
                            minWidth: "42px",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            padding: 0,
                            margin: 0,
                            border:
                              "1px solid #dbeafe",
                            borderRadius:
                              "10px",
                            background:
                              "#eff6ff",
                            color:
                              "#2563eb",
                            fontSize:
                              "18px",
                            cursor:
                              "pointer",
                            boxSizing:
                              "border-box",
                          }}
                        >
                          ✏️
                        </button>



                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteImage(
                              item.id
                            )
                          }
                          title="Delete Image"
                          aria-label="Delete Image"
                          style={{
                            width: "42px",
                            height: "42px",
                            minWidth: "42px",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            padding: 0,
                            margin: 0,
                            border:
                              "1px solid #fecdd3",
                            borderRadius:
                              "10px",
                            background:
                              "#fff1f2",
                            color:
                              "#ef4444",
                            fontSize:
                              "18px",
                            cursor:
                              "pointer",
                            boxSizing:
                              "border-box",
                          }}
                        >
                          🗑️
                        </button>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>



      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="gallery-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="gallery-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* HEADER */}

            <div className="gallery-modal-header">

              <div>

                <h2>
                  {editingItem
                    ? "Edit Gallery Image"
                    : "Add Gallery Image"}
                </h2>

                <p>
                  Upload image from your PC.
                </p>

              </div>


              <button
                type="button"
                className="gallery-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>



            {/* FORM */}

            <form
              className="gallery-form"
              onSubmit={handleSubmit}
            >


              {/* TITLE */}

              <div className="gallery-form-group">

                <label>
                  Image Title
                  <span> *</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Computer Lab"
                  required
                />

              </div>



              {/* CATEGORY */}

              <div className="gallery-form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >

                  <option value="Campus">
                    Campus
                  </option>

                  <option value="Facilities">
                    Facilities
                  </option>

                  <option value="Events">
                    Events
                  </option>

                  <option value="Students">
                    Students
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>



              {/* UPLOAD */}

              <div className="gallery-form-group">

                <label>
                  Upload Image

                  {!editingItem && (
                    <span> *</span>
                  )}

                </label>


                <label
                  className="gallery-upload-box"
                  style={{
                    cursor: "pointer",
                  }}
                >

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    hidden
                    onChange={
                      handleImageChange
                    }
                  />


                  <div className="gallery-upload-icon">
                    📷
                  </div>


                  <strong>

                    {selectedImage
                      ? selectedImage.name
                      : editingItem
                      ? "Choose new image (optional)"
                      : "Choose Image from PC"}

                  </strong>


                  <small>
                    JPG, PNG, WEBP or GIF
                    <br />
                    Maximum 5 MB
                  </small>

                </label>



                {/* PREVIEW */}

                {imagePreview && (

                  <div className="gallery-preview">

                    <div className="gallery-preview-header">

                      <p>
                        Image Preview
                      </p>

                      {selectedImage && (

                        <span>
                          {(
                            selectedImage.size /
                            1024 /
                            1024
                          ).toFixed(2)}
                          {" "}MB
                        </span>

                      )}

                    </div>


                    <div className="gallery-preview-image">

                      <img
                        src={imagePreview}
                        alt="Preview"
                      />

                    </div>

                  </div>

                )}

              </div>



              {/* FOOTER */}

              <div className="gallery-modal-footer">

                <button
                  type="button"
                  className="gallery-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="gallery-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Update Image"
                    : "Add Image"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* =================================================
          IMAGE VIEWER
      ================================================= */}

      {viewerImage && (

        <div
          className="gallery-image-viewer-overlay"
          onClick={closeImageViewer}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background:
              "rgba(0,0,0,.78)",
            backdropFilter:
              "blur(5px)",
          }}
        >

          <div
            className="gallery-image-viewer"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              position: "relative",
              width: "min(900px, 94vw)",
              maxHeight: "90vh",
              overflow: "hidden",
              background:
                "#ffffff",
              borderRadius:
                "16px",
            }}
          >


            {/* CLOSE */}

            <button
              type="button"
              onClick={closeImageViewer}
              title="Close"
              aria-label="Close"
              style={{
                position:
                  "absolute",
                top: "12px",
                right: "12px",
                zIndex: 20,
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                border: "none",
                borderRadius:
                  "50%",
                background:
                  "#ffffff",
                color:
                  "#111827",
                fontSize:
                  "30px",
                lineHeight: 1,
                cursor:
                  "pointer",
                boxShadow:
                  "0 5px 18px rgba(0,0,0,.25)",
              }}
            >
              ×
            </button>



            {/* IMAGE */}

            <div
              style={{
                width: "100%",
                maxHeight:
                  "calc(90vh - 55px)",
                padding: "20px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "#111827",
              }}
            >

              <img
                src={viewerImage}
                alt={viewerTitle}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight:
                    "calc(90vh - 100px)",
                  width: "auto",
                  height: "auto",
                  objectFit:
                    "contain",
                  borderRadius:
                    "8px",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "/images/gallery_campus.png";
                }}
              />

            </div>



            {/* TITLE */}

            <div
              style={{
                padding:
                  "13px 18px",
                textAlign:
                  "center",
                color:
                  "#111827",
                background:
                  "#ffffff",
                fontSize:
                  "16px",
                fontWeight:
                  700,
              }}
            >
              {viewerTitle}
            </div>

          </div>

        </div>

      )}

    </div>
  );
}


export default AdminGallery;