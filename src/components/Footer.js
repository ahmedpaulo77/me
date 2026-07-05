import React from 'react';
import './Footer.css';

function Footer({ lang }) {
  return (
    <footer className="footer">
      <p>
        {lang === 'ar' ? 'صُنع بـ' : 'Made with'} <span>❤️</span> {lang === 'ar' ? 'بواسطة' : 'by'}
        <span className="footer-name"> Ahmed Abdelmaqsoud</span>
      </p>
      <p className="footer-copy">© 2025 {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
    </footer>
  );
}

export default Footer;