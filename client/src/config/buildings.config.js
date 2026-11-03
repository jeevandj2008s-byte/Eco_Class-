/**
 * Buildings & Campus 3D Architecture Configuration
 * Defines building dimensional properties, courtyard void geometry, connected wings,
 * bridge walkways, classrooms, parking lot parameters, and block labels.
 *
 * EDIT HERE to customize block names, parking capacity, or animation flags
 * without touching 3D rendering geometry code.
 */

import { generateClassroomLayout } from '../utils/seatLayout.js';

export const FLOOR_HEIGHT = 3.4; // Realistic floor-to-floor height in 3D units (~3.4m)

/**
 * Global 3D Animation Controls
 * Toggle any animation on or off with a single boolean flag.
 */
export const ANIMATION_CONFIG = {
  enabled: true,         // Master animation switch
  barrierArm: true,      // Parking entry barrier arm oscillation
  carsMoving: true,      // Autonomous shuttle/car entering & leaving
  flagWave: true,        // Courtyard flag waving in the wind
  treesSway: true,       // Subtle foliage wind sway
  studentsIdle: true,    // Seated student idle breathing/sway
  fountainWater: true    // Courtyard fountain water shimmer
};

/**
 * Editable Block Names & Labels Configuration
 * Change any name, accent color, or badge here in one line.
 */
export const BLOCK_LABELS_CONFIG = [
  {
    id: 'bit-main',
    name: 'Block A (Main Courtyard Block)',
    shortName: 'Block A',
    code: 'BLK-A',
    accentColor: '#38bdf8', // Cool cyan/sky
    entranceLabel: 'Main Grand Entrance',
    floors: ['G', '1', '2', '3', '4']
  },
  {
    id: 'bit-block-central',
    name: 'Block B (Academic Wing)',
    shortName: 'Block B',
    code: 'BLK-B',
    accentColor: '#a78bfa', // Lavender/purple
    entranceLabel: 'East Plaza Entry',
    floors: ['G', '1', '2', '3']
  },
  {
    id: 'bit-mechanical',
    name: 'Block C (Engineering & Labs)',
    shortName: 'Block C',
    code: 'BLK-C',
    accentColor: '#34d399', // Emerald
    entranceLabel: 'Tech Labs Entry',
    floors: ['G', '1', '2', '3']
  },
  {
    id: 'bit-block-east',
    name: 'Block D (Admin & Seminar Wing)',
    shortName: 'Block D',
    code: 'BLK-D',
    accentColor: '#fbbf24', // Amber
    entranceLabel: 'Admin Secretariat',
    floors: ['G', '1', '2']
  },
  {
    id: 'campus-parking',
    name: 'Parking Facility',
    shortName: 'Parking',
    code: 'P',
    accentColor: '#006bff',
    entranceLabel: 'Main Gate & Security',
    floors: ['G']
  }
];

/**
 * Editable Parking Lot Configuration
 * Configurable capacity, location, and fill ratios.
 */
export const PARKING_CONFIG = {
  id: 'campus-parking',
  position: [18, 0, 32],       // South-east area adjacent to access road
  width: 28,                   // East-West length
  depth: 22,                   // North-South depth
  rows: 2,                     // Rows of car parking bays
  baysPerRow: 8,               // 8 bays per row = 16 car bays total
  bayWidth: 2.6,               // Standard 2.6m car bay
  bayDepth: 5.0,               // Standard 5.0m car bay
  bikeSlots: 16,               // Dedicated two-wheeler parking slots
  accessibleBays: 2,           // Accessible / PRM reserved parking spots
  visitorBays: 4,              // Dedicated visitor slots
  carFillRatio: 0.65,          // ~65% occupied with cars
  bikeFillRatio: 0.60,         // ~60% occupied with two-wheelers
  barrierGatePos: [4.5, 0, 22.5], // Gate barrier arm location
  securityBoothPos: [2.5, 0, 22.5]
};

/**
 * Sky-Bridges / Connecting Walkways between blocks
 */
