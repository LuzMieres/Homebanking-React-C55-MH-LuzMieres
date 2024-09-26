import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { useDispatch } from 'react-redux';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';

export const transactionsArray = [];
export const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts')) || []; 

function NewTransactionData() {
  const [formData, setFormData] = useState({
    accountType: 'Own',
    sourceAccount: '',
    destinationAccount: '',
    amount: '',
  });
  const [client, setClient] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amountError, setAmountError] = useState(false);
  const [amountInvalid, setAmountInvalid] = useState(false);
  const [destinationAccountError, setDestinationAccountError] = useState('');
  const [serverError, setServerError] = useState('');
  const [contactAccounts, setContactAccounts] = useState(savedAccounts);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    obtenerClient();
  }, []);

  function obtenerClient() {
    axios.get("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/auth/current", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setClient(response.data);
      })
      .catch(error => {
        console.error("There was a problem with the request:", error);
      });
  }

  function handleAccountTypeChange(event) {
    setFormData({
      ...formData,
      accountType: event.target.value,
      destinationAccount: ''
    });
    setServerError('');
    setDestinationAccountError('');
  }

  function handleSourceAccountChange(event) {
    const selectedAccountNumber = event.target.value;
    const account = client?.accounts.find(a => a.number === selectedAccountNumber);

    if (account) {
      setSelectedAccount(account);
      setFormData(prevState => ({
        ...prevState,
        sourceAccount: selectedAccountNumber,
      }));
      setAmountError(false);
    }
  }

  function handleDestinationAccountChange(event) {
    const destinationAccount = event.target.value.toUpperCase();
    setFormData(prevState => ({
      ...prevState,
      destinationAccount,
    }));
    setDestinationAccountError('');
    setServerError('');

    const validPattern = /^VIN[A-Z0-9]*$/;
    if (formData.accountType === 'Other' && destinationAccount && !validPattern.test(destinationAccount)) {
      setDestinationAccountError('Destination account must start with "VIN" and contain only letters and numbers.');
    } else {
      setDestinationAccountError('');
    }
  }

  function handleAmountChange(event) {
    const enteredAmount = event.target.value;
    const cleanedAmount = enteredAmount.replace(/[^0-9.]/g, '');

    setFormData(prevState => ({
      ...prevState,
      amount: cleanedAmount,
    }));

    if (!/^\d*\.?\d*$/.test(cleanedAmount) || cleanedAmount === '') {
      setAmountInvalid(true);
    } else {
      setAmountInvalid(false);
    }

    const numericValue = parseFloat(cleanedAmount);
    if (selectedAccount && numericValue > selectedAccount.balance) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.sourceAccount || !formData.destinationAccount || !formData.amount) {
      alert("Please fill in all required fields.");
      return;
    }

    if (amountError) {
      alert("The amount exceeds the available balance.");
      return;
    }

    if (amountInvalid) {
      alert("Please enter a valid amount.");
      return;
    }

    Swal.fire({
      title: 'Confirm Transaction',
      html: `
        <p>Type: <strong>${formData.accountType}</strong></p>
        <p>Source Account: <strong>${formData.sourceAccount}</strong></p>
        <p>Destination Account: <strong>${formData.destinationAccount}</strong></p>
        <p>Amount: <strong>${formatAmountToARS(parseFloat(formData.amount))}</strong></p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const newTransaction = {
          originAccountNumber: formData.sourceAccount,
          destinationAccountNumber: formData.destinationAccount,
          amount: parseFloat(formData.amount),
        };

        axios.post("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/transactions/", newTransaction, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => {
            Swal.fire({
              title: 'Transaction Successful',
              text: 'Your transaction was completed successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              dispatch(loadCurrentUserAction());

              if (formData.accountType === 'Other' && !savedAccounts.includes(formData.destinationAccount)) {
                Swal.fire({
                  title: 'Save Contact',
                  text: `Do you want to save the account ${formData.destinationAccount} in your contacts?`,
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, save it!',
                  cancelButtonText: 'No, cancel'
                }).then((result) => {
                  if (result.isConfirmed) {
                    savedAccounts.push(formData.destinationAccount);
                    setContactAccounts([...savedAccounts]);
                    localStorage.setItem('savedAccounts', JSON.stringify(savedAccounts));
                    Swal.fire('Saved!', `The account ${formData.destinationAccount} has been added to your contacts.`, 'success');
                  }
                });
              }
            });
          })
          .catch(error => {
            if (error.response) {
              if (error.response.data === "Destination account does not exist") {
                setDestinationAccountError("The destination account does not exist.");
              } else {
                setServerError(error.response.data || "There was a problem with the transaction.");
              }
            } else {
              setServerError("There was a problem with the transaction.");
            }
          });
      }
    });
  }

  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  const isFormValid = formData.sourceAccount && formData.destinationAccount && formData.amount && !amountError && !amountInvalid;

  return (
    <div className="new-transaction-container">
      <div className="transaction-form-container">
        <img className="transaction-image" src="newTransaction.png" alt="newTransaction" />
        <form onSubmit={handleSubmit} className="transaction-form">

          {/* Tipo de cuenta de destino */}
          <div className="account-type-container">
            <label className="account-type-label">
              Own
              <input
                type="radio"
                name="accountType"
                value="Own"
                checked={formData.accountType === 'Own'}
                onChange={handleAccountTypeChange}
                className="account-type-radio"
              />
            </label>
            <label className="account-type-label">
              Other
              <input
                type="radio"
                name="accountType"
                value="Other"
                checked={formData.accountType === 'Other'}
                onChange={handleAccountTypeChange}
                className="account-type-radio"
              />
            </label>
            <label className="account-type-label">
              Saved
              <input
                type="radio"
                name="accountType"
                value="Saved"
                checked={formData.accountType === 'Saved'}
                onChange={handleAccountTypeChange}
                className="account-type-radio"
              />
            </label>
          </div>

          {/* Campo de cuenta de origen */}
          <div className="form-group">
            <label className="form-label" htmlFor="sourceAccount">Select source account:</label>
            <select
              className="form-select"
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleSourceAccountChange}
            >
              <option className='form-option' value="" disabled>Select a source account:</option>
              {client.accounts.map(account => (
                <option className='form-option' key={account.number} value={account.number}>{account.number}</option>
              ))}
            </select>
          </div>

          {/* Campo de cuenta de destino */}
          <div className="form-group">
            <p className="error-message">{serverError}</p>
            <label className="form-label" htmlFor="destinationAccount">Destination account:</label>
            {formData.accountType === 'Own' ? (
              <select
                className="form-select"
                id="destinationAccount"
                name="destinationAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
              >
                <option className='form-option' value="" disabled>Select a destination account:</option>
                {client.accounts
                  .filter(account => account.number !== formData.sourceAccount)
                  .map(account => (
                    <option className='form-option' key={account.number} value={account.number}>{account.number}</option>
                ))}
              </select>
            ) : formData.accountType === 'Other' ? (
              <>
                <input
                  className="form-input"
                  type="text"
                  id="destinationAccount"
                  name="destinationAccount"
                  value={formData.destinationAccount}
                  onChange={handleDestinationAccountChange}
                  placeholder="Enter destination account number (e.g., VIN123)"
                />
                {destinationAccountError && (
                  <p className="error-message">{destinationAccountError}</p>
                )}
              </>
            ) : (
              <select
                className="form-select"
                id="savedAccount"
                name="savedAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
              >
                <option className='form-option' value="" disabled>Select a saved account:</option>
                {contactAccounts.map((account, index) => (
                  <option className='form-option' key={index} value={account}>{account}</option>
                ))}
              </select>
            )}
          </div>

          {/* Campo para el monto de la transacción */}
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount:</label>
            <input
              className={`form-input ${amountError ? 'input-error' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              disabled={!selectedAccount}
            />
            {amountInvalid && (
              <p className="error-message">Invalid amount</p>
            )}
            {selectedAccount && (
              <p className={`amount-info ${amountError ? 'text-red-500' : 'text-gray-500'}`}>
                Available balance: {formatAmountToARS(selectedAccount.balance)}
              </p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className={`submit-button ${!isFormValid ? 'button-disabled' : ''}`}
            disabled={!isFormValid}
          >
            Send
          </button>

          {/* Mensaje de error del servidor */}
          {serverError && (
            <p className="error-message">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NewTransactionData;
