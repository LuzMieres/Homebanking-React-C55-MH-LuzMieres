import React from "react";
import "../styles/style.css";

function Footer({ className = "" }) {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-content">
        <div className="footer-links">
          <p className="footer-text">© 2023. All rights reserved.</p>
          <a
            className="footer-link"
            href="https://www.linkedin.com/in/luz-mieres-617300324/"
            target="_blank" // Abrir en una nueva ventana
            rel="noopener noreferrer" // Seguridad adicional
          >
            Linkedin: Luz Mieres
          </a>
          <p className="footer-text">MindHub - CoHort 55</p>
        </div>
        <div className="footer-icons">
          <a
            href="https://www.facebook.com/"
            target="_blank" // Abrir en una nueva ventana
            rel="noopener noreferrer" // Seguridad adicional
          >
            <img
              className="footer-icon"
              src="https://img.icons8.com/?size=100&id=118468&format=png&color=000000"
              alt="logo facebook"
            />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank" // Abrir en una nueva ventana
            rel="noopener noreferrer" // Seguridad adicional
          >
            <img
              className="footer-icon"
              src="https://img.icons8.com/?size=100&id=WDlIZj1YGQtm&format=png&color=000000"
              alt="logo instagram"
            />
          </a>
          <a
            href="https://www.whatsapp.com/"
            target="_blank" // Abrir en una nueva ventana
            rel="noopener noreferrer" // Seguridad adicional
          >
            <img
              className="footer-icon"
              src="https://img.icons8.com/?size=100&id=16712&format=png&color=000000"
              alt="logo whatsapp"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