export const CONNECTING_BRIDGES = [
  {
    id: 'bridge-a-b-fl2',
    fromBlock: 'bit-main',
    toBlock: 'bit-block-central',
    level: 2,
    start: [-5, (2 - 1) * FLOOR_HEIGHT + 1.2, 14],
    end: [8, (2 - 1) * FLOOR_HEIGHT + 1.2, 8],
    width: 2.8,
    height: 2.6
  },
  {
    id: 'bridge-a-b-fl3',
    fromBlock: 'bit-main',
    toBlock: 'bit-block-central',
    level: 3,
    start: [-5, (3 - 1) * FLOOR_HEIGHT + 1.2, 14],
    end: [8, (3 - 1) * FLOOR_HEIGHT + 1.2, 8],
    width: 2.8,
    height: 2.6
  },
  {
    id: 'bridge-b-c-fl2',
    fromBlock: 'bit-block-central',
    toBlock: 'bit-mechanical',
    level: 2,
    start: [20, (2 - 1) * FLOOR_HEIGHT + 1.2, 4],
    end: [22, (2 - 1) * FLOOR_HEIGHT + 1.2, -18],
    width: 2.6,
    height: 2.6
  }
];

/**
 * Building Blocks Architectural Hierarchy
 */
export const BUILDINGS_CONFIG = [
  {
    id: 'bit-main',
    name: 'Block A (Main Courtyard Block)',
    code: 'BLK-A',
    color: '#38bdf8',
    accentColor: '#7dd3fc',
    position: [-27, 0, 24],
    width: 44,
    depth: 44,
    floorCount: 4,
    // Courtyard Void Geometry inside Block A (open center from ground to sky)
    courtyard: {
      enabled: true,
      width: 18,
      depth: 18,
      center: [0, 0, 0],
      corridorWidth: 2.6, // Corridor loop surrounding the quad
      quadGarden: {
        lawnWidth: 16,
        lawnDepth: 16,
        hasFountain: true,
        hasFlagPole: true,
        benchesCount: 4,
        treesCount: 4
      }
    },
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Computer Science & Grand Atrium',
        classrooms: [
          {
            id: 'MB-101',
            name: 'CS-101 (Data Structures)',
            code: 'CS-101',
            type: 'LECTURE_HALL',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 5,
            columns: 2,
            seatsPerBench: 3,
            department: 'Computer Science'
          },
          {
            id: 'MB-102',
            name: 'CS-102 (Operating Systems)',
            code: 'CS-102',
            type: 'LECTURE_HALL',
            offset: [12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Computer Science'
          },
          {
            id: 'MB-103',
            name: 'CS-103 (Algorithms Lab)',
            code: 'CS-103',
            type: 'SMART_CLASS',
            offset: [-12, 0, 12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Computer Science'
          },
          {
            id: 'MB-104',
            name: 'CS-104 (Database Systems)',
            code: 'CS-104',
            type: 'LECTURE_HALL',
            offset: [12, 0, 12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Computer Science'
          }
        ]
      },
      {
        level: 2,
        name: 'Floor 2 - AI, ML & Data Science',
        classrooms: [
          {
            id: 'MB-201',
            name: 'AI-201 (Machine Learning Core)',
            code: 'AI-201',
            type: 'LECTURE_HALL',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 5,
            columns: 2,
            seatsPerBench: 3,
            department: 'AI & Machine Learning'
          },
          {
            id: 'MB-202',
            name: 'AI-202 (Deep Learning Studio)',
            code: 'AI-202',
            type: 'SMART_CLASS',
            offset: [12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'AI & Machine Learning'
          },
          {
            id: 'MB-203',
            name: 'AI-203 (Robotics & Vision Lab)',
            code: 'AI-203',
            type: 'SMART_CLASS',
            offset: [-12, 0, 12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'AI & Machine Learning'
          },
          {
            id: 'MB-204',
            name: 'AI-204 (Natural Language Systems)',
            code: 'AI-204',
            type: 'LECTURE_HALL',
            offset: [12, 0, 12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'AI & Machine Learning'
          }
        ]
      },
      {
        level: 3,
        name: 'Floor 3 - Software Architecture & Cloud Labs',
        classrooms: [
          {
            id: 'MB-301',
            name: 'SE-301 (Distributed Systems)',
            code: 'SE-301',
            type: 'LECTURE_HALL',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Information Science'
          },
          {
            id: 'MB-302',
            name: 'SE-302 (Cybersecurity Studio)',
            code: 'SE-302',
            type: 'SMART_CLASS',
            offset: [12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Information Science'
          }
        ]
      },
      {
        level: 4,
        name: 'Floor 4 - Research Labs & Department Library',
        classrooms: [
          {
            id: 'MB-401',
            name: 'RES-401 (Quantum Computing)',
            code: 'RES-401',
            type: 'SMART_CLASS',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Research & Innovation'
          },
          {
            id: 'MB-402',
            name: 'RES-402 (Digital Twin Simulator)',
            code: 'RES-402',
            type: 'LECTURE_HALL',
            offset: [12, 0, -12],
            width: 11,
            depth: 9.2,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Research & Innovation'
          }
        ]
      }
    ]
  },
  {
    id: 'bit-block-central',
    name: 'Block B (Academic Wing)',
    code: 'BLK-B',
    color: '#a78bfa',
    accentColor: '#c4b5fd',
    position: [18, 0, -10],
    width: 26,
    depth: 36,
    floorCount: 4,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Electronics Core & VLSI',
        classrooms: [
          {
            id: 'B2-101',
            name: 'EC-101 (Analog Microelectronics)',
            code: 'EC-101',
            type: 'LECTURE_HALL',
            offset: [0, 0, -9],
            width: 13,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electronics & Comm'
          },
          {
            id: 'B2-102',
            name: 'EC-102 (Signal Processing Lab)',
            code: 'EC-102',
            type: 'SMART_CLASS',
            offset: [0, 0, 9],
            width: 13,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Electronics & Comm'
          }
        ]
      },
      {
        level: 2,
        name: 'Floor 2 - Embedded Systems & IoT Hub',
        classrooms: [
          {
            id: 'B2-201',
            name: 'EC-201 (Microcontrollers Lab)',
            code: 'EC-201',
            type: 'SMART_CLASS',
            offset: [0, 0, -9],
            width: 13,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Electronics & Comm'
          },
          {
            id: 'B2-202',
            name: 'EC-202 (FPGA & SoC Design)',
            code: 'EC-202',
            type: 'LECTURE_HALL',
            offset: [0, 0, 9],
            width: 13,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electronics & Comm'
          }
        ]
      }
    ]
  },
  {
    id: 'bit-mechanical',
    name: 'Block C (Engineering & Labs)',
    code: 'BLK-C',
    color: '#34d399',
    accentColor: '#6ee7b7',
    position: [24, 0, -38],
    width: 28,
    depth: 30,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Robotics & Mechatronics',
        classrooms: [
          {
            id: 'ME-101',
            name: 'ME-101 (Thermodynamics)',
            code: 'ME-101',
            type: 'LECTURE_HALL',
            offset: [0, 0, -6],
            width: 14,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Mechanical Engg'
          },
          {
            id: 'ME-102',
            name: 'ME-102 (Automated CAD Lab)',
            code: 'ME-102',
            type: 'SMART_CLASS',
            offset: [0, 0, 6],
            width: 14,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Mechanical Engg'
          }
        ]
      }
    ]
  },
  {
    id: 'bit-block-east',
    name: 'Block D (Admin & Seminar Wing)',
    code: 'BLK-D',
    color: '#fbbf24',
    accentColor: '#fde68a',
    position: [34, 0, 18],
    width: 22,
    depth: 32,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Executive Hall & Faculty',
        classrooms: [
          {
            id: 'B3-101',
            name: 'ADM-101 (Executive Seminar Hall)',
            code: 'ADM-101',
            type: 'AUDITORIUM',
            offset: [0, 0, -6],
            width: 12,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Administration'
          },
          {
            id: 'B3-102',
            name: 'ADM-102 (Conference Room)',
            code: 'ADM-102',
            type: 'SMART_CLASS',
            offset: [0, 0, 6],
            width: 12,
            depth: 8.5,
            rows: 3,
            columns: 2,
            seatsPerBench: 2,
            department: 'Administration'
          }
        ]
      }
    ]
  }
];

// Pre-compute runtime classroom layout tree for fast O(1) access
export const PROCESSED_BUILDINGS = BUILDINGS_CONFIG.map((building) => {
  const floors = building.floors.map((floor) => {
    const classrooms = floor.classrooms.map((room) => {
      const layout = generateClassroomLayout({
        rows: room.rows,
        columns: room.columns,
        seatsPerBench: room.seatsPerBench,
        roomWidth: room.width,
        roomDepth: room.depth,
        classroomId: room.id
      });

      return {
        ...room,
        layout
      };
    });

    return {
      ...floor,
      classrooms
    };
  });

  return {
    ...building,
    floors
  };
});

/**
 * Helper to find building, floor, and classroom by IDs
 */
export function findClassroomHierarchy(classroomId) {
  for (const b of PROCESSED_BUILDINGS) {
    for (const f of b.floors) {
      const room = f.classrooms.find((r) => r.id === classroomId);
      if (room) {
        return { building: b, floor: f, classroom: room };
      }
    }
  }
  return null;
}
