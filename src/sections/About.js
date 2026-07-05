import React from 'react';
import './About.css';

const content = {
  ar: {
    title: 'عني',
    subtitle: 'تعرف علي أكثر',
    greeting: 'مرحباً! أنا Ahmed 👋',
    bio1: 'مطور واجهات أمامية شغوف بتحويل الأفكار إلى تجارب ويب جميلة وسلسة. متخصص في React.js وبناء مواقع احترافية للعيادات والشركات والمتاجر الإلكترونية.',
    bio2: 'خريج جامعة المستقبل (FUE)، وأعمل كـ Freelancer على منصات Khamsat وMstqel وLinkedIn.',
    btn: 'تواصل معي',
    info: [
      { label: 'الاسم', value: 'Ahmed Abdelmaqsoud' },
      { label: 'التخصص', value: 'Frontend Developer' },
      { label: 'الجامعة', value: 'Future University in Egypt (FUE)' },
      { label: 'الموبايل', value: '01220811060' },
      { label: 'الإيميل', value: 'p638599@gmail.com' },
      { label: 'المتاحية', value: 'Freelance - متاح للعمل' },
    ],
  },
  en: {
    title: 'About Me',
    subtitle: 'Get to know me more',
    greeting: "Hi! I'm Ahmed 👋",
    bio1: 'A passionate frontend developer who loves turning ideas into beautiful web experiences. Specialized in React.js, building professional websites for clinics, companies and e-commerce.',
    bio2: 'Graduate of Future University in Egypt (FUE), working as a Freelancer on Khamsat, Mstqel and LinkedIn.',
    btn: 'Contact Me',
    info: [
      { label: 'Name', value: 'Ahmed Abdelmaqsoud' },
      { label: 'Role', value: 'Frontend Developer' },
      { label: 'University', value: 'Future University in Egypt (FUE)' },
      { label: 'Phone', value: '01220811060' },
      { label: 'Email', value: 'p638599@gmail.com' },
      { label: 'Availability', value: 'Freelance - Available' },
    ],
  },
};

function About({ lang }) {
  const t = content[lang];

  return (
    <section className="section about" id="about">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
        <div className="about-grid">
          <div className="about-text">
            <h3>{t.greeting}</h3>
            <p>{t.bio1}</p>
            <p>{t.bio2}</p>
            <a href="https://wa.me/201220811060" target="_blank" rel="noreferrer" className="btn-primary">
              {t.btn}
            </a>
          </div>
          <div className="about-info">
            {t.info.map((item, i) => (
              <div className="info-row" key={i}>
                <span className="info-label">{item.label}:</span>
                <span className="info-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;