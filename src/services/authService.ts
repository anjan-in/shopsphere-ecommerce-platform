import { auth, db, googleProvider } from '../firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '../types/auth.types';

export const authService = {
  // Save or Update User Profile Schema
  async createUserProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const userRef = doc(db, 'users', uid);
    const profileSnap = await getDoc(userRef);

    if (!profileSnap.exists()) {
      const newProfile: UserProfile = {
        uid,
        fullName: data.fullName || 'Anonymous User',
        email: data.email || '',
        profileImage: data.profileImage || '',
        role: 'customer', // Enforced default customer role client-side
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      // Write to firestore securely
      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newProfile;
    }
    
    return profileSnap.data() as UserProfile;
  },

  // Email Sign Up
  async register({ email, password, fullName }: { email: string; password: string; fullName: string }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return await this.createUserProfile(credential.user.uid, { fullName, email });
  },

  // Email Login
  async login({ email, password }: { email: string; password: string }) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', credential.user.uid);
    const profileSnap = await getDoc(userRef);
    return profileSnap.data() as UserProfile;
  },

  // Google Sign In Popup Integration
  async loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    return await this.createUserProfile(credential.user.uid, {
      fullName: credential.user.displayName || 'Google User',
      email: credential.user.email || '',
      profileImage: credential.user.photoURL || '',
    });
  },

  // Fetch Current Session Profile
  async getCurrentUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const profileSnap = await getDoc(userRef);
    return profileSnap.exists() ? (profileSnap.data() as UserProfile) : null;
  },

  // Logout Session
  async logout() {
    await signOut(auth);
  }
};