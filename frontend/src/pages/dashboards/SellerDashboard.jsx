import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProducts } from '../../redux/slices/productsSlice';
import { fetchSellerOrders } from '../../redux/slices/ordersSlice';
import { updateOrderStatus } from '../../redux/slices/ordersSlice';
import { deleteProduct } from '../../redux/slices/productsSlice';
import { ORDER_STATUSES } from '../../utils/constants';
import { getImageUrl } from '../../services/api';

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { myProducts } = useSelector((s) => s.products);
  const { list: orders } = useSelector((s) => s.orders);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProducts()).then(() => setProductsLoaded(true));
    dispatch(fetchSellerOrders()).then(() => setOrdersLoaded(true));
  }, [dispatch]);

  const myOrderItems = orders.flatMap((o) =>
    (o.items || []).filter((i) => i.sellerId?.toString() === user?._id?.toString()).map((i) => ({ ...i, orderId: o._id, orderStatus: o.status, customerId: o.customerId }))
  );
  const revenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.items || []).filter((i) => i.sellerId?.toString() === user?._id?.toString()).reduce((s, i) => s + i.price * i.quantity, 0), 0);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-2">Seller Dashboard</h1>
      {user?.isApproved === false && (
        <p className="text-amber-700 bg-amber-50 px-4 py-2 rounded-lg mb-6">Your seller account is pending approval. You cannot add products until approved.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">Total Revenue</p>
          <p className="text-2xl font-semibold text-scentora-noir">${revenue.toFixed(2)}</p>
        </div>
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">My Products</p>
          <p className="text-2xl font-semibold text-scentora-noir">{myProducts?.length ?? 0}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl text-scentora-stone">My Products</h2>
          {user?.isApproved && (
            <Link to="/seller/products/new" className="bg-scentora-stone text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-scentora-noir">
              Add Product
            </Link>
          )}
        </div>
        {!productsLoaded ? (
          <p className="text-scentora-stone">Loading...</p>
        ) : myProducts?.length === 0 ? (
          <p className="text-scentora-stone">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {myProducts?.map((p) => (
              <div key={p._id} className="border border-scentora-blush rounded-xl overflow-hidden bg-white">
                <div className="aspect-square bg-scentora-blush">
                  {p.images?.[0] ? (
                    <img src={getImageUrl(p.images[0])} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🌸</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  <p className="text-scentora-stone text-sm">${p.price?.toFixed(2)} · Stock: {p.stock}</p>
                  <div className="flex gap-1 mt-1">
                    <Link to={`/seller/products/${p._id}/edit`} className="text-xs text-scentora-stone hover:underline">Edit</Link>
                    <button onClick={() => dispatch(deleteProduct(p._id))} className="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-xl text-scentora-stone mb-4">Orders (my items)</h2>
        {!ordersLoaded ? (
          <p className="text-scentora-stone">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-scentora-stone">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const myItems = order.items?.filter((i) => i.sellerId?.toString() === user?._id?.toString()) || [];
              if (myItems.length === 0) return null;
              return (
                <div key={order._id} className="border border-scentora-blush rounded-xl p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-scentora-stone">Order #{order._id.slice(-6)} · {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="px-2 py-1 rounded text-sm bg-scentora-blush text-scentora-stone">{order.status}</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {myItems.map((item, i) => (
                      <li key={i}>{item.productId?.title} × {item.quantity}</li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ORDER_STATUSES.filter((s) => s !== order.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order._id, status)}
                        className="text-xs bg-scentora-blush hover:bg-scentora-rose/30 px-2 py-1 rounded"
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
