import { Request, Response } from 'express';
import { Product } from '../models/Product';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const productsDb = await Product.find();
    let products = productsDb.map(p => p.toJSON() as any);

    const { category, search, sort } = req.query;

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toString().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tastingNotes && p.tastingNotes.some((n: string) => n.toLowerCase().includes(q)))
      );
    }

    if (sort === 'price-low') {
      products.sort((a: any, b: any) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a: any, b: any) => b.price - a.price);
    } else if (sort === 'popular') {
      products = products.filter((p: any) => p.featured).concat(products.filter((p: any) => !p.featured));
    }

    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json(product.toJSON());
  } catch {
    res.status(500).json({ error: 'Failed to retrieve product.' });
  }
}
