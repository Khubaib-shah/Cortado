import { Request, Response } from 'express';
import validator from 'validator';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AuthenticatedRequest } from '../middleware/auth';
import { SocketService } from '../lib/socket';

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { customer, items, paymentMethod } = req.body;

  if (!customer || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Cannot submit: cart is empty.' });
    return;
  }

  const { name, email, phone, address, city } = customer;
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim() || !city?.trim()) {
    res.status(400).json({ error: 'All delivery details are required.' });
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }

  try {
    // Server-side price recalculation — never trust client prices
    let subtotal = 0;
    for (const item of items) {
      const prod = await Product.findOne({ id: item.productId });
      if (!prod) {
        res.status(400).json({ error: `Product "${item.productId}" does not exist.` });
        return;
      }
      if (!prod.inStock) {
        res.status(400).json({ error: `"${prod.name}" is currently out of stock.` });
        return;
      }
      subtotal += prod.price * Math.max(1, Math.floor(item.quantity));
    }

    const deliveryFee = 150;
    const total = subtotal + deliveryFee;
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${orderNum}`;
    const id = 'o_' + Math.random().toString(36).substr(2, 9);

    const order = await Order.create({
      id,
      orderId,
      customer: {
        name: validator.escape(name.trim()),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: validator.escape(address.trim()),
        city: city.trim(),
        notes: customer.notes ? validator.escape(customer.notes.trim()) : undefined,
      },
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price, // stored for historical display only, subtotal recalculated above
        quantity: Math.max(1, Math.floor(item.quantity)),
        image: item.image,
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const orderJson = order.toJSON() as any;

    // Emit real-time event to admin dashboard
    SocketService.emitNewOrder(orderJson);

    res.status(201).json(orderJson);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Order creation failed.' });
  }
}

export async function getUserOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // Use exact string match to prevent ReDoS — fixes Security Issue #1
    const userOrders = await Order.find({
      'customer.email': req.user!.email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(userOrders.map(o => o.toJSON()));
  } catch {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
}

export async function trackOrder(req: Request, res: Response): Promise<void> {
  const orderId = req.query.orderId?.toString().trim();
  if (!orderId) {
    res.status(400).json({ error: 'Order ID is required.' });
    return;
  }

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      res.status(404).json({ error: 'No order found with that tracking code.' });
      return;
    }
    res.json(order.toJSON());
  } catch {
    res.status(500).json({ error: 'Failed to retrieve order.' });
  }
}
