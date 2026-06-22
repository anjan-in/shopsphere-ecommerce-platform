import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

// Example: Add a new product (Useful for Admin Dashboard later)
export const addProduct = async (productData: DocumentData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

// Example: Fetch all products
export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};