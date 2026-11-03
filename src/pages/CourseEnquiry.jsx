import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CourseEnquiry.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function CourseEnquiry() {
  const location = useLocation();
  const navigate = useNavigate();

  /* =====================================================
     SCROLL TO TOP WHEN ENQUIRY PAGE OPENS
     ===================================================== */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  /* =====================================================
     SELECTED COURSE
     ===================================================== */
  const selectedCourse =
    location.state?.course?.title ||
    location.state?.selectedCourse ||
    "";

  const courseData = location.state?.course;

  /* =====================================================
     FORM STATE
     ===================================================== */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: selectedCourse,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     COURSES
     ===================================================== */
  const courses = [
    "Full Stack Web Development",
    "Python Programming",
    "Java Programming",
    "React JS Development",
    "Data Science & AI",
    "Cyber Security",
    "UI/UX Designing",
    "Graphic Designing",
    "Digital Marketing",
    "Computer Basics & MS Office",
  ];

  /* =====================================================
     HANDLE INPUT
     ===================================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     SUBMIT ENQUIRY
     ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit enquiry"
        );
      }

      setSuccess(
        "Your enquiry has been submitted successfully. Our admission team will contact you soon."
      );

      setForm({
        name: "",
        phone: "",
        email: "",
        course: selectedCourse,
        message: "",
      });
    } catch (err) {
      console.error("Enquiry Error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     PAGE
     ===================================================== */
  return (
    <div className="enquiry-page">

      {/* =================================================
          NAVBAR
          ================================================= */}
      <header className="enquiry-navbar">
        <div className="enquiry-nav-inner">

          {/* LOGO */}
          <div
            className="enquiry-logo"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate("/");
              }
            }}
          >
            <span>E</span>

            <div>
              <strong>EduNova</strong>
              <small>Learn • Grow • Build</small>
            </div>
          </div>

          {/* BACK BUTTON */}
          <button
            type="button"
            className="enquiry-back"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

        </div>
      </header>


      {/* =================================================
          MAIN PAGE
          ================================================= */}
      <main className="enquiry-main">

        <div className="enquiry-container">

          {/* =================================================
              LEFT INTRO SECTION
              ================================================= */}
          <section className="enquiry-intro">

            <span className="enquiry-kicker">
              COURSE ENQUIRY
            </span>

            <h1>
              Start Your
              <span> Learning Journey.</span>
            </h1>

            <p>
              Interested in joining this course? Fill out the
              enquiry form and our admission team will contact
              you with complete course details.
            </p>


            {/* SELECTED COURSE */}
            {courseData && (
              <div className="selected-course-card">

                <div className="selected-course-image">
                  <img
                    src={courseData.image}
                    alt={courseData.title}
                  />
                </div>

                <div className="selected-course-content">

                  <span>
                    SELECTED COURSE
                  </span>

                  <h3>
                    {courseData.title}
                  </h3>

                  <div className="selected-course-meta">

                    {courseData.duration && (
                      <b>
                        {courseData.duration}
                      </b>
                    )}

                    {courseData.fees !== undefined &&
                      courseData.fees !== null &&
                      courseData.fees !== "" && (
                        <b>
                          ₹
                          {Number(
                            courseData.fees
                          ).toLocaleString("en-IN")}
                        </b>
                      )}

                  </div>

                </div>

              </div>
            )}


            {/* BENEFITS */}
            <div className="enquiry-benefits">

              <div>
                <span>✓</span>

                <p>
                  Quick response from admission team
                </p>
              </div>

              <div>
                <span>✓</span>

                <p>
                  Complete course information
                </p>
              </div>

              <div>
                <span>✓</span>

                <p>
                  Fee and batch timing guidance
                </p>
              </div>

              <div>
                <span>✓</span>

                <p>
                  Career counselling support
                </p>
              </div>

            </div>

          </section>


          {/* =================================================
              FORM CARD
              ================================================= */}
          <section className="enquiry-form-card">

            {/* FORM HEADING */}
            <div className="form-card-heading">

              <div>
                <span>
                  GET IN TOUCH
                </span>

                <h2>
                  Send an Enquiry
                </h2>
              </div>

              <div className="form-heading-icon">
                ✦
              </div>

            </div>


            {/* SUCCESS MESSAGE */}
            {success && (
              <div
                className="enquiry-success"
                role="alert"
              >
                ✓ {success}
              </div>
            )}


            {/* ERROR MESSAGE */}
            {error && (
              <div
                className="enquiry-error"
                role="alert"
              >
                ⚠ {error}
              </div>
            )}


            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* NAME + PHONE */}
              <div className="enquiry-form-row">

                {/* NAME */}
                <div className="enquiry-field">

                  <label htmlFor="name">
                    Full Name <span>*</span>
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>


                {/* PHONE */}
                <div className="enquiry-field">

                  <label htmlFor="phone">
                    Mobile Number <span>*</span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}
              <div className="enquiry-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />

              </div>


              {/* COURSE */}
              <div className="enquiry-field">

                <label htmlFor="course">
                  Select Course <span>*</span>
                </label>

                <select
                  id="course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select a course
                  </option>

                  {courses.map((item) => (
                    <option
                      value={item}
                      key={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

              </div>


              {/* MESSAGE */}
              <div className="enquiry-field">

                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you want to know..."
                  rows={5}
                />

              </div>


              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="submit-enquiry-btn"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Enquiry →"}
              </button>


              {/* PRIVACY */}
              <p className="privacy-note">
                🔒 Your information is safe and will only be
                used for admission communication.
              </p>

            </form>

          </section>

        </div>

      </main>


      {/* =================================================
          FOOTER
          ================================================= */}
      <footer className="enquiry-footer">

        <div className="enquiry-container">

          <div className="enquiry-footer-inner">

            <div>

              <strong>
                EduNova
              </strong>

              <span>
                Learn • Grow • Build
              </span>

            </div>

            <p>
              © 2026 EduNova. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default CourseEnquiry;