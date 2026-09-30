import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, Layers3, Smartphone, Sparkles, Check, Play, BarChart3, ShoppingBag, HeartPulse, UtensilsCrossed, Star, Quote } from 'lucide-react';
import SiteLayout, { SectionIntro } from './components/SiteLayout.jsx';
import { API_URL } from './lib.js';

const fallbackProjects = [
  { title: 'BrandSpire CRM', category: 'Business SaaS', description: 'A modern CRM platform for customers, leads, tasks and everyday business operations.', link: 'https://brandspire-crm.vercel.app/dashboard', tags: ['CRM', 'React', 'SaaS'], icon: BarChart3 },
  { title: "Demon's Biller", category: 'POS & Billing', description: 'A fast point-of-sale experience for counter operations, orders and saved billing records.', link: 'https://demon-s-biller.vercel.app/create-bill', tags: ['POS', 'Billing', 'Web App'], icon: ShoppingBag },
  { title: 'KisanSetu', category: 'Marketplace', description: 'An accessible e-commerce marketplace experience designed for scalable digital commerce.', link: 'https://kisan-setu-gamma.vercel.app/', tags: ['E-commerce', 'Marketplace'], icon: ShoppingBag },
  { title: 'Restaurant Website', category: 'Hospitality', description: 'A responsive restaurant experience built around menu discovery, brand and contact journeys.', link: 'https://ss.brandspire.tech/', tags: ['Restaurant', 'React'], icon: UtensilsCrossed },
  { title: 'Hospital Management', category: 'Healthcare', description: 'A management interface for patients, appointments, doctors, staff and daily operations.', link: 'https://cc.brandspire.tech/', tags: ['Healthcare', 'Management'], icon: HeartPulse },
];
const fallbackReviews = [
  { name: 'Aarav Mehta', role: 'Founder · SaaS startup', rating: 5, text: 'The team brought structure to our idea and turned it into a polished product experience. The communication throughout the project was clear and focused.' },
  { name: 'Priya Sharma', role: 'Business owner', rating: 5, text: 'BrandSpire understood what we needed quickly and delivered a website that feels modern, fast and genuinely easy for our customers to use.' },
  { name: 'Rohan Verma', role: 'Operations lead', rating: 5, text: 'We needed custom software around our workflow, not another generic tool. The final system was designed around how our team actually works.' },
  { name: 'Neha Kapoor', role: 'Marketing lead', rating: 5, text: 'From the first conversation to launch, the process felt organised and thoughtful. The design quality and attention to detail really stood out.' },
];


function ReviewStars({ rating = 0, onChange, interactive = false }) {
  return (
    <div className={interactive ? 'review-stars-input' : 'review-stars'} role={interactive ? 'radiogroup' : undefined} aria-label={interactive ? `Choose ${rating} out of 5 stars` : `${rating} out of 5 stars`}>
      {interactive && (
        <button type="button" className={`star-zero ${rating === 0 ? 'selected' : ''}`} onClick={() => onChange(0)} aria-label="0 stars">0</button>
      )}
      {[1, 2, 3, 4, 5].map((i) => (
        interactive ? (
          <button type="button" key={i} className={`star-button ${i <= rating ? 'selected' : ''}`} onClick={() => onChange(i)} aria-label={`${i} star${i > 1 ? 's' : ''}`}>
            <Star size={22} fill={i <= rating ? 'currentColor' : 'none'} />
          </button>
        ) : (
          <Star key={i} size={16} fill={i <= rating ? 'currentColor' : 'none'} />
        )
      ))}
    </div>
  );
}

function ReviewForm({ onSubmitted, onClose }) {
  const [form, setForm] = useState({ name: '', role: '', rating: 0, text: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      setMessage('Please enter your name and review.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/public/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : { error: `Review server returned ${response.status}. Make sure the Express server is running on port 3000.` };
      if (!response.ok) throw new Error(data?.error || 'Unable to publish your review.');
      onSubmitted(data.data);
      setForm({ name: '', role: '', rating: 0, text: '' });
      setMessage('Thanks! Your review is now visible to visitors.');
    } catch (error) {
      setMessage(error.message || 'Unable to publish your review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="write-review-panel" onSubmit={submit}>
      <div className="write-review-head">
        <div>
          <p className="eyebrow">WRITE A REVIEW</p>
          <h3>Tell us about your BrandSpire experience.</h3>
        </div>
        <button type="button" className="review-close" onClick={onClose} aria-label="Close review form">×</button>
      </div>

      <div className="review-form-grid">
        <label>
          <span>Your name</span>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" maxLength={80} required />
        </label>
        <label>
          <span>Role / company <em>optional</em></span>
          <input value={form.role} onChange={(e) => update('role', e.target.value)} placeholder="Founder · Company" maxLength={120} />
        </label>
      </div>

      <label className="review-rating-field">
        <span>Rating <em>0–5 stars</em></span>
        <ReviewStars rating={form.rating} onChange={(value) => update('rating', value)} interactive />
      </label>

      <label>
        <span>Your review</span>
        <textarea value={form.text} onChange={(e) => update('text', e.target.value)} placeholder="Share your experience with BrandSpire..." rows={5} maxLength={1200} required />
      </label>

      <div className="review-form-footer">
        <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Publishing…' : 'Publish review'} <ArrowRight size={17} /></button>
        {message && <span className="review-form-message">{message}</span>}
      </div>
    </form>
  );
}


function RotatingAboutTagline() {
  const words = ['useful', 'powerful', 'beautiful', 'scalable', 'impactful'];
  const [index, setIndex] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setIndex(i => (i + 1) % words.length), 2800); return () => window.clearInterval(id) }, []);
  return <h2 className="home-about-tagline" aria-label={`We turn ideas into ${words[index]} digital products.`}>
    <span className="home-about-fixed">We turn ideas into </span>
    <span className="home-about-changing" key={words[index]}>{words[index]}</span><br></br><span className="home-about-fixed home-about-products"> digital products.</span>
  </h2>;
}

