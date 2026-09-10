import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Profile } from '../types.ts';

interface LandingHeroProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onExploreMatches: (filters?: any) => void;
  featuredProfiles: Profile[];
  onViewProfile: (profile: Profile) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenAuth,
  onExploreMatches,
  featuredProfiles,
  onViewProfile
}) => {
  const [lookingFor, setLookingFor] = useState<'Bride' | 'Groom'>('Bride');
  const [religion, setReligion] = useState<string>('All');
  const [ageMin, setAgeMin] = useState<number>(24);
  const [ageMax, setAgeMax] = useState<number>(32);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreMatches({
      gender: lookingFor === 'Bride' ? 'Female' : 'Male',
      religion: religion !== 'All' ? religion : '',
      ageMin,
      ageMax
    });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 bg-gradient-to-b from-rose-50/70 via-[#faf7f2] to-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-100/70 border border-rose-200 text-rose-900 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>100% Manually Verified Profiles & Secure Contacts</span>
              </div>

              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Where Soulmates Connect with <span className="italic text-rose-700">Dignity</span> & <span className="italic text-amber-700">Trust</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Discover educated, progressive, and family-oriented singles. Every profile and photograph undergoes human moderation so you can explore meaningful matrimonial matches in complete safety.
              </p>

              {/* Quick Search Widget */}
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-amber-100/80 p-5 sm:p-6">
                <form onSubmit={handleQuickSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                        I am looking for
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setLookingFor('Bride')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                            lookingFor === 'Bride'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          A Bride
                        </button>
                        <button
                          type="button"
                          onClick={() => setLookingFor('Groom')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                            lookingFor === 'Groom'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          A Groom
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                        Age Range
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={ageMin}
                          onChange={(e) => setAgeMin(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500"
                        >
                          {[21, 23, 25, 27, 29, 31, 33, 35, 40].map((a) => (
                            <option key={a} value={a}>
                              {a} yrs
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-400 text-xs">to</span>
                        <select
                          value={ageMax}
                          onChange={(e) => setAgeMax(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500"
                        >
                          {[25, 27, 29, 31, 33, 35, 38, 42, 50].map((a) => (
                            <option key={a} value={a}>
                              {a} yrs
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                        Community / Faith
                      </label>
                      <select
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="All">All Religions</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                        <option value="Jain">Jain</option>
                        <option value="Buddhist">Buddhist</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Privacy protected • No unsolicited phone calls</span>
                    </p>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-200 flex items-center justify-center space-x-2 transition-transform active:scale-95"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search Matches</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700">Verified Profiles</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700">Moderated Photos</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700">Direct Express Interest</span>
                </div>
              </div>
            </div>

            {/* Right Visual / Featured Cards Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-rose-300/40 via-amber-200/40 to-rose-200/40 rounded-3xl blur-2xl -z-10" />

                {/* Primary Card */}
                {featuredProfiles[0] && (
                  <div
                    onClick={() => onViewProfile(featuredProfiles[0])}
                    className="bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden cursor-pointer hover:shadow-rose-100/60 transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                      <img
                        src={featuredProfiles[0].profilePhoto}
                        alt={featuredProfiles[0].fullName}
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 flex items-center space-x-1 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold tracking-tight">
                          {featuredProfiles[0].fullName}, {featuredProfiles[0].age}
                        </h3>
                        <p className="text-xs text-rose-200 font-medium">
                          {featuredProfiles[0].occupation} • {featuredProfiles[0].city}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-white space-y-2">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        "{featuredProfiles[0].bio}"
                      </p>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-rose-700 font-semibold">
                        <span>View Verified Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondary overlapping card */}
                {featuredProfiles[1] && (
                  <div
                    onClick={() => onViewProfile(featuredProfiles[1])}
                    className="hidden sm:block absolute -bottom-8 -right-6 w-64 bg-white rounded-xl shadow-xl border border-slate-200/80 p-3 cursor-pointer hover:shadow-2xl transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={featuredProfiles[1].profilePhoto}
                        alt={featuredProfiles[1].fullName}
                        className="w-12 h-12 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {featuredProfiles[1].fullName}, {featuredProfiles[1].age}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{featuredProfiles[1].occupation}</p>
                        <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{featuredProfiles[1].city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Members</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
              Verified Profiles Looking for Companionship
            </h2>
          </div>
          <button
            onClick={() => onExploreMatches()}
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProfiles.slice(0, 4).map((prof) => (
            <div
              key={prof._id}
              onClick={() => onViewProfile(prof)}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={prof.profilePhoto}
                  alt={prof.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {prof.isVerified && (
                  <span className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base truncate">
                    {prof.fullName}, {prof.age}
                  </h3>
                  <p className="text-xs text-rose-100 truncate flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{prof.city}, {prof.state}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="flex items-center space-x-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{prof.occupation}</span>
                  </p>
                  <p className="flex items-center space-x-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prof.qualification}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{prof.religion} • {prof.maritalStatus}</span>
                  <span className="font-bold text-rose-700 group-hover:translate-x-0.5 transition-transform">
                    Connect →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / 3-Step Process */}
      <section className="bg-white py-16 border-y border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif-display text-3xl font-bold text-slate-900">
              A Structured, Transparent Matrimonial Journey
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Simple steps designed to ensure high intent, authenticated profiles, and dignified conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#faf7f2] p-6 rounded-2xl border border-amber-200/50 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Register & Build Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your educational background, lifestyle preferences, family values, and upload photos that undergo rapid administrative moderation.
              </p>
            </div>

            <div className="bg-[#faf7f2] p-6 rounded-2xl border border-amber-200/50 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Discover & Connect</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by religion, profession, location, and lifestyle. Send personalized interest requests to profiles that match your vision.
              </p>
            </div>

            <div className="bg-[#faf7f2] p-6 rounded-2xl border border-amber-200/50 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Mutual Acceptance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When both members accept interest, contact details are unlocked for safe family discussions and lifelong partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
