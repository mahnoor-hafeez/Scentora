import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../redux/slices/productsSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { getImageUrl } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, loading } = useSelector((s) => s.products);
  const { user, token } = useSelector((s) => s.auth);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!token || user?.role !== 'Customer') {
      navigate('/login');
      return;
    }
    await dispatch(addToCart({ productId: id, quantity }));
    setAdded(true);
  };

  if (loading || !current) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-scentora-stone">
        {loading ? 'Loading...' : 'Product not found.'}
      </div>
    );
  }

  const imgSrc = current.images?.[0];
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-2xl overflow-hidden bg-scentora-blush">
          {imgSrc ? (
            <img src={getImageUrl(imgSrc)} alt={current.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-scentora-rose/50 text-8xl">🌸</div>
          )}
        </div>
        <div>
          <p className="text-scentora-stone text-sm uppercase tracking-wide">{current.category} · {current.subCategory}</p>
          <h1 className="font-serif text-3xl text-scentora-noir mt-1">{current.title}</h1>
          <p className="text-scentora-stone mt-2">{current.fragranceType}</p>
          <p className="text-2xl font-medium text-scentora-stone mt-4">${current.price?.toFixed(2)}</p>
          <p className="text-scentora-noir/80 mt-4">{current.description}</p>
          <p className="text-sm text-scentora-stone mt-2">Stock: {current.stock}</p>
          {user?.role === 'Customer' && (
            <div className="mt-6 flex items-center gap-4">
              <input
                type="number"
                min={1}
                max={current.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 border border-scentora-blush rounded-lg px-3 py-2"
              />
              <button
                onClick={handleAddToCart}
                disabled={current.stock < 1 || added}
                className="bg-scentora-stone text-white px-6 py-2 rounded-lg font-medium hover:bg-scentora-noir disabled:opacity-50 transition"
              >
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
