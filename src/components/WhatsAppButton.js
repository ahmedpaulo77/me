// src/components/WhatsAppButton.js
import React from 'react';

export default function WhatsAppButton({ phone }) {
  const url = `https://wa.me/${phone}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="تواصل عبر واتساب"
    >
      <i className="ti ti-brand-whatsapp"></i>
    </a>
  );
}