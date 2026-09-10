# Matrimony Management Platform — Architecture, Security, & System Documentation

## 1. Executive Summary

The **Matrimony Management Platform** is an enterprise-ready, full-stack web application designed for verified matrimonial matchmaking, secure interpersonal communication, and administrative governance. 

The platform is built using a modern, decoupled monolithic stack:
- **Backend**: Node.js & Express with typed RESTful endpoints, persistent schema storage, JWT authentication, and administrative moderation pipelines.
- **Frontend**: React 19 with Vite, TypeScript, and Tailwind CSS, utilizing a component-driven architecture with zero external UI bloat.
- **Data Layer**: File-persisted typed relational database engine (`.data/db.json`) mirroring production MongoDB/DocumentDB schemas with transactional write guarantees.

---

## 2. System Architecture & Topology

```
                         ┌─────────────────────────────────────────┐
                         │               Client Layer              │
                         │   React 19 + TypeScript + Tailwind CSS  │
                         └───────────────────┬─────────────────────┘
                                             │ HTTPS / JSON
                                             ▼
                         ┌─────────────────────────────────────────┐
                         │              Reverse Proxy              │
                         │             Nginx (Port 3000)           │
                         └───────────────────┬─────────────────────┘
                                             │
                                             ▼
                         ┌─────────────────────────────────────────┐
                         │           Express API Server            │
                         │   • JWT Auth & RBAC Middleware          │
                         │   • Validation & Sanitization Layer     │
                         │   • Rate Limiting & Security Headers    │
                         └──────┬───────┬───────┬───────┬──────────┘
                                │       │       │       │
       ┌────────────────────────┘       │       │       └────────────────────────┐
       ▼                                ▼       ▼                                ▼
┌───────────────┐           ┌───────────────┐ ┌───────────────┐          ┌───────────────┐
│  Auth Router  │           │Profile Router │ │Match & Search │          │ Admin Control │
│ • Login       │           │• Edit Profile │ │• Filtering    │          │• Verify Users │
│ • Register    │           │• Completion % │ │• Compatibility│          │• Media Review │
│ • OTP Reset   │           │• Preferences  │ │• Scoring Eng. │          │• Suspension   │
└───────┬───────┘           └───────┬───────┘ └───────┬───────┘          └───────┬───────┘
        │                           │                 │                          │
        └───────────────────────────┼─────────────────┴──────────────────────────┘
                                    ▼
                         ┌─────────────────────────────────────────┐
                         │        Data Access Layer (DAL)          │
                         │  • Atomic JSON File Persistence Engine  │
                         │  • Schema Type Enforcers & Seeders      │
                         └───────────────────┬─────────────────────┘
                                             ▼
                         ┌─────────────────────────────────────────┐
                         │     Persistence Store (.data/db.json)   │
                         │ Users | Profiles | Interests | Media    │
                         └─────────────────────────────────────────┘
```

---

## 3. Data Models & Relational Schema

### 3.1 User Entity (`User`)
Represents the authentication and account record.
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `string` | Unique UUID/ObjectID |
| `username` | `string` | Unique profile username |
| `email` | `string` | Unique lowercase email address |
| `passwordHash`| `string` | Bcrypt or SHA-256 hashed credential |
| `role` | `'user' \| 'admin'` | RBAC authorization role |
| `status` | `'active' \| 'suspended'`| Account access state |
| `createdAt` | `ISO string` | Registration timestamp |
| `updatedAt` | `ISO string` | Last account update timestamp |

