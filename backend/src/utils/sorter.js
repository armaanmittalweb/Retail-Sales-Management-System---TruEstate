function applySorting(data, { sortBy, sortDir }) {
  const dir = sortDir === 'asc' ? 1 : -1;
  const sorted = [...data];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'quantity': {
        const aq = a.quantity || 0;
        const bq = b.quantity || 0;
        if (aq === bq) return 0;
        return aq > bq ? dir : -dir;
      }
      case 'customerName': {
        const an = (a.customerName || '').toLowerCase();
        const bn = (b.customerName || '').toLowerCase();
        if (an === bn) return 0;
        return an > bn ? dir : -dir;
      }
      case 'date':
      default: {
        const at = a.date instanceof Date ? a.date.getTime() : 0;
        const bt = b.date instanceof Date ? b.date.getTime() : 0;
        if (at === bt) return 0;
        return at > bt ? dir : -dir;
      }
    }
  });

  return sorted;
}

module.exports = { applySorting };
