import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Header() {
  const { user, token } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items?.length ?? 0);
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-scentora-blush/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-2xl font-semibold text-scentora-stone hover:text-scentora-noir transition">
          Scentora
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-scentora-noir/80 hover:text-scentora-stone font-medium">Home</Link>
          <Link to="/products" className="text-scentora-noir/80 hover:text-scentora-stone font-medium">Shop</Link>
          {token && user?.role === 'Customer' && (
            <>
              <Link to="/cart" className="relative text-scentora-noir/80 hover:text-scentora-stone font-medium">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-scentora-rose text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/dashboard" className="text-scentora-noir/80 hover:text-scentora-stone font-medium">Orders</Link>
            </>
          )}
          {token && user?.role === 'Seller' && (
            <Link to="/seller/dashboard" className="text-scentora-noir/80 hover:text-scentora-stone font-medium">Seller</Link>
          )}
          {token && user?.role === 'Admin' && (
            <Link to="/admin/dashboard" className="text-scentora-noir/80 hover:text-scentora-stone font-medium">Admin</Link>
          )}
          {!token ? (
            <>
              <Link to="/login" className="text-scentora-noir/80 hover:text-scentora-stone font-medium">Login</Link>
              <Link to="/register" className="bg-scentora-stone text-white px-4 py-2 rounded-lg font-medium hover:bg-scentora-noir transition">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => dispatch(logout())}
              className="text-scentora-noir/80 hover:text-scentora-rose font-medium"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