### 3.2 Profile Entity (`Profile`)
Stores biographical, educational, family, and partner preference details.
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `string` | Unique profile identifier |
| `userId` | `string` | Foreign key referencing `User._id` |
| `fullName` | `string` | Display name of the member |
| `gender` | `'Male' \| 'Female' \| 'Other'` | Biological gender |
| `dob` | `string` | Date of birth (`YYYY-MM-DD`) |
| `age` | `number` | Computed age in years |
| `maritalStatus` | `MaritalStatus` | Never Married, Divorced, Widowed, etc. |
| `religion` | `string` | Religious affiliation (Hindu, Muslim, Sikh, etc.) |
| `caste` | `string` | Community or caste designation |
| `motherTongue` | `string` | Primary spoken native language |
| `qualification`| `string` | Educational degree |
| `occupation` | `string` | Profession / current position |
| `company` | `string?` | Employer organization |
| `annualIncome` | `string?` | Bracket / financial compensation |
| `height` / `weight`| `string` | Physical attributes |
| `foodPreference` | `FoodPreference` | Vegetarian, Non-Veg, Jain, Vegan, etc. |
| `smokingStatus` | `SmokingDrinking` | Lifestyle habits (No, Occasionally, Yes) |
| `drinkingStatus`| `SmokingDrinking` | Lifestyle habits |
| `city` / `state`| `string` | Residential location |
| `bio` | `string` | Free-form personal narrative |
| `hobbies` | `string[]` | Array of personal interests |
| `profilePhoto` | `string` | Primary approved image URL |
| `photos` | `MediaPhoto[]` | Moderated photo gallery items |
| `isVerified` | `boolean` | Government ID / human verification flag |
| `profileCompletion` | `number` | Dynamic completion rating (0–100%) |
| `partnerPreferences`| `PartnerPreferences` | Desired age, religion, education criteria |

### 3.3 Interest Proposal Entity (`Interest`)
Tracks two-way connection proposals between members.
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `string` | Unique interest ID |
| `fromUserId` | `string` | Sender's User ID |
| `fromProfileId`| `string` | Sender's Profile ID |
| `toUserId` | `string` | Recipient's User ID |
| `toProfileId` | `string` | Recipient's Profile ID |
| `status` | `'pending' \| 'accepted' \| 'rejected'` | Mutual state |
| `message` | `string?` | Custom or template proposal note |
| `createdAt` | `ISO string` | Transmission timestamp |
| `updatedAt` | `ISO string` | Status modification timestamp |

### 3.4 Media Entity (`MediaPhoto`)
Tracks individual photos submitted for administrative moderation.
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique photo ID |
| `url` | `string` | Image URL / base64 source |
| `caption` | `string?` | Photo context or caption |
| `status` | `'approved' \| 'pending' \| 'rejected'` | Moderation state |
| `rejectedReason`| `string?` | Compliance reason if rejected |
| `isProfilePhoto`| `boolean` | Flag indicating primary avatar |
| `uploadedAt` | `ISO string` | Timestamp |

---

## 4. Security Architecture & Threat Mitigation

### 4.1 Authentication & Token Mechanics
- **Token Format**: Standards-compliant JSON Web Tokens (`HS256`).
- **Signature Secret**: Configured via `JWT_SECRET` environment variable with a resilient fallback for zero-configuration development environments.
- **Expiration**: Auth tokens carry a 7-day time-to-live (`expiresIn: '7d'`).
- **Authorization Header**: Client requests pass `Authorization: Bearer <token>`.
- **Token Revocation / Role Invalidation**: The `authenticate` middleware verifies both token integrity and checks that the user exists and is in `'active'` status. Suspended users are immediately denied access (`403 Forbidden: Account suspended`).

### 4.2 Role-Based Access Control (RBAC)
Two strictly separated roles are enforced:
1. `user`: Standard member authorized to modify only their own profile, send/respond to interests, and upload personal photos.
2. `admin`: Privileged operator authorized to access system metrics, review the moderation queue, verify identity flags, and suspend accounts.
- **Implementation**: Enforced server-side via the `requireAdmin` middleware. Any unauthorized invocation returns `403 Forbidden: Administrative privileges required`.

