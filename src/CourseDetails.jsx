import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CourseDetails.css";

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

  const [openModule, setOpenModule] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState("");

  const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  useEffect(() => {
    if (!course?.id) {
      setContentLoading(false);
      setContentError("Course ID is missing. Please open this page from the course listing.");
      return;
    }

    const controller = new AbortController();

    const fetchCourseContent = async () => {
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

        const [moduleData, projectData] = await Promise.all([
          moduleResponse.json(),
          projectResponse.json(),
        ]);

        if (!moduleResponse.ok) {
          throw new Error(moduleData.message || "Unable to load course modules.");
        }

        if (!projectResponse.ok) {
          throw new Error(projectData.message || "Unable to load course projects.");
        }

        const moduleItems = Array.isArray(moduleData.data) ? moduleData.data : [];
        const projectItems = Array.isArray(projectData.data) ? projectData.data : [];

        setCurriculum(
          [...moduleItems].sort(
            (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
          )
        );

        setProjects(
          [...projectItems].sort(
            (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
          )
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Course content loading error:", error);
          setContentError(error.message || "Unable to load course content.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setContentLoading(false);
        }
      }
    };

    fetchCourseContent();

    return () => controller.abort();
  }, [course?.id, API_URL]);

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course Not Found</h2>
        <button onClick={() => navigate("/")}>
          Back to Courses
        </button>
      </div>
    );
  }

  const tools = [
    "Photoshop",
    "Illustrator",
    "Figma",
    "Canva",
    "InDesign",
    "CorelDRAW",
  ];

  const benefits = [
    ["🎓", "Certificate", "Get a certificate after successful completion."],
    ["💻", "Practical Projects", "Work on real-world design projects."],
    ["👨‍🏫", "Expert Mentorship", "Learn with professional guidance."],
    ["📁", "Portfolio Building", "Build a strong professional portfolio."],
    ["💼", "Career Guidance", "Get career and interview guidance."],
    ["🚀", "Industry Skills", "Learn tools used in the industry."],
  ];

  const faqs = [
    "Is this course beginner friendly?",
    "Will I get a certificate?",
    "Are practical projects included?",
    "What software will I learn?",
    "Is placement assistance available?",
  ];

