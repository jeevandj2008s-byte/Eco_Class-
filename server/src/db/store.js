import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json');

// In-Memory collections
export const db = {
  users: [],
  tickets: [],
  workers: [],
  lifts: [],
  bins: [],
  feedback: [],
  settings: [],
  auditLogs: [],
  controlActions: [],
  carbonBudgets: [],
  carbonPassports: []
};

// Seed passwords hashed with bcrypt 12 rounds
const BCRYPT_SALT_ROUNDS = 12;

export async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(plainText, hash) {
  return await bcrypt.compare(plainText, hash);
}

/**
 * Initialize and seed the database
 */
export async function initDatabase(forceReseed = false) {
  try {
    if (!forceReseed && fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      Object.assign(db, parsed);
      console.log('✅ Loaded database from file storage with', db.users.length, 'users &', db.tickets.length, 'tickets.');
      return;
    }
  } catch (err) {
    console.warn('⚠️ Could not load data file, proceeding to fresh seeding:', err.message);
  }

  console.log('🌱 Seeding fresh database for BIT Energy Twin...');

  // Pre-hash passwords
  const adminHash = await hashPassword('Admin@12345');
  const hodHash = await hashPassword('Hod@12345');
  const facultyHash = await hashPassword('Faculty@12345');
  const studentHash = await hashPassword('Student@12345');
  const workerHash = await hashPassword('Worker@12345');
  const passkeyHash = await hashPassword('123456');

  // Neutral role-based demo identities
  db.users = [
    {
      id: 'usr-admin-1',
      name: 'Demo Principal',
      email: 'admin@aurasync.demo',
      passwordHash: adminHash,
      role: 'admin',
      department: 'Campus Administration',
      passKeyHash: passkeyHash,
      twoFAEnabled: true,
      approvalStatus: 'approved',
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-hod-1',
      name: 'Demo HOD',
      email: 'hod.aiml@aurasync.demo',
      passwordHash: hodHash,
      role: 'hod',
      department: 'Computer Science and Engineering (AIML)',
      passKeyHash: passkeyHash,
      twoFAEnabled: true,
      approvalStatus: 'approved',
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-staff-1',
      name: 'Demo Faculty',
      email: 'faculty@aurasync.demo',
      passwordHash: facultyHash,
      role: 'staff',
      department: 'Computer Science and Engineering (AIML)',
      passKeyHash: passkeyHash,
      twoFAEnabled: false,
      approvalStatus: 'approved',
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-student-1',
      name: 'Demo Student (USN: [DEMO USN])',
      email: 'student@aurasync.demo',
      passwordHash: studentHash,
      role: 'student',
      department: 'Computer Science and Engineering (AIML)',
      passKeyHash: passkeyHash,
      twoFAEnabled: false,
      approvalStatus: 'approved',
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-worker-1',
      name: 'Worker 1 (Lead Electrician)',
      email: 'worker@aurasync.demo',
      passwordHash: workerHash,
      role: 'worker',
      department: 'Campus Facilities & Maintenance',
      workerSkill: 'Electrician',
      shift: 'Morning (07:00 - 15:30)',
      passKeyHash: passkeyHash,
      twoFAEnabled: false,
      approvalStatus: 'approved',
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString()
    }
  ];

  // 12 Neutral Workers
  db.workers = [
    { id: 'w-1', name: 'Worker 1 (Electrician)', skill: 'Electrician', phone: '[ADD PHONE]', shift: 'Morning', workload: 2, availability: 'available', rating: 4.8 },
    { id: 'w-2', name: 'Worker 2 (Plumber)', skill: 'Plumber', phone: '[ADD PHONE]', shift: 'Morning', workload: 1, availability: 'available', rating: 4.9 },
    { id: 'w-3', name: 'Worker 3 (Housekeeping)', skill: 'Housekeeping', phone: '[ADD PHONE]', shift: 'Morning', workload: 3, availability: 'busy', rating: 4.7 },
    { id: 'w-4', name: 'Worker 4 (Lift Technician)', skill: 'Lift Technician', phone: '[ADD PHONE]', shift: 'General', workload: 1, availability: 'available', rating: 4.9 },
    { id: 'w-5', name: 'Worker 5 (Housekeeping)', skill: 'Housekeeping', phone: '[ADD PHONE]', shift: 'Morning', workload: 1, availability: 'available', rating: 4.6 },
    { id: 'w-6', name: 'Worker 6 (HVAC Specialist)', skill: 'HVAC Specialist', phone: '[ADD PHONE]', shift: 'General', workload: 2, availability: 'available', rating: 4.8 },
    { id: 'w-7', name: 'Worker 7 (Gardener & Waste)', skill: 'Gardener & Waste', phone: '[ADD PHONE]', shift: 'Morning', workload: 0, availability: 'available', rating: 4.5 },
    { id: 'w-8', name: 'Worker 8 (Electrician)', skill: 'Electrician', phone: '[ADD PHONE]', shift: 'Evening', workload: 1, availability: 'available', rating: 4.7 },
    { id: 'w-9', name: 'Worker 9 (Carpenter & Civil)', skill: 'Carpenter & Civil', phone: '[ADD PHONE]', shift: 'Morning', workload: 2, availability: 'busy', rating: 4.4 },
    { id: 'w-10', name: 'Worker 10 (Housekeeping)', skill: 'Housekeeping', phone: '[ADD PHONE]', shift: 'Evening', workload: 1, availability: 'available', rating: 4.8 },
    { id: 'w-11', name: 'Worker 11 (IT & AV Tech)', skill: 'IT & AV Tech', phone: '[ADD PHONE]', shift: 'General', workload: 3, availability: 'busy', rating: 4.9 },
    { id: 'w-12', name: 'Worker 12 (Security Supervisor)', skill: 'Security Supervisor', phone: '[ADD PHONE]', shift: 'Night', workload: 0, availability: 'available', rating: 4.9 }
  ];

  // Lifts inside BIT Buildings
  db.lifts = [
    { id: 'lift-main-1', buildingId: 'bit-main', name: 'BIT Main Block Elevator A', capacityKg: 680, currentFloor: 1, status: 'running', faultCode: 'NORMAL', energyKwh: 14.8, tripsToday: 84, emergencyTrapped: false },
    { id: 'lift-main-2', buildingId: 'bit-main', name: 'BIT Main Block Elevator B', capacityKg: 680, currentFloor: 3, status: 'idle', faultCode: 'NORMAL', energyKwh: 12.3, tripsToday: 71, emergencyTrapped: false },
    { id: 'lift-b2-1', buildingId: 'bit-block-central', name: 'BIT Block 2 Central Lift', capacityKg: 544, currentFloor: 0, status: 'idle', faultCode: 'NORMAL', energyKwh: 8.4, tripsToday: 42, emergencyTrapped: false },
    { id: 'lift-mech-1', buildingId: 'bit-mechanical', name: 'Mechanical Bay Freight Lift', capacityKg: 1000, currentFloor: 0, status: 'idle', faultCode: 'NORMAL', energyKwh: 9.1, tripsToday: 35, emergencyTrapped: false },
    { id: 'lift-b3-1', buildingId: 'bit-block-east', name: 'BIT Block 3 North Lift', capacityKg: 544, currentFloor: 2, status: 'idle', faultCode: 'NORMAL', energyKwh: 11.2, tripsToday: 58, emergencyTrapped: false },
    { id: 'lift-gh-1', buildingId: 'bit-guest-house', name: 'Guest House Service Lift', capacityKg: 400, currentFloor: 0, status: 'idle', faultCode: 'NORMAL', energyKwh: 4.5, tripsToday: 20, emergencyTrapped: false }
  ];

  // 60 Smart Waste Bins across BIT Campus buildings
  const binLocations = [
    { bId: 'bit-main', prefix: 'BIT Main' },
    { bId: 'bit-block-central', prefix: 'BIT Block 2' },
    { bId: 'bit-mechanical', prefix: 'Mechanical Block' },
    { bId: 'bit-block-east', prefix: 'BIT Block 3' },
    { bId: 'bit-block-strip', prefix: 'BIT Block 4' },
    { bId: 'bit-parking', prefix: 'Parking Facility' }
  ];
  const binTypes = ['dry', 'wet', 'plastic', 'e-waste'];

  db.bins = [];
  let binCounter = 1;
  for (let i = 0; i < 60; i++) {
    const loc = binLocations[i % binLocations.length];
    const type = binTypes[i % binTypes.length];
    const fill = Math.floor(20 + Math.random() * 75);
    db.bins.push({
      id: `bin-${String(binCounter).padStart(3, '0')}`,
      buildingId: loc.bId,
      locationName: `${loc.prefix} - Zone ${Math.floor(i / 6) + 1}`,
      type,
      fillPct: fill,
      lastEmptied: new Date(Date.now() - (i * 3600000)).toISOString(),
      capacityLiters: type === 'dry' ? 120 : 80
    });
    binCounter++;
  }

  // 40 Realistic Seed Tickets across BIT Campus
  db.tickets = [
    {
      ticketId: 'AS-2026-000101',
      category: 'Garbage and Waste',
      subcategory: 'Overflowing Bin',
      title: 'Overflowing bin near BIT Block 2 cafeteria courtyard',
      description: 'The segregated dry waste bin is overflowing. Needs immediate clearing.',
      locationRef: { buildingId: 'bit-block-central', floor: 0, roomId: 'b2-court', pin3D: { x: 72, y: 1, z: 25 } },
      urgency: 'high',
      status: 'assigned',
      reporterId: 'usr-student-1',
      reporterName: 'Demo Student',
      anonymous: false,
      assignedHodId: 'usr-hod-1',
      assignedWorkerId: 'w-3',
      slaDueAt: new Date(Date.now() + 2 * 3600000).toISOString(),
      media: [{ url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80', type: 'image' }],
      beforeMedia: [{ url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80' }],
      afterMedia: [],
      rating: null,
      timeline: [
        { status: 'new', byUserId: 'usr-student-1', at: new Date(Date.now() - 3600000).toISOString(), note: 'Ticket submitted via Mobile Quick-Report' },
        { status: 'assigned', byUserId: 'usr-hod-1', at: new Date(Date.now() - 1800000).toISOString(), note: 'Smart-assigned to Worker 3 (Housekeeping)' }
      ]
    },
    {
      ticketId: 'AS-2026-000102',
      category: 'Energy Waste',
      subcategory: 'Ghost Load',
      title: 'Lab 204 AC running with 0 occupants for 35 minutes',
      description: 'Computer Lab 204 has 2.0T Split AC running at 18C while room is locked and empty. Energy Ghost alert triggered.',
      locationRef: { buildingId: 'bit-main', floor: 2, roomId: 'bit-204', pin3D: { x: -45, y: 12, z: 42 } },
      urgency: 'high',
      status: 'in_progress',
      reporterId: 'usr-admin-1',
      reporterName: 'Aura AI Auto-Detector',
      anonymous: false,
      assignedHodId: 'usr-hod-1',
      assignedWorkerId: 'w-1',
      slaDueAt: new Date(Date.now() + 1 * 3600000).toISOString(),
      media: [],
      beforeMedia: [],
      afterMedia: [],
      rating: null,
      timeline: [
        { status: 'new', byUserId: 'system', at: new Date(Date.now() - 2400000).toISOString(), note: 'Energy Ghost correlation detected: Power 1950W, Occupancy 0' },
        { status: 'in_progress', byUserId: 'w-1', at: new Date(Date.now() - 900000).toISOString(), note: 'Technician en route to verify and isolate relay' }
      ]
    },
    {
      ticketId: 'AS-2026-000103',
      category: 'Lifts and Elevators',
      subcategory: 'Stuck Door Fault',
      title: 'BIT Block 2 Central Lift door sensor intermittent jam',
      description: 'Ground floor lift doors reopen repeatedly before closing. Causing delay for staff and students.',
      locationRef: { buildingId: 'bit-block-central', floor: 0, roomId: 'b2-atrium', pin3D: { x: 0, y: 1, z: -48 } },
      urgency: 'high',
      status: 'assigned',
      reporterId: 'usr-staff-1',
      reporterName: 'Demo Faculty',
      anonymous: false,
      assignedHodId: 'usr-hod-1',
      assignedWorkerId: 'w-4',
      slaDueAt: new Date(Date.now() + 3 * 3600000).toISOString(),
      media: [],
      beforeMedia: [],
      afterMedia: [],
      rating: null,
      timeline: [
        { status: 'new', byUserId: 'usr-staff-1', at: new Date(Date.now() - 5400000).toISOString(), note: 'Ticket logged from Staff Portal' },
        { status: 'assigned', byUserId: 'usr-hod-1', at: new Date(Date.now() - 3600000).toISOString(), note: 'Assigned to Worker 4 (Lift Technician)' }
      ]
    }
  ];

  // Generate 37 additional tickets referencing BIT buildings
  const ticketCategories = [
    { cat: 'HVAC and Cooling', sub: 'Thermostat set too low', urg: 'normal', b: 'bit-main', title: 'Main Admin block AC running at 19C causing excessive draw' },
    { cat: 'Lighting and Illumination', sub: 'Corridor lights on in daylight', urg: 'low', b: 'bit-block-east', title: 'Perimeter corridor 40W tubes on during noon sunshine' },
    { cat: 'Water and Plumbing', sub: 'Washroom tap leak', urg: 'high', b: 'bit-mechanical', title: 'Ground floor washroom tap leaking continuously' },
    { cat: 'Safety and Security', sub: 'Extinguisher pin missing', urg: 'high', b: 'bit-main', title: '2nd Floor Fire Extinguisher inspection seal cut' },
    { cat: 'Cleanliness', sub: 'Classroom floor spill', urg: 'low', b: 'bit-block-central', title: 'Beverage spill in Seminar Hall 101' },
    { cat: 'Energy Waste', sub: 'Projector left on', urg: 'normal', b: 'bit-main', title: 'Auditorium projector left idling on blank screen' }
  ];

  for (let i = 4; i <= 40; i++) {
    const tmpl = ticketCategories[i % ticketCategories.length];
    const statusPool = ['new', 'assigned', 'in_progress', 'resolved', 'closed'];
    const curStatus = statusPool[i % statusPool.length];
    db.tickets.push({
      ticketId: `AS-2026-${String(100 + i).padStart(6, '0')}`,
      category: tmpl.cat,
      subcategory: tmpl.sub,
      title: tmpl.title,
      description: `Routine maintenance ticket for ${tmpl.title}.`,
      locationRef: { buildingId: tmpl.b, floor: (i % 4), roomId: `${tmpl.b}-f${i % 4}` },
      urgency: tmpl.urg,
      status: curStatus,
      reporterId: i % 2 === 0 ? 'usr-student-1' : 'usr-staff-1',
      reporterName: i % 2 === 0 ? 'Demo Student' : 'Demo Faculty',
      anonymous: false,
      assignedHodId: 'usr-hod-1',
      assignedWorkerId: `w-${(i % 12) + 1}`,
      slaDueAt: new Date(Date.now() + (i * 1800000)).toISOString(),
      media: [],
      beforeMedia: [],
      afterMedia: [],
      rating: curStatus === 'closed' ? 5 : null,
      timeline: [
        { status: 'new', byUserId: 'usr-student-1', at: new Date(Date.now() - (i * 3600000)).toISOString(), note: 'Ticket submitted via Helpdesk' }
      ]
    });
  }

  // Feedback records
  db.feedback = [
    {
      id: 'fb-001',
      userId: 'usr-student-1',
      userName: 'Demo Student',
      userRole: 'student',
      rating: 5,
      comment: 'The live microgrid dashboard really helps us track real-time campus energy!',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      adminReply: 'Thank you! We are expanding solar monitoring across all blocks.'
    },
    {
      id: 'fb-002',
      userId: 'usr-staff-1',
      userName: 'Demo Faculty',
      userRole: 'staff',
      rating: 4,
      comment: 'Scheduling load shedding before peak hours has trimmed department bills.',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      adminReply: 'Acknowledged. We are optimizing thermostat setpoints as well.'
    }
  ];

  // System Settings
  db.settings = [
    {
      key: 'grid_emission_factor',
      name: 'Grid Carbon Emission Factor',
      category: 'ESG & Carbon',
      unit: 'kg CO₂e/kWh',
      scopeAllowed: ['global'],
      defaultValue: 0.71,
      globalValue: 0.71,
      deptValues: {},
      personalValues: {},
      min: 0.2,
      max: 1.5,
      lockedBy: null,
      description: 'Default CEA baseline for Indian regional power grid.'
    },
    {
      key: 'commercial_tariff_inr',
      name: 'BESCOM HT Commercial Slab Rate',
      category: 'Financial & Tariffs',
      unit: '₹/kWh',
      scopeAllowed: ['global'],
      defaultValue: 8.25,
      globalValue: 8.25,
      deptValues: {},
      personalValues: {},
      min: 4.0,
      max: 15.0,
      lockedBy: null,
      description: 'Effective energy charge per unit consumed.'
    },
    {
      key: 'standard_ac_setpoint',
      name: 'Standard AC Setpoint Temperature',
      category: 'Thermal & Comfort',
      unit: '°C',
      scopeAllowed: ['global', 'department'],
      defaultValue: 24,
      globalValue: 24,
      deptValues: {
        'Computer Science and Engineering (AIML)': 24,
        'Management Studies': 24,
        'Mechanical Engineering': 25
      },
      personalValues: {},
      min: 22,
      max: 27,
      lockedBy: null,
      description: 'BEE recommended thermostat sweet spot for energy efficiency.'
    },
    {
      key: 'idle_timeout_minutes',
      name: 'Vacant Room Auto-Off Delay',
      category: 'Auto-Optimizer',
      unit: 'Minutes',
      scopeAllowed: ['global', 'department'],
      defaultValue: 15,
      globalValue: 15,
      deptValues: {
        'Computer Science and Engineering (AIML)': 15
      },
      personalValues: {},
      min: 5,
      max: 60,
      lockedBy: null,
      description: 'Minutes of zero occupancy detected before auto-switching non-critical loads.'
    }
  ];

  // Carbon Budgets for BIT
  db.carbonBudgets = [
    {
      scopeId: 'campus-global',
      scopeName: 'BIT Campus Total',
      period: 'October 2026',
      capKg: 120000,
      usedKg: 84210,
      warningThresholdPct: 70
    },
    {
      scopeId: 'dept-aiml',
      scopeName: 'CSE (AIML) Department',
      period: 'October 2026',
      capKg: 28000,
      usedKg: 19450,
      warningThresholdPct: 70
    },
    {
      scopeId: 'dept-main',
      scopeName: 'BIT Main Block',
      period: 'October 2026',
      capKg: 45000,
      usedKg: 31200,
      warningThresholdPct: 70
    },
    {
      scopeId: 'dept-mech',
      scopeName: 'Mechanical Engineering',
      period: 'October 2026',
      capKg: 22000,
      usedKg: 16800,
      warningThresholdPct: 70
    },
    {
      scopeId: 'block-central',
      scopeName: 'BIT Block 2',
      period: 'October 2026',
      capKg: 25000,
      usedKg: 16760,
      warningThresholdPct: 70
    }
  ];

  saveDatabaseToFile();
  console.log('✅ Database seeded and saved to file successfully with neutral BIT data!');
}

export function saveDatabaseToFile() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Failed to persist store to file:', err.message);
  }
}
