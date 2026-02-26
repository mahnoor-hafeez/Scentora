import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty.' });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;
      if (!product) continue;
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}.` });
      }
      const price = product.price * item.quantity;
      totalAmount += price;
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        sellerId: product.sellerId,
      });
    }

    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || {},
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
    }
    cart.items = [];
    await cart.save();

    await order.populate('items.productId');
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create order.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch orders.' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId').populate('customerId', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    const isCustomer = order.customerId._id.toString() === req.user._id.toString();
    const isSeller = order.items.some((i) => i.sellerId.toString() === req.user._id.toString());
    if (!isCustomer && !isSeller && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view this order.' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch order.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    const isSeller = order.items.some((i) => i.sellerId.toString() === req.user._id.toString());
    if (req.user.role !== 'Admin' && !isSeller) {
      return res.status(403).json({ message: 'Not authorized to update this order.' });
    }

    order.status = status;
    await order.save();
    await order.populate('items.productId');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update order.' });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.user._id })
      .populate('items.productId')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch orders.' });
  }
};
