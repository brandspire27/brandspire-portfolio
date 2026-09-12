import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Gauge,
  Globe2,
  LayoutDashboard,
  Rocket,
} from "lucide-react";

export default function WebDevelopment() {
  const solutions = [
    {
      icon: Globe2,
      title: "Business Websites",
      text:
        "Professional responsive websites designed to clearly present your business, services and brand.",
    },
    {
      icon: Code2,
      title: "Web Applications",
      text:
        "Interactive web applications built around real business workflows, users and operational requirements.",
    },
    {
      icon: LayoutDashboard,
      title: "Dashboards & Portals",
      text:
        "Admin panels, customer portals and internal dashboards that organize business data and operations.",
    },
    {
      icon: Gauge,
      title: "Performance & Responsive Design",
      text:
        "Fast, mobile-friendly interfaces designed to work smoothly across modern devices and screen sizes.",
    },
  ];

  const capabilities = [
    "Business Websites",
    "Portfolio Websites",
    "Web Applications",
    "Admin Dashboards",
    "Customer Portals",
    "E-commerce Websites",
    "Restaurant Websites",
    "Healthcare Websites",
    "Landing Pages",
    "Responsive UI Development",
    "API Integration",
    "Website Deployment",
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
                WEB DEVELOPMENT
              </p>

              <h1>
                Modern Websites & Web Applications
                <span className="gradient-text">
                  {" "}
                  Built for Business.
                </span>
              </h1>

              <p className="hero-text">
                BrandSpire builds responsive business
                websites, web applications, dashboards,
                portals and digital experiences designed
                around usability, performance and real
                business goals.
              </p>

              <div className="hero-actions">
                <a
                  href="/#contact"
                  className="primary-button"
                >
                  Start a web project
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
                  WEB SOLUTIONS
                </p>

                <h2>
                  Web experiences designed around your goals.
                </h2>
              </div>

              <p>
                From a professional company website to
                complex business web applications,
                BrandSpire focuses on clean interfaces,
                responsiveness and practical functionality.
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
                WEB DEVELOPMENT CAPABILITIES
              </p>

              <h2>
                What BrandSpire can build for the web.
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
                NEED A WEBSITE?
              </p>

              <h2>
                Build your next
                <span className="gradient-text">
                  {" "}
                  web experience.
                </span>
              </h2>

              <p>
                Tell us what kind of website or web
                application you need and what you want
                it to achieve.
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
