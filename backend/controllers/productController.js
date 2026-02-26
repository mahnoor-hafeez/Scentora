import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const images = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const product = await Product.create({
      ...req.body,
      sellerId: req.user._id,
      images,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this product.' });
    }
    const newImages = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const images = newImages.length ? [...(product.images || []), ...newImages] : product.images;
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update product.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product.' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete product.' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category, subCategory, fragranceType, minPrice, maxPrice, sort, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (fragranceType) filter.fragranceType = fragranceType;
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) filter.price.$gte = Number(minPrice);
      if (maxPrice != null) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];

    let query = Product.find(filter).populate('sellerId', 'name email');
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query.lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch products.' });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch product.' });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch products.' });
  }
};
