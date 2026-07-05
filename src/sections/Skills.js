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
    level: 80,
    icon: "ti-brand-javascript",
    color: "#f7df1e",
  },
  { name: "React.js", level: 80, icon: "ti-brand-react", color: "#61dafb" },
  {
    name: "Bootstrap",
    level: 85,
    icon: "ti-brand-bootstrap",
    color: "#7952b3",
  },
  {
    name: "Git & GitHub",
    level: 75,
    icon: "ti-brand-github",
    color: "#f1f1f1",
  },
  { name: "Firebase", level: 60, icon: "ti-brand-firebase", color: "#ffca28" },
  { name: "React Router", level: 80, icon: "ti-route", color: "#7c6ff7" },
];

function Skills({ lang }) {
  const t = content[lang];

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">{t.subtitle}</p>
        <div className="skills-grid">
          {skills.map((skill, i) => (
            <div className="skill-card" key={i}>
              <div className="skill-header">
                <div className="skill-icon" style={{ color: skill.color }}>
                  <i className={`ti ${skill.icon}`}></i>
                </div>
                <div className="skill-info">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                  </div>
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
