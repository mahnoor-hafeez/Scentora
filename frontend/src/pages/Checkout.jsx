import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/ordersSlice';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { loading: orderLoading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => {
    const p = item.productId;
    if (!p) return sum;
    return sum + (p.price || 0) * (item.quantity || 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createOrder({
      shippingAddress: { address, city, postalCode, country },
    }));
    if (createOrder.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  if (items.length === 0 && !orderLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-scentora-stone">
        Your cart is empty. <a href="/products" className="underline">Shop now</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-scentora-blush rounded-lg px-4 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-scentora-blush rounded-lg px-4 py-2"
            required
          />
        </div>
        <p className="text-lg font-medium text-scentora-noir pt-4">Order total: ${total.toFixed(2)}</p>
        <button
          type="submit"
          disabled={orderLoading}
          className="w-full bg-scentora-stone text-white py-3 rounded-lg font-medium hover:bg-scentora-noir disabled:opacity-50 transition"
        >
          {orderLoading ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