const enquireNow = () => {
  navigate("/course-enquiry", {
    state: {
      course: course,
    },
  });
};

  return (
    <div className="course-details-page">

      {/* NAVBAR */}
      <header className="course-nav-bar">
        <div className="course-nav-inner">

          <div
            className="course-logo"
            onClick={() => navigate("/")}
          >
            <span>E</span>
            <div>
              <strong>EduNova</strong>
              <small>Learn • Grow • Build</small>
            </div>
          </div>

          <button
            className="back-courses"
            onClick={() => navigate("/")}
          >
            ← All Courses
          </button>

        </div>
      </header>


      {/* HERO */}
      <section className="course-hero">

        <div className="course-container course-hero-grid">

          <div className="course-hero-image">
            <img
              src={course.image}
              alt={course.title}
            />

            <div className="image-floating-badge">
              ⭐ 4.8 Rated Course
            </div>
          </div>


          <div className="course-hero-content">

            <span className="course-label">
              COURSE DETAILS
            </span>

            <h1>{course.title}</h1>

            <p className="course-short-description">
              {course.description}
            </p>

            <div className="course-meta">

              <div className="meta-item">
                <span>Duration</span>
                <strong>📅 {course.duration}</strong>
              </div>

              <div className="meta-item">
                <span>Course Fee</span>
                <strong>
                  ₹{Number(course.fees).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="meta-item">
                <span>Mode</span>
                <strong>💻 Offline / Online</strong>
              </div>

            </div>

            <button
              className="hero-enquire-btn"
              onClick={enquireNow}
            >
              Enquire Now <span>→</span>
            </button>

          </div>

        </div>

      </section>


      {/* OVERVIEW */}
      <section className="overview-section">

        <div className="course-container overview-grid">

          <div className="overview-content">

            <span className="section-kicker">
              COURSE OVERVIEW
            </span>

            <h2>
              Build Skills That
              <span> Create Opportunities</span>
            </h2>

            <p>
              This course is designed to provide practical,
              industry-focused knowledge and hands-on experience.
              You will learn professional tools, design concepts
              and real-world project workflows.
            </p>

            <p>
              From fundamentals to advanced concepts, the training
              focuses on creating practical projects and building
              a strong professional portfolio.
            </p>

            <div className="overview-checks">
              <span>✓ Beginner Friendly</span>
              <span>✓ Practical Training</span>
              <span>✓ Industry Projects</span>
              <span>✓ Career Guidance</span>
            </div>

          </div>


          <div className="overview-stat-card">

            <div className="big-stat">
              <strong>100%</strong>
              <span>Practical Learning</span>
            </div>

            <div className="stat-divider"></div>

            <div className="small-stat-row">

              <div>
                <strong>{contentLoading ? "…" : projects.length}</strong>
                <span>Projects</span>
              </div>

              <div>
                <strong>{contentLoading ? "…" : curriculum.length}</strong>
                <span>Modules</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Certificate</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* WHAT YOU LEARN */}
      <section className="learn-section">

        <div className="course-container">

          <div className="section-heading center">

            <span className="section-kicker">
              WHAT YOU'LL LEARN
            </span>

            <h2>
              Master Professional
              <span> Skills</span>
            </h2>

            <p>
              Learn everything you need to start your career
              with confidence.
            </p>

          </div>


          <div className="learn-grid">

            {[
              ["🎨", "Creative Design", "Create attractive and professional designs."],
              ["🖌️", "Graphic Tools", "Master industry-standard design software."],
              ["💡", "Design Thinking", "Understand concepts behind great designs."],
              ["📱", "Digital Design", "Create modern social media graphics."],
              ["🏷️", "Branding", "Build professional brand identities."],
              ["📁", "Portfolio", "Create a job-ready design portfolio."],
            ].map((item, index) => (
              <div className="learn-card" key={index}>
                <div className="learn-icon">{item[0]}</div>
                <h3>{item[1]}</h3>
                <p>{item[2]}</p>
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* CURRICULUM */}
      <section className="curriculum-section">

        <div className="course-container curriculum-grid">

          <div>

            <div className="section-heading">

              <span className="section-kicker">
                COURSE CURRICULUM
              </span>

              <h2>
                Complete Learning
                <span> Roadmap</span>
              </h2>

              <p>
                Follow our structured modules from basics
                to advanced professional skills.
              </p>

            </div>

          </div>


          <div className="curriculum-list">

            {contentLoading ? (
              <p className="course-content-message">Loading course modules...</p>
            ) : contentError ? (
              <p className="course-content-message">{contentError}</p>
            ) : curriculum.length === 0 ? (
              <p className="course-content-message">Modules will be added soon.</p>
            ) : (
              curriculum.map((item, index) => (
                <div
                  className={`curriculum-item ${
                    openModule === index ? "active" : ""
                  }`}
                  key={item.id || index}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenModule(openModule === index ? null : index)
                    }
                  >
                    <span className="module-number">
                      {String(item.sort_order || index + 1).padStart(2, "0")}
                    </span>

                    <span className="module-title">{item.title}</span>

                    <span className="module-plus">
                      {openModule === index ? "−" : "+"}
                    </span>
                  </button>

                  {openModule === index && (
                    <div className="module-content">
                      {item.description && <p>{item.description}</p>}
                      {item.topics && <p>{item.topics}</p>}
                    </div>
                  )}
                </div>
              ))
            )}

          </div>

        </div>

      </section>


      {/* TOOLS */}
      <section className="tools-section">

        <div className="course-container">

          <div className="section-heading center">

            <span className="section-kicker">
              SOFTWARE & TOOLS
            </span>

            <h2>
              Tools You'll
              <span> Master</span>
            </h2>

          </div>


          <div className="tools-grid">

            {tools.map((tool, index) => (
              <div className="tool-card" key={index}>
                <div className="tool-number">
                  0{index + 1}
                </div>

                <strong>{tool}</strong>

                <span>Professional Training</span>
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* PROJECTS */}
      <section className="projects-section">

        <div className="course-container">

          <div className="section-heading center">

            <span className="section-kicker">
              PRACTICAL TRAINING
            </span>

            <h2>
              Build Real
              <span> Projects</span>
            </h2>

            <p>
              Practice what you learn through real-world projects.
            </p>

          </div>


          <div className="projects-grid">

            {contentLoading ? (
              <p className="course-content-message">Loading course projects...</p>
            ) : projects.length === 0 ? (
              <p className="course-content-message">Projects will be added soon.</p>
            ) : (
              projects.map((project, index) => (
                <div className="project-card" key={project.id || index}>
                  <div className="project-icon">✓</div>

                  <div>
                    <strong>{project.title}</strong>
                    {project.description && <p>{project.description}</p>}
                    {project.technologies && (
                      <span>Technologies: {project.technologies}</span>
                    )}
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View project →
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}

          </div>

        </div>

      </section>


      {/* BENEFITS */}
      <section className="benefits-section">

        <div className="course-container">

          <div className="section-heading center">

            <span className="section-kicker">
              WHY CHOOSE THIS COURSE
            </span>

            <h2>
              Everything You
              <span> Need</span>
            </h2>

          </div>


          <div className="benefits-grid">

            {benefits.map((item, index) => (

              <div className="benefit-card" key={index}>

                <div className="benefit-icon">
                  {item[0]}
                </div>

                <h3>{item[1]}</h3>

                <p>{item[2]}</p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* FAQ */}
      <section className="faq-course-section">

        <div className="course-container faq-course-grid">

          <div className="faq-title">

            <span className="section-kicker">
              FAQ
            </span>

            <h2>
              Frequently Asked
              <span> Questions</span>
            </h2>

            <p>
              Everything you need to know before joining
              the course.
            </p>

          </div>


          <div className="faq-course-list">

            {faqs.map((faq, index) => (

              <details key={index}>
                <summary>
                  <span>{faq}</span>
                  <b>+</b>
                </summary>

                <p>
                  Yes. Our team provides complete guidance,
                  practical training and support according
                  to the selected course.
                </p>

              </details>

            ))}

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="course-final-cta">

        <div className="cta-glow"></div>

        <div className="course-container final-cta-content">

          <div>

            <span>START YOUR JOURNEY</span>

            <h2>
              Ready to Build Your
              <strong> Career?</strong>
            </h2>

            <p>
              Join our professional training program and
              start learning today.
            </p>

          </div>

          <button onClick={enquireNow}>
            Enquire Now →
          </button>

        </div>

      </section>


      {/* FOOTER */}
<footer className="course-footer">

  <div className="course-container">

    <div className="real-footer-grid">

      {/* BRAND */}
      <div>

        <div className="footer-course-logo">
          <span>E</span>
          <strong>EduNova</strong>
        </div>

        <p className="footer-brand-text">
          Empowering learners with industry-focused education,
          practical training and expert mentorship to build
          successful careers.
        </p>

        <div className="footer-socials">

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            f
          </a>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            ◎
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            in
          </a>

          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            ▶
          </a>

        </div>

      </div>


      {/* QUICK LINKS */}
      <div className="footer-column">

        <h4>Quick Links</h4>

        <a href="/">Home</a>
        <a href="/#about">About Us</a>
        <a href="/#courses">Courses</a>
        <a href="/#faculty">Faculty</a>
        <a href="/#gallery">Gallery</a>

      </div>


      {/* COURSES */}
      <div className="footer-column">

        <h4>Popular Courses</h4>

        <a href="/#courses">Full Stack Development</a>
        <a href="/#courses">Python Programming</a>
        <a href="/#courses">Java Programming</a>
        <a href="/#courses">React JS</a>
        <a href="/#courses">Graphic Designing</a>

      </div>


      {/* CONTACT */}
      <div className="footer-column">

        <h4>Contact Us</h4>

        <div className="footer-contact-item">
          <span>📍</span>

          <div>
            <strong>Address</strong>
            Bijnor, Uttar Pradesh, India
          </div>
        </div>

        <div className="footer-contact-item">
          <span>☎</span>

          <div>
            <strong>Phone</strong>
            +91 98765 43210
          </div>
        </div>

        <div className="footer-contact-item">
          <span>✉</span>

          <div>
            <strong>Email</strong>
            info@edunova.com
          </div>
        </div>

        <div className="footer-contact-item">
          <span>◷</span>

          <div>
            <strong>Working Hours</strong>
            Mon - Sat: 9 AM - 6 PM
          </div>
        </div>

      </div>

    </div>


    {/* FOOTER BOTTOM */}

    <div className="footer-bottom">

      <span>
        © 2026 EduNova. All rights reserved.
      </span>

      <span>
        Designed with ❤️ by Tushar Chauhan
      </span>

    </div>

  </div>

</footer>

    </div>
  );
}

export default CourseDetails;