import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Importar el CSS de SweetAlert2
import '../styles/style.css';

function Header() {
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();

  // Función para manejar el logout con confirmación
  function handleLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to log out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Color del botón de confirmación (rojo)
      cancelButtonColor: '#3085d6', // Color del botón de cancelación (azul)
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay',
    }).then((result) => {
      if (result.isConfirmed) {
        // Acciones para cerrar sesión
        localStorage.removeItem('token');
        navigate('/');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have successfully logged out.',
          icon: 'success',
          timer: 2000, // Mostrar por 2 segundos antes de redirigir
          showConfirmButton: false,
        });
      }
    });
  }

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <>
      <header className='header w-full h-[20vh] bg-blue-800 flex justify-between items-center p-4 md:z-1 lg:z-1 xl:z-1 2xl:z-1'>
        <div className='flex justify-center items-center'>
        <h1 className='text-white text-[50px]'>Big Bank</h1>
        </div>
        {/* Mostrar el botón del menú solo en pantallas pequeñas */}
        <button
          id="menu"
          onClick={toggleNav}
          className='bg-blue-900 text-[30px] md:hidden lg:hidden xl:hudden 2xl:hidden text-white pl-3 pr-3'
        >
          {showNav ? "X" : "≡"}
        </button>
      </header>
      {/* En pantallas grandes (md en adelante), mostrar el nav sin transición y sin el botón */}
      <nav
        className={`nav ${showNav ? 'show' : ''} bg-blue-900 z-10 lg:static lg:flex lg:flex-row lg:justify-around lg:items-center lg:gap-8 lg:top-0 lg:h-auto lg:shadow-none lg:w-full`}
      >
        <ul className='navLinks text-white lg:flex lg:gap-8'>
          <li>
            <NavLink 
              to='/accounts' 
              className={({ isActive }) => 
                isActive ? "hover:text-gray-200 border-b-2 border-white md:z-2 lg:z-2 xl:z-2 2xl:z-2" : "hover:text-gray-200"
              }
            >
              Accounts
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/newTransaction' 
              className={({ isActive }) => 
                isActive ? "hover:text-gray-200 border-b-2 border-white md:z-2 lg:z-2 xl:z-2 2xl:z-2" : "hover:text-gray-200"
              }
            >
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/cards' 
              className={({ isActive }) => 
                isActive ? "hover:text-gray-200 border-b-2 border-white md:z-2 lg:z-2 xl:z-2 2xl:z-2" : "hover:text-gray-200"
              }
            >
              Cards
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/loans' 
              className={({ isActive }) => 
                isActive ? "hover:text-gray-200 border-b-2 border-white md:z-2 lg:z-2 xl:z-2 2xl:z-2" : "hover:text-gray-200"
              }
            >
              Loans
            </NavLink>
          </li>
        </ul>
        <button 
          onClick={handleLogout} 
          className="p-3 mb-2 bg-red-500 text-white h-12 w-12 flex items-center justify-center mt-4 hover:bg-red-400 lg:mt-0 md:z-2 lg:z-2 xl:z-2 2xl:z-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="RGB(255 255 255)">
            <path d="M806-440H360q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h446l-34-34q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T829-611l103 103q12 12 12 28t-12 28L829-349q-12 12-28.5 11.5T772-350q-11-12-11.5-28t11.5-28l34-34ZM600-640v-120H200v560h400v-120q0-17 11.5-28.5T640-360q17 0 28.5 11.5T680-320v120q0 33-23.5 56.5T600-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h400q33 0 56.5 23.5T680-760v120q0 17-11.5 28.5T640-600q-17 0-28.5-11.5T600-640Z" />
          </svg>
        </button>
      </nav>
    </>
  );
}

export default Header;
