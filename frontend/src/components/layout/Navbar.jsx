import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiViewGrid,
  HiClipboardList,
  HiLogout,
  HiUser,
  HiMenu,
  HiX,
  HiLightningBolt,
} from 'react-icons/hi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiViewGrid },
  { to: '/tasks', label: 'Tasks', icon: HiClipboardList },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
              <HiLightningBolt className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              TaskFlow
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === to
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-surface-100 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-50 border border-surface-200">
              <div className="w-6 h-6 rounded-lg bg-brand-100 flex items-center justify-center">
                <HiUser className="w-3.5 h-3.5 text-brand-700" />
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.name}</span>
            </div>
            <button onClick={logout} className="btn-ghost text-slate-500 hover:text-red-600">
              <HiLogout className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-surface-100"
          >
            {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-surface-100 mt-0 animate-slide-in">
            <div className="pt-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === to
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-surface-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-surface-100 mt-2">
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500">
                  <HiUser className="w-4 h-4" />
                  {user?.name} · {user?.email}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <HiLogout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
