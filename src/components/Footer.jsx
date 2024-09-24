import React from "react";
import "../styles/style.css";

function Footer({ className = "" }) {
  return (
    <footer
      className={`footer bg-blue-900 text-white sm:flex-row sm:justify-around sm:items-center sm:h-[10vh] md:h-[15vh] ${className}`}
    >
      <div className="flex justify-between items center w-full">
        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row md:justify-center md:items-center md:gap-5 lg:justify-center lg:items-center lg:gap-8 xl:justify-center xl:items-center xl:gap-10">
          <p className="text-sm sm:text-xl md:text-xs lg:text-xl xl:text-xl 2xl:text-[50px]">
            © 2023. All rights reserved.
          </p>
          <a
            className="text-sm sm:text-xl md:text-xs lg:text-xl xl:text-xl 2xl:text-[50px]"
            href="https://www.linkedin.com/in/luz-mieres-617300324/"
            target="_blank" // Abrir en una nueva ventana
            rel="noopener noreferrer" // Seguridad adicional
          >
            Linkedin: Luz Mieres
          </a>
          <p className="text-sm sm:text-xl md:text-xs lg:text-xl xl:text-xl 2xl:text-[50px]">
            MindHub - CoHort 55
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://www.facebook.com/"
            target="_blank" // Abrir en una nueva ventana
            rel="noopener noreferrer" // Seguridad adicional
          >
            <img
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 xl:w-14 xl:h-14 2xl:w-20 2xl:h-20 rounded-full"
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
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 xl:w-14 xl:h-14 2xl:w-20 2xl:h-20 rounded-full"
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
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 xl:w-14 xl:h-14 2xl:w-20 2xl:h-20 rounded-full"
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
