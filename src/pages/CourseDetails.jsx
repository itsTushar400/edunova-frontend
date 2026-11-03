
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import "./CourseDetails.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const COURSE_IMAGES = {
  "full-stack-web-development": "/images/course_full_stack_web_development.png",
  "python-programming": "/images/course_python_programming.png",
  "java-programming": "/images/course_java_programming.png",
  "react-js-development": "/images/course_react_js_development.png",
  "data-science-ai": "/images/course_data_science_ai.png",
  "cyber-security": "/images/course_cyber_security.png",
  "ui-ux-designing": "/images/course_ui_ux_designing.png",
  "graphic-designing": "/images/course_graphic_designing.png",
  "digital-marketing": "/images/course_digital_marketing.png",
  "computer-basics-ms-office": "/images/course_ms_office.png",
};

const getSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  const path = image.trim().replace(/\\/g, "/");

  if (/^(https?:)?\/\//i.test(path)) return path;

  if (path.startsWith("/uploads/")) return `${API_URL}${path}`;

  if (path.startsWith("uploads/")) return `${API_URL}/${path}`;

  if (path.startsWith("/")) return path;

  return `/images/${path.split("/").pop()}`;
};

const parseList = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value !== "string" || !value.trim()) return [];

  const trimmedValue = value.trim();

  if (trimmedValue.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmedValue);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fall back to the supported comma-separated format.
    }
  }

  return trimmedValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Contact for fees";
  }

  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN")}`
    : String(value);
};

