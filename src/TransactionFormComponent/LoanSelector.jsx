import React from 'react';

function LoanSelector({ loansToPay, selectedLoan, onLoanChange }) {
  return (
    <div className="w-full">
      <label className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg block mb-1" htmlFor="loanSelection">
        Select Loan
      </label>
      <select
        className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg rounded"
        id="loanSelection"
        name="loanSelection"
        value={selectedLoan}
        onChange={onLoanChange}
      >
        <option value="" disabled>Select a loan</option>
        {loansToPay.map(loan => (
          <option key={loan.id} value={loan.id}>
            {loan.name} - {loan.payments} payments remaining
          </option>
        ))}
      </select>
    </div>
  );
}

export default LoanSelector;
