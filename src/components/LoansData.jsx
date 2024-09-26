import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/style.css';
import { LoanContext } from '../context/LoanContext';

function LoansData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);
  const { selectedAccount } = useContext(LoanContext);

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

  function handleRowClick(loan) {
    // Obtener el total con intereses directamente desde el objeto `loan` si ya viene calculado desde el backend
    const totalAmount = formatAmountToARS(loan.totalAmount);

    Swal.fire({
      title: 'Loan Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Loan Type:</strong> ${loan.loanType || loan.name}</p>
          <p><strong>Requested Amount:</strong> ${formatAmountToARS(loan.amount)}</p>
          <p><strong>Credited Amount:</strong> ${formatAmountToARS(loan.amount)}</p>
          <p><strong>Total with Interest:</strong> ${totalAmount}</p>
          <p><strong>Payments:</strong> ${loan.payments}</p>
          <p><strong>Deposit Account:</strong> ${selectedAccount || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide',
      }
    });
  }

  return (
    <main className="loans-container">
      <div className="loans-instruction">
        Please select a loan to view details.
      </div>

      {client && client.loans && client.loans.length > 0 ? (
        <div className="loans-table-container">
          <table className="loans-table">
            <thead>
              <tr className="loans-table-header">
                <th className="loans-table-header-cell">LOAN TYPE</th>
                <th className="loans-table-header-cell">REQUESTED AMOUNT</th>
                <th className="loans-table-header-cell">CREDITED AMOUNT</th>
                <th className="loans-table-header-cell">TOTAL WITH INTEREST</th>
                <th className="loans-table-header-cell">PAYMENTS</th>
              </tr>
            </thead>
            <tbody>
              {client.loans.map((loan, index) => (
                <tr 
                  key={index} 
                  className="loans-table-row"
                  onClick={() => handleRowClick(loan)}
                >
                  <td className="loans-table-cell">{loan.loanType || loan.name}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.amount)}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.amount)}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.totalAmount)}</td> {/* Mostramos el total con intereses directamente del backend */}
                  <td className="loans-table-cell">{loan.payments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-loans-message">No loans available.</div>
      )}

      <button
        className="request-loan-button"
        onClick={() => navigate('/newLoan')}
      >
        Request New Loan
      </button>
    </main>
  );
}

export default LoansData;