### 4.3 PII Protection & Mutual Consent Privacy
- **Password Hashes**: User object serialization explicitly deletes `passwordHash` prior to transmitting JSON responses.
- **Contact Number Protection**: Direct phone numbers and personal emails are shielded from public profile search endpoints. Only verified, mutually accepted connections can view contact communication channels.
- **Sanitized Search**: Public discovery profiles only expose necessary matrimonial attributes.

### 4.4 Human-in-the-Loop Media Moderation Pipeline
- To prevent spam, deepfakes, and inappropriate content, all newly uploaded photos default to `status: 'pending'`.
- Pending photos are **not visible** to general public search queries.
- Administrators review images inside the **Admin Moderation Queue** and either mark them as `'approved'` or `'rejected'` with an audit explanation.
- Profiles can only set their primary profile photo from previously approved assets.

### 4.5 Real-Time Client-Side Password Strength & Verification
- **Dynamic Scoring**: Evaluates password resilience in real-time across 5 core security vectors:
  1. Minimum recommended length (8+ characters)
  2. Uppercase letter presence (`[A-Z]`)
  3. Lowercase letter presence (`[a-z]`)
  4. Numeric digit presence (`[0-9]`)
  5. Special punctuation or symbols (`[^A-Za-z0-9]`)
- **Interactive Visual Gauge**: 4-segment progressive gauge (`Very Weak` → `Weak` → `Fair` → `Good` → `Strong`) with dynamic color transitions (`rose`, `amber`, `sky`, `emerald`).
- **Real-Time Match Validator**: Dynamic feedback verifying identical match between password and confirmation fields.
- **Eye Visibility Toggles**: Interactive show/hide controls on all password input fields to prevent input typos while preserving user privacy.

---

## 5. Algorithmic Specifications

### 5.1 Match Compatibility Engine
The platform calculates a dynamic compatibility score (0–100%) between the active user and candidate matches:
```typescript
Total Score = AgeScore + ReligionScore + MaritalStatusScore + LifestyleScore + SharedHobbiesScore
```
1. **Age Alignment (Up to 30 pts)**:
   - Target age within member's `partnerPreferences.ageMin` and `ageMax` receives full points.
   - Minor deviation (within 2 years) receives partial credit (15 pts).
2. **Religion & Culture Alignment (Up to 25 pts)**:
   - Matches preferred religions list: +25 pts.
3. **Marital Status Consistency (Up to 20 pts)**:
   - Matches preferred marital status: +20 pts.
4. **Lifestyle & Dietary Compatibility (Up to 15 pts)**:
   - Identical dietary preference: +10 pts.
   - Compatible non-smoking/drinking status: +5 pts.
5. **Shared Interests (Up to 10 pts)**:
   - 2 pts per overlapping hobby/interest, capped at 10 pts.

### 5.2 Profile Completion Calculator
Tracks completeness across critical matrimonial dimensions:
- Personal Essentials (Name, Gender, DOB): **25%**
- Religious & Cultural Heritage: **15%**
- Education & Career: **20%**
- Physical & Dietary Lifestyle: **15%**
- Personal Biography & Hobbies: **10%**
- Photos & Partner Preferences: **15%**

---

## 6. Complete API Reference

### 6.1 Authentication Endpoints
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new member and create initial profile | None |
| `POST` | `/api/auth/login` | Log in with email/username and password | None |
| `POST` | `/api/auth/admin/login` | Authenticate as administrator | None |
| `GET` | `/api/auth/me` | Fetch active user identity and profile | Bearer Token |
| `POST` | `/api/auth/forgot-password` | Generate 6-digit recovery OTP | None |
| `POST` | `/api/auth/reset-password` | Validate OTP and set new password | None |

### 6.2 Profile Endpoints
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Get logged-in user's own profile | Bearer Token |
| `PUT` | `/api/profile` | Update profile fields and recalculate score | Bearer Token |
| `GET` | `/api/profiles` | Search/filter public profiles | Optional |
| `GET` | `/api/profiles/:id` | View detailed public profile | Optional |

