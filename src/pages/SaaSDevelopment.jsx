import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cloud,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export default function SaaSDevelopment() {
  const solutions = [
    {
      icon: Boxes,
      title: "Custom SaaS Products",
      text:
        "Subscription-based software platforms designed around your business idea, users and long-term product goals.",
    },
    {
      icon: LayoutDashboard,
      title: "SaaS Dashboards",
      text:
        "Modern dashboards for customers, staff and administrators with clear workflows and useful business data.",
    },
    {
      icon: ShieldCheck,
      title: "Authentication & Access",
      text:
        "Secure login, user roles, permissions and account management for multi-user SaaS applications.",
    },
    {
      icon: Cloud,
      title: "Scalable Cloud Platforms",
      text:
        "Cloud-ready architecture designed to support growing users, features and future integrations.",
    },
  ];

  const capabilities = [
    "Subscription Platforms",
    "Multi-user SaaS Systems",
    "Admin Dashboards",
    "Customer Portals",
    "Authentication Systems",
    "Role-Based Access",
    "CRM SaaS",
    "POS SaaS",
    "Business Automation SaaS",
    "API Integrations",
    "Cloud Deployment",
    "Custom SaaS Products",
  ];

  return (
    <div className="site-shell">
      <main>
        <section className="section hero">
          <div className="container">
            <a href="/" className="text-button">
              <ArrowLeft size={17} />
              Back to BrandSpire
            </a>

            <div
              className="hero-copy"
              style={{ marginTop: "48px" }}
            >
              <p className="eyebrow">
                SAAS DEVELOPMENT
              </p>

              <h1>
                SaaS Products Built to
                <span className="gradient-text">
                  {" "}
                  Grow With Your Business.
                </span>
              </h1>

              <p className="hero-text">
                BrandSpire develops SaaS platforms with
                modern dashboards, authentication,
                role-based access and scalable foundations
                designed for real business products.
              </p>

              <div className="hero-actions">
                <a
                  href="/#contact"
                  className="primary-button"
                >
                  Start a SaaS project
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section services-section">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">
                  SAAS SOLUTIONS
                </p>

                <h2>
                  From product idea to scalable SaaS platform.
                </h2>
              </div>

              <p>
                BrandSpire can help transform a software
                idea into a structured online product
                designed for customers, teams and future
                growth.
              </p>
            </div>

            <div className="services-grid">
              {solutions.map(
                ({ icon: Icon, title, text }, index) => (
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

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">
                SAAS CAPABILITIES
              </p>

              <h2>
                What BrandSpire can build.
              </h2>
            </div>

            <div className="services-grid">
              {capabilities.map((item) => (
                <article
                  className="service-card"
                  key={item}
                >
                  <CheckCircle2 size={20} />
                  <h3>{item}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section">
          <div className="container contact-shell">
            <div className="contact-copy">
              <p className="eyebrow">
                HAVE A SAAS IDEA?
              </p>

              <h2>
                Turn it into a
                <span className="gradient-text">
                  {" "}
                  working product.
                </span>
              </h2>

              <p>
                Tell us about your idea, expected users,
                important features and the problem your
                SaaS product should solve.
              </p>

              <a
                href="/#contact"
                className="primary-button"
              >
                Discuss your SaaS product
                <Rocket size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
