import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Shield, 
  Package, 
  Heart, 
  LogOut, 
  Sparkles, 
  ChevronRight,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err: any) {
      toast.error('Failed to log out: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Profile Header Banner */}
      <div className="glass-panel rounded-3xl p-8 shadow-soft-xs border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white text-2xl font-black shadow-soft-md">
            {user?.fullName?.charAt(0) || <User className="h-8 w-8" />}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.fullName || 'ShopSphere Member'}</h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> VIP
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Quick Access Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/orders"
          className="glass-panel flex items-center justify-between rounded-2xl p-5 shadow-soft-xs hover:shadow-soft-md hover:border-blue-200 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">My Orders</h3>
              <p className="text-[11px] text-slate-400">Track shipments & past purchases</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition" />
        </Link>

        <Link
          to="/wishlist"
          className="glass-panel flex items-center justify-between rounded-2xl p-5 shadow-soft-xs hover:shadow-soft-md hover:border-red-200 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Heart className="h-6 w-6 fill-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-500 transition">Saved Wishlist</h3>
              <p className="text-[11px] text-slate-400">{wishlistCount} item{wishlistCount === 1 ? '' : 's'} saved</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition" />
        </Link>
      </div>

      {/* Security & Preferences */}
      <div className="glass-panel rounded-3xl p-6 shadow-soft-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
          <Shield className="h-4 w-4 text-emerald-600" /> Account Security
        </h3>
        
        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-center justify-between py-1">
            <span>Email Authentication</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Verified
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>Role Permissions</span>
            <span className="font-bold text-slate-900 capitalize">{user?.role || 'Customer'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}