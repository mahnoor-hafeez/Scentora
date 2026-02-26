import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, fetchProduct } from '../../redux/slices/productsSlice';
import { CATEGORIES, SUB_CATEGORIES, FRAGRANCE_TYPES } from '../../utils/constants';

export default function SellerProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current } = useSelector((s) => s.products);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: 'Men',
    subCategory: 'Perfumes',
    fragranceType: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProduct(id));
    }
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        title: current.title || '',
        description: current.description || '',
        price: current.price ?? '',
        stock: current.stock ?? '',
        category: current.category || 'Men',
        subCategory: current.subCategory || 'Perfumes',
        fragranceType: current.fragranceType || '',
      });
    }
  }, [isEdit, current]);

  const fragranceOptions = FRAGRANCE_TYPES[form.category]?.[form.subCategory] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'category' || name === 'subCategory') setForm((prev) => ({ ...prev, fragranceType: '' }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', Number(form.price));
    formData.append('stock', Number(form.stock));
    formData.append('category', form.category);
    formData.append('subCategory', form.subCategory);
    formData.append('fragranceType', form.fragranceType);
    images.forEach((file) => formData.append('images', file));

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, formData })).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-scentora-stone mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border border-scentora-blush rounded-lg px-4 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-scentora-blush rounded-lg px-4 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Price ($)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} min={0} step={0.01} className="w-full border border-scentora-blush rounded-lg px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-scentora-noir mb-1">Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} min={0} className="w-full border border-scentora-blush rounded-lg px-4 py-2" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border border-scentora-blush rounded-lg px-4 py-2">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Subcategory</label>
          <select name="subCategory" value={form.subCategory} onChange={handleChange} className="w-full border border-scentora-blush rounded-lg px-4 py-2">
            {SUB_CATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Fragrance Type</label>
          <select name="fragranceType" value={form.fragranceType} onChange={handleChange} className="w-full border border-scentora-blush rounded-lg px-4 py-2" required>
            <option value="">Select</option>
            {fragranceOptions.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-scentora-noir mb-1">Images (max 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full border border-scentora-blush rounded-lg px-4 py-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-scentora-stone text-white py-2 rounded-lg font-medium hover:bg-scentora-noir disabled:opacity-50">
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
