import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import SellerDashboard from './pages/dashboards/SellerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import SellerProductForm from './pages/seller/SellerProductForm';

function PrivateRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((s) => s.auth);
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { token } = useSelector((s) => s.auth);
  if (token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/cart" element={<PrivateRoute allowedRoles={['Customer']}><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute allowedRoles={['Customer']}><Checkout /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
        <Route path="/seller/dashboard" element={<PrivateRoute allowedRoles={['Seller']}><SellerDashboard /></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['Admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/seller/products/new" element={<PrivateRoute allowedRoles={['Seller']}><SellerProductForm /></PrivateRoute>} />
        <Route path="/seller/products/:id/edit" element={<PrivateRoute allowedRoles={['Seller']}><SellerProductForm /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
