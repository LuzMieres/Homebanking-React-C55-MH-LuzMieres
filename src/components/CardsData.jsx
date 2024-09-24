// src/components/CardsData.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import CardCarousel from './CardCarousel'; // Importar el componente CardCarousel
import '../styles/style.css';

function CardsData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);

  // Estado local para controlar el tipo de tarjeta seleccionado
  const [selectedCardType, setSelectedCardType] = useState("CREDIT");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  // Función para manejar el cambio en el select
  const handleCardTypeChange = (event) => {
    setSelectedCardType(event.target.value);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!client || !client.cards) {
    console.log('No client or cards available:', client); // Depuración
    return <div>No cards available.</div>;
  }

  // Filtrar tarjetas según el tipo seleccionado
  const filteredCards = client.cards.filter(card => card.type === selectedCardType);

  // Depuración para ver tarjetas filtradas
  console.log("Filtered Cards:", filteredCards);

  // Deshabilitar botón si el total de tarjetas es 6 o más
  const totalCards = client.cards.length;
  const isMaxCardsReached = totalCards >= 6;

  return (
    <main className="contenedorPrincipalCards flex flex-col w-full justify-center items-center min-h-screen overflow-hidden mt-20px">
      {/* Mostrar mensaje en rojo si se alcanzó el máximo de tarjetas */}
      {isMaxCardsReached && (
        <p className="text-red-500 mt-1 text-center text-xs sm:text-xs md:text-sm lg:text-sm xl:text-lg 2xl:text-3xl absolute bottom-[-180px]">
          You already have the maximum number of cards you can request.
        </p>
      )}

      {/* Select para filtrar por tipo de tarjeta */}
      <div className="flex justify-center absolute top-[126px] xl:top-[200px] 2xl:top-[300px] w-full gap-2 md:gap-10">
        <label className="text-lg font-bold 2xl:text-3xl">Card type:</label>
        <select
          value={selectedCardType}
          onChange={handleCardTypeChange}
          className="border bg-blue-800 border-gray-300 z-1 p-2 rounded-md text-white 2xl:text-3xl"
        >
          <option value="CREDIT">CREDIT</option>
          <option value="DEBIT">DEBIT</option>
        </select>
      </div>

      {/* Mostrar el carrusel solo si hay tarjetas */}
      {filteredCards.length > 0 ? (
        <CardCarousel cards={filteredCards} />
      ) : (
        <p className="text-xl text-gray-500">No {selectedCardType.toLowerCase()} cards available.</p>
      )}

      {/* Quitar botón si se alcanzó el máximo de tarjetas */}
      {!isMaxCardsReached && (
        <button
          className="w-[40%] sm:w-[20%] md:w-[20%] lg:w-[20%] 2xl:w-[15%] p-2 sm:p-2 md:p-2 lg:p-2 2xl:p-6 bg-blue-800 text-xs md:text-sm lg:text-sm text-white 2xl:text-[40px] rounded hover:bg-blue-600 transition-colors duration-300 absolute bottom-[-250px] 2xl:bottom-[-100px]"
          onClick={() => navigate('/newCard')}
        >
          Request New Card
        </button>
      )}
    </main>
  );
}

export default CardsData;
