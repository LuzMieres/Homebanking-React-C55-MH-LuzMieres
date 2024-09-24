import React, { useState } from 'react';
import '../styles/style.css'; // Importar los estilos si es necesario

const AccountsCarousel = ({ accounts, onAccountClick }) => {
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);

  // Función para ir a la siguiente cuenta
  const nextAccount = () => {
    setCurrentAccountIndex((prevIndex) => (prevIndex + 1) % accounts.length);
  };

  // Función para ir a la cuenta anterior
  const prevAccount = () => {
    setCurrentAccountIndex((prevIndex) => (prevIndex - 1 + accounts.length) % accounts.length);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative top-[40px] overflow-hidden">
      {/* Botón anterior */}
      <button
        onClick={prevAccount}
        className="absolute left-[20px] top-[20px] transform -translate-y-1/2 text-white bg-blue-800 hover:bg-blue-600 px-3 text-3xl rounded-lg transition-transform transform-gpu hover:-translate-x-2 z-10"
      >
        &#8249;
      </button>

      {/* Contenedor principal para centrar la cuenta */}
      <div className="w-full lg:h-[200px] flex justify-center items-center relative top-[-70px] lg:pt-[100px] pt-[80px] md:top-[-150px] lg:top-[-180px] xl:top-[-250px] 2xl:top-[-550px]">
        <div
          className="w-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentAccountIndex * 100}%)` }}
        >
          {accounts.map((account) => (
            <div
              key={account.id}
              className="w-full flex justify-center items-center"
              style={{ minWidth: '100%' }}
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
        className="absolute right-[20px] top-[20px] transform -translate-y-1/2 text-white bg-blue-800 hover:bg-blue-600 px-3 text-3xl rounded-lg transition-transform transform-gpu hover:translate-x-2 z-10"
      >
        &#8250;
      </button>
    </div>
  );
};

export default AccountsCarousel;
