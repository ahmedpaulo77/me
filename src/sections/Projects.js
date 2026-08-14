// src/sections/Projects.js - المشاريع الجديدة في الأول
import React from 'react';
import './Projects.css';

const content = {
  ar: {
    title: 'مشاريعي',
    subtitle: 'أبرز الأعمال التي قمت بتنفيذها',
    btn: 'شوف المشروع',
  },
  en: {
    title: 'My Projects',
    subtitle: 'My best work',
    btn: 'View Project',
  },
};

const projects = [
  // ✅ المشاريع الجديدة في الأول
  {
    title: 'SaaS PRO – Business Platform',
    desc: { ar: 'منصة SaaS متكاملة لإدارة الشركات والعملاء والفواتير والمخزون والمهام مع تقارير بيانية وتصدير PDF', en: 'Full-featured SaaS platform for companies, clients, invoices, inventory, tasks, and reports with PDF/Excel export' },
    tags: ['React', 'Firebase', 'Vercel'],
    link: 'https://saas-platform-sandy.vercel.app/',
    color: '#6366f1',
  },
  {
    title: 'BookFlow – Booking System',
    desc: { ar: 'نظام حجوزات SaaS متعدد الفروع مع إدارة المواعيد والخدمات', en: 'Multi-branch SaaS booking system with appointments and services management' },
    tags: ['React', 'Firebase', 'Vercel'],
    link: 'https://bookflow-amber.vercel.app/',
    color: '#f59e0b',
  },
  // ... باقي المشاريع
  {
    title: 'RWCON - Landscaping Company',
    desc: { ar: 'موقع شركة ركن المقاولات السعودية للمناظر الطبيعية والمسابح في تبوك', en: 'Saudi landscaping & pools company website in Tabuk' },
    tags: ['React', 'CSS', 'GitHub Pages'],
    link: 'https://ahmedpaulo77.github.io/rwcon/#/',
    color: '#6c63ff',
  },
  {
    title: 'Bloom Kitchen Restaurant',
    desc: { ar: 'موقع مطعم وتصفح منيو تفاعلي مع فلترة وميزة اللغات', en: 'Interactive restaurant menu website with filtering & multilingual support' },
    tags: ['React', 'Framer Motion', 'CSS'],
    link: 'https://ahmedpaulo77.github.io/food/',
    color: '#d97706',
  },
  {
    title: 'Auto Parts Import & Export',
    desc: { ar: 'موقع متكامل لشركة استيراد وتصدير قطع غيار السيارات لعرض المنتجات والخدمات', en: 'Auto parts import and export company website displaying products and services' },
    tags: ['React', 'CSS', 'GitHub Pages'],
    link: 'https://ahmedpaulo77.github.io/cars/',
    color: '#e74c3c',
  },
  {
    title: 'Shiny Dental Clinic',
    desc: { ar: 'موقع عيادة أسنان د. أحمد إسلام في بنها', en: 'Dental clinic website for Dr. Ahmed Islam in Benha' },
    tags: ['React', 'React Router', 'CSS'],
    link: 'https://ahmedpaulo77.github.io/shiny-dental/#/',
    color: '#00b4d8',
  },
  {
    title: 'Hayah Nutrition Clinic',
    desc: { ar: 'موقع عيادة تغذية د. أحمد مجدي بثلاث فروع', en: 'Nutrition clinic website with 3 branches' },
    tags: ['React', 'CSS', 'GitHub Pages'],
    link: 'https://ahmedpaulo77.github.io/ahmed-abdelkader/#/',
    color: '#2ecc71',
  },
  {
    title: 'Dr. Allam Clinic',
    desc: { ar: 'موقع عيادة د. محمود علام أخصائي التغذية', en: 'Nutrition specialist clinic website' },
    tags: ['React', 'React Router', 'CSS'],
    link: 'https://ahmedpaulo77.github.io/dr-allam-clinic/',
    color: '#f39c12',
  },
  {
    title: 'Dr. Mohamed Eye Clinic',
    desc: { ar: 'موقع عيادة د. محمد عمر مصطفى استشاري طب وجراحة العيون', en: 'Eye surgery clinic website' },
    tags: ['React', 'Firebase', 'CSS'],
    link: 'https://ahmedpaulo77.github.io/dr-mohamed/',
    color: '#1E88E5',
  },
  {
    title: 'ÉLITE Fashion Store',
    desc: { ar: 'متجر أزياء عصري مبني بـ Vite + React', en: 'Modern fashion store built with Vite + React' },
    tags: ['Vite', 'React', 'CSS'],
    link: 'https://ahmedpaulo77.github.io/elite/',
    color: '#e91e63',
  },
  {
    title: 'إتقان - Maintenance Office',
    desc: { ar: 'موقع مكتب صيانة وتشطيبات بنها', en: 'Maintenance & finishing office website in Benha' },
    tags: ['React', 'React Router', 'CSS'],
    link: 'https://ahmedpaulo77.github.io/etqan/#/',
    color: '#D4AF37',
  },
];

function Projects({ lang }) {
  const t = content[lang];

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
        <div className="projects-grid">
          {projects.map((project, i) => (
            <div className="project-card" key={i}>
              <div className="project-top">
                <div className="project-dots">
                  <span style={{background: '#ff5f57'}}></span>
                  <span style={{background: '#febc2e'}}></span>
                  <span style={{background: '#28c840'}}></span>
                </div>
                <a href={project.link} target="_blank" rel="noreferrer" className="project-link-icon">
                  <i className="ti ti-external-link"></i>
                </a>
              </div>
              <div className="project-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc[lang]}</p>
              </div>
              <div className="project-footer">
                <div className="project-tags">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="tag" style={{color: project.color, borderColor: project.color}}>
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noreferrer" className="project-btn" style={{background: project.color}}>
                  {t.btn}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;