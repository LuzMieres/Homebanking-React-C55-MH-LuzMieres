import React from 'react';

function SourceAccountSelector({ client, selectedAccount, onAccountChange }) {
  return (
    <div className="w-full">
      <label className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg block mb-1" htmlFor="sourceAccount">
        Select source account
      </label>
      <select
        className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg rounded"
        id="sourceAccount"
        name="sourceAccount"
        value={selectedAccount ? selectedAccount.number : ''}
        onChange={onAccountChange}
      >
        <option value="" disabled>Select a source account</option>
        {client.accounts.map(account => (
          <option key={account.number} value={account.number}>
            {account.number}
          </option>
        ))}
      </select>
      {selectedAccount && (
        <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-600 mt-1">
          Available balance: ${selectedAccount.balance.toFixed(2)}
        </p>
      )}
    </div>
  );
}

export default SourceAccountSelector;
