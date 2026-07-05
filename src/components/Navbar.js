import React, { useState, useEffect } from 'react';
import './Navbar.css';

const content = {
  ar: {
    links: [
      { label: 'الرئيسية', href: '#hero' },
      { label: 'عني', href: '#about' },
      { label: 'مهاراتي', href: '#skills' },
      { label: 'مشاريعي', href: '#projects' },
      { label: 'تواصل معي', href: '#contact' },
    ],
  },
  en: {
    links: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Skills', href: '#skills' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ],
  },
};

function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = content[lang];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo">
          <span className="logo-bracket">&lt;</span>
          Ahmed
          <span className="logo-bracket">/&gt;</span>
        </a>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {t.links.map((link, i) => (
            <li key={i}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;