import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  User as UserIcon,
  Sparkles,
  Lock,
  CheckCircle,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Profile } from '../types.ts';

interface ProfileDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
  onSendInterest: (profile: Profile) => void;
  onToggleFavorite: (profile: Profile) => void;
  isFavorite: boolean;
  hasSentInterest: boolean;
  isLoggedIn: boolean;
  onPromptLogin: () => void;
  isAdmin?: boolean;
  onAdminToggleVerify?: (profileId: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onSendInterest,
  onToggleFavorite,
  isFavorite,
  hasSentInterest,
  isLoggedIn,
  onPromptLogin,
  isAdmin,
  onAdminToggleVerify
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!profile) return null;

  const approvedPhotos = profile.photos?.filter(p => p.status === 'approved') || [];
  const gallery = approvedPhotos.length > 0
    ? approvedPhotos
    : [{ id: 'main', url: profile.profilePhoto, status: 'approved' as const, uploadedAt: '' }];

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % gallery.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#faf7f2]/60">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 text-sm sm:text-base">
              {profile.fullName}'s Matrimonial Profile
            </span>
            {profile.isVerified ? (
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded-full">
                Under Verification
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && onAdminToggleVerify && (
              <button
                type="button"
                onClick={() => onAdminToggleVerify(profile._id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                  profile.isVerified
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                {profile.isVerified ? 'Revoke Verification' : 'Verify Profile'}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* Top Hero: Photos Slider + Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={gallery[activePhotoIdx]?.url || profile.profilePhoto}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right arrows if multiple */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:bg-white shadow"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:bg-white shadow"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {activePhotoIdx + 1} of {gallery.length} photos
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {gallery.map((photo, i) => (
                    <button
                      key={photo.id || i}
                      onClick={() => setActivePhotoIdx(i)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activePhotoIdx === i ? 'border-rose-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo.url} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Profile Summary (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
                    {profile.fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center space-x-2 mt-1">
                    <span>{profile.age} Yrs</span>
                    <span>•</span>
                    <span>{profile.height}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.city}, {profile.state}, {profile.country}</span>
                    </span>
                  </p>
                </div>

                {/* Key Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/60 text-rose-800 text-xs font-semibold">
                    {profile.religion} • {profile.caste || 'Caste No Bar'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    {profile.motherTongue}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    {profile.maritalStatus}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    {profile.foodPreference}
                  </span>
                </div>

                {/* About Bio */}
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-amber-100/80 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About Me</h4>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{profile.bio || 'Warm, thoughtful, and looking forward to finding a life partner with shared aspirations and respect.'}"
                  </p>
                </div>

                {/* Hobbies / Interests */}
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-700">Hobbies & Interests</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.hobbies.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Strip */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      onPromptLogin();
                      return;
                    }
                    onSendInterest(profile);
                  }}
                  disabled={hasSentInterest}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-transform shadow-md ${
                    hasSentInterest
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white active:scale-98'
                  }`}
                >
                  {hasSentInterest ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Interest Request Sent</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Express Interest Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      onPromptLogin();
                      return;
                    }
                    onToggleFavorite(profile);
                  }}
                  className={`p-3 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={isFavorite ? 'Remove Shortlist' : 'Add to Shortlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Data Tabs / Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Education & Career Details */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-rose-600" />
                <span>Education & Profession</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Highest Qualification</span>
                  <span className="font-semibold text-slate-800">{profile.qualification || 'Professional Degree'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">College / Institute</span>
                  <span className="font-semibold text-slate-800">{profile.college || 'Reputed University'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Occupation</span>
                  <span className="font-semibold text-slate-800">{profile.occupation || 'Private Sector'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Employer / Company</span>
                  <span className="font-semibold text-slate-800">{profile.company || 'Leading Enterprise'}</span>
                </div>
                {profile.annualIncome && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Annual Income</span>
                    <span className="font-semibold text-emerald-800">{profile.annualIncome}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle & Habits */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <UserIcon className="w-4 h-4 text-rose-600" />
                <span>Lifestyle & Personal Traits</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Diet / Food Habits</span>
                  <span className="font-semibold text-slate-800">{profile.foodPreference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Smoking Habits</span>
                  <span className="font-semibold text-slate-800">{profile.smokingStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Drinking Habits</span>
                  <span className="font-semibold text-slate-800">{profile.drinkingStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Physical Fitness</span>
                  <span className="font-semibold text-slate-800">{profile.height}, {profile.weight}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Mother Tongue</span>
                  <span className="font-semibold text-slate-800">{profile.motherTongue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Expectations */}
          {profile.partnerPreferences && (
            <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/60 space-y-2">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Desired Partner Preferences</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Seeking a partner aged between <span className="font-semibold">{profile.partnerPreferences.ageMin} and {profile.partnerPreferences.ageMax}</span> years
                {profile.partnerPreferences.religions && profile.partnerPreferences.religions.length > 0 && (
                  <span> of faith {profile.partnerPreferences.religions.join(', ')}</span>
                )}
                {profile.partnerPreferences.locations && (
                  <span> residing in or open to {profile.partnerPreferences.locations.join(', ')}</span>
                )}
                . Must appreciate open communication and family values.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
