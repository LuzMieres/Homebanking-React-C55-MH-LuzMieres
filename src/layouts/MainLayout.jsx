import React, { useState } from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import '../styles/style.css';
import Footer from '../components/Footer';

function MainLayout() {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="flex flex-col min-h-screen"> {/* Contenedor principal que ocupa toda la pantalla */}
      <Header showNav={showNav} toggleNav={() => setShowNav(!showNav)} />
      
      <div className={`flex-grow w-full ${showNav ? 'overflow-hidden' : ''}`}> {/* Contenedor del contenido principal */}
        <Outlet />
      </div>
      
      <Footer className="absolute top-[170vh] md:top-[150vh] lg:top-[150vh] 2xl:top-[120vh]" /> {/* Footer se coloca automáticamente al final del contenedor principal */}
    </div>
  );
}

export default MainLayout;
