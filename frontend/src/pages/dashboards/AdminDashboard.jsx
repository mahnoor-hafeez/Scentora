import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getAnalytics().then((r) => r.data),
      adminAPI.getPendingSellers().then((r) => r.data),
      adminAPI.getUsers().then((r) => r.data),
      adminAPI.getOrders().then((r) => r.data),
    ])
      .then(([a, s, u, o]) => {
        setAnalytics(a);
        setPendingSellers(s);
        setUsers(u);
        setOrders(o);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await adminAPI.approveSeller(id);
    setPendingSellers((prev) => prev.filter((x) => x._id !== id));
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-12 text-scentora-stone">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">Total Users</p>
          <p className="text-2xl font-semibold text-scentora-noir">{analytics?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">Sellers</p>
          <p className="text-2xl font-semibold text-scentora-noir">{analytics?.totalSellers ?? 0}</p>
        </div>
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">Products</p>
          <p className="text-2xl font-semibold text-scentora-noir">{analytics?.totalProducts ?? 0}</p>
        </div>
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">Orders</p>
          <p className="text-2xl font-semibold text-scentora-noir">{analytics?.totalOrders ?? 0}</p>
        </div>
        <div className="bg-scentora-blush/50 rounded-xl p-4">
          <p className="text-scentora-stone text-sm">Revenue</p>
          <p className="text-2xl font-semibold text-scentora-noir">${(analytics?.totalRevenue ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {pendingSellers?.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl text-scentora-stone mb-4">Pending Seller Approvals</h2>
          <div className="border border-scentora-blush rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-scentora-blush/50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingSellers.map((s) => (
                  <tr key={s._id} className="border-t border-scentora-blush">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleApprove(s._id)}
                        className="bg-scentora-stone text-white px-3 py-1 rounded text-sm hover:bg-scentora-noir"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-serif text-xl text-scentora-stone mb-4">Recent Orders</h2>
        <div className="border border-scentora-blush rounded-xl overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-scentora-blush/50">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).slice(0, 10).map((o) => (
                <tr key={o._id} className="border-t border-scentora-blush">
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3 text-right">${o.totalAmount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
