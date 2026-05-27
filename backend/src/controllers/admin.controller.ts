import { Request, Response } from 'express';
import validator from 'validator';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AuthenticatedRequest } from '../middleware/auth';
import { SocketService } from '../lib/socket';

export async function getAdminOrders(_req: Request, res: Response): Promise<void> {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(o => o.toJSON()));
  } catch {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
}

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'completed'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status value.' });
    return;
  }

  try {
    const order = await Order.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { orderId: req.params.id }] },
      { status, updatedAt: new Date().toISOString() },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    const orderJson = order.toJSON() as any;
    // Emit to admin + customer tracking room
    SocketService.emitOrderUpdated(orderJson);

    res.json(orderJson);
  } catch {
    res.status(500).json({ error: 'Failed to update order.' });
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const order = await Order.findOneAndDelete({
      $or: [{ id: req.params.id }, { orderId: req.params.id }],
    });
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    SocketService.emitOrderDeleted(req.params.id);
    res.json({ message: 'Order deleted.' });
  } catch {
    res.status(500).json({ error: 'Failed to delete order.' });
  }
}

export async function getStats(_req: Request, res: Response): Promise<void> {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const preparing = orders.filter(o => o.status === 'preparing').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const revenue = orders
      .filter(o => o.status !== 'pending')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({ totalOrders, pending, preparing, ready, completed, revenue });
  } catch {
    res.status(500).json({ error: 'Failed to compute stats.' });
  }
}

export async function createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { name, description, price, category, image, ingredients, tastingNotes, featured, inStock } = req.body;
  if (!name?.trim() || price === undefined || !category || !image?.trim()) {
    res.status(400).json({ error: 'Name, price, category, and image are required.' });
    return;
  }

  try {
    const id = 'p_' + Math.random().toString(36).substring(2, 11);
    const product = await Product.create({
      id,
      name: validator.escape(name.trim()),
      description: description ? validator.escape(description.trim()) : '',
      price: Number(price),
      category,
      image: image.trim(),
      ingredients: Array.isArray(ingredients) ? ingredients.map((i: string) => i.trim()) : [],
      tastingNotes: Array.isArray(tastingNotes) ? tastingNotes.map((n: string) => n.trim()) : [],
      featured: !!featured,
      inStock: inStock !== undefined ? !!inStock : true,
    });
    res.status(201).json(product.toJSON());
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Product creation failed.' });
  }
}

export async function updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { name, description, price, category, image, ingredients, tastingNotes, featured, inStock } = req.body;
  try {
    const updateData: any = {};
    if (name !== undefined) updateData.name = validator.escape(name.trim());
    if (description !== undefined) updateData.description = validator.escape(description.trim());
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image.trim();
    if (ingredients !== undefined) updateData.ingredients = Array.isArray(ingredients) ? ingredients.map((i: string) => i.trim()) : [];
    if (tastingNotes !== undefined) updateData.tastingNotes = Array.isArray(tastingNotes) ? tastingNotes.map((n: string) => n.trim()) : [];
    if (featured !== undefined) updateData.featured = !!featured;
    if (inStock !== undefined) updateData.inStock = !!inStock;

    const product = await Product.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json(product.toJSON());
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Product update failed.' });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json({ message: 'Product deleted.' });
  } catch {
    res.status(500).json({ error: 'Product deletion failed.' });
  }
}
