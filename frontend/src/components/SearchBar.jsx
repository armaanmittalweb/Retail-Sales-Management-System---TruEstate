import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <label className="field-label" htmlFor="search-input">
        Search
      </label>
      <input
        id="search-input"
        type="text"
        placeholder="Search by customer name or phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
