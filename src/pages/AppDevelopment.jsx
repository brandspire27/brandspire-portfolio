import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MonitorSmartphone,
  Smartphone,
  Layers3,
  Rocket,
  Zap,
} from "lucide-react";

export default function AppDevelopment() {
  const solutions = [
    {
      icon: Smartphone,
      title: "Mobile App Development",
      text:
        "Modern mobile applications designed around usability, performance and real business requirements.",
    },
    {
      icon: MonitorSmartphone,
      title: "Business Apps",
      text:
        "Apps for internal operations, customer interaction, bookings, services and business workflows.",
    },
    {
      icon: Layers3,
      title: "Scalable App Architecture",
      text:
        "Applications structured for future features, integrations and growing user requirements.",
    },
    {
      icon: Zap,
      title: "Fast & Responsive Experience",
      text:
        "Clean mobile interfaces focused on smooth navigation, speed and practical user experience.",
    },
  ];

  const capabilities = [
    "Business Mobile Apps",
    "Customer Service Apps",
    "Booking Applications",
    "E-commerce Apps",
    "Dashboard Apps",
    "Employee Apps",
    "Inventory Apps",
    "Healthcare Apps",
    "Restaurant Apps",
    "API-integrated Apps",
    "Authentication Systems",
    "Custom Mobile Solutions",
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
                APP DEVELOPMENT
              </p>

              <h1>
                Mobile Applications Built for
                <span className="gradient-text">
                  {" "}
                  Real Business Needs.
                </span>
              </h1>

              <p className="hero-text">
                BrandSpire builds modern mobile
                experiences and business applications
                designed around your users, services
                and operational requirements.
              </p>

              <div className="hero-actions">
                <a
                  href="/#contact"
                  className="primary-button"
                >
                  Start an app project
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
                  APP SOLUTIONS
                </p>

                <h2>
                  Mobile experiences designed around your users.
                </h2>
              </div>

              <p>
                From business applications to
                customer-facing mobile products,
                BrandSpire focuses on intuitive
                interfaces, scalability and practical
                functionality.
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
                APP DEVELOPMENT CAPABILITIES
              </p>

              <h2>
                What BrandSpire can build for mobile.
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
                HAVE AN APP IDEA?
              </p>

              <h2>
                Turn your idea into a
                <span className="gradient-text">
                  {" "}
                  working application.
                </span>
              </h2>

              <p>
                Tell us what your app should do,
                who will use it and what problem
                you want it to solve.
              </p>

              <a
                href="/#contact"
                className="primary-button"
              >
                Discuss your app
                <Rocket size={17} />
              </a>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
