import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './firebase/auth';
import { authService } from './services/authService';
import { setInitialize, selectAuthLoading } from './redux/slices/authSlice';
import AppRoutes from './routes/AppRoutes';
import { Loader } from './components/ui/Loader';

export default function App() {
  const dispatch = useDispatch();
  const globalLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await authService.getCurrentUserProfile(firebaseUser.uid);
        dispatch(setInitialize(profile));
      } else {
        dispatch(setInitialize(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (globalLoading) {
    return <Loader />; // Block layout rendering until initialization confirms auth status
  }

  return <AppRoutes />;
}