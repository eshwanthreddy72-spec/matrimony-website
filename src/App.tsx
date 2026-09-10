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
import { api, tokenStorage } from './services/api.ts';
import { User, Profile, Interest, Favorite, MatchRecommendation, SearchFilters } from './types.ts';
import { Heart, ShieldCheck, Lock, Users, Sparkles, Phone, Mail, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'admin' | 'forgot'>('login');
  const [profileDetail, setProfileDetail] = useState<Profile | null>(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [targetInterestProfile, setTargetInterestProfile] = useState<Profile | null>(null);

  // Context preservation & modal stacking prevention
  const [pendingAuthAction, setPendingAuthAction] = useState<{
    type: 'interest' | 'favorite' | 'view';
    profile: Profile;
  } | null>(null);
  const [stackedPreviousProfile, setStackedPreviousProfile] = useState<Profile | null>(null);

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
        // Initialize by default to landing/guest state without auto-login
        setActiveTab('home');
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

  const handleOpenSendInterest = (profile: Profile) => {
    if (!currentUser) {
      setPendingAuthAction({ type: 'interest', profile });
      if (profileDetail) {
        setStackedPreviousProfile(profileDetail);
        setProfileDetail(null);
      }
      handleOpenAuth('login');
      return;
    }

    if (profileDetail) {
      setStackedPreviousProfile(profileDetail);
      setProfileDetail(null);
    }
    setTargetInterestProfile(profile);
  };

  const handleCloseSendInterest = () => {
    setTargetInterestProfile(null);
    if (stackedPreviousProfile) {
      setProfileDetail(stackedPreviousProfile);
      setStackedPreviousProfile(null);
    }
  };

  const handleAuthSuccess = async (user: User, profile?: Profile) => {
    setCurrentUser(user);
    if (profile) setCurrentProfile(profile);
    setAuthModalOpen(false);

    if (user.role === 'admin') {
      setActiveTab('admin');
      setPendingAuthAction(null);
      setStackedPreviousProfile(null);
      return;
    }

    // Context preservation: execute pending action seamlessly
    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);

      if (action.type === 'interest') {
        showToast(`Welcome ${user.username}! Ready to express your interest in ${action.profile.fullName}.`, 'info');
        setTargetInterestProfile(action.profile);
        return;
      }

      if (action.type === 'favorite') {
        try {
          await api.addFavorite(action.profile._id);
          setFavoriteIds((prev) => new Set(prev).add(action.profile._id));
          setFavorites((prev) => [
            ...prev,
            {
              id: 'fav_' + Date.now(),
              userId: user._id,
              profileId: action.profile._id,
              profile: action.profile,
              createdAt: new Date().toISOString()
            }
          ]);
          showToast(`Welcome! Added ${action.profile.fullName} to your shortlist.`, 'success');
          if (stackedPreviousProfile) {
            setProfileDetail(stackedPreviousProfile);
            setStackedPreviousProfile(null);
          }
        } catch (err: any) {
          showToast(err.message || 'Could not update shortlist', 'error');
        }
        return;
      }
    }

    if (stackedPreviousProfile) {
      setProfileDetail(stackedPreviousProfile);
      setStackedPreviousProfile(null);
      return;
    }

    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentProfile(null);
    setActiveTab('home');
    setPendingAuthAction(null);
    setStackedPreviousProfile(null);
    showToast('You have been logged out safely.', 'info');
  };

  const handleToggleFavorite = async (profile: Profile) => {
    if (!currentUser) {
      setPendingAuthAction({ type: 'favorite', profile });
      if (profileDetail) {
        setStackedPreviousProfile(profileDetail);
        setProfileDetail(null);
      }
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
        showToast(`Removed ${profile.fullName} from shortlisted favorites.`, 'info');
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
        showToast(`Added ${profile.fullName} to your shortlist!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not update favorites', 'error');
    }
  };

  const handleSendInterestSubmit = async (profileId: string, message: string) => {
    try {
      const res = await api.sendInterest(profileId, message);
      setSentInterestIds((prev) => new Set(prev).add(profileId));
      setInterestsSent((prev) => [...prev, res.interest]);
      setTargetInterestProfile(null);
      if (stackedPreviousProfile) {
        setProfileDetail(stackedPreviousProfile);
        setStackedPreviousProfile(null);
      }
      showToast('Matrimonial expression of interest successfully sent!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send interest', 'error');
    }
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
      showToast(`Profile verification status updated to ${isVerified ? 'Verified' : 'Unverified'}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update verification', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-slate-800 selection:bg-rose-100 selection:text-rose-900 relative">
      {/* Dynamic Toast Feedback Notification */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] sm:w-auto flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200 bg-white/95 text-slate-900 border-slate-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-amber-600 shrink-0" />}
          <p className="text-xs sm:text-sm font-semibold pr-2">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors ml-auto shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

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
      />

      {/* Main App Content Body (pb-20 on mobile to clear bottom navigation) */}
      <main className="flex-1 pb-20 md:pb-0">
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
            onSendInterest={(prof) => handleOpenSendInterest(prof)}
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
            onSendInterest={(prof) => handleOpenSendInterest(prof)}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
            sentInterestIds={sentInterestIds}
            isLoggedIn={!!currentUser}
            onPromptLogin={() => {
              handleOpenAuth('login');
            }}
          />
        )}

        {/* TAB: RECOMMENDATIONS ENGINE */}
        {activeTab === 'recommendations' && (
          <RecommendationsView
            recommendations={recommendations}
            onViewProfile={(prof) => setProfileDetail(prof)}
            onSendInterest={(prof) => handleOpenSendInterest(prof)}
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
            onSendInterest={(prof) => handleOpenSendInterest(prof)}
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
      </main>

      {/* Profile Detail Modal */}
      {profileDetail && (
        <ProfileDetailModal
          profile={profileDetail}
          onClose={() => {
            setProfileDetail(null);
            setStackedPreviousProfile(null);
          }}
          onSendInterest={(prof) => handleOpenSendInterest(prof)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favoriteIds.has(profileDetail._id)}
          hasSentInterest={sentInterestIds.has(profileDetail._id)}
          isLoggedIn={!!currentUser}
          onPromptLogin={() => {
            setStackedPreviousProfile(profileDetail);
            setProfileDetail(null);
            handleOpenAuth('login');
          }}
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
          onClose={handleCloseSendInterest}
          onSubmit={handleSendInterestSubmit}
        />
      )}

      {/* Auth Modal (Login / Register / Admin / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        onClose={() => {
          setAuthModalOpen(false);
          if (stackedPreviousProfile) {
            setProfileDetail(stackedPreviousProfile);
            setStackedPreviousProfile(null);
          }
        }}
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
                Support & Inquiries
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need guidance with profile registration, verification badges, or match preferences? Our dedicated support team is here to assist you.
              </p>
              <div className="pt-1 flex flex-col space-y-1 text-xs text-slate-600">
                <span className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Toll-Free: 1800-BANDHAN</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>support@bandhanmatrimony.com</span>
                </span>
              </div>
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
      <SpeedInsights />
    </div>
  );
}