function CourseDetails() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pageRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);

  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState("");

  const [openModule, setOpenModule] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const selectedCourse = location.state?.course;

  // Scroll to top when course page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Fetch all courses
  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/courses`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success === false) {
          throw new Error(result.message || "Unable to load courses");
        }

        setCourses(
          Array.isArray(result) ? result : result.data || []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Course API Error:", err);
          setError(err.message || "Unable to connect to server");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => controller.abort();
  }, []);

  // Find selected course using URL slug
  const course = useMemo(() => {
    const found = courses.find(
      (item) => (item.slug || getSlug(item.title)) === slug
    );

    if (found) return found;

    if (
      selectedCourse &&
      (!slug ||
        slug === selectedCourse.slug ||
        slug === getSlug(selectedCourse.title))
    ) {
      return selectedCourse;
    }

    return null;
  }, [courses, slug, selectedCourse]);

  // Fetch dynamic modules and projects for selected course
  useEffect(() => {
    if (!course?.id) {
      setModules([]);
      setProjects([]);
      return undefined;
    }

    const controller = new AbortController();

    const loadContent = async () => {
      try {
        setContentLoading(true);
        setContentError("");

        const [moduleResponse, projectResponse] = await Promise.all([
          fetch(`${API_URL}/api/courses/${course.id}/modules`, {
            signal: controller.signal,
          }),
          fetch(`${API_URL}/api/courses/${course.id}/projects`, {
            signal: controller.signal,
          }),
        ]);

        const [moduleResult, projectResult] = await Promise.all([
          moduleResponse.json(),
          projectResponse.json(),
        ]);

        if (!moduleResponse.ok) {
          throw new Error(
            moduleResult.message || "Unable to load modules"
          );
        }

        if (!projectResponse.ok) {
          throw new Error(
            projectResult.message || "Unable to load projects"
          );
        }

        const moduleRows = Array.isArray(moduleResult)
          ? moduleResult
          : moduleResult.data || [];

        const projectRows = Array.isArray(projectResult)
          ? projectResult
          : projectResult.data || [];

        setModules(
          [...moduleRows].sort(
            (a, b) =>
              Number(a.sort_order || 0) - Number(b.sort_order || 0)
          )
        );

        setProjects(
          [...projectRows].sort(
            (a, b) =>
              Number(a.sort_order || 0) - Number(b.sort_order || 0)
          )
        );

        setOpenModule(0);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Course content error:", err);

          setContentError(
            err.message || "Unable to load course content"
          );

          setModules([]);
          setProjects([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setContentLoading(false);
        }
      }
    };

    loadContent();

    return () => controller.abort();
  }, [course?.id]);

  // Scroll reveal animation
  useEffect(() => {
    const root = pageRef.current;

    if (!root) return undefined;

    const selectors = [
      [".cd-hero-image", "from-left"],
      [".cd-hero-content", "from-right"],
      [".cd-overview-copy", "from-left"],
      [".cd-journey-card", "from-right"],
      [".cd-section-heading", "from-left"],
      [".cd-module", "from-right"],
      [".cd-project-card", "from-left"],
      [".cd-feature-card", "from-bottom"],
      [".cd-tool", "from-bottom"],
      [".cd-review-card", "from-bottom"],
      [".cd-faq", "from-right"],
      [".cd-related-card", "from-bottom"],
      [".cd-cta-inner > *", "from-left"],
    ];

    selectors.forEach(([selector, direction]) => {
      root.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("cd-reveal", `cd-${direction}`);

        element.style.setProperty(
          "--reveal-delay",
          `${(index % 4) * 90}ms`
        );
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cd-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px",
      }
    );

    root.querySelectorAll(".cd-reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [course, modules, projects, contentLoading]);

  // Related courses
  const relatedCourses = useMemo(() => {
    return courses
      .filter((item) => String(item.id) !== String(course?.id))
      .slice(0, 6);
  }, [courses, course]);

  // Enquiry navigation
  const enquireNow = () => {
    navigate("/course-enquiry", {
      state: { course },
    });
  };

  // Loading screen
  if (loading) {
    return (
      <div className="cd-state">
        <div className="cd-spinner" />
        <h2>Loading course details...</h2>
        <p>Preparing your learning experience</p>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="cd-state">
        <span className="cd-state-icon">!</span>

        <h2>
          {error ? "Unable to load course" : "Course not found"}
        </h2>

        <p>
          {error ||
            "This course may have been removed or is unavailable."}
        </p>

        <button
          className="cd-button"
          onClick={() => navigate("/")}
        >
          Explore Courses
        </button>
      </div>
    );
  }

  const title = course.title || "Professional Course";

  const image =
    getImageUrl(course.image) ||
    COURSE_IMAGES[getSlug(title)] ||
    "";

  const learning = parseList(
    course.learning_outcomes || course.learning
  );

  const tools = parseList(course.tools);
  const benefits = parseList(course.benefits);
  const faqs = parseList(course.faqs);

  const testimonials = parseList(
    course.testimonials || course.reviews
  );

  const highlights = parseList(course.highlights);

  return (
    <div className="cd-page" ref={pageRef}>
      {/* NAVBAR */}
      <header className="cd-navbar">
        <div className="cd-nav-inner">
          <Link to="/" className="cd-brand">
            <span className="cd-brand-mark">E</span>

            <span>
              <strong>EduNova</strong>
              <small>Learn. Grow. Build.</small>
            </span>
          </Link>

          <button
            type="button"
            className={`cd-menu-toggle${navOpen ? " is-open" : ""}`}
            onClick={() => setNavOpen((isOpen) => !isOpen)}
            aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={navOpen}
            aria-controls="course-navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="course-navigation"
            className={`cd-nav-links${navOpen ? " is-open" : ""}`}
          >
            <Link to="/" onClick={() => setNavOpen(false)}>Home</Link>

            <Link to="/#courses" onClick={() => setNavOpen(false)}>
              All Courses
            </Link>

            <button className="cd-nav-cta" onClick={() => {
              setNavOpen(false);
              enquireNow();
            }}>
              Enquire Now ↗
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="cd-hero">
          <div className="cd-container cd-hero-grid">
            <div className="cd-hero-image">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  onError={(e) => {
                    const fallback =
                      COURSE_IMAGES[getSlug(title)];

                    if (
                      fallback &&
                      e.currentTarget.src !==
                        new URL(fallback, window.location.href).href
                    ) {
                      e.currentTarget.src = fallback;
                    } else {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                />
              ) : (
                <div className="cd-image-placeholder">
                  🎓
                  <span>{title}</span>
                </div>
              )}

              <div className="cd-image-chip">
                ✦ Professional Training
              </div>

            </div>

            <div className="cd-hero-content">
              <div className="cd-breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/#courses">Courses</Link>
                <span>/</span>
                <b>{title}</b>
              </div>

              <span className="cd-eyebrow">
                COURSE DETAILS
              </span>

              <h1>{title}</h1>

              <p className="cd-hero-description">
                {course.description ||
                  "Build practical skills with structured, industry-focused training."}
              </p>

              <div className="cd-meta-grid">
                <div className="cd-meta-card">
                  <span>COURSE DURATION</span>
                  <strong>
                    ◷ {course.duration || "Contact us"}
                  </strong>
                </div>

                <div className="cd-meta-card">
                  <span>COURSE FEES</span>
                  <strong>{formatPrice(course.fees)}</strong>
                </div>

                <div className="cd-meta-card">
                  <span>LEARNING MODE</span>
                  <strong>{course.mode || "Contact us"}</strong>
                </div>
              </div>

              <button
                className="cd-button cd-hero-button"
                onClick={enquireNow}
              >
                Enquire About This Course
                <span>→</span>
              </button>

              <div className="cd-trust-row">
                <span>✓ Professional Training</span>
                <span>✓ Practical Learning</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT COURSE */}
        <section className="cd-section cd-overview">
          <div className="cd-container cd-overview-grid">
            <div className="cd-overview-copy">
              <span className="cd-eyebrow">
                ABOUT THE COURSE
              </span>

              <h2>
                Build Skills That{" "}
                <em>Create Opportunities.</em>
              </h2>

              <p>
                {course.overview ||
                  course.description ||
                  "Learn new skills, practice concepts and develop your professional knowledge."}
              </p>

              {highlights.length > 0 && (
                <div className="cd-highlights">
                  {highlights.map((item, i) => (
                    <span key={i}>
                      ✓{" "}
                      {typeof item === "string"
                        ? item
                        : item.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <aside className="cd-journey-card">
              <div className="cd-journey-icon">🎯</div>

              <span className="cd-card-kicker">
                YOUR LEARNING JOURNEY
              </span>

              <h3>Learn. Practice. Build.</h3>

              <p>
                Develop professional knowledge through
                structured lessons and practical projects.
              </p>

              <div className="cd-stats">
                <div>
                  <strong>
                    {contentLoading ? "…" : modules.length}
                  </strong>
                  <span>Modules</span>
                </div>

                <div>
                  <strong>
                    {contentLoading ? "…" : projects.length}
                  </strong>
                  <span>Projects</span>
                </div>

                <div>
                  <strong>{course.duration || "—"}</strong>
                  <span>Duration</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* LEARNING OUTCOMES */}
        {learning.length > 0 && (
          <section className="cd-section cd-soft-section">
            <div className="cd-container">
              <div className="cd-section-heading">
                <span className="cd-eyebrow">
                  LEARNING OUTCOMES
                </span>

                <h2>
                  What You'll <em>Learn</em>
                </h2>

                <p>
                  Skills and knowledge included in this course.
                </p>
              </div>

              <div className="cd-feature-grid">
                {learning.map((item, i) => (
                  <article
                    className="cd-feature-card"
                    key={i}
                  >
                    <span className="cd-feature-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      {typeof item === "string"
                        ? item
                        : item.title}
                    </h3>

                    {item.description && (
                      <p>{item.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COURSE CURRICULUM */}
        <section className="cd-section">
          <div className="cd-container cd-curriculum-grid">
            <div className="cd-section-heading cd-sticky-heading">
              <span className="cd-eyebrow">
                COURSE CURRICULUM
              </span>

              <h2>
                Complete Learning <em>Roadmap</em>
              </h2>

              <p>
                Explore the modules covered in this course,
                step by step.
              </p>

              <div className="cd-count-pill">
                <strong>
                  {contentLoading ? "…" : modules.length}
                </strong>

                <span>Learning Modules</span>
              </div>
            </div>

            <div className="cd-module-list">
              {contentLoading ? (
                <div className="cd-empty-state">
                  Loading course modules...
                </div>
              ) : contentError ? (
                <div className="cd-empty-state cd-error-text">
                  {contentError}
                </div>
              ) : modules.length === 0 ? (
                <div className="cd-empty-state">
                  Course modules will be added soon.
                </div>
              ) : (
                modules.map((module, index) => {
                  const topics = parseList(module.topics);
                  const expanded = openModule === index;

                  return (
                    <article
                      className={`cd-module ${
                        expanded ? "is-open" : ""
                      }`}
                      key={module.id || index}
                    >
                      <button
                        className="cd-module-toggle"
                        onClick={() =>
                          setOpenModule(
                            expanded ? null : index
                          )
                        }
                        aria-expanded={expanded}
                      >
                        <span className="cd-module-number">
                          {String(
                            module.sort_order || index + 1
                          ).padStart(2, "0")}
                        </span>

                        <span className="cd-module-name">
                          {module.title ||
                            `Module ${index + 1}`}
                        </span>

                        <span className="cd-module-symbol">
                          {expanded ? "−" : "+"}
                        </span>
                      </button>

                      {expanded && (
                        <div className="cd-module-body">
                          {module.description && (
                            <p className="cd-module-description">
                              {module.description}
                            </p>
                          )}

                          {topics.length > 0 && (
                            <>
                              <span className="cd-topic-label">
                                TOPICS COVERED
                              </span>

                              <ul className="cd-topic-list">
                                {topics.map((topic, i) => (
                                  <li key={i}>
                                    <span>✓</span>

                                    {typeof topic === "string"
                                      ? topic
                                      : topic.title}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* TOOLS AND TECHNOLOGIES */}
        {tools.length > 0 && (
          <section className="cd-section cd-soft-section">
            <div className="cd-container">
              <div className="cd-section-heading">
                <span className="cd-eyebrow">
                  SOFTWARE & TECHNOLOGY
                </span>

                <h2>
                  Tools You'll <em>Explore</em>
                </h2>
              </div>

              <div className="cd-tools-grid">
                {tools.map((tool, i) => (
                  <div className="cd-tool" key={i}>
                    <span>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <strong>
                      {typeof tool === "string"
                        ? tool
                        : tool.name}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PRACTICAL PROJECTS */}
        <section className="cd-section">
          <div className="cd-container">
            <div className="cd-section-heading">
              <span className="cd-eyebrow">
                PRACTICAL TRAINING
              </span>

              <h2>
                Build Real <em>Projects</em>
              </h2>

              <p>
                Turn your knowledge into practical experience.
              </p>
            </div>

            {contentLoading ? (
              <div className="cd-empty-state">
                Loading course projects...
              </div>
            ) : contentError ? (
              <div className="cd-empty-state cd-error-text">
                {contentError}
              </div>
            ) : projects.length === 0 ? (
              <div className="cd-empty-state">
                Projects will be added soon.
              </div>
            ) : (
              <div className="cd-project-grid">
                {projects.map((project, i) => {
                  const technologies = parseList(
                    project.technologies
                  );

                  return (
                    <article
                      className="cd-project-card"
                      key={project.id || i}
                    >
                      <div className="cd-project-top">
                        <span className="cd-project-icon">
                          ↗
                        </span>

                        <span className="cd-project-number">
                          PROJECT{" "}
                          {String(
                            project.sort_order || i + 1
                          ).padStart(2, "0")}
                        </span>
                      </div>

                      <h3>
                        {project.title || `Project ${i + 1}`}
                      </h3>

                      {project.description && (
                        <p>{project.description}</p>
                      )}

                      {technologies.length > 0 && (
                        <div className="cd-tech-line">
                          <b>TECH STACK</b>

                          <div className="cd-tech-list">
                            {technologies.map((tech, index) => (
                              <span key={index}>
                                {typeof tech === "string"
                                  ? tech
                                  : tech.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.project_url && (
                        <a
                          className="cd-project-link"
                          href={project.project_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Project <span>↗</span>
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        {benefits.length > 0 && (
          <section className="cd-section cd-soft-section">
            <div className="cd-container">
              <div className="cd-section-heading">
                <span className="cd-eyebrow">
                  WHY CHOOSE EDUNOVA
                </span>

                <h2>
                  Learn With <em>Confidence</em>
                </h2>
              </div>

              <div className="cd-feature-grid">
                {benefits.map((benefit, i) => (
                  <article
                    className="cd-feature-card"
                    key={i}
                  >
                    <span className="cd-benefit-symbol">
                      ✦
                    </span>

                    <h3>
                      {typeof benefit === "string"
                        ? benefit
                        : benefit.title}
                    </h3>

                    {benefit.description && (
                      <p>{benefit.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STUDENT REVIEWS */}
        {testimonials.length > 0 && (
          <section className="cd-section">
            <div className="cd-container">
              <div className="cd-section-heading">
                <span className="cd-eyebrow">
                  STUDENT EXPERIENCES
                </span>

                <h2>
                  What Students <em>Say</em>
                </h2>
              </div>

              <div className="cd-review-grid">
                {testimonials.map((review, i) => (
                  <article
                    className="cd-review-card"
                    key={review.id || i}
                  >
                    <div className="cd-stars">
                      ★★★★★
                    </div>

                    <p>
                      “
                      {review.text ||
                        review.comment ||
                        review.review}
                      ”
                    </p>

                    <strong>
                      {review.name || review.student_name}
                    </strong>

                    <small>
                      {review.course || title}
                    </small>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="cd-section cd-soft-section">
            <div className="cd-container cd-faq-layout">
              <div className="cd-section-heading">
                <span className="cd-eyebrow">
                  NEED HELP?
                </span>

                <h2>
                  Frequently Asked <em>Questions</em>
                </h2>

                <p>
                  Find answers to common questions about this
                  course.
                </p>
              </div>

              <div className="cd-faq-list">
                {faqs.map((faq, i) => (
                  <details className="cd-faq" key={i}>
                    <summary>
                      {typeof faq === "string"
                        ? faq
                        : faq.question}

                      <span>+</span>
                    </summary>

                    <p>
                      {typeof faq === "string"
                        ? "Please contact our institute for more information."
                        : faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RELATED COURSES */}
        {relatedCourses.length > 0 && (
          <section className="cd-section">
            <div className="cd-container">
              <div className="cd-section-heading cd-related-heading">
                <div>
                  <span className="cd-eyebrow">
                    EXPLORE MORE
                  </span>

                  <h2>
                    Related <em>Courses</em>
                  </h2>
                </div>

                <span className="cd-scroll-hint">
                  Scroll to explore →
                </span>
              </div>

              <div className="cd-related-track">
                {relatedCourses.map((item) => {
                  const itemImage =
                    getImageUrl(item.image) ||
                    COURSE_IMAGES[getSlug(item.title)] ||
                    "";

                  return (
                    <article
                      className="cd-related-card"
                      key={item.id}
                    >
                      {itemImage && (
                        <img
                          src={itemImage}
                          alt={item.title}
                          loading="lazy"
                        />
                      )}

                      <div className="cd-related-body">
                        <h3>{item.title}</h3>

                        <p>
                          {item.duration || "Flexible duration"}
                        </p>

                        <strong>
                          {formatPrice(item.fees)}
                        </strong>

                        <button
                          onClick={() =>
                            navigate(
                              `/courses/${
                                item.slug || getSlug(item.title)
                              }`,
                              {
                                state: { course: item },
                              }
                            )
                          }
                        >
                          View Course <span>→</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* CALL TO ACTION */}
      <section className="cd-cta">
        <div className="cd-container cd-cta-inner">
          <div>
            <span>YOUR FUTURE STARTS HERE</span>

            <h2>
              Ready to Start Your Learning Journey?
            </h2>

            <p>
              Connect with our team to learn more about this
              course.
            </p>
          </div>

          <button onClick={enquireNow}>
            Enquire Now <span>→</span>
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default CourseDetails;
