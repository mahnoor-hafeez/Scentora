import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-scentora-noir text-scentora-sand/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-serif text-xl text-white">Scentora</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-scentora-rose transition">Home</Link>
            <Link to="/products" className="hover:text-scentora-rose transition">Shop</Link>
          </div>
        </div>
        <p className="text-center text-scentora-sand/70 text-sm mt-6">
          © {new Date().getFullYear()} Scentora – Smart Multi-Vendor Online Fragrance Marketplace
        </p>
      </div>
    </footer>
  );
}
