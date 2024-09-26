import React, { useState } from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import '../styles/style.css';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Contenedor principal con altura mínima de pantalla completa */}
      <Header /> {/* Header estático en la parte superior */}

      {/* Contenedor del contenido principal que crece con el contenido */}
      <main className="flex-grow w-full"> 
        <Outlet />
      </main>

      {/* Footer pegajoso al final de la página */}
      <Footer className='absolute bottom-0'/>
    </div>
  );
}

export default MainLayout;
