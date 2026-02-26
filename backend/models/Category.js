import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, enum: ['Men', 'Women'] },
    subCategories: [
      {
        name: { type: String, required: true }, // Perfumes, Body Mists
        fragranceTypes: [String], // EDP, EDT, Floral, Woody, etc.
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
