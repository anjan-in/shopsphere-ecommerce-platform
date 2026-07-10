import { db } from '../firebase/firebaseConfig';
import { collection, doc, writeBatch } from 'firebase/firestore';

const MOCK_CATEGORIES = [
  { id: 'cat-elec', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', isActive: true },
  { id: 'cat-fash', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', isActive: true },
  { id: 'cat-home', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f', isActive: true },
];

const MOCK_PRODUCTS = [
  {
    title: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
    shortDescription: 'Active noise cancelling overhead headphones.',
    sku: 'ELEC-HD-001',
    brand: 'AudioPhile',
    categoryId: 'cat-elec',
    price: 199.99,
    discountPrice: 169.99,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'https://images.unsplash.com/photo-1484704849700-f032a568e944'],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: 4.7,
    totalReviews: 128,
    featured: true,
    isActive: true,
  },
  {
    title: 'Classic Leather Jacket',
    slug: 'classic-leather-jacket',
    description: 'Genuine slim-fit leather motorcycle jacket designed for enduring style and comfort.',
    shortDescription: '100% genuine black leather jacket.',
    sku: 'FASH-JK-002',
    brand: 'UrbanFit',
    categoryId: 'cat-fash',
    price: 249.99,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5'],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    rating: 4.5,
    totalReviews: 64,
    featured: true,
    isActive: true,
  }
];

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // Seed Categories
  MOCK_CATEGORIES.forEach((cat) => {
    const ref = doc(collection(db, 'categories'), cat.id);
    batch.set(ref, { ...cat, createdAt: new Date().toISOString() });
  });

  // Seed Products
  MOCK_PRODUCTS.forEach((prod, index) => {
    const ref = doc(collection(db, 'products'), `prod-00${index + 1}`);
    batch.set(ref, {
      ...prod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  await batch.commit();
  console.log('Database successfully seeded with mock data!');
};