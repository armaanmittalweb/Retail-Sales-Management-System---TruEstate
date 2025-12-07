const fs = require('fs');
const csv = require('csv-parser');

function normalizeHeader(header) {
  if (!header) return header;
  const h = header.trim().toLowerCase();

  if (h.includes('customer id')) return 'customerId';
  if (h.includes('customer name')) return 'customerName';
  if (h.includes('phone')) return 'phoneNumber';
  if (h.includes('gender')) return 'gender';
  if (h === 'age' || h.includes('age')) return 'age';
  if (h.includes('customer region') || h === 'region') return 'customerRegion';
  if (h.includes('customer type')) return 'customerType';

  if (h.includes('product id')) return 'productId';
  if (h.includes('product name')) return 'productName';
  if (h === 'brand' || h.includes('brand')) return 'brand';
  if (h.includes('product category') || h === 'category') return 'productCategory';
  if (h === 'tags' || h.includes('tag')) return 'tags';

  if (h === 'quantity' || h.includes('qty')) return 'quantity';
  if (h.includes('price per unit')) return 'pricePerUnit';
  if (h.includes('discount')) return 'discountPercentage';
  if (h.includes('total amount')) return 'totalAmount';
  if (h.includes('final amount')) return 'finalAmount';

  if (h === 'date' || h.includes('date')) return 'date';
  if (h.includes('payment')) return 'paymentMethod';
  if (h.includes('order status')) return 'orderStatus';
  if (h.includes('delivery type')) return 'deliveryType';
  if (h.includes('store id')) return 'storeId';
  if (h.includes('store location') || h.includes('location')) return 'storeLocation';
  if (h.includes('salesperson id')) return 'salespersonId';
  if (h.includes('employee name')) return 'employeeName';

  // Fallback: strip spaces and camel-ish case
  return header.replace(/\s+/g, '').replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function loadSalesData(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => normalizeHeader(header) }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = { loadSalesData };
