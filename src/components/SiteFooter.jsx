import {
  FaApple,
  FaChevronRight,
  FaEnvelope,
  FaFacebookF,
  FaGraduationCap,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaStar,
  FaUsers,
  FaXTwitter,
  FaYoutube,
  FaGooglePlay,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../pages/home.css";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      ["Home", "home"],
      ["About", "about"],
      ["Courses", "courses"],
      ["Faculty", "faculty"],
      ["Gallery", "gallery"],
      ["Contact", "contact"],
    ],
  },
  {
    title: "Our Courses",
    links: [
      ["Web Development", "courses"],
      ["Python", "courses"],
      ["React JS", "courses"],
      ["UI/UX Design", "courses"],
      ["Data Science", "courses"],
      ["Digital Marketing", "courses"],
    ],
  },
  {
    title: "Support",
    links: [
      ["FAQ", "faq"],
      ["Privacy Policy", "contact"],
      ["Terms & Conditions", "contact"],
      ["Refund Policy", "contact"],
      ["Help Center", "contact"],
      ["Contact Support", "contact"],
    ],
  },
];

function SiteFooter() {
  const navigate = useNavigate();

  const goToSection = (section) => {
    navigate(`/#${section}`);
  };

  return (
    <footer className="edu-footer">
      <div className="footer-glow footer-glow-left" />
      <div className="footer-glow footer-glow-right" />

      <div className="footer-wrapper">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <span className="footer-brand-icon">E</span>
              <div className="footer-brand-text">
                <strong>EduNova</strong>
                <small>Learn • Grow • Build</small>
              </div>
            </div>

            <p className="footer-description">
              Empowering learners with industry-focused education to build
              skills, confidence and a brighter tomorrow.
            </p>

            <div className="footer-socials">
              <a href="#" className="footer-social facebook" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="footer-social twitter" aria-label="X">
                <FaXTwitter />
              </a>
              <a href="#" className="footer-social instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="footer-social linkedin" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" className="footer-social youtube" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>

            <div className="footer-stats">
              <div className="footer-stat">
                <div className="footer-stat-icon purple"><FaGraduationCap /></div>
                <div><strong>10K+</strong><span>Students</span></div>
              </div>
              <div className="footer-stat-divider" />
              <div className="footer-stat">
                <div className="footer-stat-icon blue"><FaUsers /></div>
                <div><strong>50+</strong><span>Courses</span></div>
              </div>
              <div className="footer-stat-divider" />
              <div className="footer-stat">
                <div className="footer-stat-icon yellow"><FaStar /></div>
                <div><strong>4.9</strong><span>Rating</span></div>
              </div>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div className="footer-column" key={column.title}>
              <div className="footer-heading">
                <h3>{column.title}</h3>
                <span />
              </div>
              <ul>
                {column.links.map(([label, section]) => (
                  <li key={label}>
                    <button type="button" onClick={() => goToSection(section)}>
                      <span><FaChevronRight /></span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-newsletter">
            <div className="footer-heading">
              <h3>Stay Updated</h3>
              <span />
            </div>
            <p>Subscribe to our newsletter for the latest updates, courses and offers.</p>
            <form
              className="footer-newsletter-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="footer-email-box">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                />
              </div>
              <button type="submit">Subscribe</button>
            </form>

            <div className="footer-download">
              <h4>Download Our App</h4>
              <div className="footer-app-buttons">
                <a href="#" className="footer-app-button">
                  <FaGooglePlay />
                  <div><small>GET IT ON</small><strong>Google Play</strong></div>
                </a>
                <a href="#" className="footer-app-button">
                  <FaApple />
                  <div><small>Download on the</small><strong>App Store</strong></div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 EduNova. All rights reserved.</p>
          <div className="footer-bottom-right">
            <div className="footer-bottom-links">
              <button type="button">Sitemap</button>
              <span />
              <button type="button">Cookies</button>
              <span />
              <button type="button">Accessibility</button>
            </div>
            <div className="footer-bottom-divider" />
            <p className="footer-designer">
              Designed with <FaHeart className="footer-heart" /> by
              <strong>Tushar Chauhan</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-wave footer-wave-one" />
      <div className="footer-wave footer-wave-two" />
    </footer>
  );
}

export default SiteFooter;
