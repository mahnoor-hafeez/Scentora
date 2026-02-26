import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';
import { CATEGORIES, SUB_CATEGORIES, FRAGRANCE_TYPES } from '../utils/constants';
import { getImageUrl } from '../services/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: searchParams.get('subCategory') || '',
    fragranceType: searchParams.get('fragranceType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });

  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.products);

  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.subCategory) params.subCategory = filters.subCategory;
    if (filters.fragranceType) params.fragranceType = filters.fragranceType;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;
    setSearchParams(params, { replace: true });
    dispatch(fetchProducts(params));
  }, [filters.category, filters.subCategory, filters.fragranceType, filters.minPrice, filters.maxPrice, filters.sort, filters.search]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fragranceOptions = filters.category && filters.subCategory
    ? (FRAGRANCE_TYPES[filters.category]?.[filters.subCategory] || [])
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-6">Shop Fragrances</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0 space-y-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleFilter('search', e.target.value)}
            className="w-full border border-scentora-blush rounded-lg px-4 py-2"
          />
          <select
            value={filters.category}
            onChange={(e) => {
              handleFilter('category', e.target.value);
              handleFilter('subCategory', '');
              handleFilter('fragranceType', '');
            }}
            className="w-full border border-scentora-blush rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filters.subCategory}
            onChange={(e) => {
              handleFilter('subCategory', e.target.value);
              handleFilter('fragranceType', '');
            }}
            className="w-full border border-scentora-blush rounded-lg px-4 py-2"
          >
            <option value="">All Types</option>
            {SUB_CATEGORIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {fragranceOptions.length > 0 && (
            <select
              value={filters.fragranceType}
              onChange={(e) => handleFilter('fragranceType', e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2"
            >
              <option value="">All Scents</option>
              {fragranceOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={(e) => handleFilter('minPrice', e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={(e) => handleFilter('maxPrice', e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2"
            />
          </div>
          <select
            value={filters.sort}
            onChange={(e) => handleFilter('sort', e.target.value)}
            className="w-full border border-scentora-blush rounded-lg px-4 py-2"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12 text-scentora-stone">Loading...</div>
          ) : list.length === 0 ? (
            <div className="text-center py-12 text-scentora-stone">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="group block rounded-xl overflow-hidden border border-scentora-blush hover:shadow-lg transition"
                >
                  <div className="aspect-square bg-scentora-blush flex items-center justify-center overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={getImageUrl(p.images[0])} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <span className="text-scentora-rose/50 text-4xl">🌸</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-scentora-noir truncate">{p.title}</p>
                    <p className="text-scentora-stone text-sm">{p.fragranceType}</p>
                    <p className="text-scentora-stone font-medium">${p.price?.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
