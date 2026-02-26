import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import { getImageUrl } from '../services/api';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => {
    const p = item.productId;
    if (!p) return sum;
    return sum + (p.price || 0) * (item.quantity || 0);
  }, 0);

  if (loading && items.length === 0) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-scentora-stone">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-scentora-stone mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-scentora-stone font-medium hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => {
          const p = item.productId;
          if (!p) return null;
          return (
            <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-scentora-blush bg-white">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-scentora-blush flex-shrink-0">
                {p.images?.[0] ? (
                  <img src={getImageUrl(p.images[0])} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${p._id}`} className="font-medium text-scentora-noir hover:underline">{p.title}</Link>
                <p className="text-scentora-stone text-sm">${p.price?.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={p.stock}
                  value={item.quantity}
                  onChange={(e) => dispatch(updateCartItem({ itemId: item._id, quantity: Number(e.target.value) }))}
                  className="w-14 border border-scentora-blush rounded px-2 py-1 text-center"
                />
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="font-medium text-scentora-stone w-20 text-right">
                ${((p.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <Link to="/products" className="text-scentora-stone font-medium hover:underline">Continue shopping</Link>
        <div className="text-right">
          <p className="text-lg font-medium text-scentora-noir">Total: ${total.toFixed(2)}</p>
          <Link
            to="/checkout"
            className="inline-block mt-2 bg-scentora-stone text-white px-6 py-2 rounded-lg font-medium hover:bg-scentora-noir transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
