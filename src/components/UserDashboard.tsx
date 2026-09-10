import React from 'react';
import {
  Sparkles,
  Heart,
  Camera,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Inbox,
  Send,
  Bookmark,
  MapPin,
  Briefcase
} from 'lucide-react';
import { User, Profile, Interest, MatchRecommendation } from '../types.ts';

interface UserDashboardProps {
  user: User;
  profile: Profile | null;
  interestsSent: Interest[];
  interestsReceived: Interest[];
  favoritesCount: number;
  recommendations: MatchRecommendation[];
  onNavigate: (tab: string) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  onToggleFavorite: (profile: Profile) => void;
  favoriteIds: Set<string>;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  profile,
  interestsSent,
  interestsReceived,
  favoritesCount,
  recommendations,
  onNavigate,
  onViewProfile,
  onSendInterest,
  onToggleFavorite,
  favoriteIds
}) => {
  const pendingReceivedCount = interestsReceived.filter(i => i.status === 'pending').length;
  const acceptedCount = interestsSent.filter(i => i.status === 'accepted').length + interestsReceived.filter(i => i.status === 'accepted').length;

  const completion = profile?.profileCompletion || 40;

  // Completion missing items checklist
  const missingItems: string[] = [];
  if (!profile?.city) missingItems.push('Add current residence city & state');
  if (!profile?.qualification || !profile?.occupation) missingItems.push('Add education qualification & occupation');
  if (!profile?.bio || profile.bio.length < 30) missingItems.push('Write a detailed bio to attract compatible matches');
  if (!profile?.photos || profile.photos.length < 2) missingItems.push('Upload at least 2 high quality photos for verification');
  if (!profile?.partnerPreferences?.religions) missingItems.push('Specify partner preferences for more accurate recommendations');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-rose-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold">
                Active Member
              </span>
              {profile?.isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Profile Verified</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-semibold">
                  Verification Pending
                </span>
              )}
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight">
              Namaste, {profile?.fullName || user.username}!
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Welcome to your personal matchmaking hub. Explore your compatibility recommendations, respond to expressed interests, and keep your matrimonial profile up to date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 bg-white text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Edit My Profile
            </button>
            <button
              onClick={() => onNavigate('media')}
              className="px-4 py-2.5 bg-rose-700/80 hover:bg-rose-700 border border-rose-400/40 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metrics Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* New Matches Card */}
        <div
          onClick={() => onNavigate('recommendations')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Matches</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            {recommendations.length}
          </div>
          <p className="text-[11px] text-slate-500 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Based on your preferences</span>
          </p>
        </div>

        {/* Interests Received Card */}
        <div
          onClick={() => onNavigate('interests')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          {pendingReceivedCount > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-rose-600 rounded-bl-lg animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Received Interests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            {interestsReceived.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {pendingReceivedCount > 0 ? (
              <span className="text-rose-600 font-semibold">{pendingReceivedCount} awaiting response</span>
            ) : (
              'All caught up'
            )}
          </p>
        </div>

        {/* Interests Sent Card */}
        <div
          onClick={() => onNavigate('interests')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sent Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            {interestsSent.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {acceptedCount > 0 ? (
              <span className="text-emerald-700 font-semibold">{acceptedCount} mutual accepts</span>
            ) : (
              'Pending responses'
            )}
          </p>
        </div>

        {/* Shortlisted Favorites Card */}
        <div
          onClick={() => onNavigate('favorites')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shortlist</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            {favoritesCount}
          </div>
          <p className="text-[11px] text-slate-500">Saved candidate profiles</p>
        </div>
      </div>

      {/* Main Grid: Profile Completion Widget + Top Match Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Profile Completion & Health (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Profile Completion</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                {completion}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Profiles with &gt; 80% completion receive 3.8x more interest requests from verified families.
              </p>
            </div>

            {/* Actionable Missing Items */}
            {missingItems.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700">Recommended Steps:</p>
                <ul className="space-y-2">
                  {missingItems.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('profile')}
                  className="w-full mt-2 py-2 px-3 text-center bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Complete Details Now
                </button>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border border-amber-200/60 p-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('search')}
                className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
              >
                <span>Browse All Filtered Matches</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('media')}
                className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
              >
                <span>Manage Profile Photographs</span>
                <Camera className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onNavigate('interests')}
                className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
              >
                <span>Review Pending Invitations</span>
                <Heart className="w-3.5 h-3.5 text-rose-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Top Compatible Recommendations (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">Top Compatible Matches For You</h2>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {recommendations.slice(0, 4).map((rec) => {
              const prof = rec.profile;
              const isFav = favoriteIds.has(prof._id);

              return (
                <div
                  key={prof._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-100 cursor-pointer" onClick={() => onViewProfile(prof)}>
                    <img
                      src={prof.profilePhoto}
                      alt={prof.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Compatibility Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-rose-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{rec.compatibilityScore}% Match</span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(prof);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-base truncate flex items-center space-x-1.5">
                        <span>{prof.fullName}, {prof.age}</span>
                        {prof.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </h3>
                      <p className="text-xs text-rose-100 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{prof.city}, {prof.state}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-center space-x-1.5 font-medium text-slate-800 truncate">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prof.occupation}</span>
                      </p>
                      <p className="text-slate-500 truncate text-[11px]">
                        {prof.religion} • {prof.maritalStatus} • {prof.height}
                      </p>

                      {/* Top Match reason pill */}
                      {rec.matchReasons[0] && (
                        <div className="mt-2 text-[11px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md font-medium truncate">
                          ✓ {rec.matchReasons[0]}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onViewProfile(prof)}
                        className="flex-1 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold text-center transition-colors"
                      >
                        Full Profile
                      </button>
                      <button
                        onClick={() => onSendInterest(prof)}
                        className="flex-1 py-1.5 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold text-center flex items-center justify-center space-x-1 shadow-xs transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span>Send Interest</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
