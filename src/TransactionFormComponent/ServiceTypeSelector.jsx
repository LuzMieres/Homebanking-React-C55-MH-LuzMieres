import React from 'react';

function ServiceTypeSelector({ selectedServiceType, onServiceTypeChange }) {
  return (
    <div className="w-full">
      <label className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg block mb-1" htmlFor="serviceType">
        Select Service Type
      </label>
      <select
        className="select w-full p-1 bg-blue-700 text-white text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg rounded"
        id="serviceType"
        name="serviceType"
        value={selectedServiceType}
        onChange={onServiceTypeChange}
      >
        <option value="" disabled>Select a service</option>
        <option value="Loan">Pay Loan</option>
        <option value="Credit Card">Pay Credit Card</option>
        <option value="Utilities">Pay Utilities</option>
      </select>
    </div>
  );
}

export default ServiceTypeSelector;
