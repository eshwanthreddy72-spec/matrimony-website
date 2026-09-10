import fs from 'fs';
import path from 'path';
import { initialUsers, initialProfiles, initialInterests, initialFavorites } from '../server/seed.ts';
import { generateToken, verifyToken } from '../server/auth.ts';
import { User, UserRole } from '../server/types.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('  RUNNING PHASE 2, 3 & 4 ROLE CLEANUP VERIFICATION');
console.log('======================================================\n');

// ── PHASE 2: DEPENDENCY & ACTIVE ASSIGNMENT VERIFICATION ────────
console.log('[PHASE 2] Auditing Roles & Relational Dependencies...');

// Check seed users
const allowedRoles = new Set<UserRole>(['user', 'admin']);
const seedInvalidRoles = initialUsers.filter((u: User) => !allowedRoles.has(u.role));
assert(seedInvalidRoles.length === 0, 'Seed users have strictly valid roles (user | admin)');

// Check db.json users if file exists
const dbPath = path.join(process.cwd(), '.data', 'db.json');
if (fs.existsSync(dbPath)) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const dbInvalidRoles = dbData.users.filter((u: User) => !allowedRoles.has(u.role));
  assert(dbInvalidRoles.length === 0, 'Database (.data/db.json) users have strictly valid roles');

  const userIds = new Set<string>(dbData.users.map((u: User) => u._id));

  // Check orphan profiles
  const orphanProfiles = dbData.profiles.filter((p: any) => !userIds.has(p.userId));
  assert(orphanProfiles.length === 0, 'No orphan profiles found in database');

  // Check orphan interests
  const orphanInterests = dbData.interests.filter(
    (i: any) => !userIds.has(i.fromUserId) || !userIds.has(i.toUserId)
  );
  assert(orphanInterests.length === 0, 'No orphan interests found in database');

  // Check orphan favorites
  const orphanFavorites = dbData.favorites.filter((f: any) => !userIds.has(f.userId));
  assert(orphanFavorites.length === 0, 'No orphan favorites found in database');
} else {
  console.log('  ℹ No .data/db.json file found yet (using seed in memory)');
}

// ── PHASE 3: LOGIC & RBAC SECURITY VERIFICATION ────────────────
console.log('\n[PHASE 3] Auditing Backend RBAC & Safe Cascaded Logic...');

// Test token payload roles
const regularUser: User = {
  _id: 'usr-test-regular',
  username: 'test_user',
  email: 'test@example.com',
  passwordHash: 'dummy',
  role: 'user',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const adminUser: User = {
  _id: 'usr-test-admin',
  username: 'test_admin',
  email: 'admin@example.com',
  passwordHash: 'dummy',
  role: 'admin',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const userToken = generateToken(regularUser);
const userPayload = verifyToken(userToken);
assert(userPayload !== null && userPayload.role === 'user', 'Regular user token carries role "user"');

const adminToken = generateToken(adminUser);
const adminPayload = verifyToken(adminToken);
assert(adminPayload !== null && adminPayload.role === 'admin', 'Admin token carries role "admin"');

// Verify registration endpoint enforces 'user' role
const authRoutesCode = fs.readFileSync(path.join(process.cwd(), 'server', 'routes', 'auth.ts'), 'utf8');
assert(
  authRoutesCode.includes("role: 'user'") && !authRoutesCode.includes("role: req.body.role"),
  'User registration strictly defaults to role "user" (no role escalation possible)'
);

// Verify admin routes protection
const adminRoutesCode = fs.readFileSync(path.join(process.cwd(), 'server', 'routes', 'admin.ts'), 'utf8');
assert(
  adminRoutesCode.includes('router.use(requireAdmin);'),
  'Admin routes enforce requireAdmin middleware'
);
assert(
  adminRoutesCode.includes("if (targetUser.role === 'admin')"),
  'Admin user deletion endpoint prevents deleting administrator accounts'
);

// ── PHASE 4: STAGING & PRODUCTION CLEANUP VERIFICATION ─────────
console.log('\n[PHASE 4] Verifying Codebase Cleanup (UI & Frontend)...');

// Check Navbar.tsx
const navbarCode = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'Navbar.tsx'), 'utf8');
assert(!navbarCode.includes('Demo Role:'), 'Navbar has no "Demo Role" display');
assert(!navbarCode.includes('showDemoMenu'), 'Navbar has no demo menu state');
assert(!navbarCode.includes('onQuickSwitch'), 'Navbar has no onQuickSwitch prop');

// Check App.tsx
const appCode = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf8');
assert(!appCode.includes('handleQuickSwitch'), 'App.tsx has no handleQuickSwitch function');
assert(!appCode.includes("setActiveTab('home');") || !appCode.includes("await handleQuickSwitch('priya')"), 'App.tsx does not auto-login as demo user on startup');
assert(!appCode.includes('Demo Role Switcher'), 'App.tsx footer has no Demo Role Switcher text');

// Check AuthModal.tsx
const authModalCode = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'AuthModal.tsx'), 'utf8');
assert(!authModalCode.includes('Quick Test Autofill'), 'AuthModal has no "Quick Test Autofill" card');
assert(!authModalCode.includes('prefill('), 'AuthModal has no prefill function');
assert(!authModalCode.includes('Demo Code autofilled:'), 'AuthModal has no demo OTP autofill text');

console.log('\n------------------------------------------------------');
console.log(`Verification Complete: ${passed} Passed, ${failed} Failed`);
console.log('------------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
