// src/components/AccountsData.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import { loadCurrentUserAction } from "../redux/actions/loadCurrentUserAction";
import AccountsCarousel from './AccountsCarousel'; // Importar el componente AccountsCarousel

function AccountsData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  const handleRequestNewAccount = () => {
    if (client && client.accounts.length >= 3) {
      setErrorMessage("You already have 3 accounts, you can't request more.");
      return;
    }
    navigate("/newAccount");
  };

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
    return <div>No hay datos de cuentas disponibles.</div>;
  }

  return (
    <main className="flex flex-col w-full justify-center items-center gap-[20px] md:flex md:flex-col">
      {/* Mostrar el carrusel de cuentas */}
      <AccountsCarousel accounts={client.accounts} onAccountClick={handleAccountClick} />

      {/* Botón para solicitar una nueva cuenta */}
      <button
        onClick={handleRequestNewAccount}
        className={`absolute bottom-[-140px] md:bottom-[9px] lg:bottom-[60px] xl:bottom-[80px] 2xl:bottom-[530px] 2xl:text-3xl p-3 rounded text-white ${
          client.accounts.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-600"
        }`}
        disabled={client.accounts.length >= 3}
      >
        Request New Account
      </button>
      {errorMessage && <p className="text-red-500 absolute 2xl:bottom-[-525px]">{errorMessage}</p>}
    </main>
  );
}

export default AccountsData;
