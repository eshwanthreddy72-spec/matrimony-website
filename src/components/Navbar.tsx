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
  ChevronDown,
  Film
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
  onQuickSwitch: (role: 'priya' | 'rohit' | 'admin' | 'guest') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentProfile,
  activeTab,
  setActiveTab,
  pendingInterestsCount,
  onOpenAuth,
  onLogout,
  onQuickSwitch
}) => {
  const [showDemoMenu, setShowDemoMenu] = useState(false);
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
            {/* Cinematic Lip Animation Story Button */}
            <button
              onClick={() => setActiveTab('cinematic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 border ${
                activeTab === 'cinematic'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-indigo-50/70 border-indigo-200/80 text-indigo-700 hover:bg-indigo-100/80'
              }`}
              title="Experience cinematic scroll zoom-in animation"
            >
              <Film className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cinematic Story</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors shadow-2xs"
                title="Switch test accounts easily"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="hidden sm:inline font-semibold">Demo Role:</span>
                <span className="text-slate-900 font-bold">
                  {isAdmin
                    ? 'Admin'
                    : currentUser?.username === 'priya_sharma'
                    ? 'Priya'
                    : currentUser?.username === 'rohit_verma'
                    ? 'Rohit'
                    : currentUser
                    ? currentUser.username
                    : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showDemoMenu && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowDemoMenu(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
                    Switch Profile / Role
                  </div>
                  <button
                    onClick={() => onQuickSwitch('priya')}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <p className="font-semibold text-rose-950">Priya Sharma</p>
                      <p className="text-[11px] text-slate-600">User with pending requests</p>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-medium">User</span>
                  </button>
                  <button
                    onClick={() => onQuickSwitch('rohit')}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <p className="font-semibold text-rose-950">Rohit Verma</p>
                      <p className="text-[11px] text-slate-600">Product Manager, Bangalore</p>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">User</span>
                  </button>
                  <button
                    onClick={() => onQuickSwitch('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <p className="font-semibold text-amber-950">Administrator</p>
                      <p className="text-[11px] text-slate-600">Verification & photo approvals</p>
                    </div>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Admin</span>
                  </button>
                  <button
                    onClick={() => onQuickSwitch('guest')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 border-t border-slate-100"
                  >
                    <div>
                      <p className="font-medium text-slate-700">Guest Visitor</p>
                      <p className="text-[11px] text-slate-600">Logged out state</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Guest</span>
                  </button>
                </div>
              )}
            </div>

            {/* If Not Logged In */}
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-lg shadow-sm shadow-rose-200 transition-all hover:scale-[1.02]"
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
                  className="flex items-center space-x-2 p-1 pl-2 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
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
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                          onClick={() => setActiveTab('profile')}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit My Profile</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('media')}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                        >
                          <Camera className="w-3.5 h-3.5 text-slate-500" />
                          <span>Manage Photos</span>
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => setActiveTab('admin')}
                        className="w-full text-left px-3.5 py-2 hover:bg-amber-50 flex items-center space-x-2 text-amber-900 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center space-x-2 text-rose-600 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
