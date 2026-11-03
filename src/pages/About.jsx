import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* ================= HEADER ================= */}
      <header className="about-header">

        <div
          className="about-brand"
          onClick={() => navigate("/")}
        >
          <div className="about-brand-logo">E</div>

          <div>
            <h3>EduNova</h3>
            <span>Learn • Grow • Build</span>
          </div>
        </div>

        <nav className="about-nav">
          <button onClick={() => navigate("/")}>Home</button>
          <button className="active">About</button>
          <button onClick={() => navigate("/courses")}>Courses</button>
          <button onClick={() => navigate("/gallery")}>Gallery</button>
          <button onClick={() => navigate("/contact")}>Contact</button>
        </nav>

        <button
          className="about-apply-btn"
          onClick={() => navigate("/courses")}
        >
          Apply Now →
        </button>

      </header>


      {/* ================= HERO ================= */}
      <main>

        <section className="about-hero">

          <div className="about-image-card">

            <div className="about-image-wrapper">

              <img
                src="/images/about_campus.png"
                alt="EduNova Campus"
              />

              <div className="about-image-overlay">
                <span>EDUNOVA</span>
                <strong>Modern Learning Campus</strong>
              </div>

            </div>

            <div className="about-campus-info">

              <div>
                <strong>Modern Learning Campus</strong>
                <small>
                  Smart facilities for better learning
                </small>
              </div>

              <div className="about-campus-number">
                10+
              </div>

            </div>

          </div>


          {/* CONTENT */}
          <div className="about-content">

            <span className="about-badge">
              ABOUT EDUNOVA
            </span>

            <h1>
              Building Skills for a{" "}
              <em>Better Future</em>
            </h1>

            <p>
              At EduNova, we provide high-quality,
              affordable and flexible learning
              opportunities designed to help students
              build practical skills and grow their careers.
            </p>

            <p>
              Our industry-oriented courses, experienced
              faculty and hands-on projects ensure that
              every student gains real-world knowledge
              and confidence.
            </p>


            <div className="about-features">

              <div>
                <span>✓</span>
                Industry Oriented Curriculum
              </div>

              <div>
                <span>✓</span>
                Flexible Learning
              </div>

              <div>
                <span>✓</span>
                Live Projects & Assignments
              </div>

              <div>
                <span>✓</span>
                Placement Assistance
              </div>

            </div>


            <button
              className="about-primary-btn"
              onClick={() => navigate("/courses")}
            >
              Explore Our Courses
              <span>→</span>
            </button>

          </div>

        </section>


        {/* ================= WHY EDUNOVA ================= */}

        <section className="about-why">

          <div className="about-section-heading">

            <span>WHY EDUNOVA</span>

            <h2>
              Learn Today. Lead Tomorrow.
            </h2>

            <p>
              Everything you need to develop the skills
              that matter in today's professional world.
            </p>

          </div>


          <div className="about-feature-grid">

            <div className="about-feature-card">

              <div className="feature-icon">
                🎓
              </div>

              <h3>Expert Faculty</h3>

              <p>
                Learn from experienced mentors who
                understand both academics and industry.
              </p>

            </div>


            <div className="about-feature-card">

              <div className="feature-icon">
                💻
              </div>

              <h3>Practical Learning</h3>

              <p>
                Gain practical knowledge through
                projects, assignments and real-world tasks.
              </p>

            </div>


            <div className="about-feature-card">

              <div className="feature-icon">
                🚀
              </div>

              <h3>Career Growth</h3>

              <p>
                Develop job-ready skills and prepare
                yourself for your professional career.
              </p>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="about-cta">

          <div>

            <span>START YOUR JOURNEY</span>

            <h2>
              Ready to Build Your Future?
            </h2>

            <p>
              Explore our courses and take the next
              step towards your career.
            </p>

          </div>

          <button
            onClick={() => navigate("/courses")}
          >
            View Courses →
          </button>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="about-footer">
        © 2026 EduNova Institute. All Rights Reserved.
      </footer>

    </div>
  );
}

export default About;