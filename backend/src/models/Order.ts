import mongoose from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface IOrder {
  id: string;
  orderId: string;
  customer: ICustomerInfo;
  items: ICartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
  updatedAt: string;
}

const CartItemSchema = new mongoose.Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
}, { _id: false });

const CustomerInfoSchema = new mongoose.Schema<ICustomerInfo>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  notes: { type: String, trim: true },
}, { _id: false });

const OrderSchema = new mongoose.Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true },
  customer: { type: CustomerInfoSchema, required: true },
  items: { type: [CartItemSchema], required: true },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'card'], required: true },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed'], default: 'pending' },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
