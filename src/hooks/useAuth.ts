import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { 
  authStart, authSuccess, authFailure, logoutSuccess,
  selectCurrentUser, selectIsAuthenticated, selectAuthLoading 
} from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const login = async (email: string, pass: string) => {
    dispatch(authStart());
    try {
      const profile = await authService.login({ email, password: pass });
      dispatch(authSuccess(profile));
      toast.success(`Welcome back, ${profile.fullName}!`);
    } catch (err: any) {
      dispatch(authFailure(err.message));
      toast.error(err.message || 'Authentication failed.');
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    dispatch(authStart());
    try {
      const profile = await authService.register({ email, password: pass, fullName: name });
      dispatch(authSuccess(profile));
      toast.success('Account created successfully!');
    } catch (err: any) {
      dispatch(authFailure(err.message));
      toast.error(err.message || 'Registration failed.');
    }
  };

  const loginWithGoogle = async () => {
    dispatch(authStart());
    try {
      const profile = await authService.loginWithGoogle();
      dispatch(authSuccess(profile));
      toast.success(`Signed in as ${profile.fullName}`);
    } catch (err: any) {
      dispatch(authFailure(err.message));
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in encountered an error.');
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch(logoutSuccess());
      toast.success('Logged out successfully.');
    } catch (err: any) {
      toast.error('Error logging out.');
    }
  };

  return { user, loading, isAuthenticated, login, register, loginWithGoogle, logout };
};