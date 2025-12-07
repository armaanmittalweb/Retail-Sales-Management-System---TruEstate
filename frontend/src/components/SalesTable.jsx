import React from 'react';

const SalesTable = ({ rows }) => {
  return (
    <div className="table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Final Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.customerId}-${row.productId}-${idx}`}>
              <td>{row.date}</td>
              <td>{row.customerName}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.customerRegion}</td>
              <td>{row.productName}</td>
              <td>{row.productCategory}</td>
              <td>{row.quantity}</td>
              <td>
                {typeof row.finalAmount === 'number'
                  ? row.finalAmount.toFixed(2)
                  : row.finalAmount}
              </td>
              <td>{row.paymentMethod}</td>
              <td>{row.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
