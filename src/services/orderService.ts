import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import type { Order } from '../types/order.types';

export const orderService = {
  // Save new order to Firestore
  async createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  },

  // Get orders for logged-in user
  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },

  // Get order details by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Order) : null;
  }
};