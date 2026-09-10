import { User, Profile, Interest, Favorite } from './types.ts';
import { hashPassword } from './crypto.ts';

const defaultPasswordHash = hashPassword('Password123!');
const adminPasswordHash = hashPassword('AdminPass123!');

export const initialUsers: User[] = [
  {
    _id: 'usr-admin-1',
    username: 'admin',
    email: 'admin@matrimony.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    _id: 'usr-priya-2',
    username: 'priya_sharma',
    email: 'priya@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z'
  },
  {
    _id: 'usr-rohit-3',
    username: 'rohit_verma',
    email: 'rohit@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-12T11:30:00.000Z',
    updatedAt: '2025-01-12T11:30:00.000Z'
  },
  {
    _id: 'usr-ananya-4',
    username: 'ananya_iyer',
    email: 'ananya@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-15T09:15:00.000Z',
    updatedAt: '2025-01-15T09:15:00.000Z'
  },
  {
    _id: 'usr-arjun-5',
    username: 'arjun_mehta',
    email: 'arjun@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-18T14:20:00.000Z',
    updatedAt: '2025-01-18T14:20:00.000Z'
  },
  {
    _id: 'usr-neha-6',
    username: 'neha_patel',
    email: 'neha@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-20T16:00:00.000Z',
    updatedAt: '2025-01-20T16:00:00.000Z'
  },
  {
    _id: 'usr-vikram-7',
    username: 'vikram_singh',
    email: 'vikram@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-22T08:45:00.000Z',
    updatedAt: '2025-01-22T08:45:00.000Z'
  },
  {
    _id: 'usr-kavita-8',
    username: 'kavita_reddy',
    email: 'kavita@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-25T13:10:00.000Z',
    updatedAt: '2025-01-25T13:10:00.000Z'
  },
  {
    _id: 'usr-aditya-9',
    username: 'aditya_nair',
    email: 'aditya@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-01-28T17:40:00.000Z',
    updatedAt: '2025-01-28T17:40:00.000Z'
  },
  {
    _id: 'usr-sara-10',
    username: 'sara_khan',
    email: 'sara@example.com',
    passwordHash: defaultPasswordHash,
    role: 'user',
    status: 'active',
    createdAt: '2025-02-01T12:00:00.000Z',
    updatedAt: '2025-02-01T12:00:00.000Z'
  }
];

