import React from 'react';

function toggleValue(list, value) {
  if (list.includes(value)) {
    return list.filter((v) => v !== value);
  }
  return [...list, value];
}

const FilterPanel = ({ options, activeFilters, onChange }) => {
  const { regions, genders, productCategories, tags, paymentMethods, ageRange, dateRange } =
    activeFilters;

  const handleCheckboxChange = (groupKey, value) => {
    let current = [];
    if (groupKey === 'regions') current = regions;
    if (groupKey === 'genders') current = genders;
    if (groupKey === 'productCategories') current = productCategories;
    if (groupKey === 'tags') current = tags;
    if (groupKey === 'paymentMethods') current = paymentMethods;

    const updated = toggleValue(current, value);
    onChange(groupKey, updated);
  };

  const handleAgeChange = (field, raw) => {
    if (raw === '') {
      onChange('ageRange', { ...ageRange, [field]: '' });
      return;
    }
    const numeric = Number(raw);
    if (Number.isNaN(numeric) || numeric < 0) {
      onChange('ageRange', { ...ageRange, [field]: '' });
    } else {
      onChange('ageRange', { ...ageRange, [field]: numeric });
    }
  };

  const handleDateChange = (field, value) => {
    onChange('dateRange', { ...dateRange, [field]: value });
  };

  const renderCheckboxGroup = (label, groupKey, items) => (
    <div className="filter-group" key={groupKey}>
      <div className="filter-label">{label}</div>
      <div className="filter-options">
        {items.length === 0 && <span className="filter-empty">No values</span>}
        {items.map((item) => (
          <label key={item} className="filter-option">
            <input
              type="checkbox"
              checked={
                (groupKey === 'regions' && regions.includes(item)) ||
                (groupKey === 'genders' && genders.includes(item)) ||
                (groupKey === 'productCategories' && productCategories.includes(item)) ||
                (groupKey === 'tags' && tags.includes(item)) ||
                (groupKey === 'paymentMethods' && paymentMethods.includes(item))
              }
              onChange={() => handleCheckboxChange(groupKey, item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="filter-panel">
      <h2 className="filter-title">Filters</h2>

      {renderCheckboxGroup('Customer Region', 'regions', options.regions || [])}
      {renderCheckboxGroup('Gender', 'genders', options.genders || [])}
      {renderCheckboxGroup(
        'Product Category',
        'productCategories',
        options.productCategories || []
      )}
      {renderCheckboxGroup('Tags', 'tags', options.tags || [])}
      {renderCheckboxGroup(
        'Payment Method',
        'paymentMethods',
        options.paymentMethods || []
      )}

      <div className="filter-group">
        <div className="filter-label">Age Range</div>
        <div className="filter-range">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={ageRange.min}
            onChange={(e) => handleAgeChange('min', e.target.value)}
          />
          <span className="range-separator">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={ageRange.max}
            onChange={(e) => handleAgeChange('max', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Date Range</div>
        <div className="filter-range">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
          />
          <span className="range-separator">–</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
