import React, { useEffect, useContext } from 'react'; // Agregar useContext
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/style.css';
import { LoanContext } from '../context/LoanContext'; // Importar el contexto

function LoansData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);
  const { selectedAccount } = useContext(LoanContext); // Obtener la cuenta seleccionada del contexto

  // Cargar los datos del cliente
  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (client) {
      console.log("Client loans:", client.loans);
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

  // Calcular la tasa de interés según los pagos
  function getInterestRate(payments) {
    if (payments === 12) {
      return 1.20; // 20% de interés
    } else if (payments > 12) {
      return 1.25; // 25% de interés
    } else {
      return 1.15; // 15% de interés
    }
  }

  // Calcular monto total con intereses
  function calculateTotalAmount(loan) {
    const interestRate = getInterestRate(loan.payments); // Obtener la tasa de interés
    return formatAmountToARS(loan.amount * interestRate);
  }

  // Calcular monto acreditado (sin intereses)
  function calculateCreditedAmount(loan) {
    return formatAmountToARS(loan.amount);
  }

  // Calcular la fecha de vencimiento de la próxima cuota
  function calculateNextPaymentDueDate(loanDate) {
    const loanDateObj = new Date(loanDate);
    loanDateObj.setDate(loanDateObj.getDate() + 30); // Sumar 30 días a la fecha del préstamo
    return loanDateObj.toLocaleDateString('es-AR'); // Formato de fecha local
  }

  // Obtener la fecha de solicitud del préstamo (fecha actual)
  function getLoanRequestDate() {
    return new Date().toLocaleDateString('es-AR');
  }

  // Mostrar detalles del préstamo en una alerta
  function handleRowClick(loan) {
    const remainingPayments = loan.payments; // Cuotas restantes igual a payments
    const loanRequestDate = getLoanRequestDate(); // Fecha de solicitud
    const nextPaymentDueDate = calculateNextPaymentDueDate(new Date()); // Fecha de vencimiento 30 días después de hoy

    Swal.fire({
      title: 'Loan Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Loan Type:</strong> ${loan.loanType || loan.name}</p>
          <p><strong>Amount:</strong> ${formatAmountToARS(loan.amount)}</p>
          <p><strong>Credited Amount:</strong> ${formatAmountToARS(loan.amount)}</p>
          <p><strong>Total with Interest:</strong> ${calculateCreditedAmount(loan)}</p>
          <p><strong>Payments:</strong> ${Array.isArray(loan.payments) ? loan.payments.join(', ') : loan.payments}</p>
          <p><strong>Remaining Payments:</strong> ${remainingPayments}</p>
          <p><strong>Deposit Account:</strong> ${selectedAccount || 'N/A'}</p> <!-- Usar selectedAccount del contexto -->
          <p><strong>Loan Request Date:</strong> ${loanRequestDate}</p>
          <p><strong>Next Payment Due Date:</strong> ${nextPaymentDueDate}</p>
        </div>
      `,
      icon: 'info',
      showConfirmButton: false, // No mostrar el botón de confirmación
      showCloseButton: true, // Mostrar botón de cerrar (X)
      customClass: {
        popup: 'swal-wide', // Clase personalizada para la alerta
      }
    });
  }

  return (
    <main className="flex flex-col w-full justify-center items-center gap-5 p-4 min-h-screen">
      {/* Instrucción para seleccionar un préstamo */}
      <div className="text-center text-gray-700 absolute top-[20px]">
        Please select a loan to view details.
      </div>

      {client && client.loans && client.loans.length > 0 ? (
        <div className="overflow-x-auto flex flex-col justify-center items-center w-[100%] max-w-4xl 2xl:max-w-[70%]">
          <table className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] bg-blue-700 text-white rounded-lg shadow-2xl table-auto absolute top-[150px] lg:top-[200px] xl:top-[250px] 2xl:top-[400px]">
            <thead>
              <tr className="bg-blue-800">
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">LOAN TYPE</th>
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">AMOUNT</th>
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">CREDITED AMOUNT</th>
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">TOTAL WITH INTEREST</th>
                <th className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">PAYMENTS</th>
              </tr>
            </thead>
            <tbody>
              {client.loans.map((loan, index) => (
                <tr 
                  key={index} 
                  className="even:bg-blue-600 odd:bg-blue-500 border border-gray-300 cursor-pointer hover:bg-blue-400"
                  onClick={() => handleRowClick(loan)} // Añadir el evento de click
                >
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {loan.loanType || loan.name}
                  </td>
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {formatAmountToARS(loan.amount)}
                  </td>
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {formatAmountToARS(loan.amount)}
                  </td>
                  <td className="p-2 text-start border border-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">
                    {calculateTotalAmount(loan)}
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
