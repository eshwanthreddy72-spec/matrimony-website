import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  RotateCcw,
  Check,
  X,
  Clock,
  Activity,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { AdminStats, User, Profile, MediaModerationItem, AdminUserRecord } from '../types.ts';
import { api } from '../services/api.ts';

interface AdminPanelProps {
  onViewProfile: (profile: Profile) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onViewProfile }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pendingMedia, setPendingMedia] = useState<MediaModerationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verifications' | 'media' | 'logs'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // User deletion state
  const [userToDelete, setUserToDelete] = useState<{ user: User; profile?: Profile } | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  // Rejection modal state for media
  const [rejectingPhoto, setRejectingPhoto] = useState<MediaModerationItem | null>(null);
  const [rejectReason, setRejectReason] = useState('Image does not clearly display face or violates quality standards');

  const [userSearch, setUserSearch] = useState('');
  const [profileSearch, setProfileSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, usersRes, mediaRes, profilesRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getPendingMedia(),
        api.getProfiles({})
      ]);

      setStats(statsRes);
      setAdminUsers(usersRes.users);
      setPendingMedia(mediaRes.pendingMedia);
      setProfiles(profilesRes.profiles);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrative records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUserStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await api.updateUserStatus(user._id, nextStatus);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleToggleVerify = async (profileId: string) => {
    try {
      await api.toggleProfileVerification(profileId);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    }
  };

  const handleApproveMedia = async (photoId: string) => {
    try {
      await api.moderateMedia(photoId, 'approved');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve media');
    }
  };

  const handleRejectMedia = async () => {
    if (!rejectingPhoto) return;
    try {
      await api.moderateMedia(rejectingPhoto.id, 'rejected', rejectReason);
      setRejectingPhoto(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject media');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeletingUser(true);
      const res = await api.deleteAdminUser(userToDelete.user._id);
      setActionSuccess(res.message);
      setUserToDelete(null);
      await loadData();
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user account');
    } finally {
      setDeletingUser(false);
    }
  };

  const filteredUsers = adminUsers.filter(
    (item) =>
      item.user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      item.user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (item.profile?.fullName && item.profile.fullName.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredProfiles = profiles.filter(
    (p) =>
      p.fullName.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.city.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.religion.toLowerCase().includes(profileSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs text-slate-500">Live Administration</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Matrimony Platform Administration
          </h1>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Activity },
          { id: 'users', label: `Users (${adminUsers.length})`, icon: Users },
          { id: 'verifications', label: `Profile Verification (${profiles.filter((p) => !p.isVerified).length} Pending)`, icon: ShieldCheck },
          { id: 'media', label: `Media Moderation (${pendingMedia.length} In Queue)`, icon: ImageIcon }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Users</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUsers}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Registered members</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Profiles</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalProfiles}</div>
              <span className="text-[10px] text-slate-400">Created bio-data</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Verified Profiles</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.verifiedProfiles}</div>
              <span className="text-[10px] text-emerald-600 font-medium">100% ID checked</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Pending Verif.</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">{stats.pendingVerifications}</div>
              <span className="text-[10px] text-amber-600 font-medium">Awaiting check</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Media In Queue</span>
              <div className="text-2xl font-bold text-rose-700 mt-1">{stats.pendingMediaCount}</div>
              <span className="text-[10px] text-rose-600 font-medium">Moderation required</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Inquiries</span>
              <div className="text-2xl font-bold text-blue-700 mt-1">{stats.totalInterests}</div>
              <span className="text-[10px] text-blue-600 font-medium">{stats.acceptedInterests} Mutual accepts</span>
            </div>
          </div>

          {/* Quick Action Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgent Media Moderation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Media Queue Needing Attention</h3>
                </div>
                <button
                  onClick={() => setActiveTab('media')}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  View All ({pendingMedia.length})
                </button>
              </div>

              {pendingMedia.length === 0 ? (
                <p className="text-xs text-slate-500">All uploaded photos have been approved or rejected.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {pendingMedia.slice(0, 3).map((item) => (
                    <div key={item.id} className="relative rounded-xl overflow-hidden border border-slate-200 h-28">
                      <img src={item.url} alt="queue" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] text-white font-bold truncate max-w-[90%]">
                        {item.profileName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Queue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Profiles Requiring ID Verification</h3>
                </div>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  View Profiles
                </button>
              </div>

              <div className="space-y-2">
                {profiles.filter(p => !p.isVerified).slice(0, 3).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                    <div className="flex items-center space-x-2.5">
                      <img src={p.profilePhoto} alt={p.fullName} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-900">{p.fullName}</p>
                        <p className="text-[11px] text-slate-500">{p.city} • {p.occupation}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleVerify(p._id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                    >
                      Verify Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-slate-900 text-sm">All Platform Accounts ({filteredUsers.length})</h2>
            <div className="relative sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by email or username..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Registered On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(({ user: u, profile: p }) => {
                  const isActive = u.status === 'active';
                  const isVerified = p?.isVerified;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p?.fullName || u.username}</div>
                        <div className="text-[11px] text-slate-500">@{u.username} • {u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          <span>{u.status.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isVerified ? (
                          <span className="text-emerald-700 font-semibold flex items-center space-x-1 text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'admin' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                                isActive
                                  ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {isActive ? 'Suspend' : 'Reactivate'}
                            </button>
                            <button
                              onClick={() => setUserToDelete({ user: u, profile: p })}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title="Delete user account and associated data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VERIFICATIONS TAB */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Profile Verification Audits</h2>
              <p className="text-xs text-slate-500">
                Grant or revoke official verification checkmarks after verifying matrimonial claims
              </p>
            </div>
            <div className="relative sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profileSearch}
                onChange={(e) => setProfileSearch(e.target.value)}
                placeholder="Filter by name or city..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((p) => (
              <div
                key={p._id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                  p.isVerified ? 'bg-emerald-50/20 border-emerald-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={p.profilePhoto}
                    alt={p.fullName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-xs truncate">
                        {p.fullName}, {p.age}
                      </h3>
                      {p.isVerified && (
                        <span className="text-emerald-700 text-[10px] font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{p.occupation}</p>
                    <p className="text-[11px] text-slate-500 truncate">{p.city} • {p.religion}</p>
                    <div className="text-[10px] text-rose-700 font-semibold mt-1">
                      {p.profileCompletion}% Bio-data Completion
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewProfile(p)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleToggleVerify(p._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      p.isVerified
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {p.isVerified ? 'Revoke Badge' : 'Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEDIA MODERATION TAB */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900 text-sm">Media Moderation Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and moderate member photographs to protect against impersonation, obscenity, or low-resolution imagery.
            </p>
          </div>

          {pendingMedia.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="text-sm font-bold text-slate-800">Media Queue is Completely Clear</p>
              <p className="text-xs text-slate-400">All user-submitted photographs have been moderated.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pendingMedia.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-64 bg-slate-100">
                    <img
                      src={photo.url}
                      alt="pending review"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Review Pending</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {photo.profileName}
                      </p>
                      {photo.caption && (
                        <p className="text-xs text-slate-600 italic truncate">
                          "{photo.caption}"
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400">
                        Uploaded: {new Date(photo.uploadedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRejectingPhoto(photo)}
                        className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApproveMedia(photo.id)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REJECT PHOTO MODAL */}
      {rejectingPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm">Reject Photograph</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Please specify a reason for rejecting this photograph. The reason will be clearly displayed to {rejectingPhoto.profileName}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rejection Reason</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectingPhoto(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectMedia}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Permanently Delete User Account?</h3>
                <p className="text-xs text-slate-500">
                  {userToDelete.profile?.fullName || userToDelete.user.username} (@{userToDelete.user.username})
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">Safe Cascaded Removal:</p>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                <li>User account and login credentials will be removed.</li>
                <li>Matrimony profile, photos, and verification documents deleted.</li>
                <li>All incoming and outgoing interest requests cleaned up.</li>
                <li>Saved bookmarks and favorites deleted without leaving orphan records.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deletingUser}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deletingUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center space-x-1.5"
              >
                {deletingUser ? <span>Deleting...</span> : <span>Confirm Permanent Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
