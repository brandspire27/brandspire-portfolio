import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Layers3,
  Rocket,
  Settings2,
} from "lucide-react";

export default function SoftwareDevelopment() {
  const solutions = [
    {
      icon: Layers3,
      title: "Custom Business Software",
      text:
        "Purpose-built software designed around your workflow instead of forcing your business into generic tools.",
    },
    {
      icon: Database,
      title: "CRM & Management Systems",
      text:
        "Customer, lead, invoice, task and operational management platforms for growing businesses.",
    },
    {
      icon: Settings2,
      title: "Business Automation",
      text:
        "Automation solutions for repetitive workflows, notifications, data handling and internal business processes.",
    },
    {
      icon: Code2,
      title: "SaaS Platforms",
      text:
        "Scalable software products with authentication, dashboards, subscriptions and business-ready architecture.",
    },
  ];

  const capabilities = [
    "CRM Software",
    "POS & Billing Systems",
    "Inventory Management",
    "Business Dashboards",
    "Employee Management Systems",
    "SaaS Applications",
    "Admin Portals",
    "Workflow Automation",
    "API Integrations",
    "Custom Web Applications",
    "Booking Systems",
    "Business Management Software",
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
                SOFTWARE DEVELOPMENT
              </p>

              <h1>
                Custom Software Built Around
                <span className="gradient-text">
                  {" "}
                  Your Business.
                </span>
              </h1>

              <p className="hero-text">
                BrandSpire designs and develops custom
                software, CRM platforms, POS systems,
                SaaS products, dashboards and automation
                tools built to solve real business problems.
              </p>

              <div className="hero-actions">
                <a
                  href="/#contact"
                  className="primary-button"
                >
                  Start a software project
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
                  WHAT WE DEVELOP
                </p>

                <h2>
                  Software solutions designed for
                  real-world workflows.
                </h2>
              </div>

              <p>
                Every business works differently.
                BrandSpire develops software around
                your team, customers, processes and
                operational requirements.
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
                SOFTWARE CAPABILITIES
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
                HAVE A SOFTWARE IDEA?
              </p>

              <h2>
                Turn it into a
                <span className="gradient-text">
                  {" "}
                  working product.
                </span>
              </h2>

              <p>
                Tell us what problem you want to
                solve and what you need the software
                to do. BrandSpire can help take the
                idea from planning to deployment.
              </p>

              <a
                href="/#contact"
                className="primary-button"
              >
                Discuss your project
                <Rocket size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
