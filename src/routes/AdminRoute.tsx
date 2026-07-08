import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../redux/slices/authSlice';

export default function AdminRoute() {
  const isAuth = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  if (!isAuth) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}