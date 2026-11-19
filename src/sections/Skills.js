import React from "react";
import "./Skills.css";

const content = {
  ar: { title: "مهاراتي", subtitle: "التقنيات التي أعمل بها" },
  en: { title: "My Skills", subtitle: "Technologies I work with" },
};

const skills = [
  { name: "HTML5", level: 95, icon: "ti-brand-html5", color: "#e34f26" },
  { name: "CSS3", level: 90, icon: "ti-brand-css3", color: "#1572b6" },
  {
    name: "JavaScript",
    level: 85,
    icon: "ti-brand-javascript",
    color: "#f7df1e",
  },
  { name: "React.js", level: 85, icon: "ti-brand-react", color: "#61dafb" },
  { name: "React Router", level: 85, icon: "ti-route", color: "#7c6ff7" },
  { name: "Firebase", level: 85, icon: "ti-brand-firebase", color: "#ffca28" },
  { name: "Vite", level: 85, icon: "ti-brand-vite", color: "#646cff" },
  {
    name: "Git & GitHub",
    level: 80,
    icon: "ti-brand-github",
    color: "#24292f",
  },
  {
    name: "Framer Motion",
    level: 75,
    icon: "ti-brand-framer",
    color: "#e64b8c",
  },
  { name: "Three.js", level: 70, icon: "ti-3d-cube-sphere", color: "#049ef4" },
  { name: "GSAP", level: 70, icon: "ti-bolt", color: "#88ce02" },
  {
    name: "Testing (Vitest)",
    level: 65,
    icon: "ti-test-pipe",
    color: "#fcc72b",
  },
];

function Skills({ lang }) {
  const t = content[lang];

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <div className="skill-header">
                <div className="skill-icon" style={{ color: skill.color }}>
                  <i className={`ti ${skill.icon}`} aria-hidden="true"></i>
                </div>
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                </div>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-fill"
                  style={{ width: `${skill.level}%`, background: skill.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
