import { useEffect, useState } from 'react';
import { ArrowRight, Check, Code2, Layers3, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteLayout, { PageHero, SectionIntro } from '../components/SiteLayout.jsx';

function AboutTagline() {
  const phrases = ['useful','powerful','beautiful','scalable','impactful'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <h1
      className="about-tagline-transition"
      aria-label={`We turn ideas into${phrases[index]}digital products.`}
      style={{
        color: '#111111',
      }}
    >
      {/* Fixed text */}
      <span style={{ color: '#111111'}}>
        We turn ideas into{''}
      </span>

      {/* Only this word changes + stays orange */}
      <span
        key={phrases[index]}
        className="about-tagline-word"
        aria-hidden="true"
        style={{
          color: '#F05A28',
          display: 'block',
          marginRight: '0',
        }}
      >
        {phrases[index]}
      </span>

      {/* Fixed text */}
      <span
        className="about-tagline-products"
        style={{
          color: '#111111',
          marginLeft: '0',
          marginright:'0',
        }}
      >
        digital products.
      </span>
    </h1>
  );
}

export default function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="ABOUT BRANDSPIRE"
        customTitle={<AboutTagline />}
        text="BrandSpire is a digital product and software studio focused on practical technology — from high-impact websites to custom business systems and SaaS products."
      >
        <Link className="primary-button" to="/contact">
          Work with us <ArrowRight size={17} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionIntro
            eyebrow="OUR APPROACH"
            title="Technology should remove friction, not add it."
            text="Our work starts with understanding the people, process and business outcome behind a project. Then we design and build the smallest clear path from idea to useful software."
          />

          <div className="about-values">
            <article>
              <Code2 />
              <span>01</span>
              <h3>Product thinking</h3>
              <p>
                We focus on what the product needs to accomplish, not just how
                it should look.
              </p>
            </article>

            <article>
              <Layers3 />
              <span>02</span>
              <h3>One connected team</h3>
              <p>
                Design and engineering stay close so decisions move quickly
                from concept to implementation.
              </p>
            </article>

            <article>
              <Rocket />
              <span>03</span>
              <h3>Built to ship</h3>
              <p>
                We favour practical scope, clean foundations and a clear route
                to launch.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="container about-split">
          <div>
            <p className="eyebrow">WHAT WE BELIEVE</p>
            <h2>
              Good software feels <span>obvious.</span>
            </h2>
          </div>

          <div className="belief-list">
            {[
              'Clear interfaces over unnecessary complexity',
              'Useful features over feature overload',
              'Scalable foundations without overengineering',
              'Long-term collaboration after launch',
            ].map((x) => (
              <div key={x}>
                <Check size={18} />
                {x}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-grid">
          <div>
            <b>01</b>
            <span>Strategy → design → engineering</span>
          </div>

          <div>
            <b>04+</b>
            <span>Core service capabilities</span>
          </div>

          <div>
            <b>05+</b>
            <span>Deployed product examples</span>
          </div>

          <div>
            <b>∞</b>
            <span>Ideas worth exploring</span>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}