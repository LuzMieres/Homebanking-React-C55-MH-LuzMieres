import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadCurrentUserAction } from "../redux/actions/loadCurrentUserAction";

function AccountDetails() {
  const { id } = useParams(); // Obtener el ID de la cuenta desde los parámetros de la URL
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(false); // Estado para mostrar/ocultar el balance

  const { client, status, error } = useSelector((state) => state.currentUser);
  const [account, setAccount] = useState(null); // Estado local para almacenar la cuenta seleccionada

  useEffect(() => {
    if (isNaN(id)) {
      console.error("The account ID from the URL is not a valid number:", id);
      return;
    }

    const accountId = parseInt(id, 10);

    // Si el cliente no está cargado y el estado es 'idle', cargar datos del cliente
    if (!client && status === "idle") {
      dispatch(loadCurrentUserAction());
    } else if (client && client.accounts) {
      // Buscar la cuenta seleccionada por ID
      const selectedAccount = client.accounts.find((acc) => acc.id === accountId);
      setAccount(selectedAccount);
    }
  }, [client, id, status, dispatch]);

  if (status === "loading") {
    return <div>Loading client data...</div>;
  }

  if (status === "failed") {
    return <div>Error loading client data: {error}</div>;
  }

  if (!client) {
    return <div>No client data available.</div>;
  }

  if (!account) {
    return (
      <div>
        Account not found for ID: {id}. Check if the account ID is correct.
      </div>
    );
  }

  // Función para formatear el monto a ARS
  function formatAmountToARS(amount) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  }

  // Simplificación de los datos de transacciones para mostrar en la tabla
  const simplifiedAccount = account.transactions.map((tr) => ({
    type: tr.type,
    amount: tr.amount,
    date: tr.date.slice(0, 10),
    hour: tr.date.slice(11, 19),
    description: tr.description,
  }));

  return (
    <div className="w-full flex justify-center items-center min-h-[90vh]">
      <div className="bg-gray-200 rounded-xl p-[20px] w-[80%] flex flex-col items-center gap-10 shadow-xl">
        {/* Información principal de la cuenta */}
        <div className="w-full flex flex-col items-center justify-center relative">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-[40px] 2xl:text-[50px]">
            Your selected account {account.number}
          </h2>
          <div className="flex justify-center items-center w-[80%] h-[100px] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] bg-blue-600 rounded-lg shadow-2xl text-white gap-2 text-xl md:text-2xl lg:text-3xl xl:text-[40px] 2xl:text-[50px] mt-[20px]">
            <strong className="text-xl md:text-2xl lg:text-3xl xl:text-[40px] 2xl:text-[50px]">Balance:</strong>{" "}
            {showBalance ? formatAmountToARS(account.balance) : "••••••••"}
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)} // Alternar la visualización del balance
              className="w-10 h-10"
            >
              <img
                src={
                  showBalance
                    ? "https://img.icons8.com/?size=100&id=14744&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=13758&format=png&color=000000"
                }
                alt={showBalance ? "Hide balance" : "Show balance"}
              />
            </button>
          </div>
        </div>

        {/* Mostrar las transacciones si hay alguna disponible */}
        {simplifiedAccount.length > 0 ? (
          <div className="w-full flex justify-center">
            <table className="table-auto w-[90%] bg-blue-700 rounded-lg shadow-2xl">
              <thead>
                <tr>
                  <th className="text-xs text-white border border-white p-2">DATE</th>
                  <th className="text-xs text-white border border-white p-2">HOUR</th>
                  <th className="text-xs text-white border border-white p-2">TYPE</th>
                  <th className="text-xs text-white border border-white p-2">AMOUNT</th>
                  <th className="text-xs text-white border border-white p-2">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {simplifiedAccount.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`even:bg-blue-600 odd:bg-blue-500 border border-gray-300 ${transaction.type.toLowerCase()}`}
                  >
                    <td className="text-xs text-white border border-white p-2">{transaction.date}</td>
                    <td className="text-xs text-white border border-white p-2">{transaction.hour}</td>
                    <td className="text-xs text-white border border-white p-2">{transaction.type}</td>
                    <td className="text-xs text-white border border-white p-2">{formatAmountToARS(transaction.amount)}</td>
                    <td className="text-xs text-white border border-white p-2">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-transactions text-xl md:text-2xl lg:text-3xl xl:text-[40px] 2xl:text-[50px] mt-10">
            No transactions available for this account.
          </p>
        )}
      </div>
    </div>
  );
}

export default AccountDetails;
