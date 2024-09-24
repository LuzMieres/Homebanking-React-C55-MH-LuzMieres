import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/style.css';

function LoansData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);

  // Cargar los datos del cliente
  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (client) {
      console.log("Préstamos del cliente:", client.loans);
    }
  }, [client]);
  

  if (status === 'loading') {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  return (
    <main className="flex flex-col w-full justify-center items-center gap-5 p-4 min-h-screen">
      {client && client.loans && client.loans.length > 0 ? (
        <div className="overflow-x-auto flex flex-col justify-center items-center w-[100%] max-w-4xl 2xl:max-w-[70%]">
          <table className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] bg-blue-700 text-white rounded-lg shadow-2xl table-auto absolute top-[150px] lg:top-[200px] xl:top-[250px] 2xl:top-[400px]">
            <thead>
              <tr className="bg-blue-800">
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">LOAN TYPE</th>
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">AMOUNT</th>
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">PAYMENTS</th>
              </tr>
            </thead>
            <tbody>
              {client.loans.map((loan, index) => (
                <tr key={index} className="even:bg-blue-600 odd:bg-blue-500 border border-gray-300">
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {loan.loanType || loan.name}
                  </td>
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {formatAmountToARS(loan.amount)}
                  </td>
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {Array.isArray(loan.payments) ? loan.payments.join(', ') : loan.payments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600">No loans available.</div>
      )}

      {/* Botón para solicitar un nuevo préstamo siempre visible */}
      <button
        className="w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[20%] p-2 bg-blue-800 text-white text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-3xl rounded hover:bg-blue-600 transition-colors duration-300 mt-8"
        onClick={() => navigate('/newLoan')}
      >
        Request New Loan
      </button>
    </main>
  );
}

export default LoansData;
