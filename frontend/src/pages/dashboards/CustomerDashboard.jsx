import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/slices/ordersSlice';
export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-6">My Orders</h1>
      {loading && list.length === 0 ? (
        <p className="text-scentora-stone">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-scentora-stone">You have no orders yet. <Link to="/products" className="text-scentora-stone font-medium underline">Start shopping</Link></p>
      ) : (
        <div className="space-y-4">
          {list.map((order) => (
            <div key={order._id} className="border border-scentora-blush rounded-xl p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-scentora-stone">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-scentora-blush text-scentora-stone'
                }`}>
                  {order.status}
                </span>
              </div>
              <ul className="space-y-1">
                {order.items?.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{item.productId?.title} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="font-medium text-scentora-noir mt-2">Total: ${order.totalAmount?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
