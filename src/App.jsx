import { useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Check,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  MonitorSmartphone,
  Rocket,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

/* ===========================================================
   CRM API
=========================================================== */

const CRM_API_URL =
  "https://site--brandspire-crm--gnbmjcfsyzsx.code.run/api";

/* ===========================================================
   PROJECTS
=========================================================== */

const projects = [
  {
    number: "01",
    title: "BrandSpire CRM",
    category: "Business CRM Platform",
    description:
      "A modern customer relationship management platform built to manage customers, leads, tasks, invoices and day-to-day business operations from one place.",
    link: "https://brandspire-crm.vercel.app/dashboard",
    tags: ["CRM", "React", "Business SaaS"],
    icon: BarChart3,
    previewClass: "preview-crm",
    previewLabel: "CRM / DASHBOARD",
  },

  {
    number: "02",
    title: "Demon's Biller",
    category: "POS & Billing System",
    description:
      "A fast point-of-sale and billing experience for counter operations, with order creation, customer handling, bill generation and saved billing records.",
    link: "https://demon-s-biller.vercel.app/create-bill",
    tags: ["POS", "Billing", "Responsive UI"],
    icon: Zap,
    previewClass: "preview-biller",
    previewLabel: "POS / BILLING",
  },

  {
    number: "03",
    title: "KisanSetu",
    category: "E-commerce Marketplace",
    description:
      "An e-commerce marketplace experience created to connect users with products through a clean, accessible and scalable digital storefront.",
    link: "https://kisan-setu-gamma.vercel.app/",
    tags: ["E-commerce", "Marketplace", "Web App"],
    icon: ShoppingBag,
    previewClass: "preview-kisan",
    previewLabel: "COMMERCE / MARKETPLACE",
  },
];

/* ===========================================================
   SERVICES
=========================================================== */

const services = [
  {
    icon: Globe2,
    title: "Web Development",
    text: "Fast, responsive websites and web applications designed around your business goals.",
  },

  {
    icon: MonitorSmartphone,
    title: "App Development",
    text: "Modern mobile-first product experiences with intuitive flows and scalable foundations.",
  },

  {
    icon: Layers3,
    title: "Custom Software",
    text: "Purpose-built software, dashboards, automation tools, billing systems and internal platforms.",
  },

  {
    icon: Boxes,
    title: "SaaS Products",
    text: "From idea to deployable SaaS product with clean interfaces and business-ready architecture.",
  },
];

/* ===========================================================
   PROCESS
=========================================================== */

const process = [
  [
    "01",
    "Discover",
    "We understand your idea, users, goals and the exact problem the software needs to solve.",
  ],

  [
    "02",
    "Design",
    "We shape the user experience, visual direction, screens and product flow before building.",
  ],

  [
    "03",
    "Build",
    "We develop the product with a focus on performance, responsiveness and maintainability.",
  ],

  [
    "04",
    "Launch",
    "We test, deploy and help take the project from development to a working live product.",
  ],
];

/* ===========================================================
   LOGO
=========================================================== */

function Logo() {
  return (
    <a
      className="brand"
      href="#home"
      aria-label="BrandSpire home"
    >
      <span className="brand-mark">
        <Sparkles
          size={17}
          strokeWidth={2.5}
        />
      </span>

      <span>
        Brand<span>Spire</span>
      </span>
    </a>
  );
}

/* ===========================================================
   CONTACT FORM
=========================================================== */

function ContactForm() {
  const formId =
    import.meta.env.VITE_FORMSPREE_ID ||
    "YOUR_FORM_ID";

  const [sending, setSending] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;

    const form = event.currentTarget;

    const formData =
      new FormData(form);

    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (
      !name ||
      !email ||
      !message
    ) {
      setErrorMessage(
        "Please fill all required fields."
      );

      return;
    }

    if (
      formId === "YOUR_FORM_ID"
    ) {
      setErrorMessage(
        "Formspree is not configured. Please add VITE_FORMSPREE_ID."
      );

      return;
    }

    try {
      setSending(true);
      setErrorMessage("");

      /* =====================================================
         1. SEND TO FORMSPREE
      ===================================================== */

      const formspreeResponse =
        await fetch(
          `https://formspree.io/f/${formId}`,
          {
            method: "POST",

            body: formData,

            headers: {
              Accept:
                "application/json",
            },
          }
        );

      let formspreeData = {};

      try {
        formspreeData =
          await formspreeResponse.json();
      } catch {
        formspreeData = {};
      }

      if (!formspreeResponse.ok) {
        throw new Error(
          formspreeData?.errors?.[0]
            ?.message ||
            "Form submission failed."
        );
      }

      /* =====================================================
         2. SEND TO CRM
      ===================================================== */

      const crmResponse =
        await fetch(
          `${CRM_API_URL}/notifications/contact`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,

              projectDetails:
                message,

              source:
                "BrandSpire Portfolio",
            }),
          }
        );

      let crmData = {};

      try {
        crmData =
          await crmResponse.json();
      } catch {
        crmData = {};
      }

      if (!crmResponse.ok) {
        throw new Error(
          crmData?.message ||
            "CRM notification failed."
        );
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      form.reset();

      setSuccess(true);
    } catch (error) {
      console.error(
        "Contact Submit Error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     SUCCESS UI
  ========================================================= */

  if (success) {
    return (
      <div className="form-success">

        <div className="success-icon">
          <Check size={28} />
        </div>

        <p className="eyebrow">
          MESSAGE RECEIVED
        </p>

        <h3>
          Thanks for reaching out.
        </h3>

        <p>
          We’ve received your project details.
          Our BrandSpire team will review your
          message and get back to you as soon
          as possible.
        </p>

        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setSuccess(false);
            setErrorMessage("");
          }}
        >
          Send another message
        </button>

      </div>
    );
  }

  /* =========================================================
     FORM UI
  ========================================================= */

  return (
    <form
      className="contact-form"
      onSubmit={handleContactSubmit}
    >

      <input
        type="hidden"
        name="subject"
        value="New BrandSpire Project Enquiry"
      />

      {/* Name */}

      <div className="field-group">

        <label htmlFor="name">
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          required
        />

      </div>

      {/* Email */}

      <div className="field-group">

        <label htmlFor="email">
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

      </div>

      {/* Message */}

      <div className="field-group">

        <label htmlFor="message">
          Project details
        </label>

        <textarea
          id="message"
          name="message"
          rows="6"
          placeholder="Tell us what you want to build, important features, expected timeline, or anything else we should know."
          required
        />

      </div>

      {/* Error */}

      {errorMessage && (
        <p
          style={{
            color: "#ef4444",
            marginTop: "8px",
            marginBottom: "8px",
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </p>
      )}

      {/* Submit */}

      <button
        className="submit-button"
        type="submit"
        disabled={sending}
      >
        <span>
          {sending
            ? "Sending..."
            : "Send message"}
        </span>

        <Send size={17} />
      </button>

      {formId ===
        "YOUR_FORM_ID" && (
        <p className="setup-note">
          Developer setup: add your
          Formspree form ID to{" "}
          <code>
            VITE_FORMSPREE_ID
          </code>{" "}
          before deploying.
        </p>
      )}

    </form>
  );
}

/* ===========================================================
   APP
=========================================================== */

export default function App() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const closeMenu = () =>
    setMenuOpen(false);

  return (
    <div className="site-shell">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* ================= HEADER ================= */}

      <header className="site-header">

        <div className="container nav-wrap">

          <Logo />

          <nav
            className={
              menuOpen
                ? "nav-links nav-open"
                : "nav-links"
            }
          >

            <a
              href="#services"
              onClick={closeMenu}
            >
              Services
            </a>

            <a
              href="#work"
              onClick={closeMenu}
            >
              Work
            </a>

            <a
              href="#process"
              onClick={closeMenu}
            >
              Process
            </a>

            <a
              href="#contact"
              onClick={closeMenu}
            >
              Contact
            </a>

          </nav>

          <a
            className="nav-cta"
            href="#contact"
          >
            Start a project

            <ArrowRight size={15} />
          </a>

          <button
            className="menu-button"
            type="button"
            onClick={() =>
              setMenuOpen(
                (value) => !value
              )
            }
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X />
            ) : (
              <Menu />
            )}
          </button>

        </div>

      </header>

      <main>

        {/* ================= HERO ================= */}

        <section
          className="hero section"
          id="home"
        >

          <div className="container hero-grid">

            <div className="hero-copy">

              <div className="pill">

                <span className="live-dot" />

                SOFTWARE SOLUTIONS, BUILT TO SHIP

              </div>

              <h1>
                We turn ideas into

                <span className="gradient-text">
                  {" "}
                  digital products.
                </span>
              </h1>

              <p className="hero-text">
                BrandSpire is a software team
                building web applications,
                mobile experiences, business
                systems and custom digital
                products for real-world needs.
              </p>

              <div className="hero-actions">

                <a
                  className="primary-button"
                  href="#work"
                >
                  Explore our work

                  <ArrowRight
                    size={18}
                  />
                </a>

                <a
                  className="text-button"
                  href="#contact"
                >
                  <MessageSquareText
                    size={17}
                  />

                  Discuss a project
                </a>

              </div>

              <div className="hero-proof">

                <span>
                  <BadgeCheck
                    size={17}
                  />

                  Project-focused development
                </span>

                <span>
                  <ShieldCheck
                    size={17}
                  />

                  Clean & scalable builds
                </span>

              </div>

            </div>

            <div
              className="hero-visual"
              aria-hidden="true"
            >

              <div className="orb orb-a" />
              <div className="orb orb-b" />

              <div className="code-window glass-panel">

                <div className="window-top">

                  <div className="traffic">
                    <i />
                    <i />
                    <i />
                  </div>

                  <span>
                    brandspire / build
                  </span>

                </div>

                <div className="code-body">

                  <div className="code-line">
                    <span>01</span>

                    <div>
                      <b>const</b> idea ={" "}
                      <em>"your vision"</em>;
                    </div>
                  </div>

                  <div className="code-line">
                    <span>02</span>

                    <div>
                      <b>const</b> team ={" "}
                      <em>"BrandSpire"</em>;
                    </div>
                  </div>

                  <div className="code-line">
                    <span>03</span>
                    <div />
                  </div>

                  <div className="code-line">
                    <span>04</span>

                    <div>
                      <b>function</b>{" "}
                      buildProduct() {"{"}
                    </div>
                  </div>

                  <div className="code-line indent">
                    <span>05</span>

                    <div>
                      design(
                      <em>"simple"</em>);
                    </div>
                  </div>

                  <div className="code-line indent">
                    <span>06</span>

                    <div>
                      develop(
                      <em>"scalable"</em>);
                    </div>
                  </div>

                  <div className="code-line indent">
                    <span>07</span>

                    <div>
                      ship(
                      <em>"fast"</em>);
                    </div>
                  </div>

                  <div className="code-line">
                    <span>08</span>

                    <div>{"}"}</div>
                  </div>

                </div>

                <div className="status-row">

                  <span>
                    <i />
                    Production ready
                  </span>

                  <Rocket size={15} />

                </div>

              </div>

              <div className="floating-card floating-one">

                <Code2 size={18} />

                <span>
                  <strong>
                    Web Apps
                  </strong>

                  Modern & responsive
                </span>

              </div>

              <div className="floating-card floating-two">

                <Zap size={18} />

                <span>
                  <strong>
                    Fast Delivery
                  </strong>

                  Idea to launch
                </span>

              </div>

            </div>

          </div>

          <div className="container hero-bottom-line">

            <span>
              WEB DEVELOPMENT
            </span>

            <i />

            <span>
              APP DEVELOPMENT
            </span>

            <i />

            <span>
              CUSTOM SOFTWARE
            </span>

            <i />

            <span>
              SAAS PRODUCTS
            </span>

          </div>

        </section>

        {/* ================= SERVICES ================= */}

        <section
          className="section services-section"
          id="services"
        >

          <div className="container">

            <div className="section-heading split-heading">

              <div>

                <p className="eyebrow">
                  WHAT WE BUILD
                </p>

                <h2>
                  Software made around your
                  business.
                </h2>

              </div>

              <p>
                Not one-size-fits-all
                templates. We build practical
                digital products around the
                experience your users and team
                actually need.
              </p>

            </div>

            <div className="services-grid">

              {services.map(
                (
                  {
                    icon: Icon,
                    title,
                    text,
                  },
                  index
                ) => (
                  <article
                    className="service-card"
                    key={title}
                  >

                    <div className="service-number">
                      0{index + 1}
                    </div>

                    <div className="icon-box">
                      <Icon size={22} />
                    </div>

                    <h3>{title}</h3>

                    <p>{text}</p>

                    <span className="card-line" />

                  </article>
                )
              )}

            </div>

          </div>

        </section>

        {/* ================= PROJECTS ================= */}

        <section
          className="section work-section"
          id="work"
        >

          <div className="container">

            <div className="section-heading work-heading">

              <div>

                <p className="eyebrow">
                  SELECTED WORK
                </p>

                <h2>
                  Products we’ve already
                  brought to life.
                </h2>

              </div>

              <p>
                Explore some of BrandSpire’s
                deployed work. Every card
                below opens the live project.
              </p>

            </div>

            <div className="project-list">

              {projects.map(
                ({
                  number,
                  title,
                  category,
                  description,
                  link,
                  tags,
                  icon: Icon,
                  previewClass,
                  previewLabel,
                }) => (
                  <article
                    className="project-card"
                    key={title}
                  >

                    <div
                      className={`project-preview ${previewClass}`}
                    >

                      <div className="preview-browser">

                        <div className="preview-bar">

                          <span />
                          <span />
                          <span />

                          <small>
                            {previewLabel}
                          </small>

                        </div>

                        <div className="preview-content">

                          <div className="preview-sidebar">

                            <div className="preview-logo" />

                            <i />
                            <i />
                            <i />
                            <i />

                          </div>

                          <div className="preview-main">

                            <div className="preview-head">
                              <b />
                              <span />
                            </div>

                            <div className="preview-stat-row">
                              <i />
                              <i />
                              <i />
                            </div>

                            <div className="preview-chart">

                              <svg
                                viewBox="0 0 500 150"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M0,125 C70,118 72,52 145,76 C210,98 220,25 295,52 C360,77 396,26 500,18"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                />
                              </svg>

                            </div>

                          </div>

                        </div>

                      </div>

                      <div className="preview-badge">

                        <Icon size={16} />

                        LIVE PRODUCT

                      </div>

                    </div>

                    <div className="project-info">

                      <div className="project-topline">

                        <span>
                          {number}
                        </span>

                        <p>
                          {category}
                        </p>

                      </div>

                      <h3>
                        {title}
                      </h3>

                      <p className="project-description">
                        {description}
                      </p>

                      <div className="tag-row">

                        {tags.map(
                          (tag) => (
                            <span key={tag}>
                              {tag}
                            </span>
                          )
                        )}

                      </div>

                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        Visit live project

                        <ExternalLink
                          size={16}
                        />
                      </a>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

        </section>

        {/* ================= PROCESS ================= */}

        <section
          className="section process-section"
          id="process"
        >

          <div className="container process-grid">

            <div className="process-intro">

              <p className="eyebrow">
                HOW WE WORK
              </p>

              <h2>
                From first idea to live
                software.
              </h2>

              <p>
                Clear communication, focused
                product decisions and a build
                process that keeps the outcome
                practical.
              </p>

              <a
                href="#contact"
                className="text-button"
              >
                Tell us what you’re building

                <ArrowRight
                  size={17}
                />
              </a>

            </div>

            <div className="process-list">

              {process.map(
                ([
                  number,
                  title,
                  text,
                ]) => (
                  <div
                    className="process-item"
                    key={number}
                  >

                    <span>
                      {number}
                    </span>

                    <div>
                      <h3>
                        {title}
                      </h3>

                      <p>
                        {text}
                      </p>
                    </div>

                    <ChevronRight
                      size={20}
                    />

                  </div>
                )
              )}

            </div>

          </div>

        </section>

        {/* ================= CONTACT ================= */}

        <section
          className="section contact-section"
          id="contact"
        >

          <div className="container contact-shell">

            <div className="contact-copy">

              <p className="eyebrow">
                START A CONVERSATION
              </p>

              <h2>
                Have an idea?
                <br />

                <span className="gradient-text">
                  Let’s build it.
                </span>
              </h2>

              <p>
                Share what you want to create
                and what problem you want to
                solve. Your message will reach
                the BrandSpire team through
                the form.
              </p>

              <div className="contact-points">

                <div>

                  <span>
                    <Mail size={18} />
                  </span>

                  <p>
                    <strong>
                      Email us
                    </strong>

                    <a href="mailto:brandspire27@gmail.com">
                      brandspire27@gmail.com
                    </a>
                  </p>

                </div>

                <div>

                  <span>
                    <MapPin size={18} />
                  </span>

                  <p>
                    <strong>
                      Our location
                    </strong>

                    Ghaziabad, Uttar Pradesh
                  </p>

                </div>

                <div>

                  <span>
                    <Rocket size={18} />
                  </span>

                  <p>
                    <strong>
                      From idea to deployment
                    </strong>

                    Web, apps & custom software
                  </p>

                </div>

              </div>

            </div>

            <ContactForm />

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="container footer-grid">

          <div className="footer-brand">

            <Logo />

            <p>
              Building useful software with
              clarity, speed and craft.
            </p>

            <div className="footer-contact">

              <a href="mailto:contact@brandspire.tech">

                <Mail size={14} />

              contact@brandspire.tech

              </a>

              <span>

                <MapPin size={14} />

                Ghaziabad, Uttar Pradesh

              </span>

            </div>

          </div>

          <div className="footer-links">

            <a href="#services">
              Services
            </a>

            <a href="#work">
              Work
            </a>

            <a href="#process">
              Process
            </a>

            <a href="#contact">
              Contact
            </a>

          </div>

          <p className="copyright">
            © {new Date().getFullYear()}{" "}
            BrandSpire. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}
