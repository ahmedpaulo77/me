import React, { useEffect, useState } from 'react';
import './Hero.css';

const content = {
  ar: {
    greeting: 'مرحباً، أنا 👋',
    titles: ['Frontend Developer', 'React Developer', 'UI Developer'],
    desc: 'مطور واجهات أمامية متخصص في React.js، أبني مواقع وتطبيقات ويب احترافية وسريعة وجميلة.',
    btn1: 'شوف مشاريعي',
    btn2: 'تواصل معي',
  },
  en: {
    greeting: "Hi, I'm 👋",
    titles: ['Frontend Developer', 'React Developer', 'UI Developer'],
    desc: 'Frontend developer specialized in React.js, building professional, fast and beautiful web applications.',
    btn1: 'View Projects',
    btn2: 'Contact Me',
  },
};

function Hero({ lang }) {
  const t = content[lang];
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = t.titles[titleIndex];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 100);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 60);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIndex((titleIndex + 1) % t.titles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, titleIndex, t.titles]);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="hero-grid"></div>
      </div>
      <div className="hero-content">
        <p className="hero-greeting">{t.greeting}</p>
        <h1 className="hero-name">Ahmed Abdelmaqsoud</h1>
        <div className="hero-title">
          <span className="title-prefix">&lt;</span>
          <span className="typing">{displayed}</span>
          <span className="cursor">|</span>
          <span className="title-prefix">/&gt;</span>
        </div>
        <p className="hero-desc">{t.desc}</p>
        <div className="hero-btns">
          <a href="#projects" className="btn-primary">{t.btn1}</a>
          <a href="#contact" className="btn-outline">{t.btn2}</a>
        </div>
        <div className="hero-social">
          <a href="https://github.com/ahmedpaulo77" target="_blank" rel="noreferrer" className="social-link">
            <i className="ti ti-brand-github"></i>
          </a>
          <a href="https://wa.me/201220811060" target="_blank" rel="noreferrer" className="social-link">
            <i className="ti ti-brand-whatsapp"></i>
          </a>
          <a href="mailto:p638599@gmail.com" className="social-link">
            <i className="ti ti-mail"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;