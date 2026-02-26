import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'Seller', isApproved: false }).select('-password');
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch sellers.' });
  }
};

export const approveSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true }).select('-password');
    if (!user || user.role !== 'Seller') return res.status(404).json({ message: 'Seller not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to approve seller.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch users.' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'Seller', isApproved: true });
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch analytics.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch orders.' });
  }
};
