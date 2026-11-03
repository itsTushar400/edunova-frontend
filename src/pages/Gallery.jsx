import { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const getImageUrl = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  if (image.startsWith("/images/")) {
    return image;
  }

  return `/images/${image}`;
};

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/gallery`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load gallery"
        );
      }

      setGallery(
        Array.isArray(result.data) ? result.data : []
      );
    } catch (err) {
      console.error("Gallery API Error:", err);
      setError("Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(
      gallery
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const filteredGallery =
    category === "All"
      ? gallery
      : gallery.filter(
          (item) => item.category === category
        );

  return (
    <div className="gallery-page">

      {/* NAVBAR */}
      <header className="gallery-navbar">
        <div className="gallery-nav-inner">

          <a href="/" className="gallery-brand">
            <span className="gallery-brand-icon">E</span>

            <div>
              <strong>EduNova</strong>
              <small>Learn • Grow • Build</small>
            </div>
          </a>

          <nav>
            <a href="/">Home</a>
            <a href="/#about">About</a>
            <a href="/#courses">Courses</a>
            <a href="/#faculty">Faculty</a>
            <a className="active" href="/gallery">
              Gallery
            </a>
            <a href="/#contact">Contact</a>
          </nav>

          <a
            href="/#admission"
            className="gallery-apply-btn"
          >
            Apply Now →
          </a>

        </div>
      </header>

      {/* HERO */}
      <section className="gallery-hero">
        <span>OUR CAMPUS</span>

        <h1>
          Moments From Our{" "}
          <em>Campus</em>
        </h1>

        <p>
          Explore our campus, classrooms, laboratories,
          events and student activities.
        </p>
      </section>

      {/* CATEGORY FILTER */}
      {!loading && gallery.length > 0 && (
        <div className="gallery-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <main className="gallery-container">

        {loading && (
          <div className="gallery-loading">
            <div className="gallery-spinner"></div>
            <p>Loading gallery...</p>
          </div>
        )}

        {!loading && error && (
          <div className="gallery-error">
            <div>⚠️</div>
            <h3>{error}</h3>
            <button onClick={loadGallery}>
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredGallery.length === 0 && (
            <div className="gallery-empty">
              <div>🖼️</div>
              <h2>No Gallery Images</h2>
              <p>
                Gallery images will appear here
                when they are added by admin.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredGallery.length > 0 && (
            <div className="gallery-grid-page">

              {filteredGallery.map((item) => (
                <article
                  className="gallery-card-page"
                  key={item.id}
                  onClick={() =>
                    setSelectedImage(item)
                  }
                >
                  <div className="gallery-card-image">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <div className="gallery-overlay">
                      <span>⌕</span>
                      <strong>View Image</strong>
                    </div>
                  </div>

                  <div className="gallery-card-info">
                    <h3>{item.title}</h3>

                    <span>
                      {item.category || "Campus"}
                    </span>
                  </div>
                </article>
              ))}

            </div>
          )}
      </main>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="gallery-lightbox"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <button
            className="gallery-lightbox-close"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            ×
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={getImageUrl(
                selectedImage.image
              )}
              alt={selectedImage.title}
            />

            <div className="gallery-lightbox-info">
              <h2>
                {selectedImage.title}
              </h2>

              <span>
                {selectedImage.category ||
                  "Campus"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="gallery-footer">
        <span>EduNova</span>
        <span>
          © 2026 Tushar Chauhan
        </span>
      </footer>

    </div>
  );
}

export default Gallery;