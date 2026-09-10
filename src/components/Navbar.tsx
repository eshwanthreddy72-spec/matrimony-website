import React, { useState } from 'react';
import {
  Heart,
  Search,
  Sparkles,
  ShieldCheck,
  Bell,
  User as UserIcon,
  LogOut,
  Camera,
  Layers,
  ChevronDown
} from 'lucide-react';
import { User, Profile } from '../types.ts';

interface NavbarProps {
  currentUser: User | null;
  currentProfile: Profile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingInterestsCount: number;
  onOpenAuth: (mode: 'login' | 'register' | 'admin') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentProfile,
  activeTab,
  setActiveTab,
  pendingInterestsCount,
  onOpenAuth,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(isAdmin ? 'admin' : (currentUser ? 'dashboard' : 'home'))}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-display text-xl font-bold tracking-tight text-slate-900">
                  Bandhan
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                  Matrimony
                </span>
              </div>
              <p className="text-[11px] text-slate-600 tracking-wide font-medium">Verified Matrimonial Network</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {!currentUser && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'home' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'search' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Discover Matches</span>
                </button>
              </>
            )}

            {currentUser && !isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'dashboard' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'search' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Matches</span>
                </button>

                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'recommendations' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Recommended</span>
                </button>

                <button
                  onClick={() => setActiveTab('interests')}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'interests' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Interests</span>
                  {pendingInterestsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                      {pendingInterestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'favorites' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>Shortlist</span>
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'media' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>My Gallery</span>
                </button>
              </>
            )}

            {isAdmin && (
              <div className="flex items-center space-x-1 bg-amber-50/80 p-1 rounded-xl border border-amber-200">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 ${
                    activeTab === 'admin' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium text-amber-900 hover:bg-amber-100`}
                >
                  View as User
                </button>
              </div>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* If Not Logged In */}
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 min-h-[44px] text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 min-h-[44px] text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-xl shadow-sm shadow-rose-200 transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                  Register Free
                </button>
              </div>
            ) : (
              /* User Menu */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="User account menu"
                  aria-expanded={showProfileMenu}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 pr-3 min-h-[44px] rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {currentProfile?.profilePhoto ? (
                      <img
                        src={currentProfile.profilePhoto}
                        alt={currentProfile.fullName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {currentProfile?.fullName || currentUser.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showProfileMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">
                        {currentProfile?.fullName || currentUser.username}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">{currentUser.email}</p>
                      {currentProfile?.isVerified && (
                        <div className="mt-1 flex items-center space-x-1 text-[10px] text-emerald-700 font-medium">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Profile</span>
                        </div>
                      )}
                    </div>

                    {!isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveTab('profile')}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          <span>Edit My Profile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('media')}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 font-medium"
                        >
                          <Camera className="w-4 h-4 text-slate-500" />
                          <span>Manage Photos</span>
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('admin')}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 flex items-center space-x-2 text-amber-900 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50 flex items-center space-x-2 text-rose-700 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (App-like navigation for small screens) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around"
      >
        {!currentUser ? (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'home' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 mb-0.5 ${activeTab === 'home' ? 'fill-rose-500 text-rose-600' : ''}`} />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'search' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span>Discover</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-semibold text-rose-700 hover:text-rose-900 transition-colors"
            >
              <UserIcon className="w-4 h-4 mb-0.5" />
              <span>Sign In</span>
            </button>
          </>
        ) : isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-semibold transition-colors ${
                activeTab === 'admin' ? 'text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mb-0.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-semibold transition-colors ${
                activeTab === 'search' ? 'text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span>User View</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'dashboard' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 mb-0.5" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'search' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span>Matches</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recommendations')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'recommendations' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 mb-0.5 text-amber-500" />
              <span>Top AI</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'favorites' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 mb-0.5 ${activeTab === 'favorites' ? 'fill-rose-500 text-rose-600' : ''}`} />
              <span>Shortlist</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'interests' ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4 mb-0.5" />
              {pendingInterestsCount > 0 && (
                <span className="absolute top-1 right-3.5 bg-rose-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {pendingInterestsCount}
                </span>
              )}
              <span>Interests</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
};
