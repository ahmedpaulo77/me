import React from 'react';
import './Contact.css';

const content = {
  ar: {
    title: 'تواصل معي',
    subtitle: 'هل عندك مشروع؟ تكلم معايا!',
    heading: 'يلا نشتغل سوا! 🚀',
    bio1: 'أنا متاح للعمل على مشاريع فريلانس في أي وقت. سواء كنت محتاج موقع لعيادتك، شركتك، أو متجرك الإلكتروني، أنا هنا أساعدك.',
    bio2: 'بتحب تشتغل معايا؟ تواصل معايا دلوقتي!',
    items: [
      { icon: 'ti-brand-whatsapp', label: 'واتساب', value: '01220811060', link: 'https://wa.me/201220811060', color: '#25D366' },
      { icon: 'ti-mail', label: 'الإيميل', value: 'p638599@gmail.com', link: 'mailto:p638599@gmail.com', color: '#7c6ff7' },
      { icon: 'ti-brand-github', label: 'GitHub', value: 'ahmedpaulo77', link: 'https://github.com/ahmedpaulo77', color: '#f1f1f1' },
    ],
  },
  en: {
    title: 'Contact Me',
    subtitle: "Have a project? Let's talk!",
    heading: "Let's work together! 🚀",
    bio1: "I'm available for freelance projects anytime. Whether you need a website for your clinic, company, or online store, I'm here to help.",
    bio2: "Want to work with me? Reach out now!",
    items: [
      { icon: 'ti-brand-whatsapp', label: 'WhatsApp', value: '01220811060', link: 'https://wa.me/201220811060', color: '#25D366' },
      { icon: 'ti-mail', label: 'Email', value: 'p638599@gmail.com', link: 'mailto:p638599@gmail.com', color: '#7c6ff7' },
      { icon: 'ti-brand-github', label: 'GitHub', value: 'ahmedpaulo77', link: 'https://github.com/ahmedpaulo77', color: '#f1f1f1' },
    ],
  },
};

function Contact({ lang }) {
  const t = content[lang];

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
        <div className="contact-grid">
          <div className="contact-text">
            <h3>{t.heading}</h3>
            <p>{t.bio1}</p>
            <p>{t.bio2}</p>
          </div>
          <div className="contact-cards">
            {t.items.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noreferrer" className="contact-card">
                <div className="contact-icon" style={{color: item.color}}>
                  <i className={`ti ${item.icon}`}></i>
                </div>
                <div>
                  <span className="contact-label">{item.label}</span>
                  <span className="contact-value">{item.value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;