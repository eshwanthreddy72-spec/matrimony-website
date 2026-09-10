import React, { useState } from 'react';
import {
  Inbox,
  Send,
  Bookmark,
  Heart,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ShieldCheck,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Interest, Favorite, Profile } from '../types.ts';
import { api } from '../services/api.ts';

interface InterestsManagerProps {
  interestsReceived: Interest[];
  interestsSent: Interest[];
  favorites: Favorite[];
  onRefresh: () => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
}

export const InterestsManager: React.FC<InterestsManagerProps> = ({
  interestsReceived,
  interestsSent,
  favorites,
  onRefresh,
  onViewProfile,
  onSendInterest
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'favorites'>('received');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleAccept = async (interestId: string) => {
    try {
      setActionLoadingId(interestId);
      await api.acceptInterest(interestId);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to accept interest');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (interestId: string) => {
    try {
      setActionLoadingId(interestId);
      await api.rejectInterest(interestId);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to decline interest');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveFavorite = async (profileId: string) => {
    try {
      await api.removeFavorite(profileId);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove from shortlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900">
          Connections & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review matrimonial invitations, follow up on sent proposals, and manage shortlisted prospects.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center space-x-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'received'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received ({interestsReceived.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center space-x-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'sent'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Proposals ({interestsSent.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center space-x-2 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'favorites'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Shortlisted ({favorites.length})</span>
        </button>
      </div>

      {/* TAB 1: RECEIVED INTERESTS */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {interestsReceived.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No invitations received yet</p>
              <p className="text-xs text-slate-400">
                Enhance your profile photo and details to receive proposals from matching families.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {interestsReceived.map((item) => {
                const sender = item.senderProfile;
                if (!sender) return null;

                const isAccepted = item.status === 'accepted';
                const isRejected = item.status === 'rejected';
                const isPending = item.status === 'pending';

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                      isAccepted
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : isRejected
                        ? 'border-slate-200 opacity-60'
                        : 'border-rose-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={sender.profilePhoto}
                        alt={sender.fullName}
                        onClick={() => onViewProfile(sender)}
                        className="w-20 h-20 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => onViewProfile(sender)}
                            className="font-bold text-slate-900 text-sm hover:text-rose-600 cursor-pointer truncate"
                          >
                            {sender.fullName}, {sender.age}
                          </h3>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRejected
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isAccepted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isRejected && <XCircle className="w-3 h-3 text-slate-500" />}
                            {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{item.status.toUpperCase()}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 truncate flex items-center space-x-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          <span>{sender.occupation}</span>
                        </p>
                        <p className="text-xs text-slate-500 truncate flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{sender.city}, {sender.state}</span>
                        </p>
                      </div>
                    </div>

                    {/* Sender's Message */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                      "{item.message}"
                    </div>

                    {/* Contact Unlocked on Mutual Acceptance */}
                    {isAccepted && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                        <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Contact Details Unlocked</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 space-y-0.5">
                          <p className="flex items-center space-x-1.5">
                            <Mail className="w-3 h-3" />
                            <span>{sender.fullName.toLowerCase().replace(/\s+/g, '')}@example.com</span>
                          </p>
                          <p className="flex items-center space-x-1.5">
                            <Phone className="w-3 h-3" />
                            <span>+91 98765 43210 (Verified Mobile)</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onViewProfile(sender)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Full Profile
                      </button>

                      {isPending && (
                        <div className="flex items-center space-x-2">
                          <button
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleAccept(item.id)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                          >
                            Accept Interest
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SENT PROPOSALS */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {interestsSent.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <Send className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No proposals sent</p>
              <p className="text-xs text-slate-400">
                Explore the discovery feed and send an interest request to members you like.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {interestsSent.map((item) => {
                const receiver = item.receiverProfile;
                if (!receiver) return null;

                const isAccepted = item.status === 'accepted';
                const isRejected = item.status === 'rejected';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={receiver.profilePhoto}
                        alt={receiver.fullName}
                        onClick={() => onViewProfile(receiver)}
                        className="w-20 h-20 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => onViewProfile(receiver)}
                            className="font-bold text-slate-900 text-sm hover:text-rose-600 cursor-pointer truncate"
                          >
                            {receiver.fullName}, {receiver.age}
                          </h3>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRejected
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {receiver.occupation} • {receiver.city}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Sent: {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                      "{item.message}"
                    </div>

                    {isAccepted && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                        <p className="font-bold text-emerald-900">Proposal Accepted!</p>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          {receiver.fullName} has accepted your interest. You may initiate contact respectfully.
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => onViewProfile(receiver)}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                      >
                        View Profile Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SHORTLISTED FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Your shortlist is empty</p>
              <p className="text-xs text-slate-400">
                Click the heart icon on any profile to bookmark it here for family discussion.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => {
                const prof = fav.profile;
                if (!prof) return null;

                return (
                  <div
                    key={fav.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-48 bg-slate-100 cursor-pointer" onClick={() => onViewProfile(prof)}>
                      <img
                        src={prof.profilePhoto}
                        alt={prof.fullName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(prof._id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-600 hover:bg-rose-50 shadow-sm"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-bold text-base truncate">
                          {prof.fullName}, {prof.age}
                        </h3>
                        <p className="text-xs text-rose-100 truncate">
                          {prof.city}, {prof.state}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="text-xs text-slate-600 space-y-1">
                        <p className="font-medium text-slate-800 truncate">{prof.occupation}</p>
                        <p className="text-slate-500 truncate">{prof.religion} • {prof.qualification}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => onViewProfile(prof)}
                          className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg text-center"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onSendInterest(prof)}
                          className="flex-1 py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg text-center flex items-center justify-center space-x-1"
                        >
                          <Heart className="w-3 h-3" />
                          <span>Connect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
