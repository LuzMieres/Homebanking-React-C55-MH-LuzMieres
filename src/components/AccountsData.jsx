import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCurrentUserAction } from "../redux/actions/loadCurrentUserAction";
import AccountsCarousel from './AccountsCarousel'; // Importar el componente AccountsCarousel

function AccountsData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);
  
  // Estado local para manejar el mensaje de error
  const [errorMessage, setErrorMessage] = useState('');

  // Definir el límite máximo de cuentas permitidas
  const accountLimit = 3;

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  // Función para manejar la solicitud de una nueva cuenta
  const handleRequestNewAccount = () => {
    const accountCount = client.accounts.length;

    // Verificar si el cliente ya ha alcanzado el límite de cuentas
    if (accountCount >= accountLimit) {
      setErrorMessage(`You already have ${accountLimit} accounts, you can't request more.`);
      return;
    }

    // Redirigir a la página para solicitar una nueva cuenta
    navigate("/newAccount");
  };

  // Función para manejar el clic en una cuenta específica
  const handleAccountClick = (accountId) => {
    navigate(`/account/${accountId}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!client || !client.accounts) {
    console.log('No client or accounts available:', client); // Depuración
    return <div>No accounts available.</div>;
  }

  // Verificar si el cliente ya alcanzó el límite de cuentas
  const accountCount = client.accounts.length;
  const isMaxAccountsReached = accountCount >= accountLimit;

  return (
    <main className="flex flex-col w-full justify-center items-center min-h-screen overflow-hidden mt-20px">
      
      {/* Mostrar el carrusel de cuentas si hay cuentas disponibles */}
      {client.accounts.length > 0 ? (
        <AccountsCarousel accounts={client.accounts} onAccountClick={handleAccountClick} />
      ) : (
        <p className="text-xl text-gray-500 mt-[300px] 2xl:mt-[400px]">No accounts available.</p>
      )}

      {/* Botón para solicitar nueva cuenta y mensaje de error */}
      <div className="flex flex-col items-center mt-8">
        <button
          onClick={handleRequestNewAccount}
          className={`absolute bottom-[-310px] md:bottom-[-130px] lg:bottom-[-320px] xl:bottom-[-130px] 2xl:bottom-[420px] 2xl:text-3xl p-3 rounded text-white ${
            isMaxAccountsReached ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 text-white hover:bg-blue-600"
          }`}
          disabled={isMaxAccountsReached} // Deshabilitar si ya alcanzó el límite de cuentas
        >
          Request New Account
        </button>
        
        {/* Mostrar mensaje de error si el cliente ya tiene el máximo de cuentas permitidas */}
        {isMaxAccountsReached && (
          <p className="text-red-500 mt-2 absolute bottom-[-340px] md:bottom-[-160px] lg:bottom-[-350px] xl:bottom-[-160px] 2xl:bottom-[350px] 2xl:text-3xl">
            You already have {accountLimit} accounts, you can't request more.
          </p>
        )}
      </div>
    </main>
  );
}

export default AccountsData;
