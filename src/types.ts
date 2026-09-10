export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
export type FoodPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';
export type SmokingDrinking = 'No' | 'Occasionally' | 'Yes';
export type MediaApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface MediaPhoto {
  id: string;
  url: string;
  caption?: string;
  status: MediaApprovalStatus;
  uploadedAt: string;
  rejectedReason?: string;
  isProfilePhoto?: boolean;
}

export interface PartnerPreferences {
  ageMin: number;
  ageMax: number;
  religions?: string[];
  maritalStatus?: string[];
  education?: string[];
  locations?: string[];
  minHeight?: string;
}

export interface Profile {
  _id: string;
  userId: string;
  fullName: string;
  gender: Gender;
  dob: string;
  age: number;
  maritalStatus: MaritalStatus;
  religion: string;
  caste: string;
  motherTongue: string;
  nationality: string;
  qualification: string;
  college: string;
  occupation: string;
  company?: string;
  annualIncome?: string;
  height: string;
  weight: string;
  foodPreference: FoodPreference;
  smokingStatus: SmokingDrinking;
  drinkingStatus: SmokingDrinking;
  city: string;
  state: string;
  country: string;
  bio: string;
  hobbies: string[];
  profilePhoto: string;
  photos: MediaPhoto[];
  isVerified: boolean;
  profileCompletion: number;
  partnerPreferences: PartnerPreferences;
  createdAt?: string;
  updatedAt?: string;
  favoritedAt?: string;
}

export type InterestStatus = 'pending' | 'accepted' | 'rejected';

export interface Interest {
  _id: string;
  id?: string;
  fromUserId: string;
  fromProfileId: string;
  toUserId: string;
  toProfileId: string;
  receiverId?: string;
  senderId?: string;
  status: InterestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  senderProfile?: Profile;
  receiverProfile?: Profile;
}

export interface Favorite {
  id?: string;
  userId?: string;
  profileId: string;
  profile?: Profile;
  createdAt?: string;
}

export interface MediaModerationItem {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  profileName: string;
  profileId: string;
}

export interface MatchRecommendation {
  profile: Profile;
  compatibilityScore: number;
  matchReasons: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  verifiedProfiles: number;
  verificationRate: number;
  totalUploads: number;
  pendingApprovals: number;
  approvedPhotos: number;
  rejectedPhotos: number;
  totalInterestsSent: number;
  acceptedInterests: number;
  registrationsByDate: Record<string, number>;
}

export interface AdminUserRecord {
  user: User;
  profile?: Profile;
}

export interface AdminMediaRecord {
  photo: MediaPhoto;
  profile: Profile;
  user: User;
}

export interface SearchFilters {
  q: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  religion: string;
  caste: string;
  occupation: string;
  education: string;
  city: string;
  state: string;
  maritalStatus: string;
  foodPreference: string;
  verifiedOnly: boolean;
}
