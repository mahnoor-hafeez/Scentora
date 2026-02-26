import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-scentora-stone text-center mb-6">Login to Scentora</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-scentora-blush p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}
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
            <label className="block text-sm font-medium text-scentora-noir mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-scentora-blush rounded-lg px-4 py-2 focus:ring-2 focus:ring-scentora-rose focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-scentora-stone text-white py-2 rounded-lg font-medium hover:bg-scentora-noir disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-scentora-noir/80">
          Don't have an account? <Link to="/register" className="text-scentora-stone font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
