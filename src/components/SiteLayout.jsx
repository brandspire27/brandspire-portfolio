import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, Mail, MapPin } from 'lucide-react';
import Chatbot from './Chatbot.jsx';

export function Logo() {
  return <Link className="brand" to="/" aria-label="BrandSpire home"><img src="/brandmark.png" alt="" className="brand-logo-mark"/><span className="brand-name">Brand<span>Spire</span></span></Link>;
}

export default function SiteLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });

    const targets = document.querySelectorAll(
      '.page-hero-inner, .section > .container, .cta-box, .services-page-card, .about-values article, .stats-grid > div, .work-card, .blog-card, .contact-detail, .contact-form-new, .delivery-grid > div, .process-steps > div, .feature-grid article, .service-card-new, .project-tile'
    );
    targets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const root = document.querySelector('.site-shell');
    if (!root) return;
    const move = (event) => {
      root.style.setProperty('--mx', `${event.clientX}px`);
      root.style.setProperty('--my', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  const links = [['/','Home'],['/about','About'],['/services','Services'],['/work','Work'],['/blog','Blog'],['/contact','Contact']];
  return <div className="site-shell"><div className="cursor-glow" aria-hidden="true"/>
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="site-header"><div className="container nav-wrap"><Logo/>
      <nav className={open ? 'nav-links nav-open' : 'nav-links'}>{links.map(([to,label])=><NavLink key={to} to={to} end={to==='/' }>{label}</NavLink>)}</nav>
      <Link className="nav-cta" to="/contact">Start a project <ArrowRight size={15}/></Link>
      <button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
    </div></header>
    <main>{children}</main>
    <footer><div className="container footer-grid">
      <div className="footer-brand"><Logo/><p>Digital products, websites and software systems designed to help ambitious businesses move forward.</p><div className="footer-contact"><a href="mailto:contact@brandspire.tech"><Mail size={14}/>contact@brandspire.tech</a><span><MapPin size={14}/>Ghaziabad, Uttar Pradesh</span></div></div>
      <div className="footer-column"><span>Explore</span>{links.slice(1).map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div>
      <div className="footer-column"><span>Services</span><Link to="/web-development">Web Development</Link><Link to="/app-development">App Development</Link><Link to="/software-development">Custom Software</Link><Link to="/saas-development">SaaS Development</Link></div>
      <div className="footer-cta"><span>Have a product in mind?</span><Link className="primary-button" to="/contact">Let’s talk <ArrowRight size={16}/></Link></div>
      <p className="copyright">© {new Date().getFullYear()} BrandSpire. All rights reserved.</p>
    </div></footer>
    <Chatbot/>
  </div>;
}

export function PageHero({ eyebrow, title = '', accent = '', text, children, animatedTitle = false, customTitle = null }) {
  const titleWords = title.split(' ');
  const accentWords = accent.trim().split(' ');
  return <section className="page-hero"><div className="container page-hero-inner"><div className="eyebrow">{eyebrow}</div>{customTitle ? customTitle : animatedTitle ? <h1 className="page-hero-title animated-hero-title" aria-label={`${title}${accent}`}><span className="sr-only">{title}{accent}</span><span className="hero-word-wrap" aria-hidden="true">{titleWords.map((word,i)=><span className="hero-word" style={{'--word-delay': `${i*90}ms`}} key={`${word}-${i}`}>{word}</span>)}{' '}<span className="hero-accent">{accentWords.map((word,i)=><span className="hero-word" style={{'--word-delay': `${(titleWords.length+i)*90}ms`}} key={`${word}-${i}`}>{word}</span>)}</span></span></h1> : <h1>{title}<span>{accent}</span></h1>}{text&&<p>{text}</p>}{children}</div></section>;
}

export function SectionIntro({ eyebrow, title, text }) {
  return <div className="section-heading split-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{text&&<p>{text}</p>}</div>;
}
