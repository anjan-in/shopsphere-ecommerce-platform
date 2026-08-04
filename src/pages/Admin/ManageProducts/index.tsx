import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Product } from '../../../types/product.types';
import { FaPlus, } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    discountPrice: 0,
    brand: '',
    categoryId: 'electronics',
    stock: 10,
    rating: 5,
    totalReviews: 1,
    featured: false,
    isActive: true,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
  });

  const fetchProducts = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (err: any) {
      toast.error('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: new Date().toISOString(),
      });
      toast.success('Product created successfully!');
      setIsAdding(false);
      fetchProducts();
    } catch (err: any) {
      toast.error('Creation failed: ' + err.message);
    }
  };

  const toggleProductActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { isActive: !currentStatus });
      toast.success('Updated product status');
      fetchProducts();
    } catch (err: any) {
      toast.error('Status update failed');
    }
  };

  if (loading) return <div className="text-sm font-semibold text-slate-500">Loading catalog management...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Products</h1>
          <p className="text-xs text-slate-500 mt-1">Add, update, or deactivate catalog items</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          <FaPlus /> {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {/* Product Creation Modal/Form */}
      {isAdding && (
        <form onSubmit={handleCreateProduct} className="rounded-2xl border bg-white p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900">Add New Product Entry</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-600">Product Title *</label>
              <input
                type="text"
                required
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Brand *</label>
              <input
                type="text"
                required
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-600">Price ($) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Discount Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Stock Units *</label>
              <input
                type="number"
                required
                min="0"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-600">Description</label>
            <textarea
              rows={3}
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                className="accent-blue-600"
              />
              <span className="font-semibold text-slate-700">Mark as Featured</span>
            </label>
          </div>

          <button type="submit" className="rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white hover:bg-emerald-700">
            Save Product to Firestore
          </button>
        </form>
      )}

      {/* Product List Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="border-b bg-slate-50 text-[11px] font-bold uppercase text-slate-400">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/50">
                <td className="p-4 flex items-center gap-3">
                  <img src={prod.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100" />
                  <span className="font-bold text-slate-800 line-clamp-1">{prod.title}</span>
                </td>
                <td className="p-4 font-semibold">{prod.brand}</td>
                <td className="p-4 font-bold text-slate-900">${prod.price}</td>
                <td className="p-4 font-semibold">{prod.stock}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${prod.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {prod.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleProductActive(prod.id, prod.isActive)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    {prod.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}