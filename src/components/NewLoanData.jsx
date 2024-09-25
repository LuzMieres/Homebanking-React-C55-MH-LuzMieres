import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { requestNewLoanAction } from '../redux/actions/loanActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/style.css';
import { LoanContext } from '../context/LoanContext'; // Importar el contexto

const availableLoans = [
  {
    name: "Mortgage",
    maxAmount: 500000,
    payments: [12, 24, 36, 48, 60, 72],
  },
  {
    name: "Personal",
    maxAmount: 100000,
    payments: [6, 12, 24],
  },
  {
    name: "Automotive",
    maxAmount: 300000,
    payments: [6, 12, 24, 36],
  },
];

function NewLoanData() {
  const [formData, setFormData] = useState({
    name: '',
    sourceAccount: '',
    amount: '',
    payments: '',
  });

  const { setSelectedAccount } = useContext(LoanContext); // Usar el contexto para actualizar selectedAccount
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amountError, setAmountError] = useState(false); 
  const [isFormValid, setIsFormValid] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client, status, error } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
      });
    }
  }, [error]);

  useEffect(() => {
    const isValid = formData.name && formData.sourceAccount && formData.amount && formData.payments && !amountError;
    setIsFormValid(isValid);
  }, [formData, amountError]);

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
    setAmountError(false);
  }

  function handleAccountChange(event) {
    const selectedAccount = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      sourceAccount: selectedAccount,
    }));
    setSelectedAccount(selectedAccount); // Actualizar la cuenta seleccionada en el contexto
  }

  function handleAmountChange(event) {
    const enteredAmount = parseFloat(event.target.value.replace(/[^0-9.]/g, ''));
    setFormData(prevState => ({
      ...prevState,
      amount: event.target.value,
    }));

    if (selectedLoan && enteredAmount > selectedLoan.maxAmount) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  }

  function handlePaymentsChange(event) {
    const selectedPayments = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      payments: selectedPayments,
    }));
  }

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

    const newLoan = {
      loanName: formData.name,
      amount: parseFloat(formData.amount),
      payments: formData.payments,
      destinationAccountNumber: formData.sourceAccount,
    };

    dispatch(requestNewLoanAction(newLoan)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(loadCurrentUserAction()).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Loan Requested',
            text: 'Your loan request has been successfully submitted.',
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            navigate('/loans');
          }, 1500);
        });
      }
    });
  }

  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  // Función para formatear el monto a la moneda local (ARS)
  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-[90%] bg-white p-2 rounded-lg shadow-2xl gap-4 absolute bottom-[-360px] md:bottom-[56px] md:top-[120px] lg:top-[130px] lg:h-[65vh] xl:h-[70vh] xl:top-[160px] 2xl:top-[250px]">
        <img className="w-full md:w-1/2 h-auto object-cover mb-4 md:mb-0 lg:h-[60vh]" src="newLoan.png" alt="newLoan" />
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full md:w-1/2 gap-2 lg:h-[60vh] pt-5">
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-xl md:text-xs lg:text-sm block mb-1" htmlFor="loanType">Select Loan Type</label>
            <select
              className="w-full p-1 bg-blue-700 text-white text-xs sm:text-xl md:text-xs lg:text-sm rounded"
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
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-sm lg:text-sm md:text-xs lg:text-sm block mb-1" htmlFor="amount">Amount</label>
            <input
              className={`w-full p-1 bg-blue-700 text-white text-xs sm:text-sm md:text-xs lg:text-sm rounded ${amountError ? 'border-red-500' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formatAmountToARS(formData.amount)}
              onChange={handleAmountChange}
            />
            {selectedLoan && (
              <p className={`text-sm ${amountError ? 'text-red-500' : 'text-gray-500'} mt-1`}>
                Max amount: {formatAmountToARS(selectedLoan.maxAmount)}
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-sm md:text-xs lg:text-sm block mb-1" htmlFor="payments">Select Payments</label>
            <select
              className="w-full p-1 bg-blue-700 text-white text-xs sm:text-sm md:text-xs lg:text-sm rounded"
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
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-sm md:text-xs lg:text-sm block mb-1" htmlFor="sourceAccount">Select Account</label>
            <select
              className="w-full p-1 bg-blue-700 text-white text-xs sm:text-sm md:text-xs lg:text-sm rounded"
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
            className={`w-full p-1 rounded text-white transition-all duration-300 ${isFormValid ? 'bg-blue-800 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
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
