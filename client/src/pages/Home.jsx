import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiCode,
  FiDatabase,
  FiFileText,
  FiGlobe,
  FiHelpCircle,
  FiLock,
  FiMail,
  FiMenu,
  FiMessageCircle,
  FiPackage,
  FiPlay,
  FiSend,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const getDashboard = () => {
    if (!user) return "/register";

    if (user.role === "ADMIN") return "/admin";
    if (user.role === "SUPPLIER") return "/supplier";

    return "/buyer";
  };

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id) => {
    closeMenu();

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const faqs = [
    {
      question: "What is RFQ Market?",
      answer:
        "RFQ Market is a B2B procurement workspace where buyers can create RFQs, suppliers can submit quotations, and both parties can communicate through real-time messaging.",
    },
    {
      question: "Can buyers and suppliers communicate in real time?",
      answer:
        "Yes. The platform is designed around real-time buyer-supplier communication using Socket.IO, while conversations and messages are persisted in the database.",
    },
    {
      question: "How does registration work?",
      answer:
        "Create an account, select your role, verify your email using OTP, and then access the appropriate buyer or supplier workspace.",
    },
    {
      question: "Is RFQ Market open source?",
      answer:
        "The project is presented as an open-source platform and can be adapted for business purposes according to the project's applicable license and deployment terms.",
    },
    {
      question: "Can I contact the developer?",
      answer:
        "Yes. Use the Help section below to contact CodePilot.devteam by email for project-related questions, support, or development communication.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* =========================
          GLOBAL ANIMATIONS
      ========================== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #ffffff;
          color: #111827;
        }

        a {
          text-decoration: none;
        }

        button {
          font-family: inherit;
        }

        ::selection {
          background: #2563eb;
          color: white;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(8px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.12);
            opacity: .7;
          }
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes notification {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shine {
          from {
            transform: translateX(-120%);
          }
          to {
            transform: translateX(120%);
          }
        }

        .rfq-fade-up {
          animation: fadeUp .8s ease both;
        }

        .rfq-fade-up-delay {
          animation: fadeUp .8s .15s ease both;
        }

        .rfq-fade-up-delay-2 {
          animation: fadeUp .8s .3s ease both;
        }

        .rfq-card-hover {
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .rfq-card-hover:hover {
          transform: translateY(-7px);
          box-shadow: 0 25px 60px rgba(15, 23, 42, .10);
          border-color: #bfdbfe !important;
        }

        .rfq-button {
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .rfq-button:hover {
          transform: translateY(-2px);
        }

        .rfq-button:active {
          transform: translateY(0);
        }

        .rfq-nav-link {
          position: relative;
        }

        .rfq-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -7px;
          width: 0;
          height: 2px;
          border-radius: 10px;
          background: #2563eb;
          transition: width .25s ease;
        }

        .rfq-nav-link:hover::after {
          width: 100%;
        }

        .rfq-mobile-link {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 13px 14px;
          border-radius: 12px;
          color: #334155;
          font-weight: 700;
        }

        .rfq-mobile-link:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .rfq-shine {
          overflow: hidden;
          position: relative;
        }

        .rfq-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.28),
            transparent
          );
          transform: translateX(-120%);
          animation: shine 4s infinite;
        }

        @media (max-width: 1050px) {
          .rfq-desktop-nav {
            display: none !important;
          }

          .rfq-mobile-menu-btn {
            display: flex !important;
          }

          .rfq-hero-grid {
            grid-template-columns: 1fr !important;
          }

          .rfq-hero-copy {
            max-width: 760px !important;
            margin: 0 auto;
            text-align: center;
          }

          .rfq-hero-actions {
            justify-content: center !important;
          }

          .rfq-trust {
            justify-content: center !important;
          }

          .rfq-dashboard-preview {
            max-width: 760px;
            margin: 0 auto;
          }

          .rfq-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 720px) {
          .rfq-container {
            width: min(100% - 32px, 1180px) !important;
          }

          .rfq-hero {
            padding-top: 55px !important;
          }

          .rfq-hero-title {
            font-size: clamp(42px, 13vw, 68px) !important;
            line-height: .98 !important;
          }

          .rfq-hero-description {
            font-size: 17px !important;
            line-height: 1.7 !important;
          }

          .rfq-hero-actions {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .rfq-hero-actions a {
            width: 100%;
            justify-content: center;
          }

          .rfq-trust {
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
          }

          .rfq-dashboard-preview {
            padding: 10px !important;
          }

          .rfq-preview-window {
            min-height: 460px !important;
          }

          .rfq-preview-content {
            grid-template-columns: 58px 1fr !important;
          }

          .rfq-preview-sidebar-text {
            display: none;
          }

          .rfq-preview-sidebar {
            padding: 14px 9px !important;
          }

          .rfq-metric-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .rfq-features-grid {
            grid-template-columns: 1fr !important;
          }

          .rfq-steps {
            grid-template-columns: 1fr !important;
          }

          .rfq-role-grid {
            grid-template-columns: 1fr !important;
          }

          .rfq-security-grid {
            grid-template-columns: 1fr !important;
          }

          .rfq-footer-grid {
            grid-template-columns: 1fr !important;
          }

          .rfq-footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .rfq-section {
            padding: 75px 0 !important;
          }

          .rfq-section-title {
            font-size: 36px !important;
          }

          .rfq-nav {
            height: 72px !important;
          }

          .rfq-brand-subtitle {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .rfq-brand-name {
            font-size: 16px !important;
          }

          .rfq-hero-title {
            font-size: 42px !important;
          }

          .rfq-container {
            width: min(100% - 24px, 1180px) !important;
          }

          .rfq-metric-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* =========================
          NAVBAR
      ========================== */}
      <header
        style={{
          ...styles.navbar,
          ...(scrolled ? styles.navbarScrolled : {}),
        }}
        className="rfq-nav"
      >
        <div className="rfq-container" style={styles.navInner}>
          <Link to="/" style={styles.brand} onClick={closeMenu}>
            <div style={styles.brandLogo}>
              R
            </div>

            <div>
              <div
                className="rfq-brand-name"
                style={styles.brandName}
              >
                RFQ Market
              </div>

              <div
                className="rfq-brand-subtitle"
                style={styles.brandSubtitle}
              >
                B2B PROCUREMENT
              </div>
            </div>
          </Link>

          <nav
            className="rfq-desktop-nav"
            style={styles.desktopNav}
          >
            <button
              style={styles.navButton}
              className="rfq-nav-link"
              onClick={() => scrollTo("features")}
            >
              Features
            </button>

            <button
              style={styles.navButton}
              className="rfq-nav-link"
              onClick={() => scrollTo("how-it-works")}
            >
              How it works
            </button>

            <button
              style={styles.navButton}
              className="rfq-nav-link"
              onClick={() => scrollTo("security")}
            >
              Security
            </button>

            <button
              style={styles.navButton}
              className="rfq-nav-link"
              onClick={() => scrollTo("help")}
            >
              Help
            </button>

            <Link
              to={user ? getDashboard() : "/login"}
              style={styles.navSignIn}
              className="rfq-button"
            >
              {user ? "Workspace" : "Sign in"}
            </Link>

            <Link
              to={user ? getDashboard() : "/register"}
              style={styles.primaryButtonSmall}
              className="rfq-button rfq-shine"
            >
              {user ? "Open workspace" : "Get started"}
              <FiArrowRight size={17} />
            </Link>
          </nav>

          <button
            className="rfq-mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            style={styles.mobileMenuButton}
            aria-label="Open menu"
          >
            {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>

        {menuOpen && (
          <div style={styles.mobileMenu}>
            <button
              className="rfq-mobile-link"
              onClick={() => scrollTo("features")}
            >
              Features
            </button>

            <button
              className="rfq-mobile-link"
              onClick={() => scrollTo("how-it-works")}
            >
              How it works
            </button>

            <button
              className="rfq-mobile-link"
              onClick={() => scrollTo("security")}
            >
              Security
            </button>

            <button
              className="rfq-mobile-link"
              onClick={() => scrollTo("registration")}
            >
              Registration
            </button>

            <button
              className="rfq-mobile-link"
              onClick={() => scrollTo("help")}
            >
              Help & support
            </button>

            <Link
              to={user ? getDashboard() : "/login"}
              className="rfq-mobile-link"
              onClick={closeMenu}
            >
              {user ? "Open workspace" : "Sign in"}
            </Link>

            <Link
              to={user ? getDashboard() : "/register"}
              style={{
                ...styles.primaryButton,
                width: "100%",
                justifyContent: "center",
              }}
              className="rfq-button"
              onClick={closeMenu}
            >
              {user ? "Open workspace" : "Get started"}
              <FiArrowRight />
            </Link>
          </div>
        )}
      </header>

      {/* =========================
          HERO
      ========================== */}
      <main>
        <section style={styles.hero} className="rfq-hero">
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div
            className="rfq-container rfq-hero-grid"
            style={styles.heroGrid}
          >
            <div
              className="rfq-hero-copy rfq-fade-up"
              style={styles.heroCopy}
            >
              <div style={styles.eyebrow}>
                <span style={styles.eyebrowDot} />
                MODERN B2B PROCUREMENT PLATFORM
              </div>

              <h1
                className="rfq-hero-title"
                style={styles.heroTitle}
              >
                Smarter sourcing.
                <br />
                <span style={styles.heroGradientText}>
                  Faster decisions.
                </span>
              </h1>

              <p
                className="rfq-hero-description"
                style={styles.heroDescription}
              >
                RFQ Market brings buyers and suppliers together in
                one streamlined procurement workspace — from RFQ
                creation to quotation comparison and real-time
                communication.
              </p>

              <div
                className="rfq-hero-actions"
                style={styles.heroActions}
              >
                <Link
                  to={user ? getDashboard() : "/register"}
                  style={styles.primaryButton}
                  className="rfq-button rfq-shine"
                >
                  {user ? "Open workspace" : "Start for free"}
                  <FiArrowRight size={19} />
                </Link>

                <button
                  onClick={() => scrollTo("how-it-works")}
                  style={styles.secondaryButton}
                  className="rfq-button"
                >
                  <span style={styles.playCircle}>
                    <FiPlay size={13} />
                  </span>
                  See how it works
                </button>
              </div>

              <div
                className="rfq-trust"
                style={styles.trustRow}
              >
                <span>
                  <FiCheckCircle />
                  Email verification
                </span>

                <span>
                  <FiShield />
                  Role-based access
                </span>

                <span>
                  <FiMessageCircle />
                  Real-time chat
                </span>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div
              className="rfq-dashboard-preview rfq-fade-up-delay"
              style={styles.dashboardPreview}
            >
              <div
                className="rfq-preview-window"
                style={styles.previewWindow}
              >
                <div style={styles.previewTopbar}>
                  <div style={styles.browserDots}>
                    <i />
                    <i />
                    <i />
                  </div>

                  <div style={styles.previewTitle}>
                    RFQ Workspace
                  </div>

                  <div style={styles.liveBadge}>
                    <span />
                    Live
                  </div>
                </div>

                <div
                  className="rfq-preview-content"
                  style={styles.previewContent}
                >
                  <aside
                    className="rfq-preview-sidebar"
                    style={styles.previewSidebar}
                  >
                    <div style={styles.previewLogo}>R</div>

                    {[
                      <FiTrendingUp />,
                      <FiFileText />,
                      <FiShoppingBag />,
                      <FiMessageCircle />,
                      <FiUsers />,
                    ].map((icon, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.previewSideIcon,
                          ...(index === 0
                            ? styles.previewSideIconActive
                            : {}),
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </aside>

                  <div style={styles.previewMain}>
                    <div style={styles.previewHeader}>
                      <div>
                        <div style={styles.previewSmall}>
                          OVERVIEW
                        </div>

                        <h3 style={styles.previewHeading}>
                          Procurement dashboard
                        </h3>
                      </div>

                      <div style={styles.previewAvatar}>
                        B
                      </div>
                    </div>

                    <div
                      className="rfq-metric-grid"
                      style={styles.metricGrid}
                    >
                      <PreviewMetric
                        icon={<FiFileText />}
                        value="24"
                        label="Active RFQs"
                      />

                      <PreviewMetric
                        icon={<FiUsers />}
                        value="128"
                        label="Suppliers"
                      />

                      <PreviewMetric
                        icon={<FiTrendingUp />}
                        value="64"
                        label="Quotations"
                      />
                    </div>

                    <div style={styles.chartCard}>
                      <div style={styles.chartHeader}>
                        <div>
                          <strong>Quotation activity</strong>
                          <small>Last 7 days</small>
                        </div>

                        <FiTrendingUp
                          color="#2563eb"
                          size={20}
                        />
                      </div>

                      <div style={styles.chart}>
                        {[35, 50, 42, 68, 58, 80, 94].map(
                          (height, index) => (
                            <div
                              key={index}
                              style={{
                                ...styles.chartBar,
                                height: `${height}%`,
                                animationDelay: `${index * 100}ms`,
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div style={styles.activityCard}>
                      <div style={styles.activityIcon}>
                        <FiMessageCircle />
                      </div>

                      <div style={{ flex: 1 }}>
                        <strong>Live conversation</strong>
                        <small>
                          Supplier is online and ready to discuss
                          quotation.
                        </small>
                      </div>

                      <span style={styles.onlineDot} />
                    </div>
                  </div>
                </div>

                <div style={styles.floatingQuotation}>
                  <div style={styles.successIcon}>
                    <FiCheck />
                  </div>

                  <div>
                    <strong>Quotation received</strong>
                    <small>Just now</small>
                  </div>
                </div>

                <div style={styles.floatingChat}>
                  <FiMessageCircle />
                  <span>Supplier replied</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURES
        ========================== */}
        <section
          id="features"
          style={styles.section}
          className="rfq-section"
        >
          <div className="rfq-container">
            <SectionHeading
              eyebrow="ONE PROCUREMENT WORKFLOW"
              title="Everything you need to manage RFQs"
              description="Designed to keep procurement teams, buyers and suppliers connected from requirement to quotation."
            />

            <div
              className="rfq-features-grid"
              style={styles.featureGrid}
            >
              <FeatureCard
                icon={<FiFileText />}
                number="01"
                title="Create RFQs"
                text="Publish structured requirements with quantities, deadlines and procurement details."
              />

              <FeatureCard
                icon={<FiShoppingBag />}
                number="02"
                title="Receive quotations"
                text="Suppliers can review RFQs and submit competitive quotations directly through the platform."
              />

              <FeatureCard
                icon={<FiTrendingUp />}
                number="03"
                title="Compare offers"
                text="Review quotation information and make procurement decisions using organized data."
              />

              <FeatureCard
                icon={<FiMessageCircle />}
                number="04"
                title="Chat in real time"
                text="Buyers and suppliers can communicate through persistent real-time conversations."
              />

              <FeatureCard
                icon={<FiBellIcon />}
                number="05"
                title="Notifications"
                text="Keep users informed about quotations, messages, RFQs and important workspace activity."
              />

              <FeatureCard
                icon={<FiShield />}
                number="06"
                title="Protected workspace"
                text="Role-based access and authenticated APIs keep buyer, supplier and admin areas separated."
              />
            </div>
          </div>
        </section>

        {/* =========================
            HOW IT WORKS
        ========================== */}
        <section
          id="how-it-works"
          style={styles.darkSection}
          className="rfq-section"
        >
          <div className="rfq-container">
            <SectionHeading
              dark
              eyebrow="SIMPLE WORKFLOW"
              title="How RFQ Market works"
              description="A straightforward procurement flow for both sides of the marketplace."
            />

            <div
              className="rfq-steps"
              style={styles.stepsGrid}
            >
              <StepCard
                number="01"
                icon={<FiEditIcon />}
                title="Buyer creates an RFQ"
                text="Add the product, quantity, specifications and required delivery information."
              />

              <StepCard
                number="02"
                icon={<FiSend />}
                title="Supplier reviews"
                text="Suppliers discover available RFQs and review buyer requirements."
              />

              <StepCard
                number="03"
                icon={<FiFileText />}
                title="Supplier sends quotation"
                text="Submit pricing, quantity, delivery timeline and other quotation details."
              />

              <StepCard
                number="04"
                icon={<FiMessageCircle />}
                title="Discuss & decide"
                text="Use real-time chat to clarify requirements and continue procurement communication."
              />
            </div>
          </div>
        </section>

        {/* =========================
            BUYER / SUPPLIER
        ========================== */}
        <section
          style={styles.section}
          className="rfq-section"
        >
          <div className="rfq-container">
            <SectionHeading
              eyebrow="FOR EVERY PARTICIPANT"
              title="Built for buyers and suppliers"
              description="Each role gets a focused workspace with the tools needed for its procurement workflow."
            />

            <div
              className="rfq-role-grid"
              style={styles.roleGrid}
            >
              <RoleCard
                type="BUYER"
                icon={<FiUser />}
                title="Buyer workspace"
                description="Create RFQs, manage procurement requirements, review supplier quotations and communicate with suppliers."
                items={[
                  "Create and manage RFQs",
                  "Review supplier quotations",
                  "Real-time supplier messaging",
                  "Track procurement activity",
                  "Manage notifications",
                ]}
                button="Create buyer account"
                link="/register"
              />

              <RoleCard
                type="SUPPLIER"
                icon={<FiShoppingBag />}
                title="Supplier workspace"
                description="Discover relevant RFQs, submit quotations, communicate with buyers and manage responses."
                items={[
                  "Browse available RFQs",
                  "Submit quotations",
                  "Communicate with buyers",
                  "Track quotation activity",
                  "Receive real-time notifications",
                ]}
                button="Join as supplier"
                link="/register"
              />
            </div>
          </div>
        </section>

        {/* =========================
            REGISTRATION
        ========================== */}
        <section
          id="registration"
          style={styles.registrationSection}
          className="rfq-section"
        >
          <div className="rfq-container">
            <div style={styles.registrationBox}>
              <div style={styles.registrationLeft}>
                <div style={styles.eyebrow}>
                  <span style={styles.eyebrowDot} />
                  QUICK REGISTRATION
                </div>

                <h2 style={styles.registrationTitle}>
                  Start your procurement workspace in minutes.
                </h2>

                <p style={styles.registrationDescription}>
                  Create your account, verify your email and start
                  managing your RFQ workflow.
                </p>

                <Link
                  to={user ? getDashboard() : "/register"}
                  style={styles.primaryButton}
                  className="rfq-button rfq-shine"
                >
                  {user ? "Open workspace" : "Create account"}
                  <FiArrowRight />
                </Link>
              </div>

              <div style={styles.registrationSteps}>
                <RegistrationStep
                  number="1"
                  title="Create account"
                  text="Enter your basic account details."
                />

                <RegistrationStep
                  number="2"
                  title="Choose your role"
                  text="Register as a buyer or supplier."
                />

                <RegistrationStep
                  number="3"
                  title="Verify email"
                  text="Complete OTP verification."
                />

                <RegistrationStep
                  number="4"
                  title="Start working"
                  text="Access your personalized workspace."
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            SECURITY
        ========================== */}
        <section
          id="security"
          style={styles.section}
          className="rfq-section"
        >
          <div className="rfq-container">
            <SectionHeading
              eyebrow="SECURITY & ACCESS"
              title="Designed with secure access in mind"
              description="Authentication and role separation are part of the platform architecture."
            />

            <div
              className="rfq-security-grid"
              style={styles.securityGrid}
            >
              <SecurityCard
                icon={<FiLock />}
                title="Authenticated APIs"
                text="Protected API endpoints help keep workspace data accessible only to authorized users."
              />

              <SecurityCard
                icon={<FiShield />}
                title="Role-based access"
                text="Buyer, supplier and admin experiences are separated through role-aware access."
              />

              <SecurityCard
                icon={<FiDatabase />}
                title="Persistent data"
                text="RFQs, quotations, conversations and messages are stored for continued workflow access."
              />

              <SecurityCard
                icon={<FiZap />}
                title="Real-time communication"
                text="Socket-based communication enables live buyer and supplier messaging."
              />
            </div>
          </div>
        </section>

        {/* =========================
            FAQ / HELP
        ========================== */}
        <section
          id="help"
          style={styles.helpSection}
          className="rfq-section"
        >
          <div className="rfq-container">
            <div style={styles.helpHeader}>
              <div>
                <div style={styles.eyebrow}>
                  <span style={styles.eyebrowDot} />
                  HELP & SUPPORT
                </div>

                <h2
                  className="rfq-section-title"
                  style={styles.sectionTitle}
                >
                  Need help?
                </h2>

                <p style={styles.sectionDescription}>
                  Find answers below or contact the developer team
                  directly.
                </p>
              </div>

              <a
                href="mailto:developer@codepilot.devteam"
                style={styles.emailButton}
                className="rfq-button"
              >
                <FiMail />
                Email developer
              </a>
            </div>

            <div style={styles.faqList}>
              {faqs.map((faq, index) => {
                const open = activeFaq === index;

                return (
                  <div
                    key={faq.question}
                    style={{
                      ...styles.faqItem,
                      ...(open ? styles.faqItemOpen : {}),
                    }}
                  >
                    <button
                      onClick={() =>
                        setActiveFaq(open ? null : index)
                      }
                      style={styles.faqQuestion}
                    >
                      <span>
                        <FiHelpCircle />
                        {faq.question}
                      </span>

                      <FiChevronDown
                        style={{
                          transform: open
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform .25s ease",
                        }}
                      />
                    </button>

                    {open && (
                      <div style={styles.faqAnswer}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.contactCard}>
              <div style={styles.contactIcon}>
                <FiCode />
              </div>

              <div style={{ flex: 1 }}>
                <strong>Developed by CodePilot.devteam</strong>

                <p>
                  For project support, implementation questions,
                  improvements or development communication, contact
                  the developer team.
                </p>
              </div>

              <a
                href="mailto:developer@codepilot.devteam"
                style={styles.contactButton}
                className="rfq-button"
              >
                <FiMail />
                Contact developer
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer style={styles.footer}>
        <div className="rfq-container">
          <div
            className="rfq-footer-grid"
            style={styles.footerGrid}
          >
            <div style={styles.footerBrandColumn}>
              <Link to="/" style={styles.footerBrand}>
                <div style={styles.footerLogo}>R</div>

                <div>
                  <strong>RFQ Market</strong>
                  <span>B2B PROCUREMENT</span>
                </div>
              </Link>

              <p style={styles.footerDescription}>
                A modern open-source B2B procurement platform for
                managing RFQs, quotations and buyer-supplier
                communication.
              </p>

              <div style={styles.openSourceBadge}>
                <FiCode />
                Open source
              </div>
            </div>

            <FooterColumn
              title="Platform"
              links={[
                ["Features", () => scrollTo("features")],
                ["How it works", () => scrollTo("how-it-works")],
                ["Security", () => scrollTo("security")],
                ["Registration", () => scrollTo("registration")],
              ]}
            />

            <FooterColumn
              title="Account"
              links={[
                ["Sign in", () => (window.location.href = "/login")],
                [
                  "Register",
                  () => (window.location.href = "/register"),
                ],
                [
                  "Workspace",
                  () =>
                    (window.location.href = getDashboard()),
                ],
                ["Help", () => scrollTo("help")],
              ]}
            />

            <div>
              <h4 style={styles.footerHeading}>
                Developer
              </h4>

              <div style={styles.developerName}>
                Developed by <strong>CodePilot.devteam</strong>
              </div>

              <a
                href="mailto:developer@codepilot.devteam"
                style={styles.footerLink}
              >
                <FiMail />
                Email developer
              </a>

              <button
                onClick={() => scrollTo("help")}
                style={styles.footerLinkButton}
              >
                <FiHelpCircle />
                Project support
              </button>

              <div style={styles.footerTech}>
                <FiCode />
                React · Node.js · MySQL · Socket.IO
              </div>
            </div>
          </div>

          <div
            className="rfq-footer-bottom"
            style={styles.footerBottom}
          >
            <span>
              © {new Date().getFullYear()} RFQ Market. All rights
              reserved.
            </span>

            <span style={styles.footerOpenSource}>
              Open source · Available for business use
            </span>

            <span>
              Developed by{" "}
              <strong>CodePilot.devteam</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}) {
  return (
    <div style={styles.sectionHeading}>
      <div
        style={{
          ...styles.eyebrow,
          ...(dark ? styles.darkEyebrow : {}),
        }}
      >
        <span
          style={{
            ...styles.eyebrowDot,
            ...(dark ? { background: "#60a5fa" } : {}),
          }}
        />
        {eyebrow}
      </div>

      <h2
        className="rfq-section-title"
        style={{
          ...styles.sectionTitle,
          ...(dark ? styles.darkSectionTitle : {}),
        }}
      >
        {title}
      </h2>

      <p
        style={{
          ...styles.sectionDescription,
          ...(dark ? styles.darkSectionDescription : {}),
        }}
      >
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ icon, number, title, text }) {
  return (
    <div
      className="rfq-card-hover"
      style={styles.featureCard}
    >
      <div style={styles.featureTop}>
        <div style={styles.featureIcon}>{icon}</div>
        <span style={styles.featureNumber}>{number}</span>
      </div>

      <h3 style={styles.featureTitle}>{title}</h3>

      <p style={styles.featureText}>{text}</p>

      <div style={styles.featureArrow}>
        <FiArrowRight />
      </div>
    </div>
  );
}

function StepCard({ number, icon, title, text }) {
  return (
    <div style={styles.stepCard}>
      <div style={styles.stepNumber}>{number}</div>

      <div style={styles.stepIcon}>{icon}</div>

      <h3 style={styles.stepTitle}>{title}</h3>

      <p style={styles.stepText}>{text}</p>
    </div>
  );
}

function RoleCard({
  type,
  icon,
  title,
  description,
  items,
  button,
  link,
}) {
  return (
    <div
      className="rfq-card-hover"
      style={styles.roleCard}
    >
      <div style={styles.roleHeader}>
        <div style={styles.roleIcon}>{icon}</div>

        <span style={styles.roleBadge}>{type}</span>
      </div>

      <h3 style={styles.roleTitle}>{title}</h3>

      <p style={styles.roleDescription}>{description}</p>

      <div style={styles.roleList}>
        {items.map((item) => (
          <div key={item} style={styles.roleListItem}>
            <FiCheckCircle />
            {item}
          </div>
        ))}
      </div>

      <Link
        to={link}
        style={styles.roleButton}
        className="rfq-button"
      >
        {button}
        <FiArrowRight />
      </Link>
    </div>
  );
}

function RegistrationStep({ number, title, text }) {
  return (
    <div style={styles.registrationStep}>
      <div style={styles.registrationNumber}>{number}</div>

      <div>
        <strong style={styles.registrationStepTitle}>
          {title}
        </strong>

        <p style={styles.registrationStepText}>
          {text}
        </p>
      </div>
    </div>
  );
}

function SecurityCard({ icon, title, text }) {
  return (
    <div
      className="rfq-card-hover"
      style={styles.securityCard}
    >
      <div style={styles.securityIcon}>{icon}</div>

      <h3 style={styles.securityTitle}>{title}</h3>

      <p style={styles.securityText}>{text}</p>
    </div>
  );
}

function PreviewMetric({ icon, value, label }) {
  return (
    <div style={styles.previewMetric}>
      <div style={styles.previewMetricIcon}>{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 style={styles.footerHeading}>{title}</h4>

      <div style={styles.footerLinks}>
        {links.map(([label, action]) => (
          <button
            key={label}
            onClick={action}
            style={styles.footerLinkButton}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Small icon aliases so the main file stays readable. */

function FiBellIcon() {
  return <FiMessageCircle />;
}

function FiEditIcon() {
  return <FiFileText />;
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    overflowX: "hidden",
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 82,
    zIndex: 1000,
    background: "rgba(255,255,255,.88)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(226,232,240,.7)",
    transition: "all .25s ease",
  },

  navbarScrolled: {
    height: 72,
    background: "rgba(255,255,255,.96)",
    boxShadow: "0 8px 35px rgba(15,23,42,.07)",
  },

  container: {},

  navInner: {
    width: "min(1180px, calc(100% - 40px))",
    height: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#0f172a",
  },

  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 15,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: 23,
    fontWeight: 900,
    background:
      "linear-gradient(135deg,#2563eb 0%,#4f46e5 55%,#7c3aed 100%)",
    boxShadow: "0 12px 28px rgba(37,99,235,.25)",
  },

  brandName: {
    fontSize: 18,
    fontWeight: 850,
    letterSpacing: "-.4px",
  },

  brandSubtitle: {
    marginTop: 2,
    color: "#94a3b8",
    fontSize: 10,
    letterSpacing: "1.2px",
    fontWeight: 800,
  },

  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: 28,
  },

  navButton: {
    border: 0,
    background: "transparent",
    color: "#475569",
    fontSize: 14,
    fontWeight: 750,
    cursor: "pointer",
    padding: "8px 0",
  },

  navSignIn: {
    color: "#0f172a",
    fontWeight: 800,
    fontSize: 14,
  },

  primaryButtonSmall: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    color: "#fff",
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    borderRadius: 13,
    padding: "13px 18px",
    fontWeight: 800,
    fontSize: 14,
    boxShadow: "0 10px 25px rgba(37,99,235,.22)",
  },

  mobileMenuButton: {
    display: "none",
    width: 44,
    height: 44,
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#0f172a",
  },

  mobileMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 12,
    right: 12,
    padding: 12,
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 25px 70px rgba(15,23,42,.15)",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  hero: {
    minHeight: "100vh",
    paddingTop: 150,
    paddingBottom: 90,
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 12% 25%,rgba(59,130,246,.10),transparent 30%), radial-gradient(circle at 88% 45%,rgba(124,58,237,.08),transparent 32%), linear-gradient(180deg,#f8fbff 0%,#fff 70%)",
  },

  heroGlowOne: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    top: 100,
    left: -220,
    background: "rgba(37,99,235,.10)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },

  heroGlowTwo: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    right: -220,
    top: 300,
    background: "rgba(124,58,237,.10)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },

  heroGrid: {
    width: "min(1180px, calc(100% - 40px))",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, .9fr) minmax(0, 1.1fr)",
    gap: 55,
    alignItems: "center",
    position: "relative",
    zIndex: 2,
  },

  heroCopy: {
    maxWidth: 620,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    padding: "8px 13px",
    borderRadius: 999,
    color: "#2563eb",
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "1px",
  },

  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 0 5px rgba(34,197,94,.12)",
    animation: "pulse 2s infinite",
  },

  heroTitle: {
    margin: "25px 0 20px",
    color: "#0f172a",
    fontSize: "clamp(55px, 6.5vw, 88px)",
    lineHeight: ".98",
    letterSpacing: "-5px",
    fontWeight: 900,
  },

  heroGradientText: {
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5 55%,#7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heroDescription: {
    maxWidth: 610,
    margin: 0,
    color: "#64748b",
    fontSize: 19,
    lineHeight: 1.75,
  },

  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    marginTop: 30,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "15px 21px",
    borderRadius: 14,
    color: "#fff",
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    fontSize: 15,
    fontWeight: 850,
    border: 0,
    cursor: "pointer",
    boxShadow: "0 15px 35px rgba(37,99,235,.24)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 20px",
    borderRadius: 14,
    color: "#0f172a",
    background: "#fff",
    border: "1px solid #dbe3ef",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 7px 20px rgba(15,23,42,.05)",
  },

  playCircle: {
    width: 27,
    height: 27,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#eff6ff",
    color: "#2563eb",
  },

  trustRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 25,
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
  },

  trustItem: {},

  dashboardPreview: {
    position: "relative",
    animation: "floatSlow 6s ease-in-out infinite",
  },

  previewWindow: {
    position: "relative",
    minHeight: 590,
    borderRadius: 25,
    overflow: "hidden",
    background: "#fff",
    border: "1px solid #dbe4ef",
    boxShadow:
      "0 35px 100px rgba(15,23,42,.15), 0 8px 30px rgba(37,99,235,.06)",
  },

  previewTopbar: {
    height: 55,
    display: "flex",
    alignItems: "center",
    padding: "0 17px",
    borderBottom: "1px solid #e8edf4",
    background: "#fbfdff",
  },

  browserDots: {
    display: "flex",
    gap: 5,
    width: 70,
  },

  previewTitle: {
    flex: 1,
    textAlign: "center",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#16a34a",
    fontSize: 11,
    fontWeight: 800,
  },

  previewContent: {
    display: "grid",
    gridTemplateColumns: "76px 1fr",
    minHeight: 535,
  },

  previewSidebar: {
    padding: "20px 13px",
    borderRight: "1px solid #edf1f6",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 13,
  },

  previewLogo: {
    width: 43,
    height: 43,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontWeight: 900,
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    marginBottom: 10,
  },

  previewSideIcon: {
    width: 43,
    height: 43,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    color: "#94a3b8",
  },

  previewSideIconActive: {
    background: "#eff6ff",
    color: "#2563eb",
  },

  previewMain: {
    padding: 24,
    background: "#fff",
  },

  previewHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  previewSmall: {
    color: "#94a3b8",
    fontSize: 9,
    letterSpacing: "1.3px",
    fontWeight: 900,
  },

  previewHeading: {
    margin: "5px 0 0",
    color: "#0f172a",
    fontSize: 20,
    letterSpacing: "-.6px",
  },

  previewAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#e2e8f0",
    color: "#334155",
    fontWeight: 900,
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
    marginTop: 24,
  },

  previewMetric: {
    minHeight: 125,
    padding: 15,
    border: "1px solid #e5eaf1",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "#fff",
  },

  previewMetricIcon: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    color: "#2563eb",
    background: "#eff6ff",
    borderRadius: 9,
    marginBottom: 6,
  },

  chartCard: {
    marginTop: 14,
    padding: 17,
    border: "1px solid #e5eaf1",
    borderRadius: 15,
  },

  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chart: {
    height: 145,
    marginTop: 15,
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    padding: "0 8px",
  },

  chartBar: {
    flex: 1,
    minWidth: 10,
    borderRadius: "7px 7px 2px 2px",
    background:
      "linear-gradient(180deg,#60a5fa,#2563eb)",
    animation:
      "fadeUp .8s ease both",
  },

  activityCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
    padding: 15,
    borderRadius: 15,
    background: "#f8fafc",
    border: "1px solid #e7edf4",
  },

  activityIcon: {
    width: 38,
    height: 38,
    display: "grid",
    placeItems: "center",
    borderRadius: 11,
    color: "#2563eb",
    background: "#dbeafe",
  },

  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 0 5px rgba(34,197,94,.10)",
  },

  floatingQuotation: {
    position: "absolute",
    left: -30,
    bottom: 55,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 16px",
    borderRadius: 15,
    background: "#fff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 45px rgba(15,23,42,.14)",
    animation: "notification 4s ease-in-out infinite",
  },

  floatingChat: {
    position: "absolute",
    right: -28,
    top: 130,
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "12px 15px",
    borderRadius: 13,
    color: "#2563eb",
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    boxShadow: "0 18px 45px rgba(37,99,235,.13)",
    animation: "float 4s ease-in-out infinite",
  },

  successIcon: {
    width: 31,
    height: 31,
    display: "grid",
    placeItems: "center",
    color: "#16a34a",
    background: "#dcfce7",
    borderRadius: "50%",
  },

  section: {
    padding: "105px 0",
    background: "#fff",
  },

  sectionHeading: {
    maxWidth: 720,
    margin: "0 auto 55px",
    textAlign: "center",
  },

  sectionTitle: {
    margin: "17px 0 13px",
    color: "#0f172a",
    fontSize: 48,
    lineHeight: 1.05,
    letterSpacing: "-2.5px",
    fontWeight: 900,
  },

  sectionDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: 17,
    lineHeight: 1.7,
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 17,
  },

  featureCard: {
    position: "relative",
    minHeight: 255,
    padding: 25,
    border: "1px solid #e5eaf1",
    borderRadius: 20,
    background: "#fff",
    overflow: "hidden",
  },

  featureTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  featureIcon: {
    width: 48,
    height: 48,
    display: "grid",
    placeItems: "center",
    borderRadius: 14,
    color: "#2563eb",
    background: "#eff6ff",
    fontSize: 21,
  },

  featureNumber: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 900,
  },

  featureTitle: {
    margin: "27px 0 10px",
    color: "#0f172a",
    fontSize: 19,
  },

  featureText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.7,
    fontSize: 14,
  },

  featureArrow: {
    position: "absolute",
    right: 24,
    bottom: 24,
    color: "#2563eb",
  },

  darkSection: {
    padding: "105px 0",
    background:
      "radial-gradient(circle at 80% 20%,rgba(37,99,235,.18),transparent 30%), #0b1220",
  },

  darkEyebrow: {
    color: "#93c5fd",
    background: "rgba(37,99,235,.12)",
    borderColor: "rgba(96,165,250,.22)",
  },

  darkSectionTitle: {
    color: "#fff",
  },

  darkSectionDescription: {
    color: "#94a3b8",
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 15,
  },

  stepCard: {
    position: "relative",
    padding: 26,
    borderRadius: 20,
    border: "1px solid rgba(148,163,184,.14)",
    background: "rgba(255,255,255,.035)",
  },

  stepNumber: {
    color: "#60a5fa",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "1px",
  },

  stepIcon: {
    width: 48,
    height: 48,
    marginTop: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: 14,
    color: "#93c5fd",
    background: "rgba(37,99,235,.15)",
    fontSize: 21,
  },

  stepTitle: {
    color: "#fff",
    margin: "22px 0 10px",
    fontSize: 18,
  },

  stepText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.7,
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 20,
  },

  roleCard: {
    padding: 32,
    border: "1px solid #e5eaf1",
    borderRadius: 22,
    background: "#fff",
  },

  roleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roleIcon: {
    width: 52,
    height: 52,
    display: "grid",
    placeItems: "center",
    color: "#2563eb",
    background: "#eff6ff",
    borderRadius: 15,
    fontSize: 22,
  },

  roleBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    color: "#2563eb",
    background: "#eff6ff",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: ".7px",
  },

  roleTitle: {
    margin: "25px 0 10px",
    color: "#0f172a",
    fontSize: 25,
  },

  roleDescription: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.7,
  },

  roleList: {
    marginTop: 23,
    display: "flex",
    flexDirection: "column",
    gap: 11,
  },

  roleListItem: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    color: "#475569",
    fontSize: 14,
    fontWeight: 650,
  },

  roleButton: {
    marginTop: 27,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 17px",
    borderRadius: 12,
    color: "#2563eb",
    background: "#eff6ff",
    fontWeight: 800,
    fontSize: 14,
  },

  registrationSection: {
    padding: "90px 0",
    background: "#f8fafc",
  },

  registrationBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 50,
    padding: "55px",
    borderRadius: 28,
    background:
      "linear-gradient(135deg,#0f172a,#172554)",
    position: "relative",
    overflow: "hidden",
  },

  registrationLeft: {
    position: "relative",
    zIndex: 2,
  },

  registrationTitle: {
    margin: "20px 0 15px",
    color: "#fff",
    fontSize: 43,
    lineHeight: 1.05,
    letterSpacing: "-2px",
  },

  registrationDescription: {
    maxWidth: 510,
    color: "#94a3b8",
    lineHeight: 1.75,
    marginBottom: 28,
  },

  registrationSteps: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    position: "relative",
    zIndex: 2,
  },

  registrationStep: {
    display: "flex",
    gap: 12,
    padding: 18,
    borderRadius: 16,
    background: "rgba(255,255,255,.055)",
    border: "1px solid rgba(148,163,184,.12)",
  },

  registrationNumber: {
    width: 32,
    height: 32,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 900,
  },

  registrationStepTitle: {
    display: "block",
    color: "#fff",
    fontSize: 14,
  },

  registrationStepText: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.5,
  },

  securityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
  },

  securityCard: {
    padding: 25,
    border: "1px solid #e5eaf1",
    borderRadius: 19,
    background: "#fff",
  },

  securityIcon: {
    width: 46,
    height: 46,
    display: "grid",
    placeItems: "center",
    borderRadius: 13,
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: 20,
  },

  securityTitle: {
    margin: "22px 0 10px",
    fontSize: 17,
    color: "#0f172a",
  },

  securityText: {
    margin: 0,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.7,
  },

  helpSection: {
    padding: "105px 0",
    background: "#f8fafc",
  },

  helpHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 25,
    marginBottom: 35,
  },

  emailButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    padding: "13px 18px",
    borderRadius: 12,
    color: "#fff",
    background: "#0f172a",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  faqItem: {
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    background: "#fff",
    overflow: "hidden",
    transition: "all .25s ease",
  },

  faqItemOpen: {
    borderColor: "#bfdbfe",
    boxShadow: "0 12px 35px rgba(37,99,235,.06)",
  },

  faqQuestion: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    padding: "19px 21px",
    border: 0,
    background: "transparent",
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
    fontSize: 14,
    fontWeight: 800,
  },

  faqQuestionSpan: {},

  faqAnswer: {
    padding: "0 21px 20px 51px",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.7,
  },

  contactCard: {
    display: "flex",
    alignItems: "center",
    gap: 17,
    marginTop: 35,
    padding: 23,
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #e2e8f0",
  },

  contactIcon: {
    width: 48,
    height: 48,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: 13,
    color: "#2563eb",
    background: "#eff6ff",
    fontSize: 20,
  },

  contactButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 15px",
    borderRadius: 11,
    color: "#2563eb",
    background: "#eff6ff",
    fontWeight: 800,
    fontSize: 13,
    whiteSpace: "nowrap",
  },

  footer: {
    padding: "75px 0 25px",
    background: "#050b16",
    color: "#fff",
  },

  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1.1fr",
    gap: 50,
    paddingBottom: 55,
  },

  footerBrandColumn: {
    maxWidth: 380,
  },

  footerBrand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    color: "#fff",
  },

  footerLogo: {
    width: 45,
    height: 45,
    display: "grid",
    placeItems: "center",
    borderRadius: 13,
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    fontSize: 21,
    fontWeight: 900,
  },

  footerDescription: {
    margin: "22px 0",
    color: "#94a3b8",
    lineHeight: 1.75,
    fontSize: 13,
  },

  openSourceBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 11px",
    borderRadius: 9,
    border: "1px solid #1e293b",
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 700,
  },

  footerHeading: {
    margin: "4px 0 19px",
    color: "#fff",
    fontSize: 14,
  },

  footerLinks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },

  footerLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 13,
    color: "#94a3b8",
    fontSize: 13,
  },

  footerLinkButton: {
    border: 0,
    padding: 0,
    background: "transparent",
    color: "#94a3b8",
    fontSize: 13,
    cursor: "pointer",
    textAlign: "left",
  },

  developerName: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },

  footerTech: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginTop: 18,
    color: "#64748b",
    fontSize: 11,
  },

  footerBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    paddingTop: 24,
    borderTop: "1px solid #172033",
    color: "#64748b",
    fontSize: 11,
  },

  footerOpenSource: {
    color: "#60a5fa",
  },
};