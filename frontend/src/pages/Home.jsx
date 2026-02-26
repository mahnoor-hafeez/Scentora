import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';
import { fetchCategories } from '../redux/slices/categoriesSlice';
import { getImageUrl } from '../services/api';

export default function Home() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.products);
  const categories = useSelector((s) => s.categories.list);
  const featured = list.slice(0, 8);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  /* Faded background images for Men's & Women's collection cards (fragrance-style) */
  const menBgImage = 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800';
  const womenBgImage = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800';

  return (
    <div className="min-h-screen bg-floral-pattern">
      <section className="relative bg-gradient-to-br from-scentora-blush/90 via-scentora-sand/95 to-white/90 py-20 px-4 overflow-hidden">
        {/* Subtle floral overlay on hero */}
        <div className="absolute inset-0 bg-floral-pattern opacity-40 pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-scentora-stone mb-4">
            Scentora
          </h1>
          <p className="text-scentora-noir/80 text-lg max-w-2xl mx-auto mb-8">
            Your smart multi-vendor marketplace for fragrances and body mists. Discover curated collections for him and her.
          </p>
          <Link
            to="/products"
            className="inline-block bg-scentora-stone text-white px-8 py-3 rounded-lg font-medium hover:bg-scentora-noir transition"
          >
            Shop All Fragrances
          </Link>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-scentora-stone mb-6 text-center">Shop by Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              to="/products?category=Men"
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex items-center justify-center bg-scentora-blush bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 230, 232, 0.72), rgba(232, 180, 184, 0.65)), url(${menBgImage})` }}
            >
              <span className="font-serif text-2xl sm:text-3xl text-scentora-stone group-hover:text-scentora-noir transition z-10 drop-shadow-sm">
                Men's Collection
              </span>
              <div className="absolute inset-0 bg-scentora-noir/10 group-hover:bg-scentora-noir/5 transition z-0" />
            </Link>
            <Link
              to="/products?category=Women"
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex items-center justify-center bg-scentora-blush bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 230, 232, 0.72), rgba(232, 180, 184, 0.65)), url(${womenBgImage})` }}
            >
              <span className="font-serif text-2xl sm:text-3xl text-scentora-stone group-hover:text-scentora-noir transition z-10 drop-shadow-sm">
                Women's Collection
              </span>
              <div className="absolute inset-0 bg-scentora-noir/10 group-hover:bg-scentora-noir/5 transition z-0" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-scentora-stone mb-6 text-center">Featured Fragrances</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((p) => (
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
                  <p className="text-scentora-stone font-medium">${p.price?.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/products" className="text-scentora-stone hover:text-scentora-noir font-medium">
              View all products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
