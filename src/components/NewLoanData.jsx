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

  const { setSelectedAccount } = useContext(LoanContext);
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
    setSelectedAccount(selectedAccount);
  }

  function handleAmountChange(event) {
    let enteredAmount = parseFloat(event.target.value.replace(/[^0-9]/g, ''));
    enteredAmount = isNaN(enteredAmount) ? '' : enteredAmount;
    setFormData(prevState => ({
      ...prevState,
      amount: enteredAmount,
    }));

    if (selectedLoan && enteredAmount > selectedLoan.maxAmount) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
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

  return (
    <div className="new-loan-container">
      <div className="loan-form-container">
        <img className="loan-image" src="newLoan.png" alt="newLoan" />
        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label className="form-label" htmlFor="loanType">Select Loan Type</label>
            <select
              className="form-select"
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
              className={`form-input ${amountError ? 'input-error' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formatAmountToARS(formData.amount)}
              onChange={handleAmountChange}
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
              className="form-select"
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
              className="form-select"
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
            className={`submit-button ${!isFormValid ? 'button-disabled' : ''}`}
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
