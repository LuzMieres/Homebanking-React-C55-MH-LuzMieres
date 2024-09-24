import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

export const transactionsArray = [];
export const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts')) || []; // Array global para cuentas agendadas, cargado desde localStorage

function NewTransactionData() {
  const [formData, setFormData] = useState({
    accountType: 'Own',
    sourceAccount: '',
    destinationAccount: '',
    amount: '',
    description: ''
  });
  const [client, setClient] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amountError, setAmountError] = useState(false);
  const [amountInvalid, setAmountInvalid] = useState(false); // Nuevo estado para el error de amount no válido
  const [destinationAccountError, setDestinationAccountError] = useState('');
  const [serverError, setServerError] = useState('');
  const [contactAccounts, setContactAccounts] = useState(savedAccounts);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerClient();
  }, []);

  // Obtener datos del cliente
  function obtenerClient() {
    axios.get("http://localhost:8080/api/auth/current", {
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
      destinationAccount: '' // Limpiar cuenta de destino al cambiar el tipo
    });
    setServerError(''); // Limpiar error del servidor
    setDestinationAccountError(''); // Limpiar error de cuenta de destino
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
    const destinationAccount = event.target.value.toUpperCase(); // Convertir a mayúsculas automáticamente
    setFormData(prevState => ({
      ...prevState,
      destinationAccount,
    }));
    setDestinationAccountError(''); // Limpiar error al cambiar la cuenta de destino
    setServerError(''); // Limpiar error del servidor

    // Validar que el destino empiece con "VIN" y solo contenga letras y números
    const validPattern = /^VIN[A-Z0-9]*$/;
    if (formData.accountType === 'Other' && destinationAccount && !validPattern.test(destinationAccount)) {
      setDestinationAccountError('Destination account must start with "VIN" and contain only letters and numbers.');
    } else {
      setDestinationAccountError(''); // Limpiar error si el patrón es válido
    }
  }

  function handleAmountChange(event) {
    const enteredAmount = event.target.value;
    // Eliminar cualquier carácter no numérico, excepto el punto
    const cleanedAmount = enteredAmount.replace(/[^0-9.]/g, '');

    setFormData(prevState => ({
      ...prevState,
      amount: cleanedAmount,
    }));

    // Validar que el valor sea un número positivo
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

    if (!formData.sourceAccount || !formData.destinationAccount || !formData.amount || !formData.description) {
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

    // Mostrar SweetAlert con los detalles de la transacción
    Swal.fire({
      title: 'Confirm Transaction',
      html: `
        <p>Type: <strong>${formData.accountType}</strong></p>
        <p>Source Account: <strong>${formData.sourceAccount}</strong></p>
        <p>Destination Account: <strong>${formData.destinationAccount}</strong></p>
        <p>Amount: <strong>$${parseFloat(formData.amount).toFixed(2)}</strong></p>
        <p>Description: <strong>${formData.description}</strong></p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la transacción si el usuario confirma
        const newTransaction = {
          originAccountNumber: formData.sourceAccount,
          destinationAccountNumber: formData.destinationAccount,
          amount: parseFloat(formData.amount),
          description: formData.description,
        };

        axios.post("http://localhost:8080/api/transactions/", newTransaction, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => {
            // Mostrar mensaje de éxito
            Swal.fire({
              title: 'Transaction Successful',
              text: 'Your transaction was completed successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Preguntar si se desea guardar la cuenta de destino en contactos, si es distinta de "Own"
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
                    // Guardar la cuenta en el array de cuentas agendadas
                    savedAccounts.push(formData.destinationAccount);
                    setContactAccounts([...savedAccounts]); // Actualizar estado local
                    localStorage.setItem('savedAccounts', JSON.stringify(savedAccounts)); // Guardar en localStorage
                    Swal.fire('Saved!', `The account ${formData.destinationAccount} has been added to your contacts.`, 'success');
                  }
                });
              }
            });
          })
          .catch(error => {
            if (error.response?.data === "Destination account does not exist") {
              setDestinationAccountError("The destination account does not exist.");
            } else {
              setServerError(error.response?.data || "There was a problem with the transaction.");
            }
          });
      }
    });
  }

  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const isFormValid = formData.sourceAccount && formData.destinationAccount && formData.amount && formData.description && !amountError && !amountInvalid;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-[90%] bg-white p-2 rounded-lg shadow-2xl gap-4 absolute bottom-[-360px] md:bottom-[56px] md:top-[120px] lg:top-[130px] lg:h-[65vh] xl:h-[70vh] xl:top-[160px] 2xl:top-[250px]">
        <img className="w-full md:w-1/2 h-auto object-cover mb-4 md:mb-0 lg:h-[60vh]" src="newTransaction.png" alt="newTransaction" />
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full md:w-1/2 gap-1 lg:h-[60vh] pt-1">

          {/* Tipo de cuenta de destino */}
          <div className="w-full flex flex-col md:flex-row justify-around mb-2 gap-1 md:gap-1">
            <label className="text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl text-gray-700 flex items-center">
              Own
              <input
                type="radio"
                name="accountType"
                value="Own"
                checked={formData.accountType === 'Own'}
                onChange={handleAccountTypeChange}
                className="ml-2"
              />
            </label>
            <label className="text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl text-gray-700 flex items-center">
              Other
              <input
                type="radio"
                name="accountType"
                value="Other"
                checked={formData.accountType === 'Other'}
                onChange={handleAccountTypeChange}
                className="ml-2"
              />
            </label>
            <label className="text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl text-gray-700 flex items-center">
              Saved
              <input
                type="radio"
                name="accountType"
                value="Saved"
                checked={formData.accountType === 'Saved'}
                onChange={handleAccountTypeChange}
                className="ml-2"
              />
            </label>
          </div>

          {/* Campo de cuenta de origen */}
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-sm lg:text-sm 2xl:text-2xl block mb-1" htmlFor="sourceAccount">Select source account</label>
            <select
              className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl rounded"
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleSourceAccountChange}
            >
              <option className='text-white 2xl:text-2xl w-[50%]' value="" disabled>Select a source account</option>
              {client.accounts.map(account => (
                <option className='w-[50%] 2xl:text-2xl' key={account.number} value={account.number}>{account.number}</option>
              ))}
            </select>
          </div>

          {/* Campo de cuenta de destino */}
          <div className="w-full">
            <p className="text-red-500 text-xs sm:text-sm md:text-xs lg:text-sm mt-1">{serverError}</p>
            <label className="text-gray-700 text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl block mb-1" htmlFor="destinationAccount">Destination account</label>
            {formData.accountType === 'Own' ? (
              <select
                className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl rounded"
                id="destinationAccount"
                name="destinationAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
              >
                <option className='text-white 2xl:text-2xl w-[50%]' value="" disabled>Select a destination account</option>
                {client.accounts
                  .filter(account => account.number !== formData.sourceAccount) // Excluir la cuenta de origen
                  .map(account => (
                    <option className='2xl:text-2xl w-[50%]' key={account.number} value={account.number}>{account.number}</option>
                ))}
              </select>
            ) : formData.accountType === 'Other' ? (
              <>
                <input
                  className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl rounded"
                  type="text"
                  id="destinationAccount"
                  name="destinationAccount"
                  value={formData.destinationAccount}
                  onChange={handleDestinationAccountChange}
                  placeholder="Enter destination account number (e.g., VIN123)"
                />
                {destinationAccountError && (
                  <p className="text-red-500 text-xs sm:text-xs md:text-xs mt-1 lg:text-sm 2xl:text-2xl">{destinationAccountError}</p>
                )}
              </>
            ) : (
              <select
                className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl rounded"
                id="savedAccount"
                name="savedAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
              >
                <option className='text-white 2xl:text-2xl w-full' value="" disabled>Select a saved account</option>
                {contactAccounts.map((account, index) => (
                  <option className='2xl:text-2xl w-full' key={index} value={account}>{account}</option>
                ))}
              </select>
            )}
          </div>

          {/* Campo para el monto de la transacción */}
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl block mb-1" htmlFor="amount">Amount $</label>
            <input
              className={`w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl rounded ${amountError ? 'border-red-500' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              disabled={!selectedAccount}
            />
            {amountInvalid && (
              <p className="text-red-500 text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl mt-1">Invalid amount</p>
            )}
            {selectedAccount && (
              <p className={`text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl ${amountError ? 'text-red-500' : 'text-gray-500'} mt-1`}>
                Available balance: ${selectedAccount.balance.toFixed(2)}
              </p>
            )}
          </div>
          
          {/* Campo para la descripción */}
          <div className="w-full">
            <label className="text-gray-700 text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl block mb-1" htmlFor="description">Description</label>
            <textarea
              className="w-full h-10 p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl rounded"
              name="description"
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          
          {/* Botón de envío */}
          <button
            type="submit"
            className={`w-full p-1 rounded text-white ${!isFormValid ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-600'}`}
            disabled={!isFormValid}
          >
            Send
          </button>

          {/* Mensaje de error del servidor */}
          {serverError && (
            <p className="text-red-500 text-xs sm:text-xs md:text-xs lg:text-sm 2xl:text-2xl mt-1">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NewTransactionData;
