import React from 'react';

const PaginationControls = ({ page, totalPages, totalItems, pageSize, onPageChange }) => {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {from}–{to} of {totalItems}
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePrev} disabled={page <= 1}>
          Previous
        </button>
        <span className="pagination-page">
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages || totalPages === 0}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