export const initialProfiles: Profile[] = [
  {
    _id: 'prof-priya-2',
    userId: 'usr-priya-2',
    fullName: 'Priya Sharma',
    gender: 'Female',
    dob: '1996-05-14',
    age: 29,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Brahmin',
    motherTongue: 'Hindi',
    nationality: 'Indian',
    qualification: 'M.Tech in Computer Science',
    college: 'IIT Delhi',
    occupation: 'Lead AI Engineer',
    company: 'Microsoft',
    annualIncome: '₹ 32 - 40 Lakhs',
    height: "5'5\"",
    weight: '56 kg',
    foodPreference: 'Vegetarian',
    smokingStatus: 'No',
    drinkingStatus: 'No',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    bio: 'Curious thinker who loves classical music, hiking mountain trails on weekends, and experimenting with traditional Indian recipes. Looking for a compassionate partner with shared intellectual curiosity and family values.',
    hobbies: ['Classical Music', 'Trekking', 'Reading Fiction', 'Gardening'],
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-p1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        caption: 'Traditional family celebration',
        status: 'approved',
        uploadedAt: '2025-01-10T10:05:00.000Z',
        isProfilePhoto: true
      },
      {
        id: 'photo-p2',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        caption: 'Weekend hike in Coorg',
        status: 'approved',
        uploadedAt: '2025-01-10T10:08:00.000Z'
      },
      {
        id: 'photo-p3',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
        caption: 'Graduation Day',
        status: 'pending',
        uploadedAt: '2025-02-15T14:30:00.000Z'
      }
    ],
    isVerified: true,
    profileCompletion: 95,
    partnerPreferences: {
      ageMin: 28,
      ageMax: 34,
      religions: ['Hindu'],
      maritalStatus: ['Never Married'],
      education: ['Masters', 'Doctorate', 'B.Tech/BE'],
      locations: ['Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad']
    },
    createdAt: '2025-01-10T10:05:00.000Z',
    updatedAt: '2025-01-10T10:05:00.000Z'
  },
  {
    _id: 'prof-rohit-3',
    userId: 'usr-rohit-3',
    fullName: 'Rohit Verma',
    gender: 'Male',
    dob: '1994-08-22',
    age: 31,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Kayastha',
    motherTongue: 'Hindi',
    nationality: 'Indian',
    qualification: 'MBA, B.Tech',
    college: 'IIM Ahmedabad & BITS Pilani',
    occupation: 'Senior Product Manager',
    company: 'Google',
    annualIncome: '₹ 45 - 55 Lakhs',
    height: "5'11\"",
    weight: '74 kg',
    foodPreference: 'Eggetarian',
    smokingStatus: 'No',
    drinkingStatus: 'Occasionally',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    bio: 'Product builder by day, marathon runner and coffee enthusiast by weekend. I believe relationships thrive on deep mutual respect, laughter, emotional maturity, and shared wanderlust.',
    hobbies: ['Marathon Running', 'Specialty Coffee', 'Podcasting', 'Travel Photography'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-r1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        caption: 'Formal portrait',
        status: 'approved',
        uploadedAt: '2025-01-12T11:35:00.000Z',
        isProfilePhoto: true
      },
      {
        id: 'photo-r2',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
        caption: 'Trip to Ladakh',
        status: 'approved',
        uploadedAt: '2025-01-12T11:40:00.000Z'
      }
    ],
    isVerified: true,
    profileCompletion: 100,
    partnerPreferences: {
      ageMin: 25,
      ageMax: 31,
      religions: ['Hindu', 'Any'],
      maritalStatus: ['Never Married'],
      education: ['Post Graduate', 'Professional Degree'],
      locations: ['Bengaluru', 'Mumbai', 'Delhi NCR']
    },
    createdAt: '2025-01-12T11:35:00.000Z',
    updatedAt: '2025-01-12T11:35:00.000Z'
  },
  {
    _id: 'prof-ananya-4',
    userId: 'usr-ananya-4',
    fullName: 'Dr. Ananya Iyer',
    gender: 'Female',
    dob: '1995-11-03',
    age: 30,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Iyer',
    motherTongue: 'Tamil',
    nationality: 'Indian',
    qualification: 'MD in Pediatrics',
    college: 'Madras Medical College',
    occupation: 'Consultant Pediatrician',
    company: 'Apollo Children Hospital',
    annualIncome: '₹ 28 - 35 Lakhs',
    height: "5'4\"",
    weight: '53 kg',
    foodPreference: 'Vegetarian',
    smokingStatus: 'No',
    drinkingStatus: 'No',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    bio: 'Passionate about healing children, trained in Carnatic vocal music and Bharatanatyam. Cherish traditional roots while enjoying modern art galleries and quiet beach walks.',
    hobbies: ['Carnatic Singing', 'Bharatanatyam', 'Baking', 'Yoga'],
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-a1',
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        caption: 'Professional portrait',
        status: 'approved',
        uploadedAt: '2025-01-15T09:20:00.000Z',
        isProfilePhoto: true
      },
      {
        id: 'photo-a2',
        url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
        caption: 'Classical performance outfit',
        status: 'approved',
        uploadedAt: '2025-01-15T09:25:00.000Z'
      }
    ],
    isVerified: true,
    profileCompletion: 90,
    partnerPreferences: {
      ageMin: 29,
      ageMax: 35,
      religions: ['Hindu'],
      maritalStatus: ['Never Married'],
      education: ['Medical', 'Engineering', 'Civil Services', 'MBA'],
      locations: ['Chennai', 'Bengaluru', 'Coimbatore']
    },
    createdAt: '2025-01-15T09:20:00.000Z',
    updatedAt: '2025-01-15T09:20:00.000Z'
  },
  {
    _id: 'prof-arjun-5',
    userId: 'usr-arjun-5',
    fullName: 'Arjun Mehta',
    gender: 'Male',
    dob: '1993-04-18',
    age: 32,
    maritalStatus: 'Never Married',
    religion: 'Jain',
    caste: 'Shwetambar',
    motherTongue: 'Gujarati',
    nationality: 'Indian',
    qualification: 'Chartered Accountant (FCA)',
    college: 'ICAI Mumbai',
    occupation: 'Investment Director',
    company: 'Kotak Private Equity',
    annualIncome: '₹ 50 - 65 Lakhs',
    height: "5'10\"",
    weight: '72 kg',
    foodPreference: 'Jain',
    smokingStatus: 'No',
    drinkingStatus: 'No',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    bio: 'Finance professional grounded in spiritual values. Love playing tennis, discussing world economics, and supporting community education initiatives. Seeking a loving life partner who appreciates family warmth.',
    hobbies: ['Tennis', 'Chess', 'Meditation', 'Documentaries'],
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-ar1',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        uploadedAt: '2025-01-18T14:25:00.000Z',
        isProfilePhoto: true
      },
      {
        id: 'photo-ar2',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
        caption: 'Mumbai Sea Link drive',
        status: 'pending',
        uploadedAt: '2025-02-10T11:00:00.000Z'
      }
    ],
    isVerified: true,
    profileCompletion: 95,
    partnerPreferences: {
      ageMin: 26,
      ageMax: 32,
      religions: ['Jain', 'Hindu'],
      maritalStatus: ['Never Married'],
      education: ['CA', 'CFA', 'MBA', 'Masters'],
      locations: ['Mumbai', 'Ahmedabad', 'Pune']
    },
    createdAt: '2025-01-18T14:25:00.000Z',
    updatedAt: '2025-01-18T14:25:00.000Z'
  },
  {
    _id: 'prof-neha-6',
    userId: 'usr-neha-6',
    fullName: 'Neha Patel',
    gender: 'Female',
    dob: '1997-02-11',
    age: 28,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Patidar',
    motherTongue: 'Gujarati',
    nationality: 'Indian',
    qualification: 'Master of Architecture',
    college: 'CEPT University, Ahmedabad',
    occupation: 'Lead Urban Architect & Restorer',
    company: 'Studio Vistara',
    annualIncome: '₹ 22 - 28 Lakhs',
    height: "5'6\"",
    weight: '58 kg',
    foodPreference: 'Vegetarian',
    smokingStatus: 'No',
    drinkingStatus: 'Occasionally',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    bio: 'Passionate about sustainable architecture, heritage conservation, and pottery. Enjoy calm mornings with watercolor sketching and discovering architectural gems in ancient cities.',
    hobbies: ['Ceramics', 'Watercolor Painting', 'Architectural Tours', 'Cycling'],
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-n1',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        uploadedAt: '2025-01-20T16:05:00.000Z',
        isProfilePhoto: true
      },
      {
        id: 'photo-n2',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
        status: 'pending',
        caption: 'Site inspection at heritage stepwell',
        uploadedAt: '2025-02-12T09:00:00.000Z'
      }
    ],
    isVerified: false,
    profileCompletion: 85,
    partnerPreferences: {
      ageMin: 27,
      ageMax: 33,
      religions: ['Hindu', 'Jain'],
      maritalStatus: ['Never Married'],
      education: ['Masters', 'B.Tech/BE', 'Design', 'MBA'],
      locations: ['Ahmedabad', 'Mumbai', 'Vadodara', 'Bengaluru']
    },
    createdAt: '2025-01-20T16:05:00.000Z',
    updatedAt: '2025-01-20T16:05:00.000Z'
  },
  {
    _id: 'prof-vikram-7',
    userId: 'usr-vikram-7',
    fullName: 'Major Vikram Singh',
    gender: 'Male',
    dob: '1992-09-30',
    age: 33,
    maritalStatus: 'Never Married',
    religion: 'Sikh',
    caste: 'Jat Sikh',
    motherTongue: 'Punjabi',
    nationality: 'Indian',
    qualification: 'B.Tech Mechanical & NDA Graduate',
    college: 'National Defence Academy',
    occupation: 'Officer / Aerospace Specialist',
    company: 'Defence Research & Services',
    annualIncome: '₹ 25 - 30 Lakhs',
    height: "6'1\"",
    weight: '82 kg',
    foodPreference: 'Non-Vegetarian',
    smokingStatus: 'No',
    drinkingStatus: 'Occasionally',
    city: 'Chandigarh',
    state: 'Punjab',
    country: 'India',
    bio: 'Disciplined, adventure lover, fond of horse riding and wildlife safaris. Seeking an honest, kind-hearted companion who embraces life enthusiastically and values integrity.',
    hobbies: ['Equestrian Riding', 'Wildlife Safaris', 'Guitar', 'Gym Training'],
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-v1',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        uploadedAt: '2025-01-22T08:50:00.000Z',
        isProfilePhoto: true
      }
    ],
    isVerified: true,
    profileCompletion: 90,
    partnerPreferences: {
      ageMin: 27,
      ageMax: 33,
      religions: ['Sikh', 'Hindu'],
      maritalStatus: ['Never Married'],
      education: ['Graduate', 'Post Graduate'],
      locations: ['Chandigarh', 'Delhi NCR', 'Mohali', 'Dehradun']
    },
    createdAt: '2025-01-22T08:50:00.000Z',
    updatedAt: '2025-01-22T08:50:00.000Z'
  },
  {
    _id: 'prof-kavita-8',
    userId: 'usr-kavita-8',
    fullName: 'Kavita Reddy',
    gender: 'Female',
    dob: '1995-07-19',
    age: 30,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Reddy',
    motherTongue: 'Telugu',
    nationality: 'Indian',
    qualification: 'MS in Biotechnology',
    college: 'University of Texas, Austin',
    occupation: 'Principal Research Scientist',
    company: 'Dr. Reddy Laboratories',
    annualIncome: '₹ 35 - 42 Lakhs',
    height: "5'7\"",
    weight: '60 kg',
    foodPreference: 'Eggetarian',
    smokingStatus: 'No',
    drinkingStatus: 'Occasionally',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    bio: 'Passionate genetic researcher and amateur astronomer. Enjoy deep conversations over filter coffee, star gazing with my telescope, and volunteering with animal rescue shelters.',
    hobbies: ['Stargazing / Astronomy', 'Violin', 'Badminton', 'Pet Rescue'],
    profilePhoto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-k1',
        url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        uploadedAt: '2025-01-25T13:15:00.000Z',
        isProfilePhoto: true
      }
    ],
    isVerified: true,
    profileCompletion: 95,
    partnerPreferences: {
      ageMin: 29,
      ageMax: 35,
      religions: ['Hindu'],
      maritalStatus: ['Never Married'],
      education: ['MS / PhD', 'B.Tech/BE', 'MBA'],
      locations: ['Hyderabad', 'Bengaluru', 'Dallas', 'California']
    },
    createdAt: '2025-01-25T13:15:00.000Z',
    updatedAt: '2025-01-25T13:15:00.000Z'
  },
  {
    _id: 'prof-aditya-9',
    userId: 'usr-aditya-9',
    fullName: 'Aditya Nair',
    gender: 'Male',
    dob: '1995-03-12',
    age: 30,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    caste: 'Nair',
    motherTongue: 'Malayalam',
    nationality: 'Indian',
    qualification: 'M.Des in Human Computer Interaction',
    college: 'NID Ahmedabad',
    occupation: 'Design Director',
    company: 'Fintech Unicorn',
    annualIncome: '₹ 38 - 48 Lakhs',
    height: "5'10\"",
    weight: '70 kg',
    foodPreference: 'Non-Vegetarian',
    smokingStatus: 'No',
    drinkingStatus: 'Occasionally',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    bio: 'Design fanatic, scuba diving enthusiast, and indie filmmaker. Value empathy, warmth, mutual creative freedom, and culinary explorations.',
    hobbies: ['Scuba Diving', 'Short Filmmaking', 'Specialty Cooking', 'Kayaking'],
    profilePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-ad1',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        uploadedAt: '2025-01-28T17:45:00.000Z',
        isProfilePhoto: true
      }
    ],
    isVerified: true,
    profileCompletion: 90,
    partnerPreferences: {
      ageMin: 26,
      ageMax: 32,
      religions: ['Hindu', 'Any'],
      maritalStatus: ['Never Married'],
      education: ['Graduate', 'Post Graduate', 'Arts/Design/Tech'],
      locations: ['Kochi', 'Bengaluru', 'Mumbai', 'Singapore']
    },
    createdAt: '2025-01-28T17:45:00.000Z',
    updatedAt: '2025-01-28T17:45:00.000Z'
  },
  {
    _id: 'prof-sara-10',
    userId: 'usr-sara-10',
    fullName: 'Dr. Sara Khan',
    gender: 'Female',
    dob: '1996-10-05',
    age: 29,
    maritalStatus: 'Never Married',
    religion: 'Muslim',
    caste: 'Sunni',
    motherTongue: 'Urdu',
    nationality: 'Indian',
    qualification: 'BDS & Masters in Orthodontics',
    college: 'King George Medical University (KGMU)',
    occupation: 'Orthodontist & Clinic Founder',
    company: 'Smile Studio',
    annualIncome: '₹ 25 - 32 Lakhs',
    height: "5'5\"",
    weight: '55 kg',
    foodPreference: 'Non-Vegetarian',
    smokingStatus: 'No',
    drinkingStatus: 'No',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    bio: 'Dedicated dental surgeon with a penchant for Urdu poetry, calligraphy, and historical architecture. Looking for a deen-conscious, supportive partner with good humor and kind nature.',
    hobbies: ['Calligraphy', 'Poetry Recitation', 'Baking Pastries', 'Historical Walks'],
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    photos: [
      {
        id: 'photo-s1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        status: 'approved',
        uploadedAt: '2025-02-01T12:05:00.000Z',
        isProfilePhoto: true
      },
      {
        id: 'photo-s2',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        caption: 'At historical residency',
        status: 'pending',
        uploadedAt: '2025-02-14T10:00:00.000Z'
      }
    ],
    isVerified: true,
    profileCompletion: 92,
    partnerPreferences: {
      ageMin: 28,
      ageMax: 34,
      religions: ['Muslim'],
      maritalStatus: ['Never Married'],
      education: ['Medical', 'Masters', 'Engineering', 'MBA'],
      locations: ['Lucknow', 'Delhi NCR', 'Dubai', 'Hyderabad']
    },
    createdAt: '2025-02-01T12:05:00.000Z',
    updatedAt: '2025-02-01T12:05:00.000Z'
  }
];

