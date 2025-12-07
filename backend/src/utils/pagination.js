function paginate(data, page, pageSize) {
  const total = data.length;
  const size = pageSize > 0 ? pageSize : 10;

  if (total === 0) {
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: size,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    };
  }

  const totalPages = Math.ceil(total / size);
  let current = page || 1;
  if (current < 1) current = 1;
  if (current > totalPages) current = totalPages;

  const start = (current - 1) * size;
  const end = start + size;

  return {
    data: data.slice(start, end),
    total,
    page: current,
    pageSize: size,
    totalPages,
    hasNext: current < totalPages,
    hasPrev: current > 1,
  };
}

module.exports = { paginate };
