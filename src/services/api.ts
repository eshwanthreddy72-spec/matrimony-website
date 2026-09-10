import {
  User,
  Profile,
  Interest,
  MatchRecommendation,
  AdminStats,
  AdminUserRecord,
  AdminMediaRecord,
  SearchFilters,
  MediaPhoto
} from '../types.ts';

const TOKEN_KEY = 'matrimony_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  remove: () => localStorage.removeItem(TOKEN_KEY)
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Authentication
  register: (body: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender?: string;
  }) => request<{ message: string; token: string; user: User; profile: Profile }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body)
  }),

  login: (body: { identifier: string; password: string }) =>
    request<{ message: string; token: string; user: User; profile?: Profile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  adminLogin: (body: { identifier: string; password: string }) =>
    request<{ message: string; token: string; user: User }>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  logout: () => request<{ message: string }>('/api/auth/logout', { method: 'POST' }),

  getMe: () => request<{ user: User; profile?: Profile }>('/api/auth/me'),

  forgotPassword: (email: string) =>
    request<{ message: string; resetToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (body: { email: string; otp: string; newPassword: string; confirmPassword: string }) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  // Profile Management
  getProfile: () => request<{ profile: Profile }>('/api/profile'),

  updateProfile: (profileData: Partial<Profile>) =>
    request<{ message: string; profile: Profile }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

  deleteProfile: () => request<{ message: string }>('/api/profile', { method: 'DELETE' }),

  // Search & Matchmaking
  searchProfiles: (filters: Partial<SearchFilters>) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.gender && filters.gender !== 'All') params.set('gender', filters.gender);
    if (filters.ageMin) params.set('ageMin', filters.ageMin.toString());
    if (filters.ageMax) params.set('ageMax', filters.ageMax.toString());
    if (filters.religion && filters.religion !== 'All') params.set('religion', filters.religion);
    if (filters.caste) params.set('caste', filters.caste);
    if (filters.city) params.set('city', filters.city);
    if (filters.occupation) params.set('occupation', filters.occupation);
    if (filters.education) params.set('education', filters.education);
    if (filters.maritalStatus && filters.maritalStatus !== 'All') params.set('maritalStatus', filters.maritalStatus);
    if (filters.foodPreference && filters.foodPreference !== 'All') params.set('foodPreference', filters.foodPreference);
    if (filters.verifiedOnly) params.set('verifiedOnly', 'true');

    return request<{ total: number; profiles: Profile[] }>(`/api/profiles?${params.toString()}`);
  },

  getProfileById: (id: string) => request<{ profile: Profile }>(`/api/profiles/${id}`),

  getMatchRecommendations: () =>
    request<{ total: number; recommendations: MatchRecommendation[] }>('/api/matches'),

  // Favorites
  getFavorites: () => request<{ total: number; profiles: Profile[] }>('/api/favorites'),

  addFavorite: (profileId: string) =>
    request<{ message: string }>('/api/favorites/' + profileId, { method: 'POST' }),

  removeFavorite: (profileId: string) =>
    request<{ message: string }>('/api/favorites/' + profileId, { method: 'DELETE' }),

  // Interest Management
  getInterests: () =>
    request<{ sent: Interest[]; received: Interest[] }>('/api/interests'),

  sendInterest: (targetProfileId: string, message?: string) =>
    request<{ message: string; interest: Interest }>('/api/interests', {
      method: 'POST',
      body: JSON.stringify({ targetProfileId, message })
    }),

  updateInterest: (id: string, action: 'accept' | 'reject' | 'cancel') =>
    request<{ message: string; interest: Interest }>(`/api/interests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    }),

  deleteInterest: (id: string) =>
    request<{ message: string }>(`/api/interests/${id}`, { method: 'DELETE' }),

  // Media Management
  getMedia: () =>
    request<{ total: number; photos: MediaPhoto[]; profilePhoto: string }>('/api/media'),

  uploadMedia: (data: { url?: string; base64Data?: string; caption?: string; isProfilePhoto?: boolean }) =>
    request<{ message: string; photo: MediaPhoto; profile: Profile }>('/api/media/upload', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  setPrimaryPhoto: (photoId: string) =>
    request<{ message: string; profilePhoto: string; photos: MediaPhoto[] }>(`/api/media/${photoId}/primary`, {
      method: 'PUT'
    }),

  deleteMedia: (photoId: string) =>
    request<{ message: string; photos: MediaPhoto[]; profilePhoto: string }>(`/api/media/${photoId}`, {
      method: 'DELETE'
    }),

  // Admin Panel APIs
  getAdminStats: () => request<AdminStats>('/api/admin/stats'),

  getAdminUsers: () => request<{ users: AdminUserRecord[] }>('/api/admin/users'),

  updateUserStatus: (userId: string, status: 'active' | 'suspended') =>
    request<{ message: string; user: Partial<User> }>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  deleteAdminUser: (userId: string) =>
    request<{ message: string }>(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    }),

  toggleProfileVerification: (profileId: string, isVerified?: boolean) =>
    request<{ message: string; profile: Profile }>(`/api/admin/profiles/${profileId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified })
    }),

  getAdminMedia: () => request<{ media: AdminMediaRecord[] }>('/api/admin/media'),

  updateMediaStatus: (photoId: string, status: 'approved' | 'rejected', reason?: string) =>
    request<{ message: string; photo: MediaPhoto }>(`/api/admin/media/${photoId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason })
    }),

  deleteAdminMedia: (profileId: string, photoId: string) =>
    request<{ message: string }>(`/api/admin/media/${profileId}/${photoId}`, {
      method: 'DELETE'
    }),

  // Convenience Aliases & Helpers
  getProfiles: (filters?: Partial<SearchFilters>) => api.searchProfiles(filters || {}),
  getMyProfile: () => api.getProfile(),
  getSentInterests: async () => {
    const res = await api.getInterests();
    return { interests: res.sent };
  },
  getReceivedInterests: async () => {
    const res = await api.getInterests();
    return { interests: res.received };
  },
  getRecommendations: () => api.getMatchRecommendations(),
  acceptInterest: (id: string) => api.updateInterest(id, 'accept'),
  rejectInterest: (id: string) => api.updateInterest(id, 'reject'),
  getPendingMedia: async () => {
    const res = await api.getAdminMedia();
    return {
      pendingMedia: res.media
        .filter((m: any) => m.photo.status === 'pending')
        .map((m: any) => ({
          id: m.photo.id,
          url: m.photo.url,
          caption: m.photo.caption,
          uploadedAt: m.photo.uploadedAt,
          profileName: m.profile?.fullName || m.user?.username || 'Member',
          profileId: m.profile?._id || ''
        }))
    };
  },
  moderateMedia: (photoId: string, status: 'approved' | 'rejected', reason?: string) =>
    api.updateMediaStatus(photoId, status, reason)
};
