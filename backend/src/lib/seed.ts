import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

export async function seedDatabase(): Promise<void> {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  console.log('--- Seeding Initial Database ---');

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('Admin@123', salt);

  await User.create({
    id: 'u_admin',
    name: 'Cortado Admin',
    email: 'admin@cortado.com',
    role: 'admin',
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  });

  await Product.insertMany([
    { id: 'p1', name: 'House Blend', description: 'Our signature whole bean combination of Latin American origins. Slow-roasted to draw out smooth brown sugar sweetness with rich, comforting undertones.', price: 480, category: 'coffee', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80', ingredients: ['100% Arabica Beans', 'Filtered Water'], tastingNotes: ['Milk Chocolate', 'Toasted Hazelnut', 'Marzipan'], featured: true, inStock: true },
    { id: 'p2', name: 'Single Origin Ethiopia', description: 'Vibrant and expressive heirloom coffee sourced from Kochere, Yirgacheffe. Sown at 1,900m to craft delicate floral moments and dynamic fruit profiles.', price: 620, category: 'coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80', ingredients: ['Ethiopian Heirloom Beans', 'Hot Springs Water'], tastingNotes: ['Jasmine Bloom', 'Bergamot Zest', 'White Peach'], featured: true, inStock: true },
    { id: 'p3', name: 'Decaf House Blend', description: 'Sustainably decaffeinated using the Swiss Water process. Retains 100% of the single-origin body and depth, pairing cocoa sweetness with subtle earthy notes.', price: 450, category: 'coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', ingredients: ['Swiss Water Decaf Beans', 'Filtered Water'], tastingNotes: ['Salted Caramel', 'Cocoa Powder', 'Buttery Pecan'], featured: false, inStock: true },
    { id: 'p4', name: 'Classic Espresso', description: 'A structural, highly balanced double shot pulled under 9 bars of pressure. Showcases a thick golden tiger-striped crema with dark chocolate notes.', price: 380, category: 'espresso', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80', ingredients: ['Cortado Blend', '9 Bar Pressure Extraction'], tastingNotes: ['Dark Cocoa', 'Malt Sweetness', 'Sticky Honey'], featured: true, inStock: true },
    { id: 'p5', name: 'Double Shot Macchiato', description: 'Bold double shot of our espresso custom marked with velvety, micro-foamed organic whole milk. Structured intense flavors softened by smooth cream.', price: 420, category: 'espresso', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80', ingredients: ['House Espresso', 'Micro-foamed Whole Milk'], tastingNotes: ['Intense Cacao', 'Rich Cream', 'Brown Sugar'], featured: false, inStock: true },
    { id: 'p6', name: 'Classic Cold Brew', description: 'Steeped patiently in cold mountain spring water for 18 hours. This prolonged extraction creates a smooth, low-acid experience with deep chocolaty resonance.', price: 520, category: 'cold-brew', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', ingredients: ['Coarse-Ground Signature Beans', 'Chilled Spring Water'], tastingNotes: ["Baker's Chocolate", 'Earthy Cedar', 'Dark Cherry'], featured: true, inStock: true },
    { id: 'p7', name: 'Vanilla Cold Brew', description: 'Our slow-steeped cold brew gently shaken with homemade organic Madagascar vanilla bean syrup and layered with a cloud of heavy sweet cream.', price: 580, category: 'cold-brew', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', ingredients: ['18-Hour Cold Brew', 'Madagascar Vanilla Pods', 'Sweet Heavy Cream'], tastingNotes: ['Sweet Vanilla', 'Caramel Drizzle', 'Buttery Cream'], featured: false, inStock: true },
    { id: 'p8', name: 'Butter Croissant', description: 'Artisanal French puff pastry prepared with 32 layers of churned Normand butter. Perfectly crisp, light flaking exterior yielding to a rich interior.', price: 350, category: 'pastries', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80', ingredients: ['French Wheat Flour', 'Normandy AOP Butter', 'Yeast'], tastingNotes: ['Flaky Butter', 'Warm Honey', 'Toasted Wheat'], featured: true, inStock: true },
    { id: 'p9', name: 'Almond Tart', description: 'A classic sweet pastry shell filled with decadent, hand-whipped frangipane paste, topped with thinly sliced toasted almonds and fresh dust of snow sugar.', price: 490, category: 'pastries', image: 'https://images.unsplash.com/photo-1517093728-73a4b0dca9e4?w=800&q=80', ingredients: ['Sweet Almond Paste', 'Organic Glaze', 'Pastry Flour'], tastingNotes: ['Sweet Almond', 'Rich Apricot', 'Pastry Glaze'], featured: false, inStock: true },
    { id: 'p10', name: 'Pain au Chocolat', description: 'Our signature buttery laminated pastry dough hand-rolled around two parallel batons of premium Valrhona 55% dark chocolate.', price: 410, category: 'pastries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', ingredients: ['Puff Pastry Lamination', 'Valrhona 55% Chocolate Batons'], tastingNotes: ['Warm Dark Chocolate', 'Salted Butter', 'Golden Crust'], featured: false, inStock: true },
    { id: 'p11', name: 'Lavender Latte', description: 'An elegant floral specialty blending rich double shot espresso with organic lavender blossom water, lightly sweetened with raw cane sugar and oat milk.', price: 650, category: 'seasonal', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80', ingredients: ['Double Espresso', 'Organic French Lavender', 'Barista Standard Oat Milk'], tastingNotes: ['Floral Lavender', 'Sweet Malt', 'Earthy Oats'], featured: true, inStock: true },
    { id: 'p12', name: 'Pumpkin Spice Latte', description: 'Autumn classic crafted with a rich reduction of real sweet pumpkin puree, warming aromatic spices including clove and nutmeg, steamed milk, and espresso.', price: 680, category: 'seasonal', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80', ingredients: ['Espresso', 'Real Roasted Pumpkin Puree', 'Nutmeg & Clove', 'Whole Milk'], tastingNotes: ['Cinnamon Dust', 'Sweet Pumpkin Core', 'Warm Cardamom'], featured: false, inStock: true },
  ]);

  console.log('--- Seeding Completed ---');
}
