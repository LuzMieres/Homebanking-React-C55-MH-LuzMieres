import React, { useState } from 'react';
import '../styles/style.css';

const CardCarousel = ({ cards }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState(Array(cards.length).fill(false));

  // Función para ir a la siguiente tarjeta
  const nextCard = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  // Función para voltear la tarjeta
  const toggleFlip = (index) => {
    setFlippedCards((prevState) => 
      prevState.map((flipped, i) => (i === index ? !flipped : flipped))
    );
  };

  return (
    <div className="carousel-container">
      {/* Contenedor principal para centrar la tarjeta */}
      <div className="carousel-cards-container">
        <div
          className="carousel-cards"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`carousel-card ${flippedCards[index] ? 'flipped' : ''}`}
              onClick={() => toggleFlip(index)}
            >
              {/* Contenedor para mostrar frente y dorso juntos */}
              <div className="card-pair">
                {/* Frente de la tarjeta */}
                <div className="card card-front" style={{
                  backgroundImage: `url(${card.color === 'GOLD' ? `${card.type === 'CREDIT' ? 'CreditCardGoldFrente.png' : 'DEBITCardGoldFrente.png'}` : card.color === 'SILVER' ? `${card.type === 'CREDIT' ? 'CreditCardSilverFrente.png' : 'DEBITCardSilverFrente.png'}` : `${card.type === 'CREDIT' ? 'CreditCardTitaniumFrente.png' : 'DEBITCardTitaniumFrente.png'}`})`
                }}>
                  <div className={`card-content ${card.color === 'SILVER' ? 'text-black' : 'text-white'}`}>
                    <div className="card-details">
                      <p className="card-number">{card.number}</p>
                      <p className="cardholder">{card.cardholder}</p>
                      <p className="card-dates">
                        <span className="text-xs">FROM</span> {new Date(card.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} <span className="text-xs">THRU</span> {new Date(card.thruDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Dorso de la tarjeta */}
                <div className="card card-back" style={{
                  backgroundImage: `url(${card.color === 'GOLD' ? 'CardGoldDorso.png' : card.color === 'SILVER' ? 'CardSilverDorso.png' : 'CardTitaniumDorso.png'})`
                }}>
                  <div className={`card-content ${card.color === 'SILVER' ? 'text-black' : 'text-white'}`}>
                    <p className="cvv"><span className="text-xs">CVV</span> {card.cvv}</p>
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
        className="next-button"
        disabled={cards.length <= 1}
      >
        Next Card
      </button>
    </div>
  );
};

export default CardCarousel;
