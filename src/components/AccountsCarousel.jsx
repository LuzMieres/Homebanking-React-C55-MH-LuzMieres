import React, { useState } from 'react';
import '../styles/style.css'; // Importar los estilos si es necesario

const AccountsCarousel = ({ accounts, onAccountClick }) => {
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);

  // Función para ir a la siguiente cuenta
  const nextAccount = () => {
    setCurrentAccountIndex((prevIndex) => (prevIndex + 1) % accounts.length);
  };

  return (
    <div className="bg-gray-300 rounded-xl absolute top-[10px] xl:top-[260px] 2xl:top-[400px] flex flex-col justify-center items-center p-[20px] w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] mx-auto my-4">
      {/* Contenedor principal para centrar la cuenta */}
      <div className="w-full lg:h-[200px] flex justify-center items-center overflow-hidden">
        <div
          className="w-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentAccountIndex * 100}%)`, width: `${accounts.length * 100}%` }} // Ajustar el ancho total
        >
          {accounts.map((account) => (
            <div
              key={account.id}
              className="w-full flex justify-center items-center"
              style={{ minWidth: '100%' }} // Asegurar que cada cuenta ocupe el 100% del contenedor
            >
              {/* Contenedor de la tarjeta de cuenta */}
              <div
                className="account-card w-[350px] h-[200px] md:w-[400px] lg:w-[400px] xl:w-[600px] lg:h-[200px] lg:pt-10 xl:h-[200px] flex flex-col justify-center items-center gap-5 text-center text-white bg-blue-700 border border-blue-800 rounded-2xl p-4 hover:bg-blue-600 hover:border-blue-700 transition-all cursor-pointer"
                onClick={() => onAccountClick(account.id)} // Manejar clic en cuenta
              >
                <p className="text-lg font-bold lg:text-xl xl:text-2xl">
                  Account Number: {account.number}
                </p>
                <p className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl">
                  Balance: {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(account.balance)}
                </p>
                <p className="text-lg font-bold lg:text-xl xl:text-2xl">
                  Creation Date: {account.creationDate || new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón siguiente */}
      <button
        onClick={nextAccount}
        className="mt-4 text-white bg-blue-800 hover:bg-blue-600 p-3 text-xl rounded-lg transition-transform transform-gpu hover:translate-y-1"
        disabled={accounts.length <= 1} // Deshabilitar el botón si hay una o ninguna cuenta
      >
        Next Account
      </button>
    </div>
  );
};

export default AccountsCarousel;