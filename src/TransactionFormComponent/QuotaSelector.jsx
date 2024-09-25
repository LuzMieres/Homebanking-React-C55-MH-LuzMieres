import React from 'react';

function QuotaSelector({ remainingPayments, selectedQuota, onQuotaChange }) {
  return (
    <div className="w-full">
      <label className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg block mb-1" htmlFor="quotaSelection">
        Select Quota
      </label>
      <select
        className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg rounded"
        id="quotaSelection"
        name="quotaSelection"
        value={selectedQuota}
        onChange={onQuotaChange}
      >
        <option value="" disabled>Select a quota</option>
        {remainingPayments.map(payment => (
          <option key={payment.quota} value={payment.quota}>
            Quota {payment.quota}: $ {payment.amount}
          </option>
        ))}
      </select>
    </div>
  );
}

export default QuotaSelector;
