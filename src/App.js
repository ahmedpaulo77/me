// src/App.js - النسخة النهائية (مع كل التعديلات)
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollAnimation from './components/ScrollAnimation';
import './App.css';

function App() {
  const [lang, setLang] = useState('en');

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // حفظ اللغة عند التغيير
  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <div className="app" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar lang={lang} setLang={handleLangChange} />
      <Hero lang={lang} />
      <About lang={lang} />
      <Skills lang={lang} />
      <Projects lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
      
      {/* زر واتساب الثابت */}
      <WhatsAppButton phone="201220811060" />
      
      {/* أنيميشن عند التمرير */}
      <ScrollAnimation />
    </div>
  );
}

export default App;