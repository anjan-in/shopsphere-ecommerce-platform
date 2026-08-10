import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import type { Order } from '../types/order.types';

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  },

  // Get order details by ID
  // async getOrderById(orderId: string): Promise<Order | null> {
  //   const docRef = doc(db, 'orders', orderId);
  //   const docSnap = await getDoc(docRef);
  //   return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Order) : null;
  // }
};