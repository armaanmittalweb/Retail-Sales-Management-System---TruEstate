import React from 'react';

const SortDropdown = ({ sortBy, sortDir, onChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === 'date') {
      onChange('date', 'desc');
    } else if (value === 'quantity') {
      onChange('quantity', 'desc'); 
    } else if (value === 'customerName') {
      onChange('customerName', 'asc');
    }
  };

  const currentValue = (() => {
    if (sortBy === 'quantity') return 'quantity';
    if (sortBy === 'customerName') return 'customerName';
    return 'date';
  })();

  return (
    <div className="sort-dropdown">
      <label className="field-label" htmlFor="sort-select">
        Sort by
      </label>
      <select id="sort-select" value={currentValue} onChange={handleChange}>
        <option value="date">Date (Newest First)</option>
        <option value="quantity">Quantity (High → Low)</option>
        <option value="customerName">Customer Name (A–Z)</option>
      </select>
    </div>
  );
};

export default SortDropdown;
