import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { UserDashboard } from './components/UserDashboard.tsx';
import { MatchDiscovery } from './components/MatchDiscovery.tsx';
import { RecommendationsView } from './components/RecommendationsView.tsx';
import { InterestsManager } from './components/InterestsManager.tsx';
import { MediaManagement } from './components/MediaManagement.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ProfileDetailModal } from './components/ProfileDetailModal.tsx';
import { ProfileEditModal } from './components/ProfileEditModal.tsx';
import { SendInterestModal } from './components/SendInterestModal.tsx';
import LipScrollZoominAnimationDemo from '@/components/ui/demo.tsx';
import { api, tokenStorage } from './services/api.ts';
import { User, Profile, Interest, Favorite, MatchRecommendation, SearchFilters } from './types.ts';
import { Heart, ShieldCheck, Lock, Users, Sparkles, Phone, Mail } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'admin' | 'forgot'>('login');
  const [profileDetail, setProfileDetail] = useState<Profile | null>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [targetInterestProfile, setTargetInterestProfile] = useState<Profile | null>(null);

  // App-wide data
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [interestsSent, setInterestsSent] = useState<Interest[]>([]);
  const [interestsReceived, setInterestsReceived] = useState<Interest[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [sentInterestIds, setSentInterestIds] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([]);

  // Search Filters
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    q: '',
    gender: 'All',
    ageMin: 21,
    ageMax: 45,
    religion: 'All',
    caste: '',
    occupation: '',
    education: '',
    city: '',
    state: '',
    maritalStatus: 'All',
    foodPreference: 'All',
    verifiedOnly: false
  });

  // Initial auth and session bootstrap
  useEffect(() => {
    bootstrapSession();
  }, []);

  const bootstrapSession = async () => {
    try {
      setLoading(true);
      const token = tokenStorage.get();
      if (token) {
        try {
          const authRes = await api.getMe();
          setCurrentUser(authRes.user);
          if (authRes.profile) {
            setCurrentProfile(authRes.profile);
          }
          if (authRes.user.role === 'admin') {
            setActiveTab('admin');
          } else {
            setActiveTab('dashboard');
          }
        } catch {
          tokenStorage.remove();
          // Fallback to guest initially
          setActiveTab('home');
        }
      } else {
        // Auto-login as demo user Priya on first load for an immediate interactive experience
        await handleQuickSwitch('priya');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch profiles when filters change or tab changes
  useEffect(() => {
    fetchProfiles();
  }, [searchFilters]);

  // When currentUser changes, reload personal data
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role !== 'admin') {
        loadUserData();
      }
    } else {
      setInterestsSent([]);
      setInterestsReceived([]);
      setFavorites([]);
      setFavoriteIds(new Set());
      setSentInterestIds(new Set());
      setRecommendations([]);
    }
  }, [currentUser]);

  const fetchProfiles = async () => {
    try {
      const res = await api.getProfiles(searchFilters);
      setProfiles(res.profiles);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    }
  };

  const loadUserData = async () => {
    try {
      const [profileRes, sentRes, receivedRes, favsRes, recsRes] = await Promise.all([
        api.getMyProfile().catch(() => ({ profile: null })),
        api.getSentInterests().catch(() => ({ interests: [] })),
        api.getReceivedInterests().catch(() => ({ interests: [] })),
        api.getFavorites().catch(() => ({ profiles: [] })),
        api.getRecommendations().catch(() => ({ recommendations: [] }))
      ]);

      if (profileRes.profile) {
        setCurrentProfile(profileRes.profile);
      }

      setInterestsSent(sentRes.interests);
      setInterestsReceived(receivedRes.interests);
      const mappedFavorites: Favorite[] = favsRes.profiles.map((p) => ({
        profileId: p._id,
        profile: p,
        createdAt: p.favoritedAt
      }));
      setFavorites(mappedFavorites);
      setRecommendations(recsRes.recommendations);

      setFavoriteIds(new Set(favsRes.profiles.map((p) => p._id)));
      setSentInterestIds(new Set(sentRes.interests.map((i: Interest) => i.toProfileId || i.receiverId || i.toUserId || '')));
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'admin' | 'forgot' = 'login') => {
    setAuthModalTab(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User, profile?: Profile) => {
    setCurrentUser(user);
    if (profile) setCurrentProfile(profile);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentProfile(null);
    setActiveTab('home');
  };

  const handleQuickSwitch = async (role: 'priya' | 'rohit' | 'admin' | 'guest') => {
    setLoading(true);
    try {
      if (role === 'guest') {
        handleLogout();
        return;
      }

      let res;
      if (role === 'priya') {
        res = await api.login({ identifier: 'priya@example.com', password: 'Password123!' });
      } else if (role === 'rohit') {
        res = await api.login({ identifier: 'rohit@example.com', password: 'Password123!' });
      } else if (role === 'admin') {
        res = await api.adminLogin({ identifier: 'admin@matrimony.com', password: 'AdminPass123!' });
      }

      if (res) {
        tokenStorage.set(res.token);
        setCurrentUser(res.user);
        if (res.profile) setCurrentProfile(res.profile);

        if (res.user.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('dashboard');
        }
      }
    } catch (err) {
      console.error('Quick switch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (profile: Profile) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }

    try {
      if (favoriteIds.has(profile._id)) {
        await api.removeFavorite(profile._id);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(profile._id);
          return next;
        });
        setFavorites((prev) => prev.filter((f) => f.profileId !== profile._id));
      } else {
        await api.addFavorite(profile._id);
        setFavoriteIds((prev) => new Set(prev).add(profile._id));
        setFavorites((prev) => [
          ...prev,
          {
            id: 'fav_' + Date.now(),
            userId: currentUser._id,
            profileId: profile._id,
            profile,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err: any) {
      alert(err.message || 'Could not update favorites');
    }
  };

  const handleSendInterestSubmit = async (profileId: string, message: string) => {
    const res = await api.sendInterest(profileId, message);
    setSentInterestIds((prev) => new Set(prev).add(profileId));
    setInterestsSent((prev) => [...prev, res.interest]);
  };

  const handleAdminToggleVerify = async (profileId: string) => {
    try {
      const res = await api.toggleProfileVerification(profileId);
      const isVerified = res.profile?.isVerified ?? true;
      setProfiles((prev) =>
        prev.map((p) => (p._id === profileId ? { ...p, isVerified } : p))
      );
      if (profileDetail && profileDetail._id === profileId) {
        setProfileDetail({ ...profileDetail, isVerified });
      }
      if (currentProfile && currentProfile._id === profileId) {
        setCurrentProfile({ ...currentProfile, isVerified });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-800 selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentProfile={currentProfile}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile') {
            setProfileEditOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        pendingInterestsCount={interestsReceived.filter((i) => i.status === 'pending').length}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onQuickSwitch={handleQuickSwitch}
      />

      {/* Main App Content Body */}
      <main className="flex-1">
        {/* TAB: LANDING HOME (For guest or exploration) */}
        {activeTab === 'home' && (
          <LandingHero
            onOpenAuth={handleOpenAuth}
            onExploreMatches={(filters) => {
              if (filters) {
                setSearchFilters((prev) => ({ ...prev, ...filters }));
              }
              setActiveTab('search');
            }}
            featuredProfiles={profiles.filter((p) => p.isVerified).slice(0, 4)}
            onViewProfile={(prof) => setProfileDetail(prof)}
          />
        )}

        {/* TAB: USER DASHBOARD */}
        {activeTab === 'dashboard' && currentUser && (
          <UserDashboard
            user={currentUser}
            profile={currentProfile}
            interestsSent={interestsSent}
            interestsReceived={interestsReceived}
            favoritesCount={favorites.length}
            recommendations={recommendations}
            onNavigate={(tab) => {
              if (tab === 'profile') {
                setProfileEditOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            onViewProfile={(prof) => setProfileDetail(prof)}
            onSendInterest={(prof) => setTargetInterestProfile(prof)}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
          />
        )}

        {/* TAB: SEARCH / DISCOVER MATCHES */}
        {activeTab === 'search' && (
          <MatchDiscovery
            profiles={profiles}
            filters={searchFilters}
            onFilterChange={setSearchFilters}
            onViewProfile={(prof) => setProfileDetail(prof)}
            onSendInterest={(prof) => setTargetInterestProfile(prof)}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
            sentInterestIds={sentInterestIds}
            isLoggedIn={!!currentUser}
            onPromptLogin={() => handleOpenAuth('login')}
          />
        )}

        {/* TAB: RECOMMENDATIONS ENGINE */}
        {activeTab === 'recommendations' && (
          <RecommendationsView
            recommendations={recommendations}
            onViewProfile={(prof) => setProfileDetail(prof)}
            onSendInterest={(prof) => setTargetInterestProfile(prof)}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
            sentInterestIds={sentInterestIds}
          />
        )}

        {/* TAB: INTERESTS & SHORTLISTS */}
        {(activeTab === 'interests' || activeTab === 'favorites') && (
          <InterestsManager
            interestsReceived={interestsReceived}
            interestsSent={interestsSent}
            favorites={favorites}
            onRefresh={loadUserData}
            onViewProfile={(prof) => setProfileDetail(prof)}
            onSendInterest={(prof) => setTargetInterestProfile(prof)}
          />
        )}

        {/* TAB: PHOTO & MEDIA MANAGEMENT */}
        {activeTab === 'media' && (
          <MediaManagement
            profile={currentProfile}
            onProfileUpdated={(up) => {
              setCurrentProfile(up);
              fetchProfiles();
            }}
          />
        )}

        {/* TAB: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminPanel onViewProfile={(prof) => setProfileDetail(prof)} />
        )}

        {/* TAB: CINEMATIC STORY / LIP SCROLL ZOOM-IN DEMO */}
        {activeTab === 'cinematic' && (
          <div className="relative w-full">
            <div className="sticky top-18 z-30 bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 shadow-md">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-semibold uppercase tracking-wider text-rose-400">Lip Scroll Zoom-in Animation</span>
                <span className="hidden sm:inline text-slate-300">| Scroll down to trigger the interactive GSAP pin & lip-mask zoom effect</span>
              </div>
              <button
                onClick={() => setActiveTab(currentUser ? 'dashboard' : 'home')}
                className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
              >
                Back to App
              </button>
            </div>
            <LipScrollZoominAnimationDemo />
          </div>
        )}
      </main>

      {/* Profile Detail Modal */}
      {profileDetail && (
        <ProfileDetailModal
          profile={profileDetail}
          onClose={() => setProfileDetail(null)}
          onSendInterest={(prof) => setTargetInterestProfile(prof)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favoriteIds.has(profileDetail._id)}
          hasSentInterest={sentInterestIds.has(profileDetail._id)}
          isLoggedIn={!!currentUser}
          onPromptLogin={() => handleOpenAuth('login')}
          isAdmin={currentUser?.role === 'admin'}
          onAdminToggleVerify={handleAdminToggleVerify}
        />
      )}

      {/* Profile Edit Modal */}
      {profileEditOpen && (
        <ProfileEditModal
          isOpen={profileEditOpen}
          profile={currentProfile}
          onClose={() => setProfileEditOpen(false)}
          onProfileUpdated={(updated) => {
            setCurrentProfile(updated);
            fetchProfiles();
          }}
        />
      )}

      {/* Send Interest Modal with Templates */}
      {targetInterestProfile && (
        <SendInterestModal
          isOpen={!!targetInterestProfile}
          targetProfile={targetInterestProfile}
          onClose={() => setTargetInterestProfile(null)}
          onSubmit={handleSendInterestSubmit}
        />
      )}

      {/* Auth Modal (Login / Register / Admin / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Platform Footer */}
      <footer className="bg-white border-t border-amber-100/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <span className="font-serif-display text-lg font-bold text-slate-900">
                  Bandhan Matrimony
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                A trustworthy, human-moderated matrimonial ecosystem honoring cultural heritage, individual values, and genuine family connections.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Discovery & Search
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li><button onClick={() => { setSearchFilters({ ...searchFilters, gender: 'Female' }); setActiveTab('search'); }} className="hover:text-rose-600">Browse Brides</button></li>
                <li><button onClick={() => { setSearchFilters({ ...searchFilters, gender: 'Male' }); setActiveTab('search'); }} className="hover:text-rose-600">Browse Grooms</button></li>
                <li><button onClick={() => { setSearchFilters({ ...searchFilters, verifiedOnly: true }); setActiveTab('search'); }} className="hover:text-rose-600">Verified Profiles</button></li>
                <li><button onClick={() => setActiveTab('recommendations')} className="hover:text-rose-600">Compatibility Recommendations</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Safety & Privacy
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Manual Photo Verification</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hidden Contact Numbers</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mutual Consent Access</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Demonstration Testing
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use the top-right <span className="font-semibold text-slate-700">Demo Role Switcher</span> to evaluate user perspectives (Priya, Rohit) or switch directly into the <span className="font-semibold text-amber-800">Admin Control Panel</span>.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} Bandhan Matrimony Management Platform. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="text-emerald-700 font-medium flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted & Moderated</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
