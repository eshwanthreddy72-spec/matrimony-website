export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
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
  // Basic Information
  fullName: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD
  age: number;
  maritalStatus: MaritalStatus;
  
  // Personal Information
  religion: string;
  caste: string;
  motherTongue: string;
  nationality: string;

  // Education & Career
  qualification: string;
  college: string;
  occupation: string;
  company?: string;
  annualIncome?: string;

  // Lifestyle
  height: string; // e.g. "5'9\"" or "175 cm"
  weight: string; // e.g. "68 kg"
  foodPreference: FoodPreference;
  smokingStatus: SmokingDrinking;
  drinkingStatus: SmokingDrinking;

  // Contact / Location
  city: string;
  state: string;
  country: string;

  // Bio & Hobbies
  bio: string;
  hobbies: string[];

  // Media
  profilePhoto: string;
  photos: MediaPhoto[];

  // Verification & Status
  isVerified: boolean;
  profileCompletion: number; // 0-100
  partnerPreferences: PartnerPreferences;

  createdAt: string;
  updatedAt: string;
}

export type InterestStatus = 'pending' | 'accepted' | 'rejected';

export interface Interest {
  _id: string;
  fromUserId: string;
  fromProfileId: string;
  toUserId: string;
  toProfileId: string;
  status: InterestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  profileId: string;
  createdAt: string;
}

export interface PasswordResetToken {
  token: string;
  otp: string;
  email: string;
  expiresAt: number;
}
