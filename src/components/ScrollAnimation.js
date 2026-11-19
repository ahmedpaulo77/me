// src/components/ScrollAnimation.js
import { useEffect } from 'react';

/**
 * بيظهر العناصر أول ما تدخل الشاشة.
 * الكلاس .reveal بيتضاف من JS — فلو الجافاسكريبت وقع، المحتوى بيفضل ظاهر عادي.
 */
const TARGETS = [
  '.section-title',
  '.project-card',
  '.skill-card',
  '.contact-card',
  '.about-text',
  '.info-row',
];

export default function ScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(TARGETS.join(','));

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('visible'));
      return undefined;
    }

    elements.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