export const initialInterests: Interest[] = [
  {
    _id: 'int-1',
    fromUserId: 'usr-rohit-3',
    fromProfileId: 'prof-rohit-3',
    toUserId: 'usr-priya-2',
    toProfileId: 'prof-priya-2',
    status: 'pending',
    message: 'Hello Priya, your profile and passion for AI & music resonated with me. I would love to connect and know more about you!',
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-02-01T10:00:00.000Z'
  },
  {
    _id: 'int-2',
    fromUserId: 'usr-priya-2',
    fromProfileId: 'prof-priya-2',
    toUserId: 'usr-arjun-5',
    toProfileId: 'prof-arjun-5',
    status: 'accepted',
    message: 'Hi Arjun, I admire your grounded nature and love for community work. Looking forward to speaking!',
    createdAt: '2025-01-20T15:00:00.000Z',
    updatedAt: '2025-01-22T09:00:00.000Z'
  },
  {
    _id: 'int-3',
    fromUserId: 'usr-vikram-7',
    fromProfileId: 'prof-vikram-7',
    toUserId: 'usr-priya-2',
    toProfileId: 'prof-priya-2',
    status: 'pending',
    message: 'Greetings Priya, our life values and outlook align very closely. Would be delighted to connect.',
    createdAt: '2025-02-10T12:00:00.000Z',
    updatedAt: '2025-02-10T12:00:00.000Z'
  },
  {
    _id: 'int-4',
    fromUserId: 'usr-aditya-9',
    fromProfileId: 'prof-aditya-9',
    toUserId: 'usr-ananya-4',
    toProfileId: 'prof-ananya-4',
    status: 'pending',
    message: 'Hi Dr. Ananya, great to read about your classical arts background. Would love to introduce myself!',
    createdAt: '2025-02-05T14:30:00.000Z',
    updatedAt: '2025-02-05T14:30:00.000Z'
  }
];

export const initialFavorites: Favorite[] = [
  {
    _id: 'fav-1',
    userId: 'usr-priya-2',
    profileId: 'prof-rohit-3',
    createdAt: '2025-01-14T08:00:00.000Z'
  },
  {
    _id: 'fav-2',
    userId: 'usr-priya-2',
    profileId: 'prof-aditya-9',
    createdAt: '2025-01-29T10:00:00.000Z'
  },
  {
    _id: 'fav-3',
    userId: 'usr-rohit-3',
    profileId: 'prof-ananya-4',
    createdAt: '2025-01-16T12:00:00.000Z'
  }
];
