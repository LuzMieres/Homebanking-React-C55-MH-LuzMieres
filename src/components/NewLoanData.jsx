import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { requestNewLoanAction } from '../redux/actions/loanActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/style.css';
import { LoanContext } from '../context/LoanContext';

const availableLoans = [
  {
    name: "Mortgage",
    maxAmount: 500000,
    payments: [12, 24, 36, 48, 60, 72],
    interestRate: 20 // Porcentaje de interés
  },
  {
    name: "Personal",
    maxAmount: 100000,
    payments: [6, 12, 24],
    interestRate: 15 // Porcentaje de interés
  },
  {
    name: "Automotive",
    maxAmount: 300000,
    payments: [6, 12, 24, 36],
    interestRate: 18 // Porcentaje de interés
  },
];

function NewLoanData() {
  const [formData, setFormData] = useState({
    name: '',
    sourceAccount: '',
    amount: '',
    payments: '',
  });
  const [rawAmount, setRawAmount] = useState(''); // Nuevo estado para el valor sin formato

  const { setSelectedAccount } = useContext(LoanContext);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amountError, setAmountError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client, status, error } = useSelector((state) => state.currentUser);

  // Cargar datos del cliente al iniciar
  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  // Mostrar alerta de error si existe
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
      });
    }
  }, [error]);

  // Verificar si el formulario es válido
  useEffect(() => {
    const isValid = formData.name && formData.sourceAccount && rawAmount && formData.payments && !amountError;
    setIsFormValid(isValid);
  }, [formData, rawAmount, amountError]);

  // Manejar cambio de tipo de préstamo
  function handleLoanChange(event) {
    const selectedName = event.target.value;
    const loan = availableLoans.find(l => l.name === selectedName);
    setSelectedLoan(loan);
    setFormData(prevState => ({
      ...prevState,
      name: selectedName,
      payments: loan ? loan.payments[0] : '',
      amount: '',
    }));
    setRawAmount(''); // Reiniciar el valor sin formato
    setAmountError(false);
  }

  // Manejar cambio de cuenta de origen
  function handleAccountChange(event) {
    const selectedAccount = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      sourceAccount: selectedAccount,
    }));
    setSelectedAccount(selectedAccount);
  }

  // Manejar cambio de monto y validación de monto máximo
  function handleAmountChange(event) {
    let enteredAmount = event.target.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
    setRawAmount(enteredAmount); // Guardar el valor sin formato
    setFormData(prevState => ({
      ...prevState,
      amount: enteredAmount, // Guardar sin formatear
    }));

    const numericAmount = enteredAmount ? parseFloat(enteredAmount) : 0;

    if (selectedLoan && numericAmount > selectedLoan.maxAmount) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  }

  // Formatear monto a ARS al perder foco
  function handleAmountBlur() {
    const numericValue = rawAmount ? parseFloat(rawAmount) : ''; // Usar el valor sin formato
    if (!isNaN(numericValue)) {
      const formattedAmount = formatAmountToARS(numericValue);
      setFormData(prevState => ({
        ...prevState,
        amount: formattedAmount,
      }));
    }
  }

  // Función para formatear el monto a ARS
  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  // Calcular el total con intereses
  function calculateTotalWithInterest(amount, interestRate) {
    return amount + (amount * interestRate / 100);
  }

  // Manejar cambio en el número de pagos
  function handlePaymentsChange(event) {
    const selectedPayments = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      payments: selectedPayments,
    }));
  }

  // Enviar solicitud de préstamo
  function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (amountError) {
      Swal.fire({
        icon: 'error',
        title: 'Amount Exceeded',
        text: 'The amount exceeds the maximum allowed for this loan.',
      });
      return;
    }

    const rawAmountValue = parseFloat(rawAmount); // Obtener el valor numérico del monto solicitado
    const totalWithInterest = calculateTotalWithInterest(rawAmountValue, selectedLoan.interestRate);

    const newLoan = {
      loanName: formData.name,
      amount: rawAmountValue, // El monto solicitado por el cliente
      totalAmount: totalWithInterest, // Total con intereses calculado
      payments: formData.payments,
      destinationAccountNumber: formData.sourceAccount,
    };

    dispatch(requestNewLoanAction(newLoan)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(loadCurrentUserAction()).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Loan Requested',
            text: `Your loan request has been successfully submitted for an amount of ${formatAmountToARS(rawAmountValue)}.`,
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            navigate('/loans');
          }, 1500);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while requesting the loan. Please try again later.',
        });
      }
    });
  }

  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="new-loan-container flex flex-col items-center">
      <div className="loan-form-container bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <img className="loan-image w-full h-32 mb-4 object-cover rounded" src="newLoan.png" alt="newLoan" />
        <form onSubmit={handleSubmit} className="loan-form flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="loanType">Select Loan Type</label>
            <select
              className="form-select border p-2 rounded"
              id="loanType"
              name="name"
              value={formData.name}
              onChange={handleLoanChange}
            >
              <option value="" disabled>Select a loan</option>
              {availableLoans.map(loan => (
                <option key={loan.name} value={loan.name}>{loan.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <input
              className={`form-input border p-2 rounded ${amountError ? 'border-red-500' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange} // Control de cambio sin formato
              onBlur={handleAmountBlur} // Aplicar formato al perder foco
            />
            {selectedLoan && (
              <p className={`amount-info ${amountError ? 'text-red-500' : 'text-gray-500'}`}>
                Max amount: {formatAmountToARS(selectedLoan.maxAmount)}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="payments">Select Payments</label>
            <select
              className="form-select border p-2 rounded"
              id="payments"
              name="payments"
              value={formData.payments}
              onChange={handlePaymentsChange}
            >
              {selectedLoan ? (
                selectedLoan.payments.map((payments, index) => (
                  <option key={index} value={payments}>{payments} payments</option>
                ))
              ) : (
                <option value="" disabled>Select a loan first</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sourceAccount">Select Account</label>
            <select
              className="form-select border p-2 rounded"
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleAccountChange}
            >
              <option value="" disabled>Select an account</option>
              {client.accounts.map(account => (
                <option key={account.id} value={account.number}>{account.number}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`submit-button bg-blue-800 text-white p-2 rounded ${!isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600 transition-colors duration-300'}`}
            disabled={!isFormValid}
          >
            Request Loan
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewLoanData;