const fallbackServices = [
  { title: 'Web Development', text: 'High-performance websites, portals and web applications with clean UX and responsive foundations.', icon: Code2, link: '/web-development' },
  { title: 'App Development', text: 'Mobile experiences designed around your users, workflows and product goals.', icon: Smartphone, link: '/app-development' },
  { title: 'Custom Software', text: 'CRM, POS, billing, inventory and internal tools built around the way your business actually works.', icon: Layers3, link: '/software-development' },
  { title: 'SaaS Development', text: 'Product strategy, interfaces, authentication, dashboards and scalable SaaS foundations.', icon: Sparkles, link: '/saas-development' },
];

export default function App() {
  const [projects, setProjects] = useState(fallbackProjects); const [services, setServices] = useState(fallbackServices);
  const [reviewItems, setReviewItems] = useState(fallbackReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  useEffect(() => { fetch(`${API_URL}/public/content`).then(r => r.ok ? r.json() : null).then(d => { if (d?.projects?.length) setProjects(d.projects.slice(0, 6).map((p, i) => ({ ...p, icon: Code2, number: String(i + 1).padStart(2, '0') }))); if (d?.services?.length) setServices(d.services.slice(0, 4).map(s => ({ ...s, icon: Code2 }))); }).catch(() => { });
    fetch(`${API_URL}/public/reviews`).then(r => r.ok ? r.json() : null).then(d => { if (d?.reviews?.length) setReviewItems(d.reviews); }).catch(() => { });
  }, []);
  return <SiteLayout>
    <section className="hero home-hero"><div className="container hero-grid"><div className="hero-copy"><div className="pill"><i /> DIGITAL PRODUCT & SOFTWARE STUDIO</div><h1>We build digital products that <span className="hero-green">move business forward.</span></h1><p className="hero-text">BrandSpire designs and develops websites, apps, SaaS products and custom software for teams that want to turn ideas into useful, scalable products.</p><div className="hero-actions"><Link className="primary-button" to="/work">Explore our work <ArrowRight size={18} /></Link><Link className="text-button" to="/contact">Start a conversation <ArrowUpRight size={17} /></Link></div><div className="hero-meta"><span><Check size={15} /> Product-first thinking</span><span><Check size={15} /> Design + development</span><span><Check size={15} /> Built to ship</span></div></div><div className="hero-stage"><div className="stage-glow" /><div className="stage-card stage-main"><div className="stage-top"><span>BRANDSPIRE / PRODUCT</span><span className="stage-live">● LIVE</span></div><div className="stage-title">Ideas into <strong>working products.</strong></div><div className="stage-grid"><div><small>01</small><b>Discover</b><span>Strategy</span></div><div className="stage-active"><small>02</small><b>Design</b><span>Experience</span></div><div><small>03</small><b>Build</b><span>Engineering</span></div><div><small>04</small><b>Launch</b><span>Growth</span></div></div><div className="stage-footer"><span>Web · Apps · SaaS · Software</span><span>01—04</span></div></div><div className="stage-float stage-float-a"><Sparkles size={17} /><span>Built around your workflow</span></div><div className="stage-float stage-float-b"><Play size={16} /><span>Design → Build → Launch</span></div></div></div><div className="container hero-marquee"><span>WEB</span><i /><span>APP</span><i /><span>SAAS</span><i /><span>SOFTWARE</span><i /><span>AI & AUTOMATION</span></div></section>
    <section className="section intro-section"><div className="container"><SectionIntro eyebrow="WHY BRANDSPIRE" title="A digital team for ideas that need to become real." text="We combine strategy, product design and engineering into one focused process. No unnecessary layers — just clear thinking, thoughtful interfaces and software that works." /><div className="feature-grid"><article><span>01</span><h3>Think product-first</h3><p>We start with the user, business problem and desired outcome before jumping into screens or code.</p></article><article><span>02</span><h3>Design for clarity</h3><p>Interfaces stay purposeful, easy to understand and consistent across the product experience.</p></article><article><span>03</span><h3>Engineer for growth</h3><p>Modern architecture and maintainable foundations make it easier to keep improving after launch.</p></article></div></div></section>
    <section className="section home-about-section"><div className="container home-about-grid"><div><p className="eyebrow">ABOUT BRANDSPIRE</p><p className="home-about-kicker">Digital products with purpose, personality and a clear path to launch.</p></div><div><RotatingAboutTagline /><p className="home-about-copy">We combine strategy, design and engineering to turn ambitious ideas into digital experiences and software that people can actually use.</p><Link className="text-button" to="/about">Discover BrandSpire <ArrowRight size={17} /></Link></div></div></section>
    <section className="section dark-section"><div className="container"><SectionIntro eyebrow="WHAT WE DO" title="From first sketch to production software." text="Choose the capability you need today — or bring us the whole product and we’ll help shape the path." /><div className="service-grid-new">{services.map(({ title, text, icon: Icon, link }, i) => <Link to={link || '/services'} className="service-card-new" key={title}><div className="service-index">0{i + 1}</div><div className="service-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p><span className="service-arrow"><ArrowUpRight size={18} /></span></Link>)}</div></div></section>
    <section className="section work-section-new"><div className="container"><div className="work-head-new"><div><p className="eyebrow">SELECTED WORK</p><h2>Built for real-world use.</h2></div><Link className="text-button" to="/work">View all projects <ArrowRight size={17} /></Link></div><div className="project-masonry">{projects.slice(0, 4).map((p, i) => { const Icon = p.icon || Code2; return <a className={`project-tile project-tile-${i + 1}`} href={p.link || '#'} target={p.link ? '_blank' : undefined} rel="noreferrer" key={p.title}><div className="project-tile-art"><div className="project-ui"><span>BRANDSPIRE / {String(p.category || 'PRODUCT').toUpperCase()}</span><Icon size={28} /><div className="ui-bars"><i /><i /><i /></div></div></div><div className="project-tile-copy"><div><small>{p.category}</small><h3>{p.title}</h3></div><ArrowUpRight size={20} /></div></a> })}</div></div></section>
    <section className="section reviews-section">
      <div className="container">
        {(() => {
          const total = reviewItems.length;
          const average = total ? (reviewItems.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total).toFixed(1) : '0.0';
          return (
            <>
              <div className="reviews-head">
                <div>
                  <p className="eyebrow">CLIENT REVIEWS</p>
                  <h2>Good work should feel good to work with.</h2>
                  <p>See what clients have shared about working with BrandSpire, and add your own experience.</p>
                </div>
                <div className="rating-summary">
                  <div className="rating-number">{average}</div>
                  <div>
                    <div className="stars"><ReviewStars rating={Math.round(Number(average))} /></div>
                    <strong>{total} {total === 1 ? 'review' : 'reviews'}</strong>
                    <span>Ratings are submitted by visitors through the review form.</span>
                  </div>
                </div>
              </div>

              <div className="reviews-grid">
                {reviewItems.map((review, index) => (
                  <article className="review-card" key={review.id || `${review.name}-${index}`}>
                    <div className="review-top">
                      <ReviewStars rating={Number(review.rating || 0)} />
                      <Quote size={24} />
                    </div>
                    <p>“{review.text}”</p>
                    <div className="review-person">
                      <div className="review-avatar">{String(review.name || 'Client').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()}</div>
                      <div><strong>{review.name}</strong><span>{review.role || 'Client'}</span></div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="reviews-cta">
                <span>Have a BrandSpire experience to share?</span>
                <button className="review-open-button" type="button" onClick={() => setShowReviewForm((value) => !value)}>
                  {showReviewForm ? 'Close review form' : 'Write a review'} <ArrowRight size={17} />
                </button>
              </div>

              {showReviewForm && (
                <ReviewForm
                  onClose={() => setShowReviewForm(false)}
                  onSubmitted={(review) => {
                    setReviewItems((current) => [review, ...current]);
                    setShowReviewForm(false);
                  }}
                />
              )}
            </>
          );
        })()}
      </div>
    </section>
    <section className="section process-new"><div className="container process-band"><div><p className="eyebrow">OUR PROCESS</p><h2>Simple process.<br /><span>Serious execution.</span></h2><Link className="primary-button" to="/contact">Start a project <ArrowRight size={17} /></Link></div><div className="process-steps">{[['01', 'Discover', 'Understand the problem.'], ['02', 'Design', 'Shape the experience.'], ['03', 'Build', 'Turn it into software.'], ['04', 'Launch', 'Ship and keep improving.']].map(([n, t, d]) => <div key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div></section>
    <section className="cta-section"><div className="container cta-box"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s make something <span>useful.</span></h2><p>Tell us what you’re building. We’ll help turn the idea into a clear next step.</p><Link className="primary-button" to="/contact">Talk to BrandSpire <ArrowRight size={18} /></Link></div></section>
  </SiteLayout>
}
