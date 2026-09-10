import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { Profile, SearchFilters } from '../types.ts';

interface MatchDiscoveryProps {
  profiles: Profile[];
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  onToggleFavorite: (profile: Profile) => void;
  favoriteIds: Set<string>;
  sentInterestIds: Set<string>;
  isLoggedIn: boolean;
  onPromptLogin: () => void;
}

export const MatchDiscovery: React.FC<MatchDiscoveryProps> = ({
  profiles,
  filters,
  onFilterChange,
  onViewProfile,
  onSendInterest,
  onToggleFavorite,
  favoriteIds,
  sentInterestIds,
  isLoggedIn,
  onPromptLogin
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const resetFilters = () => {
    onFilterChange({
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Quick Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
            Browse Matrimonial Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Showing {profiles.length} genuine profiles matching your search parameters
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Keyword Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => onFilterChange({ ...filters, q: e.target.value })}
              placeholder="Search by name, city, job..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-2xs"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-700 flex items-center space-x-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Filters Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* FILTERS SIDEBAR (3 cols) */}
        <div className={`md:col-span-4 lg:col-span-3 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Refine Search</h3>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-slate-600 hover:text-rose-600 font-semibold flex items-center space-x-1"
                aria-label="Reset all search filters to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Gender Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Seeking Gender
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {['All', 'Female', 'Male'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, gender: g })}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      filters.gender === g
                        ? 'bg-white text-rose-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g === 'Female' ? 'Bride' : g === 'Male' ? 'Groom' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Age:</span>
                <span className="text-rose-700">{filters.ageMin} - {filters.ageMax} yrs</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={18}
                  max={filters.ageMax}
                  value={filters.ageMin}
                  onChange={(e) => onFilterChange({ ...filters, ageMin: Number(e.target.value) })}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="number"
                  min={filters.ageMin}
                  max={70}
                  value={filters.ageMax}
                  onChange={(e) => onFilterChange({ ...filters, ageMax: Number(e.target.value) })}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center"
                />
              </div>
            </div>

            {/* Religion Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Religion / Faith</label>
              <select
                value={filters.religion}
                onChange={(e) => onFilterChange({ ...filters, religion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All Religions</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikh">Sikh</option>
                <option value="Christian">Christian</option>
                <option value="Jain">Jain</option>
                <option value="Parsi">Parsi</option>
                <option value="Buddhist">Buddhist</option>
              </select>
            </div>

            {/* Caste / Community */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Caste / Community</label>
              <input
                type="text"
                value={filters.caste}
                onChange={(e) => onFilterChange({ ...filters, caste: e.target.value })}
                placeholder="e.g. Brahmin, Kayastha, Reddy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            {/* City / Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                placeholder="e.g. Bengaluru, Mumbai, Delhi..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            {/* Marital Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Marital Status</label>
              <select
                value={filters.maritalStatus}
                onChange={(e) => onFilterChange({ ...filters, maritalStatus: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="All">All Statuses</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Awaiting Divorce">Awaiting Divorce</option>
              </select>
            </div>

            {/* Food Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Food Habits</label>
              <select
                value={filters.foodPreference}
                onChange={(e) => onFilterChange({ ...filters, foodPreference: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="All">Any Diet</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Jain">Jain Diet</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            {/* Verified Only Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800">Verified Profiles Only</span>
              </div>
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* PROFILES GRID (8 or 9 cols) */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Active Filter Chips Ribbon */}
          {(() => {
            const activeChips: Array<{ key: string; label: string; onRemove: () => void }> = [];
            if (filters.q.trim()) {
              activeChips.push({
                key: 'q',
                label: `Keyword: "${filters.q}"`,
                onRemove: () => onFilterChange({ ...filters, q: '' })
              });
            }
            if (filters.gender !== 'All') {
              activeChips.push({
                key: 'gender',
                label: `Seeking: ${filters.gender}`,
                onRemove: () => onFilterChange({ ...filters, gender: 'All' })
              });
            }
            if (filters.ageMin !== 21 || filters.ageMax !== 45) {
              activeChips.push({
                key: 'age',
                label: `Age: ${filters.ageMin}–${filters.ageMax} yrs`,
                onRemove: () => onFilterChange({ ...filters, ageMin: 21, ageMax: 45 })
              });
            }
            if (filters.religion !== 'All') {
              activeChips.push({
                key: 'religion',
                label: `Religion: ${filters.religion}`,
                onRemove: () => onFilterChange({ ...filters, religion: 'All' })
              });
            }
            if (filters.caste?.trim()) {
              activeChips.push({
                key: 'caste',
                label: `Caste: ${filters.caste}`,
                onRemove: () => onFilterChange({ ...filters, caste: '' })
              });
            }
            if (filters.city?.trim()) {
              activeChips.push({
                key: 'city',
                label: `City: ${filters.city}`,
                onRemove: () => onFilterChange({ ...filters, city: '' })
              });
            }
            if (filters.occupation?.trim()) {
              activeChips.push({
                key: 'occupation',
                label: `Job: ${filters.occupation}`,
                onRemove: () => onFilterChange({ ...filters, occupation: '' })
              });
            }
            if (filters.maritalStatus !== 'All') {
              activeChips.push({
                key: 'maritalStatus',
                label: `Status: ${filters.maritalStatus}`,
                onRemove: () => onFilterChange({ ...filters, maritalStatus: 'All' })
              });
            }
            if (filters.foodPreference !== 'All') {
              activeChips.push({
                key: 'foodPreference',
                label: `Diet: ${filters.foodPreference}`,
                onRemove: () => onFilterChange({ ...filters, foodPreference: 'All' })
              });
            }
            if (filters.verifiedOnly) {
              activeChips.push({
                key: 'verifiedOnly',
                label: 'Verified Only',
                onRemove: () => onFilterChange({ ...filters, verifiedOnly: false })
              });
            }

            if (activeChips.length === 0) return null;

            return (
              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 mr-1">Active Filters:</span>
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-900 rounded-full text-xs font-semibold"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      aria-label={`Remove filter ${chip.label}`}
                      className="w-5 h-5 rounded-full hover:bg-rose-200/80 flex items-center justify-center text-rose-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Clear all applied filters"
                  className="ml-auto text-xs font-bold text-slate-600 hover:text-rose-600 underline underline-offset-2 px-2 py-1 transition-colors"
                >
                  Clear All
                </button>
              </div>
            );
          })()}

          {profiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Matrimonial Profiles Found</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                No profiles match your specific filter criteria. Try expanding your age range or clearing city/religion filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 min-h-[44px] bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((prof) => {
                const isFav = favoriteIds.has(prof._id);
                const hasSentInterest = sentInterestIds.has(prof._id);

                return (
                  <div
                    key={prof._id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Photo Header */}
                    <div
                      className="relative h-60 bg-slate-100 cursor-pointer overflow-hidden"
                      onClick={() => onViewProfile(prof)}
                    >
                      <img
                        src={prof.profilePhoto}
                        alt={prof.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Verified Badge */}
                      {prof.isVerified && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified Member</span>
                        </div>
                      )}

                      {/* Favorite Button (44x44px accessible touch target) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLoggedIn) {
                            onPromptLogin();
                            return;
                          }
                          onToggleFavorite(prof);
                        }}
                        aria-label={isFav ? `Remove ${prof.fullName} from shortlisted favorites` : `Add ${prof.fullName} to shortlisted favorites`}
                        className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center z-10 transition-transform active:scale-90"
                      >
                        <div className={`w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md transition-colors ${
                          isFav ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'
                        }`}>
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </div>
                      </button>

                      {/* Bottom Name & Basic Details */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-base truncate">
                          {prof.fullName}, {prof.age}
                        </h3>
                        <p className="text-xs text-rose-100 flex items-center space-x-1 truncate font-medium">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{prof.city}, {prof.state || prof.country}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p className="flex items-center space-x-1.5 font-medium text-slate-900 truncate">
                          <Briefcase className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <span>{prof.occupation}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 text-slate-700 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <span>{prof.qualification}</span>
                        </p>
                        <div className="pt-1 flex flex-wrap gap-1.5 text-xs text-slate-700">
                          <span className="bg-slate-100/90 px-2.5 py-0.5 rounded-md border border-slate-200/70 font-medium">
                            {prof.religion}{prof.caste ? ` • ${prof.caste}` : ''}
                          </span>
                          <span className="bg-slate-100/90 px-2.5 py-0.5 rounded-md border border-slate-200/70 font-medium">
                            {prof.height}
                          </span>
                          <span className="bg-slate-100/90 px-2.5 py-0.5 rounded-md border border-slate-200/70 font-medium">
                            {prof.maritalStatus}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons with accessible touch targets */}
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => onViewProfile(prof)}
                          aria-label={`View full matrimonial details for ${prof.fullName}`}
                          className="flex-1 py-2.5 px-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => {
                            if (!isLoggedIn) {
                              onPromptLogin();
                              return;
                            }
                            onSendInterest(prof);
                          }}
                          disabled={hasSentInterest}
                          aria-label={hasSentInterest ? `Interest already sent to ${prof.fullName}` : `Connect with ${prof.fullName}`}
                          className={`flex-1 py-2.5 px-3 min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-xs ${
                            hasSentInterest
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 cursor-default'
                              : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white active:scale-95'
                          }`}
                        >
                          {hasSentInterest ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Sent</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