### 6.3 Match & Interaction Endpoints
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/matches` | Get scored match recommendations | Bearer Token |
| `GET` | `/api/interests` | Get sent and received interest proposals | Bearer Token |
| `POST` | `/api/interests` | Send interest with message template | Bearer Token |
| `PUT` | `/api/interests/:id` | Accept, reject, or cancel an interest | Bearer Token |
| `GET` | `/api/favorites` | Get bookmarked shortlist profiles | Bearer Token |
| `POST` | `/api/favorites/:id` | Add profile to favorites | Bearer Token |
| `DELETE`| `/api/favorites/:id` | Remove profile from favorites | Bearer Token |

### 6.4 Media & Gallery Endpoints
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/media` | Get own photos and moderation status | Bearer Token |
| `POST` | `/api/media/upload` | Upload image (queues for moderation) | Bearer Token |
| `PUT` | `/api/media/:id/primary`| Set photo as main avatar (if approved)| Bearer Token |
| `DELETE`| `/api/media/:id` | Delete photo from profile | Bearer Token |

### 6.5 Admin Management Endpoints
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Platform metrics, verification rates | Admin Token |
| `GET` | `/api/admin/users` | List all accounts with profile status | Admin Token |
| `PUT` | `/api/admin/users/:id/status` | Suspend or reactivate an account | Admin Token |
| `PUT` | `/api/admin/profiles/:id/verify` | Toggle verified identity badge | Admin Token |
| `GET` | `/api/admin/media` | View photo moderation queue | Admin Token |
| `PUT` | `/api/admin/media/:id/status` | Approve or reject submitted photo | Admin Token |

---

## 7. Pre-Configured Test Accounts

The platform includes seeded accounts covering all major user personas. These can be accessed via the **Demo Role Switcher** in the top navigation or through standard login:

| Persona | Role | Email / Identifier | Password | Notable Attributes |
| :--- | :--- | :--- | :--- | :--- |
| **Priya Sharma** | `user` | `priya@example.com` | `Password123!` | Female, 29, Software Architect, Verified, Pending Interests |
| **Rohit Verma** | `user` | `rohit@example.com` | `Password123!` | Male, 31, Senior PM, Verified, Active Profile |
| **Ananya Patel**| `user` | `ananya@example.com` | `Password123!` | Female, 27, Pediatrician, Verified, High Compatibility |
| **Vikram Malhotra** | `user` | `vikram@example.com` | `Password123!` | Male, 33, Investment Banker, Verified |
| **Administrator** | `admin` | `admin@matrimony.com` | `AdminPass123!` | Platform Super-Admin, Full Governance Access |

---

## 8. Production Hardening & Cloud Scaling Roadmap

When promoting this codebase from the prototype container to a production environment (Google Cloud Run / Kubernetes):

1. **Database Migration**:
   - Replace the file-based persistence layer (`server/db.ts`) with **MongoDB Atlas** (Mongoose ODM) or **Google Cloud SQL (PostgreSQL)**.
   - Add database indexes on `{ gender: 1, religion: 1, age: 1 }` and `{ fromUserId: 1, toUserId: 1 }` for sub-millisecond query execution.
2. **Object Storage for Media**:
   - Store photo assets in **Google Cloud Storage** or **AWS S3** buckets instead of data URLs.
   - Use pre-signed upload URLs and serve image assets through **Cloud CDN** with WebP compression.
3. **Session & Cookie Security**:
   - Transition JWT storage from `localStorage` to **Secure, HttpOnly, SameSite=Strict** cookies to eliminate XSS token theft vectors.
4. **Rate Limiting**:
   - Apply `express-rate-limit` to `/api/auth/*` routes (e.g., maximum 5 login attempts per minute) to prevent brute-force attacks.
5. **Automated Content Moderation**:
   - Incorporate the **Google Cloud Vision API** or **Gemini Multimodal API** as a preliminary filter before human moderation to automatically flag inappropriate content.
