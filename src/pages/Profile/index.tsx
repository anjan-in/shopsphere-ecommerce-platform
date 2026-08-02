import { useAuth } from '../../hooks/useAuth';
import { FaEnvelope, FaPhone, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl py-8 space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-2xs space-y-6">
        
        {/* Header Profile Card */}
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-2xl">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
            ) : (
              user.fullName?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{user.fullName}</h1>
            <span className="inline-block mt-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              {user.role} Account
            </span>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="flex items-center gap-3 rounded-xl border p-3.5 bg-slate-50/50">
            <FaEnvelope className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Address</p>
              <p className="font-bold text-slate-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border p-3.5 bg-slate-50/50">
            <FaPhone className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Phone Number</p>
              <p className="font-bold text-slate-800">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border p-3.5 bg-slate-50/50 sm:col-span-2">
            <FaShieldAlt className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Account Identifier</p>
              <p className="font-mono text-slate-700 font-semibold">{user.uid}</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}