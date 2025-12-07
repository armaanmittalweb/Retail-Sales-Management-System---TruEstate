const { applyFilters } = require('../utils/filters');
const { applySorting } = require('../utils/sorter');
const { paginate } = require('../utils/pagination');
const { BadRequestError } = require('../utils/errors');

let salesData = [];
let filterOptions = {
  regions: [],
  genders: [],
  productCategories: [],
  tags: [],
  paymentMethods: [],
};

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toDateOrNull(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeSaleRecord(record) {
  return {
    customerId: record.customerId || '',
    customerName: record.customerName || '',
    phoneNumber: record.phoneNumber || '',
    gender: record.gender || '',
    age: record.age ? Number(record.age) : null,
    customerRegion: record.customerRegion || '',
    customerType: record.customerType || '',
    productId: record.productId || '',
    productName: record.productName || '',
    brand: record.brand || '',
    productCategory: record.productCategory || '',
    tags: record.tags
      ? String(record.tags)
          .split(/[,|]/)
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    quantity: record.quantity ? Number(record.quantity) : 0,
    pricePerUnit: record.pricePerUnit ? Number(record.pricePerUnit) : 0,
    discountPercentage: record.discountPercentage ? Number(record.discountPercentage) : 0,
    totalAmount: record.totalAmount ? Number(record.totalAmount) : 0,
    finalAmount: record.finalAmount ? Number(record.finalAmount) : 0,
    date: record.date ? new Date(record.date) : null,
    paymentMethod: record.paymentMethod || '',
    orderStatus: record.orderStatus || '',
    deliveryType: record.deliveryType || '',
    storeId: record.storeId || '',
    storeLocation: record.storeLocation || '',
    salespersonId: record.salespersonId || '',
    employeeName: record.employeeName || '',
  };
}

function buildFilterOptions(data) {
  const regions = new Set();
  const genders = new Set();
  const productCategories = new Set();
  const tags = new Set();
  const paymentMethods = new Set();

  data.forEach((item) => {
    if (item.customerRegion) regions.add(item.customerRegion);
    if (item.gender) genders.add(item.gender);
    if (item.productCategory) productCategories.add(item.productCategory);
    if (Array.isArray(item.tags)) item.tags.forEach((t) => tags.add(t));
    if (item.paymentMethod) paymentMethods.add(item.paymentMethod);
  });

  const toSortedArray = (set) => Array.from(set).sort((a, b) => a.localeCompare(b));

  return {
    regions: toSortedArray(regions),
    genders: toSortedArray(genders),
    productCategories: toSortedArray(productCategories),
    tags: toSortedArray(tags),
    paymentMethods: toSortedArray(paymentMethods),
  };
}

function initSalesService(rawRecords) {
  salesData = rawRecords.map(normalizeSaleRecord);
  filterOptions = buildFilterOptions(salesData);
  console.log(`Loaded ${salesData.length} sales records`);
}

function parseListParam(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function getSales(query = {}) {
  const page = toNumberOrNull(query.page) || 1;
  const pageSize = toNumberOrNull(query.pageSize) || 10;

  const ageMin = toNumberOrNull(query.ageMin);
  const ageMax = toNumberOrNull(query.ageMax);
  if (ageMin !== null && ageMax !== null && ageMin > ageMax) {
    throw new BadRequestError('Invalid age range: min greater than max');
  }

  const dateFrom = toDateOrNull(query.dateFrom);
  const dateTo = toDateOrNull(query.dateTo);
  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new BadRequestError('Invalid date range: from is after to');
  }

  const search = query.search ? String(query.search).trim() : '';

  const filters = {
    regions: parseListParam(query.region),
    genders: parseListParam(query.gender),
    productCategories: parseListParam(query.productCategory),
    tags: parseListParam(query.tags),
    paymentMethods: parseListParam(query.paymentMethod),
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    search,
  };

  const sortBy = query.sortBy || 'date';
  let sortDir = query.sortDir || (sortBy === 'customerName' ? 'asc' : 'desc');
  if (!['asc', 'desc'].includes(sortDir)) sortDir = 'desc';

  const filtered = applyFilters(salesData, filters);
  const sorted = applySorting(filtered, { sortBy, sortDir });
  const pageResult = paginate(sorted, page, pageSize);

  const data = pageResult.data.map((item) => ({
    ...item,
    date: item.date ? item.date.toISOString().split('T')[0] : null,
  }));

  return {
    ...pageResult,
    data,
    sortBy,
    sortDir,
    filters: { ...filters, search },
  };
}

function getFilterOptions() {
  return filterOptions;
}

module.exports = {
  initSalesService,
  getSales,
  getFilterOptions,
};
