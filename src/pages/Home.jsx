import { useEffect, useRef, useState } from "react";

import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGraduationCap,
  FaUsers,
  FaStar,
  FaChevronRight,
  FaEnvelope,
  FaGooglePlay,
  FaApple,
  FaHeart,
  FaBell,
  FaXmark,
  FaCalendarDays,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import "./home.css";



const API_URL = (



  import.meta.env.VITE_API_URL || "http\://localhost:5000"



).replace(/\/$/, "");



const IMG = "/images";



const getFacultyImageUrl = (image) => {



  if (!image) return `${IMG}/faculty_rajesh_kumar.png`;



  if (/^https?:\/\//i.test(image)) return image;



  if (image.startsWith("/uploads/")) return `${API_URL}${image}`;



  return `${IMG}/${image.split("/").pop()}`;



};



const formatNoticeDate = (notice) => {
  const rawDate = notice?.notice_date
    ? `${String(notice.notice_date).slice(0, 10)}T00:00:00`
    : notice?.created_at;

  if (!rawDate) return "Recently published";

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) return "Recently published";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const localCourses = [



  {



    id: 1,



    title: "Full Stack Web Development",



    description: "HTML, CSS, JavaScript, React, Node.js",



    duration: "6 Months",



    fees: 25000,



    image: `${IMG}/course_full_stack_web_development.png`,



  },



  {



    id: 2,



    title: "Python Programming",



    description: "Basics to Advanced with Projects",



    duration: "4 Months",



    fees: 15000,



    image: `${IMG}/course_python_programming.png`,



  },



  {



    id: 3,



    title: "Java Programming",



    description: "Learn Core Java, OOP, collections and application development",



    duration: "4 Months",



    fees: 16000,



    image: `${IMG}/course_java_programming.png`,



  },



  {



    id: 4,



    title: "React JS Development",



    description: "Modern React development with projects",



    duration: "4 Months",



    fees: 18000,



    image: `${IMG}/course_react_js_development.png`,



  },



  {



    id: 5,



    title: "Data Science & AI",



    description:



      "Learn data analysis, machine learning and artificial intelligence",



    duration: "6 Months",



    fees: 30000,



    image: `${IMG}/course_data_science_ai.png`,



  },



  {



    id: 6,



    title: "Cyber Security",



    description:



      "Learn cybersecurity fundamentals, ethical hacking and security practices",



    duration: "6 Months",



    fees: 28000,



    image: `${IMG}/course_cyber_security.png`,



  },



  {



    id: 7,



    title: "UI/UX Designing",



    description: "Modern UI/UX and creative design",



    duration: "3 Months",



    fees: 12000,



    image: `${IMG}/course_ui_ux_designing.png`,



  },



  {



    id: 8,



    title: "Graphic Designing",



    description:



      "Learn Photoshop, Illustrator, branding and professional graphic design",



    duration: "3 Months",



    fees: 11000,



    image: `${IMG}/course_graphic_designing.png`,



  },



  {



    id: 9,



    title: "Digital Marketing",



    description:



      "Master SEO, social media marketing, Google Ads and online branding",



    duration: "3 Months",



    fees: 10000,



    image: `${IMG}/course_digital_marketing.png`,



  },



  {



    id: 10,



    title: "Computer Basics & MS Office",



    description:



      "Learn computer fundamentals, MS Word, Excel, PowerPoint and internet skills",



    duration: "2 Months",



    fees: 5000,



    image: `${IMG}/course_ms_office.png`,



  },



];



const courseImages = Object.fromEntries(



  localCourses.map((course) => [course.title, course.image])



);



const gallery = [



  {



    image: `${IMG}/gallery_campus.png`,



    title: "Campus",



  },



  {



    image: `${IMG}/gallery_computer_lab.png`,



    title: "Computer Lab",



  },



  {



    image: `${IMG}/gallery_library.png`,



    title: "Library",



  },



  {



    image: `${IMG}/gallery_seminar.png`,



    title: "Seminar",



  },



  {



    image: `${IMG}/gallery_students.png`,



    title: "Students",



  },



];



const testimonials = [



  {



    name: "Aditya Kumar",



    role: "Web Development Student",



    image: `${IMG}/student_aditya_kumar.png`,



    text: "EduNova helped me gain practical skills and prepare for my career. The faculty and support are amazing.",



  },



  {



    name: "Priya Singh",



    role: "Python Student",



    image: `${IMG}/student_priya_singh.png`,



    text: "The live projects and mentorship made learning easy and effective. Highly recommended.",



  },



  {



    name: "Rahul Kumar",



    role: "Full Stack Student",



    image: `${IMG}/student_rahul_kumar.png`,



    text: "Best learning platform with practical courses. Truly a career changing experience.",



  },



];



function Home() {



  const navigate = useNavigate();

  const [showCampusVideo, setShowCampusVideo] = useState(false);



  const [menuOpen, setMenuOpen] = useState(false);



  const [showAllCourses, setShowAllCourses] = useState(false);



  const [courses, setCourses] = useState(localCourses);



  const [faculty, setFaculty] = useState([]);

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [showNoticeDropdown, setShowNoticeDropdown] = useState(false);
  const [showNoticePopup, setShowNoticePopup] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);
  const noticeMenuRef = useRef(null);



  const [loadingFaculty, setLoadingFaculty] = useState(true);



  const visibleCourses = courses.slice(0, showAllCourses ? 10 : 6);



  const [openFaq, setOpenFaq] = useState(null);



  const [form, setForm] = useState({



    name: "",



    email: "",



    phone: "",



    course: "",



    message: "",



  });



  const [submitted, setSubmitted] = useState(false);



  useEffect(() => {



    loadCourses();



  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadNotices = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/notices/published`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notices");
        }

        const result = await response.json();
        const publishedNotices =
          result?.success && Array.isArray(result.notices)
            ? result.notices
            : [];

        setNotices(publishedNotices);

        // Open the latest notice only when published notices exist.
        if (publishedNotices.length > 0) {
          setActiveNotice(publishedNotices[0]);
          setShowNoticePopup(true);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Notices API Error:", error);
          setNotices([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingNotices(false);
        }
      }
    };

    loadNotices();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        noticeMenuRef.current &&
        !noticeMenuRef.current.contains(event.target)
      ) {
        setShowNoticeDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNoticeDropdown(false);
        setShowNoticePopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openNotice = (notice) => {
    setActiveNotice(notice);
    setShowNoticePopup(true);
    setShowNoticeDropdown(false);
  };

  const closeNoticePopup = () => {
    setShowNoticePopup(false);
  };




  const loadCourses = async () => {



    try {



      const response = await fetch(`${API_URL}/api/courses`);



      if (!response.ok) return;



      const result = await response.json();



      if (result?.success && Array.isArray(result.data) && result.data.length) {



        const apiCourses = result.data.map((course) => {



          const localImage = courseImages[course.title];



          let image = localImage || `${IMG}/about_campus.png`;



          if (course.image && (course.image.startsWith("http\://") || course.image.startsWith("https\://"))) {



            image = course.image;



          }



          return { ...course, image };



        });



        setCourses(apiCourses);



      }



    } catch (error) {



      console.log("Using local course data", error);



    }



  };



    const loadFaculty = async () => {



    try {



      setLoadingFaculty(true);



      const response = await fetch(`${API_URL}/api/faculty`);



      if (!response.ok) {



        throw new Error("Failed to fetch faculty");



      }



      const result = await response.json();



      if (result?.success && Array.isArray(result.data)) {



        setFaculty(result.data);



      } else {



        setFaculty([]);



      }



    } catch (error) {



      console.error("Faculty API Error:", error);



      setFaculty([]);



    } finally {



      setLoadingFaculty(false);



    }



  };



  useEffect(() => {



    loadFaculty();



  }, []);



const handleInput = (e) => {



    setForm({



      ...form,



      [e.target.name]: e.target.value,



    });



  };



  const submitForm = (e) => {



    e.preventDefault();



    setSubmitted(true);



    setTimeout(() => {



      setSubmitted(false);



    }, 4000);



    setForm({



      name: "",



      email: "",



      phone: "",



      course: "",



      message: "",



    });



  };



  const scrollTo = (id) => {



    setMenuOpen(false);



    document.getElementById(id)?.scrollIntoView({



      behavior: "smooth",



    });



  };



  return (



    <div className="edu-page">



      {/* BACKGROUND ORBS */}



      <div className="bg-orb orb-1"></div>



      <div className="bg-orb orb-2"></div>



      <div className="bg-orb orb-3"></div>



      {/* ================= NAVBAR ================= */}



      <header className="glass-navbar">



        <div className="nav-inner">



          <div



            className="brand"



            onClick={() => scrollTo("home")}



          >



            <span className="brand-icon">E</span>



            <div>



              <strong>EduNova</strong>



              <small>Learn • Grow • Build</small>



            </div>



          </div>



          <nav className={menuOpen ? "nav-links show" : "nav-links"}>



            <button onClick={() => scrollTo("home")}>Home</button>



            <button onClick={() => scrollTo("about")}>About</button>



            <button onClick={() => scrollTo("courses")}>Courses</button>



            <button onClick={() => scrollTo("faculty")}>Faculty</button>



            <button onClick={() => scrollTo("gallery")}>Gallery</button>



            <button onClick={() => scrollTo("contact")}>Contact</button>



          </nav>



                    <div className="notice-menu-wrapper" ref={noticeMenuRef}>
            <button
              type="button"
              className={`notice-bell-button ${showNoticeDropdown ? "is-open" : ""}`}
              onClick={() => setShowNoticeDropdown((previous) => !previous)}
              aria-label="Open notifications"
              aria-expanded={showNoticeDropdown}
            >
              <FaBell />
              {notices.length > 0 && (
                <span className="notice-bell-count">
                  {notices.length > 99 ? "99+" : notices.length}
                </span>
              )}
            </button>

            {showNoticeDropdown && (
              <div className="notice-dropdown">
                <div className="notice-dropdown-header">
                  <div>
                    <strong>Notifications</strong>
                    <small>
                      {notices.length > 0
                        ? `${notices.length} published notice${notices.length === 1 ? "" : "s"}`
                        : "Stay updated with EduNova"}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="notice-dropdown-close"
                    onClick={() => setShowNoticeDropdown(false)}
                    aria-label="Close notifications"
                  >
                    <FaXmark />
                  </button>
                </div>

                {loadingNotices ? (
                  <div className="notice-dropdown-empty">
                    Loading notifications...
                  </div>
                ) : notices.length === 0 ? (
                  <div className="notice-dropdown-empty">
                    <span className="notice-empty-icon">
                      <FaBell />
                    </span>
                    <strong>No new notices</strong>
                    <p>There are no published announcements right now.</p>
                  </div>
                ) : (
                  <div className="notice-dropdown-list">
                    {notices.map((notice) => (
                      <button
                        type="button"
                        className="notice-dropdown-item"
                        key={notice.id}
                        onClick={() => openNotice(notice)}
                      >
                        <span className="notice-item-icon">📢</span>
                        <span className="notice-item-content">
                          <strong>{notice.title}</strong>
                          <small>
                            {notice.category || "General"} · {formatNoticeDate(notice)}
                          </small>
                          <span>
                            {notice.description || "Open this notice to read more."}
                          </span>
                        </span>
                        <span className="notice-item-arrow">›</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

<button



            className="nav-apply"



            onClick={() => scrollTo("admission")}



          >



            Apply Now →



          </button>



          <button



            className={`menu-btn ${menuOpen ? "active" : ""}`}



            onClick={() => setMenuOpen(!menuOpen)}



          >



            <span></span>



            <span></span>



            <span></span>



          </button>



        </div>



      </header>



      {/* ================= HERO ================= */}



      <section id="home" className="hero-section">



        <div className="container hero-grid">



          <div className="hero-copy">



            <div className="small-pill">



              ✦ AI Learning Platform For Your Future



            </div>



            <h1>



              Learn Today.



              <span>Lead Tomorrow.</span>



            </h1>



            <p>



              Join EduNova and explore industry-focused courses,



              live projects and expert mentorship to build the



              career you deserve.



            </p>



            <div className="hero-search">



              <input



                placeholder="Search courses, skills or topics..."



              />



              <button>



                Search



              </button>



            </div>



            <div className="hero-stats">



              <div>



                <strong>10K+</strong>



                <span>Students</span>



              </div>



              <div>



                <strong>5K+</strong>



                <span>Courses</span>



              </div>



              <div>



                <strong>98%</strong>



                <span>Success Rate</span>



              </div>



            </div>



          </div>



          <div className="hero-visual">



            <div className="hero-image-wrap">



              <img



                src={`${IMG}/hero_start_journey.png`}



                alt="EduNova"



              />



              <div className="hero-floating certified">



                <span>🏅</span>



                <div>



                  <b>Get Certified</b>



                  <small>Boost Your Career</small>



                </div>



              </div>



              <div className="hero-floating students">



                <span>👥</span>



                <div>



                  <b>10K+</b>



                  <small>Active Students</small>



                </div>



              </div>



              <div className="live-class">



                <span>▣</span>



                <div>



                  <b>Live Classes</b>



                  <small>Interactive Learning</small>



                </div>



              </div>



            </div>



          </div>



        </div>



      </section>

      {/* ================= WHY CHOOSE ================= */}



      <section className="section why-section">



        <div className="section-title">



          <span>WHY CHOOSE US</span>



          <h2>



            Education That Creates



            <em> Opportunities</em>



          </h2>



          <p>



            We focus on real-world learning, expert guidance and



            career growth to help you achieve your dreams.



          </p>



        </div>



        <div className="container feature-grid">



          <div className="glass-card feature-card">



            <div className="feature-icon blue">🎓</div>



            <h3>Expert Faculty</h3>



            <p>



              Learn from industry experts and professionals.



            </p>



          </div>



          <div className="glass-card feature-card">



            <div className="feature-icon cyan">💻</div>



            <h3>Practical Training</h3>



            <p>



              Hands-on projects and real-world case studies.



            </p>



          </div>



          <div className="glass-card feature-card">



            <div className="feature-icon pink">🚀</div>



            <h3>Career Focused</h3>



            <p>



              Get job-ready with industry-relevant skills.



            </p>



          </div>



          <div className="glass-card feature-card">



            <div className="feature-icon yellow">★</div>



            <h3>Proven Results</h3>



            <p>



              Trusted by thousands with high success rate.



            </p>



          </div>



        </div>



      </section>



<section id="about" className="home-about-section">



  {/* LEFT IMAGE */}

  <div className="home-about-visual">



    <div className="home-about-image-wrap">



      <img

        src="/images/about_campus.png"

        alt="EduNova Modern Campus"

        className="home-about-image"

      />





      {/* PLAY BUTTON */}

      <button

        type="button"

        className="campus-play-btn"

        onClick={() => setShowCampusVideo(true)}

        aria-label="Play Campus Tour"

      >

        <span className="campus-play-ring"></span>



        <span className="campus-play-icon">

          ▶

        </span>

      </button>





      {/* PLAY LABEL */}

      <div className="campus-video-label">

        <span className="campus-live-dot"></span>

        Campus Tour

      </div>



    </div>





    {/* BOTTOM CARD */}

    <div className="home-about-image-bottom">



      <div className="campus-bottom-text">



        <strong>

          Modern Learning Campus

        </strong>



        <span>

          Explore our state-of-the-art facilities

        </span>



      </div>



      <div className="campus-number">

        10+

      </div>



    </div>



  </div>





  {/* RIGHT CONTENT */}

  <div className="home-about-content">



    <span className="home-about-label">

      ABOUT US

    </span>



    <h2>

      Building Skills for a{" "}

      <em>Better Future</em>

    </h2>



    <p>

      At EduNova, we provide high-quality,

      affordable and flexible learning

      opportunities to help you grow in your

      career.

    </p>



    <p>

      Our industry-designed courses, expert

      mentorship and hands-on projects ensure

      you gain real skills for the real world.

    </p>





    {/* POINTS */}

    <div className="home-about-points">



      <span>

        ✓ Industry Oriented Curriculum

      </span>



      <span>

        ✓ Flexible Learning

      </span>



      <span>

        ✓ Live Projects & Assignments

      </span>



      <span>

        ✓ Placement Assistance

      </span>



    </div>





    {/* KNOW MORE */}

    <button

      type="button"

      className="about-know-more-btn"

      onClick={() => navigate("/about")}

    >

      <span>Know More</span>

      <span className="know-more-arrow">

        →

      </span>

    </button>



  </div>



</section>



      {/* ================= COURSES ================= */}



      <section id="courses" className="section courses-section">



        <div className="section-title course-heading">



          <div className="course-heading-copy">

  <span>OUR COURSES</span>

  <h2>
    Explore Our Popular <em>Courses</em>
  </h2>

  <p>
    Learn in-demand skills with expert guidance and real world projects.
  </p>

</div>



          <div className="course-nav">



            <button type="button" aria-label="Previous courses">‹</button>



            <button type="button" aria-label="Next courses">›</button>



          </div>



        </div>



<div id="courses-grid" className="courses-grid course-grid-centered">



          {visibleCourses.map((course, index) => (



            <article className="course-card" key={course.id}>



              <div className="course-img">



                <img



                  src={courseImages[course.title] || course.image || `${IMG}/about_campus.png`}



                  alt={course.title}



                />



                <span className={`course-badge badge-${index % 4}`}>



                  {index === 0



                    ? "Popular"



                    : index === 1



                    ? "Trending"



                    : index === 2



                    ? "Best Seller"



                    : "New"}



                </span>



              </div>



              <div className="course-body">



                <h3>{course.title}</h3>



                <p>



                  {course.description}



                </p>



                <div className="course-info">



                  <button



                    type="button"



                    className="round-arrow"



                    aria-label={`View ${course.title} details`}



                    onClick={() =>

                      navigate("/course-details", {

                        state: { course },

                      })

                    }



                    >



                    →



                  </button>



                  <span>



                    👤 1K+ Students



                  </span>



                  <span>



                    ⭐ 4.8



                  </span>



                </div>



              </div>



            </article>



          ))}



        </div>



        {courses.length > 6 && (



          <div className="courses-more-wrapper">



            <button



              type="button"



        className="show-more-btn"



        aria-expanded={showAllCourses}



              aria-controls="courses-grid"



              onClick={() => setShowAllCourses((prev) => !prev)}



            >



              {showAllCourses



                ? "Show Less Courses ↑"



                : "Show More Courses ↓"}



            </button>



          </div>



        )}



</section>



      {/* ================= FACULTY ================= */}



      <section id="faculty" className="section faculty-section">



        <div className="section-title">



          <span>OUR FACULTY</span>



          <h2>



            Learn From the



            <em> Best</em>



          </h2>



          <p>



            Our experienced faculty members are dedicated to



            your success.



          </p>



        </div>



                <div className="container faculty-grid">



          {loadingFaculty ? (



            <div className="faculty-loading">



              <div className="faculty-loading-spinner"></div>



              <p>Loading our faculty...</p>



            </div>



          ) : faculty.length === 0 ? (



            <div className="faculty-loading">



              <div className="faculty-empty-icon">👨‍🏫</div>



              <p>Faculty information is currently unavailable.</p>



            </div>



          ) : (



            faculty.map((person) => (



              <div className="glass-card faculty-card" key={person.id}>



                <div className="faculty-photo">



                  <img



                    src={getFacultyImageUrl(person.image)}



                    alt={person.name}



                    onError={(e) => {



                      e.currentTarget.src = `${IMG}/faculty_rajesh_kumar.png`;



                    }}



                  />



                </div>



                <h3>{person.name}</h3>



                <strong>{person.designation || "Faculty"}</strong>



                <p>{person.experience || "Experienced Faculty"}</p>



                <div className="faculty-social">



                  <span>in</span>



                  <span>◎</span>



                  <span>f</span>



                </div>



              </div>



            ))



          )}



        </div>



      </section>



      {/* ================= GALLERY ================= */}



      <section id="gallery" className="section gallery-section">

        {/*================= GALLERY HEADING =================*/}
        <div className="section-title gallery-heading centered-section-title">

          <div className="gallery-heading-content">

            <span>OUR CAMPUS</span>

            <h2>
              Moments From Our <em>Campus</em>
            </h2>

            <p>
              Explore our modern campus, learning spaces and memorable moments.
            </p>

          </div>

        </div>

        {/*================= GALLERY IMAGES =================*/}
        <div className="container gallery-grid">

          {gallery.map((item, index) => (

            <div
              className={`gallery-card ${
                index === 0 ? "gallery-main" : ""
              }`}
              key={item.title}
            >

              <img
                src={item.image}
                alt={item.title}
              />

            </div>

          ))}

        </div>

        {/*================= VIEW GALLERY =================*/}
        <div className="gallery-view-wrapper">

          <button
            type="button"
            className="outline-btn gallery-view-btn"
            onClick={() => navigate("/gallery")}
          >
            View Gallery <span>→</span>
          </button>

        </div>

      </section>



      {/* ================= TESTIMONIAL ================= */}



      <section className="section testimonials-section">



        <div className="section-title">



          <span>STUDENT FEEDBACK</span>



          <h2>



            What Our Students



            <em> Say</em>



          </h2>



        </div>



        <div className="container testimonial-grid">



          {testimonials.map((review) => (



            <div



              className="glass-card testimonial-card"



              key={review.name}



            >



              <div className="quote">



                “



              </div>



              <div className="stars">



                ★★★★★



              </div>



              <p>



                "{review.text}"



              </p>



              <div className="review-user">



                <img



                  src={review.image}



                  alt={review.name}



                />



                <div>



                  <strong>{review.name}</strong>



                  <small>{review.role}</small>



                </div>



              </div>



            </div>



          ))}



        </div>



      </section>



      {/* ================= FAQ ================= */}

<section className="section faq-section" id="faq">

  <div className="faq-container">

    {/* FAQ HEADING */}
    <div className="faq-heading">

      <span className="faq-badge">
        FAQ
      </span>

      <h2>
        Frequently Asked <em>Questions</em>
      </h2>

    </div>


    {/* FAQ CONTENT */}
    <div className="faq-layout">

      {/* ================= LEFT : QUESTIONS ================= */}

      <div className="faq-list">

        {[
          {
            question: "What courses do you offer?",
            answer:
              "We offer a wide range of professional and skill-based courses designed to provide practical knowledge and career-focused learning."
          },

          {
            question: "Are the courses online or offline?",
            answer:
              "Our courses may be available in both online and offline formats depending on the selected program and institute schedule."
          },

          {
            question: "Will I get a certificate?",
            answer:
              "Yes. Students who successfully complete the required course are eligible to receive a course completion certificate."
          },

          {
            question: "Do you provide placement assistance?",
            answer:
              "Yes. Our team provides placement guidance, interview preparation and career support according to the selected course."
          }

        ].map((faq, index) => (

          <div
            className={`faq-item ${
              openFaq === index ? "open" : ""
            }`}
            key={faq.question}
          >

            {/* QUESTION */}

            <button
              type="button"
              className="faq-question"
              onClick={() =>
                setOpenFaq(
                  openFaq === index ? null : index
                )
              }
            >

              <span>
                {faq.question}
              </span>

              <b className="faq-plus">
                {openFaq === index ? "−" : "+"}
              </b>

            </button>


            {/* ANSWER */}

            {openFaq === index && (

              <div className="faq-answer">

                <p>
                  {faq.answer}
                </p>

              </div>

            )}

          </div>

        ))}

      </div>


      {/* ================= RIGHT : FAQ IMAGE ================= */}

      <div className="faq-visual">

        <div className="faq-question-badge">
          ?
        </div>

        <img
          src="/images/faq_student.png"
          alt="Frequently Asked Questions"
        />

        <div className="faq-chat-badge">
          💬
        </div>

      </div>

    </div>

  </div>

</section>


      {/* ================= CTA ================= */}



      <section id="admission" className="cta-section">



        <div className="cta-inner">



          <div className="cta-icon">



            🎓



          </div>



          <div>



            <h2>



              Ready to Start Your Journey?



            </h2>



            <p>



              Join thousands of learners and take the next step



              towards a brighter future.



            </p>



          </div>



          <button



            className="cta-button"



            onClick={() => scrollTo("contact")}



          >



            Apply Now →



          </button>



        </div>



      </section>



      {/* ================= CONTACT ================= */}



      <section id="contact" className="section contact-section">



        <div className="section-title">



          <span>GET IN TOUCH</span>



          <h2>



            Let's Start a



            <em> Conversation</em>



          </h2>



        </div>



        <div className="container contact-grid">



          <div className="contact-details">



            <div className="contact-detail">



              <div>☎</div>



              <span>



                <b>Phone</b>



                +91 98765 43210



              </span>



            </div>



            <div className="contact-detail">



              <div>✉</div>



              <span>



                <b>Email</b>



                info@edunova.com



              </span>



            </div>



            <div className="contact-detail">



              <div>⌖</div>



              <span>



                <b>Location</b>



                Bijnor, Uttar Pradesh, India



              </span>



            </div>



            <div className="contact-detail">



              <div>◷</div>



              <span>



                <b>Working Hours</b>



                Mon - Sat: 9:00 AM - 6:00 PM



              </span>



            </div>



          </div>



          <form



            className="contact-form"



            onSubmit={submitForm}



          >



            <div className="form-two">



              <input



                name="name"



                value={form.name}



                onChange={handleInput}



                placeholder="Full Name"



                required



              />



              <input



                name="email"



                value={form.email}



                onChange={handleInput}



                placeholder="Email Address"



                type="email"



              />



            </div>



            <select



              name="course"



              value={form.course}



              onChange={handleInput}



            >



              <option value="">Select subject</option>



              {courses.map((course) => (



                <option



                  value={course.title}



                  key={course.id}



                >



                  {course.title}



                </option>



              ))}



            </select>



            <textarea



              name="message"



              value={form.message}



              onChange={handleInput}



              placeholder="Write your message..."



              rows="5"



            />



            <button className="submit-btn">



              Send Message →



            </button>



            {submitted && (



              <div className="success-box">



                ✓ Message submitted successfully.



              </div>



            )}



          </form>



        </div>



      </section>



      {/* ================= PREMIUM FOOTER ================= */}

<footer className="edu-footer">

  {/* Decorative Background */}
  <div className="footer-glow footer-glow-left"></div>
  <div className="footer-glow footer-glow-right"></div>

  <div className="footer-wrapper">

    {/* ================= FOOTER MAIN ================= */}

    <div className="footer-main">


      {/* =================================
          BRAND SECTION
      ================================= */}

      <div className="footer-brand">

        <div className="footer-brand-logo">

          <span className="footer-brand-icon">
            E
          </span>

          <div className="footer-brand-text">

            <strong>
              EduNova
            </strong>

            <small>
              Learn • Grow • Build
            </small>

          </div>

        </div>


        <p className="footer-description">
          Empowering learners with industry-focused education
          to build skills, confidence and a brighter tomorrow.
        </p>


        {/* SOCIAL MEDIA */}

        <div className="footer-socials">

          <a
            href="#"
            className="footer-social facebook"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>


          <a
            href="#"
            className="footer-social twitter"
            aria-label="X"
          >
            <FaXTwitter />
          </a>


          <a
            href="#"
            className="footer-social instagram"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>


          <a
            href="#"
            className="footer-social linkedin"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>


          <a
            href="#"
            className="footer-social youtube"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>

        </div>


        {/* =================================
            FOOTER STATS
        ================================= */}

        <div className="footer-stats">


          <div className="footer-stat">

            <div className="footer-stat-icon purple">
              <FaGraduationCap />
            </div>

            <div>
              <strong>10K+</strong>
              <span>Students</span>
            </div>

          </div>


          <div className="footer-stat-divider"></div>


          <div className="footer-stat">

            <div className="footer-stat-icon blue">
              <FaUsers />
            </div>

            <div>
              <strong>50+</strong>
              <span>Courses</span>
            </div>

          </div>


          <div className="footer-stat-divider"></div>


          <div className="footer-stat">

            <div className="footer-stat-icon yellow">
              <FaStar />
            </div>

            <div>
              <strong>4.9</strong>
              <span>Rating</span>
            </div>

          </div>

        </div>

      </div>



      {/* =================================
          QUICK LINKS
      ================================= */}

      <div className="footer-column">

        <div className="footer-heading">

          <h3>
            Quick Links
          </h3>

          <span></span>

        </div>


        <ul>

          <li>
            <button onClick={() => scrollTo("home")}>
              <span>
                <FaChevronRight />
              </span>
              Home
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("about")}>
              <span>
                <FaChevronRight />
              </span>
              About
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              Courses
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("faculty")}>
              <span>
                <FaChevronRight />
              </span>
              Faculty
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("gallery")}>
              <span>
                <FaChevronRight />
              </span>
              Gallery
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("contact")}>
              <span>
                <FaChevronRight />
              </span>
              Contact
            </button>
          </li>

        </ul>

      </div>



      {/* =================================
          COURSES
      ================================= */}

      <div className="footer-column">

        <div className="footer-heading">

          <h3>
            Our Courses
          </h3>

          <span></span>

        </div>


        <ul>

          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              Web Development
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              Python
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              React JS
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              UI/UX Design
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              Data Science
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("courses")}>
              <span>
                <FaChevronRight />
              </span>
              Digital Marketing
            </button>
          </li>

        </ul>

      </div>



      {/* =================================
          SUPPORT
      ================================= */}

      <div className="footer-column">

        <div className="footer-heading">

          <h3>
            Support
          </h3>

          <span></span>

        </div>


        <ul>

          <li>
            <button onClick={() => scrollTo("faq")}>
              <span>
                <FaChevronRight />
              </span>
              FAQ
            </button>
          </li>


          <li>
            <button>
              <span>
                <FaChevronRight />
              </span>
              Privacy Policy
            </button>
          </li>


          <li>
            <button>
              <span>
                <FaChevronRight />
              </span>
              Terms & Conditions
            </button>
          </li>


          <li>
            <button>
              <span>
                <FaChevronRight />
              </span>
              Refund Policy
            </button>
          </li>


          <li>
            <button>
              <span>
                <FaChevronRight />
              </span>
              Help Center
            </button>
          </li>


          <li>
            <button onClick={() => scrollTo("contact")}>
              <span>
                <FaChevronRight />
              </span>
              Contact Support
            </button>
          </li>

        </ul>

      </div>



      {/* =================================
          NEWSLETTER
      ================================= */}

      <div className="footer-newsletter">

        <div className="footer-heading">

          <h3>
            Stay Updated
          </h3>

          <span></span>

        </div>


        <p>
          Subscribe to our newsletter for the latest
          updates, courses and offers.
        </p>


        <form
          className="footer-newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >

          <div className="footer-email-box">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
            />

          </div>


          <button type="submit">
            Subscribe
          </button>

        </form>



        {/* =================================
            APP DOWNLOAD
        ================================= */}

        <div className="footer-download">

          <h4>
            Download Our App
          </h4>


          <div className="footer-app-buttons">


            {/* GOOGLE PLAY */}

            <a
              href="#"
              className="footer-app-button"
            >

              <FaGooglePlay />

              <div>

                <small>
                  GET IT ON
                </small>

                <strong>
                  Google Play
                </strong>

              </div>

            </a>



            {/* APP STORE */}

            <a
              href="#"
              className="footer-app-button"
            >

              <FaApple />

              <div>

                <small>
                  Download on the
                </small>

                <strong>
                  App Store
                </strong>

              </div>

            </a>

          </div>

        </div>

      </div>

    </div>



    {/* =================================
        FOOTER BOTTOM
    ================================= */}

    <div className="footer-bottom">


      <p className="footer-copyright">
        © 2026 EduNova. All rights reserved.
      </p>


      <div className="footer-bottom-right">


        <div className="footer-bottom-links">

          <button>
            Sitemap
          </button>

          <span></span>

          <button>
            Cookies
          </button>

          <span></span>

          <button>
            Accessibility
          </button>

        </div>


        <div className="footer-bottom-divider"></div>


        <p className="footer-designer">

          Designed with

          <FaHeart className="footer-heart" />

          by

          <strong>
            Tushar Chauhan
          </strong>

        </p>

      </div>

    </div>

  </div>


  {/* =================================
      DECORATIVE WAVES
  ================================= */}

  <div className="footer-wave footer-wave-one"></div>

  <div className="footer-wave footer-wave-two"></div>

</footer>



      {/* ================= NOTICE POPUP ================= */}
      {showNoticePopup && activeNotice && (
        <div
          className="notice-popup-overlay"
          onClick={closeNoticePopup}
          role="presentation"
        >
          <section
            className="notice-popup-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="notice-popup-top">
              <span className="notice-popup-icon">
                <FaBell />
              </span>
              <button
                type="button"
                className="notice-popup-close"
                onClick={closeNoticePopup}
                aria-label="Close notice"
              >
                <FaXmark />
              </button>
            </div>

            <div className="notice-popup-label">
              LATEST ANNOUNCEMENT
            </div>

            <div className="notice-popup-meta">
              <span>{activeNotice.category || "General"}</span>
              <small>
                <FaCalendarDays />
                {formatNoticeDate(activeNotice)}
              </small>
            </div>

            <h2 id="notice-popup-title">
              {activeNotice.title || "EduNova Announcement"}
            </h2>

            <p className="notice-popup-description">
              {activeNotice.description || "Please contact EduNova for more information."}
            </p>

            <div className="notice-popup-actions">
              <button
                type="button"
                className="notice-popup-secondary"
                onClick={closeNoticePopup}
              >
                Close
              </button>
              <button
                type="button"
                className="notice-popup-primary"
                onClick={() => {
                  closeNoticePopup();
                  scrollTo("contact");
                }}
              >
                Contact Institute <span>→</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {showCampusVideo && (

        <div

          className="campus-video-overlay"

          onClick={() => setShowCampusVideo(false)}

        >

          <div

            className="campus-video-modal"

            onClick={(e) => e.stopPropagation()}

          >

            <button

              type="button"

              className="campus-video-close"

              onClick={() => setShowCampusVideo(false)}

              aria-label="Close video"

            >

              ×

            </button>



            <div className="campus-video-frame">

              <video

                controls

                autoPlay

                playsInline

                poster="/images/about_campus.png"

              >

                <source src="/videos/campus-tour.mp4" type="video/mp4" />

                Your browser does not support video.

              </video>

            </div>



            <div className="campus-video-title">

              <span>EduNova Campus Tour</span>

              <small>Explore our modern learning environment</small>

            </div>

          </div>

        </div>

      )}



    </div>



  );



}



export default Home;
