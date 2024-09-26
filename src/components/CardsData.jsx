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
  const [errorMessage, setErrorMessage] = useState('');

  // Definir los límites por tipo (sin considerar color)
  const cardLimitPerType = {
    CREDIT: 3, // Limitar a 3 tarjetas de crédito (una de cada color)
    DEBIT: 3,  // Limitar a 3 tarjetas de débito (una de cada color)
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  // Función para manejar el cambio en los inputs radio de tipo de tarjeta
  const handleCardTypeChange = (event) => {
    setSelectedCardType(event.target.value);
    setErrorMessage(''); // Limpiar el mensaje de error al cambiar el tipo de tarjeta
  };

  // Función para manejar la solicitud de una nueva tarjeta
  const handleRequestNewCard = () => {
    // Verificar cuántas tarjetas del tipo seleccionado ya tiene el cliente (sin importar color)
    const cardCountByType = client.cards.filter(
      card => card.type === selectedCardType
    ).length;

    // Verificar si ya ha alcanzado el límite
    if (cardCountByType >= cardLimitPerType[selectedCardType]) {
      setErrorMessage(`You already have ${cardLimitPerType[selectedCardType]} ${selectedCardType.toLowerCase()} cards.`);
      return;
    }

    // Redirigir a la página para solicitar una nueva tarjeta
    navigate('/newCard');
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

  // Verificar si el cliente ya alcanzó el límite de tarjetas del tipo seleccionado
  const cardCountByType = client.cards.filter(card => card.type === selectedCardType).length;
  const isMaxCardsReached = cardCountByType >= cardLimitPerType[selectedCardType];

  return (
    <main className="contenedorPrincipalCards flex flex-col w-full justify-center items-center min-h-[130vh] overflow-hidden mt-20px">
      {/* Inputs para seleccionar el tipo de tarjeta */}
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

      {/* Mostrar el carrusel solo si hay tarjetas */}
      {filteredCards.length > 0 ? (
        <CardCarousel cards={filteredCards} selectedCardType={selectedCardType} handleCardTypeChange={handleCardTypeChange} />
      ) : (
        <p className="text-xl text-gray-500 mt-[300px] 2xl:mt-[400px]">No {selectedCardType.toLowerCase()} cards available.</p>
      )}

      {/* Botón para solicitar nueva tarjeta y mensaje de error */}
      <div className="flex flex-col items-center mt-8">
        <button
          onClick={handleRequestNewCard}
          className={`2xl:text-3xl p-3 rounded text-white ${
            isMaxCardsReached ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 text-white hover:bg-blue-600"
          }`}
          disabled={isMaxCardsReached} // Deshabilitar si ya alcanzó el límite de tarjetas
        >
          Request New Card
        </button>
        
        {/* Mostrar mensaje de error si el cliente ya tiene el máximo de tarjetas del tipo seleccionado */}
        {isMaxCardsReached && (
          <p className="text-red-500 mt-2 2xl:text-xl">
            You already have {cardLimitPerType[selectedCardType]} {selectedCardType.toLowerCase()} cards.
          </p>
        )}
      </div>
    </main>
  );
}

export default CardsData;
