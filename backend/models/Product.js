import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    category: { type: String, required: true, enum: ['Men', 'Women'] },
    subCategory: { type: String, required: true, enum: ['Perfumes', 'Body Mists'] },
    fragranceType: { type: String, required: true }, // EDP, EDT, Floral, Woody, Citrus, etc.
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
