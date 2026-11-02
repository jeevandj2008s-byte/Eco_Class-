/**
 * Seed Student Generator for AuraSync Campus Twin
 * Generates realistic student rosters mapped to specific classrooms, benches, and seats.
 */

import { PROCESSED_BUILDINGS } from '../config/buildings.config.js';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Sneha', 'Karthik', 'Pooja', 'Aditya', 'Divya',
  'Vikram', 'Meera', 'Rahul', 'Nisha', 'Arjun', 'Kavya', 'Siddharth', 'Tanvi',
  'Nikhil', 'Shreya', 'Gautam', 'Isha', 'Abhishek', 'Varun', 'Neha', 'Pranav',
  'Ritu', 'Manish', 'Deepika', 'Akash', 'Shruti', 'Harsh', 'Ankita', 'Suresh'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Rao', 'Verma', 'Nair', 'Hegde', 'Kulkarni', 'Iyer',
  'Deshmukh', 'Reddy', 'Gowda', 'Kumar', 'Menon', 'Bhat', 'Shetty', 'Pillai',
  'Joshi', 'Chauhan', 'Gupta', 'Singh', 'Prasad', 'Murthy', 'Kamath', 'Babu'
];

const AVATAR_COLORS = [
  '#38bdf8', // Sky
  '#34d399', // Emerald
  '#f472b6', // Rose
  '#a78bfa', // Lavender
  '#fbbf24', // Amber
  '#fb7185', // Coral
  '#2dd4bf', // Teal
  '#818cf8', // Indigo
  '#f87171', // Crimson
  '#67e8f9'  // Cyan
];

const LOCAL_STORAGE_KEY = 'aurasync_twin_students_v1';

/**
 * Generate a realistic demo roster of students mapped to benches and seats
 */
export function generateSeedStudents() {
  const students = [];
  let nameIndex = 0;
  let usnCounter = 1;

  // We seed specifically MB-101, MB-102, MB-201, MB-202, B2-101, B2-201
  const targetClassroomIds = ['MB-101', 'MB-102', 'MB-201', 'MB-202', 'B2-101', 'B2-201'];

  for (const b of PROCESSED_BUILDINGS) {
    for (const f of b.floors) {
      for (const room of f.classrooms) {
        if (!targetClassroomIds.includes(room.id)) continue;

        const layout = room.layout;
        if (!layout || !layout.seats) continue;

        // Occupy roughly 60% - 75% of seats in the room
        const totalSeats = layout.seats.length;
        const targetCount = Math.min(totalSeats, Math.max(12, Math.floor(totalSeats * 0.7)));

        // Shuffle seats deterministically or sequentially
        const availableSeats = [...layout.seats];

        for (let i = 0; i < targetCount; i++) {
          const seat = availableSeats[i];
          const firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
          const lastName = LAST_NAMES[(nameIndex * 3 + i) % LAST_NAMES.length];
          const fullName = `${firstName} ${lastName}`;
          nameIndex++;

          const deptCode = room.id.startsWith('MB-2') ? 'AI' : room.id.startsWith('MB-1') ? 'CS' : 'EC';
          const deptName = room.department || 'Engineering';
          const usnStr = `1BI22${deptCode}${String(usnCounter++).padStart(3, '0')}`;
          const color = AVATAR_COLORS[(nameIndex + i) % AVATAR_COLORS.length];

          students.push({
            id: `stu-${seat.id}`,
            name: fullName,
            rollNo: usnStr,
            usn: usnStr,
            department: deptName,
            year: '3rd Year',
            section: 'A',
            avatarColor: color,
            buildingId: b.id,
            floorLevel: f.level,
            classroomId: room.id,
            benchId: seat.benchId,
            seatId: seat.id,
            seatIndex: seat.seatIndex,
            row: seat.row,
            column: seat.column,
            status: 'PRESENT',
            joinedAt: new Date(Date.now() - (i * 3600000)).toISOString()
          });
        }
      }
    }
  }

  return students;
}

/**
 * Retrieve students from localStorage or initialize with seed data
 */
export function getInitialStudents() {
  if (typeof window === 'undefined') return generateSeedStudents();

  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[SeedStudents] Failed to read from localStorage:', err);
  }

  const seeded = generateSeedStudents();
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
  } catch (err) {
    console.warn('[SeedStudents] Failed to persist seed to localStorage:', err);
  }
  return seeded;
}

/**
 * Save students to localStorage
 */
export function saveStudentsToStorage(students) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('[SeedStudents] Failed to save students:', err);
  }
}

