import React from 'react';
import { Sparkles, Heart, ShieldCheck, MapPin, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { MatchRecommendation, Profile } from '../types.ts';

interface RecommendationsViewProps {
  recommendations: MatchRecommendation[];
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  onToggleFavorite: (profile: Profile) => void;
  favoriteIds: Set<string>;
  sentInterestIds: Set<string>;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onViewProfile,
  onSendInterest,
  onToggleFavorite,
  favoriteIds,
  sentInterestIds
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Algorithmic Compatibility Engine</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
          Curated Matrimonial Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Matches scored dynamically based on your age criteria, religious preference, lifestyle alignment, and shared interests.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-800">No specific recommendations yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Update your partner preferences in Profile Settings to unlock automated scoring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => {
            const prof = rec.profile;
            const isFav = favoriteIds.has(prof._id);
            const hasSent = sentInterestIds.has(prof._id);

            return (
              <div
                key={prof._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="relative h-56 bg-slate-100 cursor-pointer overflow-hidden group"
                  onClick={() => onViewProfile(prof)}
                >
                  <img
                    src={prof.profilePhoto}
                    alt={prof.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Compatibility Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-rose-800 text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>{rec.compatibilityScore}% Compatibility</span>
                  </div>

                  {/* Favorite */}
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
                    <p className="text-xs text-rose-100 truncate flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{prof.city}, {prof.state}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="flex items-center space-x-1.5 font-medium text-slate-800 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{prof.occupation}</span>
                    </p>
                    <p className="flex items-center space-x-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{prof.qualification}</span>
                    </p>

                    {/* Match Reasons Checklist */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Why this is a match:
                      </span>
                      {rec.matchReasons.map((reason, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onViewProfile(prof)}
                      className="flex-1 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onSendInterest(prof)}
                      disabled={hasSent}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1 transition-all ${
                        hasSent
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      }`}
                    >
                      <Heart className="w-3 h-3" />
                      <span>{hasSent ? 'Sent' : 'Express Interest'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
