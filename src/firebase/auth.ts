import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Register User
export const registerUser = async (email: string, pass: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// Login User
export const loginUser = async (email: string, pass: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// Logout User
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};