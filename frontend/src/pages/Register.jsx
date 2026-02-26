import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register({ name, email, password, role }));
    if (register.fulfilled.match(result)) {
      navigate(role === 'Seller' ? '/' : '/');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-scentora-stone text-center mb-6">Join Scentora</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-scentora-blush p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2 focus:ring-2 focus:ring-scentora-rose focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2 focus:ring-2 focus:ring-scentora-rose focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Password (min 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2 focus:ring-2 focus:ring-scentora-rose focus:border-transparent"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2 focus:ring-2 focus:ring-scentora-rose focus:border-transparent"
            >
              <option value="Customer">Customer</option>
              <option value="Seller">Seller</option>
            </select>
            {role === 'Seller' && (
              <p className="text-xs text-scentora-stone mt-1">Seller accounts require admin approval before you can list products.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-scentora-stone text-white py-2 rounded-lg font-medium hover:bg-scentora-noir disabled:opacity-50 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4 text-scentora-noir/80">
          Already have an account? <Link to="/login" className="text-scentora-stone font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
