function applyFilters(data, filters) {
  const {
    regions,
    genders,
    productCategories,
    tags,
    paymentMethods,
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    search,
  } = filters;

  const searchLower = search ? search.toLowerCase() : '';

  return data.filter((item) => {
    if (searchLower) {
      const name = (item.customerName || '').toLowerCase();
      const phone = (item.phoneNumber || '').toLowerCase();
      if (!name.includes(searchLower) && !phone.includes(searchLower)) {
        return false;
      }
    }

    if (regions && regions.length > 0) {
      if (!item.customerRegion || !regions.includes(item.customerRegion)) {
        return false;
      }
    }

    if (genders && genders.length > 0) {
      if (!item.gender || !genders.includes(item.gender)) {
        return false;
      }
    }

    if (productCategories && productCategories.length > 0) {
      if (!item.productCategory || !productCategories.includes(item.productCategory)) {
        return false;
      }
    }

    if (paymentMethods && paymentMethods.length > 0) {
      if (!item.paymentMethod || !paymentMethods.includes(item.paymentMethod)) {
        return false;
      }
    }

    if (tags && tags.length > 0) {
      const itemTags = Array.isArray(item.tags) ? item.tags : [];
      const hasAny = itemTags.some((t) => tags.includes(t));
      if (!hasAny) return false;
    }

    if (ageMin !== null && typeof item.age === 'number' && item.age < ageMin) {
      return false;
    }
    if (ageMax !== null && typeof item.age === 'number' && item.age > ageMax) {
      return false;
    }

    if (dateFrom && item.date instanceof Date) {
      if (item.date.getTime() < dateFrom.getTime()) return false;
    }
    if (dateTo && item.date instanceof Date) {
      if (item.date.getTime() > dateTo.getTime()) return false;
    }

    return true;
  });
}

module.exports = { applyFilters };
