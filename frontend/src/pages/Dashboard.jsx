import React, { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import SortDropdown from '../components/SortDropdown.jsx';
import SalesTable from '../components/SalesTable.jsx';
import PaginationControls from '../components/PaginationControls.jsx';
import { fetchSales, fetchFilterOptions } from '../services/api.js';

const PAGE_SIZE = 10;

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [regions, setRegions] = useState([]);
  const [genders, setGenders] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const [page, setPage] = useState(1);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    productCategories: [],
    tags: [],
    paymentMethods: [],
  });

  // Load filter options once
  useEffect(() => {
    async function loadOptions() {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error(err);
      }
    }
    loadOptions();
  }, []);

  const queryParams = useMemo(
    () => ({
      search: search || undefined,
      region: regions.join(',') || undefined,
      gender: genders.join(',') || undefined,
      productCategory: productCategories.join(',') || undefined,
      tags: tags.join(',') || undefined,
      paymentMethod: paymentMethods.join(',') || undefined,
      ageMin: ageRange.min || undefined,
      ageMax: ageRange.max || undefined,
      dateFrom: dateRange.from || undefined,
      dateTo: dateRange.to || undefined,
      sortBy,
      sortDir,
      page,
      pageSize: PAGE_SIZE,
    }),
    [
      search,
      regions,
      genders,
      productCategories,
      tags,
      paymentMethods,
      ageRange,
      dateRange,
      sortBy,
      sortDir,
      page,
    ]
  );

  // Load sales whenever query changes
  useEffect(() => {
    async function loadSales() {
      setLoading(true);
      setError('');
      try {
        const result = await fetchSales(queryParams);
        setData(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error(err);
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, [queryParams]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'regions':
        setRegions(value);
        break;
      case 'genders':
        setGenders(value);
        break;
      case 'productCategories':
        setProductCategories(value);
        break;
      case 'tags':
        setTags(value);
        break;
      case 'paymentMethods':
        setPaymentMethods(value);
        break;
      case 'ageRange':
        setAgeRange(value);
        break;
      case 'dateRange':
        setDateRange(value);
        break;
      default:
        break;
    }
    setPage(1);
  };

  const handleSortChange = (newSortBy, newSortDir) => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Retail Sales Management</h1>
        <p className="app-subtitle">
          Search, filter, sort, and paginate your retail transactions.
        </p>
      </header>

      <main className="layout">
        <aside className="layout-sidebar">
          <SearchBar value={search} onChange={handleSearchChange} />
          <FilterPanel
            options={filterOptions}
            activeFilters={{
              regions,
              genders,
              productCategories,
              tags,
              paymentMethods,
              ageRange,
              dateRange,
            }}
            onChange={handleFilterChange}
          />
        </aside>

        <section className="layout-main">
          <div className="toolbar">
            <div>
              <span className="toolbar-label">Total records:</span>{' '}
              <strong>{total}</strong>
            </div>
            <SortDropdown sortBy={sortBy} sortDir={sortDir} onChange={handleSortChange} />
          </div>

          {loading && <div className="status">Loading...</div>}
          {error && !loading && <div className="status error">{error}</div>}
          {!loading && !error && data.length === 0 && (
            <div className="status">No results found. Try adjusting filters.</div>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              <SalesTable rows={data} />
              <PaginationControls
                page={page}
                totalPages={totalPages}
                totalItems={total}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
