import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle, User, BookOpen, HeartHandshake, MapPin, Sparkles } from 'lucide-react';
import { Profile } from '../types.ts';
import { api } from '../services/api.ts';

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: Profile | null;
  onClose: () => void;
  onProfileUpdated: (updatedProfile: Profile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  profile,
  onClose,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'personal' | 'education' | 'lifestyle' | 'location' | 'preferences'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Form State
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [gender, setGender] = useState(profile?.gender || 'Female');
  const [dob, setDob] = useState(profile?.dob || '1996-01-01');
  const [maritalStatus, setMaritalStatus] = useState(profile?.maritalStatus || 'Never Married');

  const [religion, setReligion] = useState(profile?.religion || 'Hindu');
  const [caste, setCaste] = useState(profile?.caste || '');
  const [motherTongue, setMotherTongue] = useState(profile?.motherTongue || 'Hindi');
  const [nationality, setNationality] = useState(profile?.nationality || 'Indian');

  const [qualification, setQualification] = useState(profile?.qualification || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [annualIncome, setAnnualIncome] = useState(profile?.annualIncome || '');

  const [height, setHeight] = useState(profile?.height || "5'6\"");
  const [weight, setWeight] = useState(profile?.weight || '60 kg');
  const [foodPreference, setFoodPreference] = useState(profile?.foodPreference || 'Vegetarian');
  const [smokingStatus, setSmokingStatus] = useState(profile?.smokingStatus || 'No');
  const [drinkingStatus, setDrinkingStatus] = useState(profile?.drinkingStatus || 'No');

  const [city, setCity] = useState(profile?.city || '');
  const [stateVal, setStateVal] = useState(profile?.state || '');
  const [country, setCountry] = useState(profile?.country || 'India');
  const [bio, setBio] = useState(profile?.bio || '');
  const [hobbiesInput, setHobbiesInput] = useState(profile?.hobbies ? profile.hobbies.join(', ') : '');

  const [prefAgeMin, setPrefAgeMin] = useState(profile?.partnerPreferences?.ageMin || 24);
  const [prefAgeMax, setPrefAgeMax] = useState(profile?.partnerPreferences?.ageMax || 34);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const hobbies = hobbiesInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    try {
      setLoading(true);
      const res = await api.updateProfile({
        fullName,
        gender: gender as any,
        dob,
        maritalStatus: maritalStatus as any,
        religion,
        caste,
        motherTongue,
        nationality,
        qualification,
        college,
        occupation,
        company,
        annualIncome,
        height,
        weight,
        foodPreference: foodPreference as any,
        smokingStatus: smokingStatus as any,
        drinkingStatus: drinkingStatus as any,
        city,
        state: stateVal,
        country,
        bio,
        hobbies,
        partnerPreferences: {
          ageMin: prefAgeMin,
          ageMax: prefAgeMax,
          religions: [religion]
        }
      });

      setSuccess('Profile successfully updated!');
      onProfileUpdated(res.profile);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#faf7f2]/80">
          <div>
            <h2 id="edit-profile-title" className="font-serif-display text-xl font-bold text-slate-900">
              Edit Matrimonial Profile
            </h2>
            <p className="text-xs text-slate-600">Provide accurate details to increase match compatibility</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit profile dialog"
            className="min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'basic', label: '1. Basic Info', icon: User },
            { id: 'personal', label: '2. Religious & Community', icon: Sparkles },
            { id: 'education', label: '3. Career & Education', icon: BookOpen },
            { id: 'lifestyle', label: '4. Lifestyle & Habits', icon: HeartHandshake },
            { id: 'location', label: '5. Location & Bio', icon: MapPin },
            { id: 'preferences', label: '6. Partner Preferences', icon: Sparkles }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-3 min-h-[44px] whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-rose-600 text-rose-700 bg-white font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Basic Demographics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="Female">Female (Bride)</option>
                    <option value="Male">Male (Groom)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PERSONAL & COMMUNITY */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Community & Origins</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Religion / Faith</label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Christian">Christian</option>
                    <option value="Jain">Jain</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Parsi">Parsi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Caste / Sub-caste</label>
                  <input
                    type="text"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    placeholder="e.g. Brahmin, Reddy, Kayastha..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    required
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    placeholder="e.g. Hindi, Tamil, Telugu, Bengali..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EDUCATION & CAREER */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Education & Profession</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. B.Tech in CS, MBA, MD..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi, IIM, BITS..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    required
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer, Doctor, CA..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Microsoft, Google, Hospital..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Income Range</label>
                  <input
                    type="text"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="e.g. ₹ 25 - 35 Lakhs or $120,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LIFESTYLE & HABITS */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lifestyle Choices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={`e.g. 5'8" or 172 cm`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 65 kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Food Preference</label>
                  <select
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Jain">Jain Diet</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Smoking Habits</label>
                  <select
                    value={smokingStatus}
                    onChange={(e) => setSmokingStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Drinking Habits</label>
                  <select
                    value={drinkingStatus}
                    onChange={(e) => setDrinkingStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* LOCATION & BIO */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Location & Self Expression</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  About Me / Personal Bio (Important)
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your values, worldview, upbringing, passions, and what you cherish in a partner..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hobbies & Interests (Comma separated)</label>
                <input
                  type="text"
                  value={hobbiesInput}
                  onChange={(e) => setHobbiesInput(e.target.value)}
                  placeholder="e.g. Classical Music, Trekking, Reading Fiction, Gardening"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* PARTNER PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Partner Expectations</h3>
              <p className="text-xs text-slate-500">
                These preferences power the automated Match Suggestions engine to curate compatible matches for you.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Age</label>
                  <input
                    type="number"
                    min={18}
                    max={prefAgeMax}
                    value={prefAgeMin}
                    onChange={(e) => setPrefAgeMin(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Age</label>
                  <input
                    type="number"
                    min={prefAgeMin}
                    max={70}
                    value={prefAgeMax}
                    onChange={(e) => setPrefAgeMax(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Submit Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 min-h-[44px] bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 flex items-center space-x-1.5 transition-transform active:scale-95 disabled:opacity-70 justify-center"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
