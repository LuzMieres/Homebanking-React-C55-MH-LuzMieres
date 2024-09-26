import React, { useState } from 'react';
import '../styles/style.css';

const CardCarousel = ({ cards, selectedCardType, handleCardTypeChange }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para ir a la siguiente tarjeta
  const nextCard = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  return (
    <div className="bg-gray-300 rounded-xl flex flex-col justify-center items-center p-[20px] w-full md:w-[90%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] mx-auto my-4">
      
      {/* Contenedor para los radios de selección del tipo de tarjeta */}
      <div className="flex items-center justify-center mb-4">
        <label className="flex items-center gap-2 mx-2 text-sm lg:text-lg 2xl:text-xl">
          <input
            type="radio"
            name="cardType"
            value="CREDIT"
            checked={selectedCardType === "CREDIT"}
            onChange={handleCardTypeChange}
            className="form-radio text-blue-600"
          />
          CREDIT
        </label>
        <label className="flex items-center gap-2 mx-2 text-sm lg:text-lg 2xl:text-xl">
          <input
            type="radio"
            name="cardType"
            value="DEBIT"
            checked={selectedCardType === "DEBIT"}
            onChange={handleCardTypeChange}
            className="form-radio text-blue-600"
          />
          DEBIT
        </label>
      </div>

      {/* Contenedor principal para centrar la tarjeta */}
      <div className="w-full lg:h-[400px] flex justify-center items-center overflow-hidden">
        <div
          className="w-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)`, width: `${cards.length * 100}%` }} // Ajustar el ancho total
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-full flex justify-center items-center"
              style={{ minWidth: '100%' }} // Asegurar que cada tarjeta ocupe el 100% del contenedor
            >
              {/* Contenedor para mostrar frente y dorso juntos */}
              <div className="card-pair flex flex-col md:flex-row justify-center items-center gap-4">
                {/* Frente de la tarjeta */}
                <div className="card w-[300px] h-[190px] md:w-[360px] md:h-[220px] rounded-xl shadow-md relative overflow-hidden">
                  <div
                    className="card-front w-full h-full rounded-lg shadow-md"
                    style={{
                      backgroundImage: `url(${card.color === 'GOLD' ? `${card.type === 'CREDIT' ? 'CreditCardGoldFrente.png' : 'DEBITCardGoldFrente.png'}` : card.color === 'SILVER' ? `${card.type === 'CREDIT' ? 'CreditCardSilverFrente.png' : 'DEBITCardSilverFrente.png'}` : `${card.type === 'CREDIT' ? 'CreditCardTitaniumFrente.png' : 'DEBITCardTitaniumFrente.png'}`})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div className={`card-content card-front-content flex flex-col justify-end pb-4 items-center gap-2 ${card.color === 'SILVER' ? 'text-black' : 'text-white'}`}>
                      {/* Contenido del frente */}
                      <div className="flex flex-col justify-center items-center absolute top-[50px] h-full pt-2">
                        <p className="text-xl md:text-xl font-bold">{card.number}</p>
                        <p className="text-xl md:text-xl font-bold">{card.cardholder}</p>
                        <p className="text-xl md:text-xl font-bold flex gap-1">
                          <span className="text-xs">FROM</span> {new Date(card.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} <span className="text-xs">THRU</span> {new Date(card.thruDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Dorso de la tarjeta */}
                <div className="card w-[300px] h-[190px] md:w-[360px] md:h-[220px] rounded-xl shadow-md relative overflow-hidden">
                  <div
                    className="card-back w-full h-full rounded-lg shadow-md"
                    style={{
                      backgroundImage: `url(${card.color === 'GOLD' ? 'CardGoldDorso.png' : card.color === 'SILVER' ? 'CardSilverDorso.png' : 'CardTitaniumDorso.png'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div className={`card-content card-back-content flex flex-col justify-center items-start pl-4 gap-2 ${card.color === 'SILVER' ? 'text-black' : 'text-white'}`}>
                      {/* Contenido del dorso */}
                      <p className="cvv text-sm text-black font-bold absolute bottom-[70px] right-[20px]">
                        <span className="text-xs text-black">CVV</span> {card.cvv}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón siguiente */}
      <button
        onClick={nextCard}
        className="mt-4 text-white bg-blue-800 hover:bg-blue-600 p-3 text-xl rounded-lg transition-transform transform-gpu hover:translate-y-1"
        disabled={cards.length <= 1} // Deshabilitar el botón si hay una o ninguna tarjeta
      >
        Next Card
      </button>
    </div>
  );
};

export default CardCarousel;
