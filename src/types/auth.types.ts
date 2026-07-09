export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthPayload {
  email: string;
  password?: string;
  fullName?: string;
}