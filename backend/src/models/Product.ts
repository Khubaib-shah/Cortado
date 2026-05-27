import mongoose from 'mongoose';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'espresso' | 'cold-brew' | 'pastries' | 'seasonal';
  image: string;
  ingredients: string[];
  tastingNotes: string[];
  featured: boolean;
  inStock: boolean;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, default: '', maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['coffee', 'espresso', 'cold-brew', 'pastries', 'seasonal'] },
  image: { type: String, required: true },
  ingredients: { type: [String], default: [] },
  tastingNotes: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
});

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
