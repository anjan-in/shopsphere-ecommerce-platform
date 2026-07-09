import { signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from './firebaseConfig';

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

// Google Sign-In
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Sign in with Google
export { auth, db };