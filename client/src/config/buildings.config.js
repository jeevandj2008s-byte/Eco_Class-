/**
 * Buildings & Campus 3D Architecture Configuration
 * Complete procedural digital twin model matching the 2D Campus Map exactly:
 * - BIT Main Block (60 kW baseline) with Central Courtyard Quadrangle
 * - BIT Block 2 (25 kW) stepped outline
 * - BIT Mechanical (35 kW) top right
 * - BIT Block 3 (28 kW) below Mechanical
 * - BIT Block 4 (10 kW) thin strip between Block 2 and Block 3
 * - BIT Block 5 (15 kW) bottom right
 * - BIT Parking Lot (38 kW) center bottom
 * - BIT Guest House (8 kW) below parking
 * - Landmarks: Chaitra Kota, Kuvempu Kalakshetra, BIT Pink Tree
 */

import { generateClassroomLayout } from '../utils/seatLayout.js';

export const FLOOR_HEIGHT = 3.6; // Volumetric floor slab height in 3D units

export const ANIMATION_CONFIG = {
  enabled: true,         // Master animation switch
  barrierArm: true,      // Parking entry barrier arm oscillation
  carsMoving: true,      // Autonomous cars entering & parking
  flagWave: true,        // Courtyard flag waving
  treesSway: true,       // Subtle foliage wind sway
  studentsIdle: true,    // Seated student idle breathing/sway
  ceilingFans: true,     // Rotating classroom ceiling fans
  fountainWater: true    // Courtyard fountain shimmer
};

/**
 * Campus Landmarks matching 2D map
 */
export const CAMPUS_LANDMARKS = [
  {
    id: 'lm-kuvempu',
    name: 'Kuvempu Kalakshetra',
    position: [-1.4, 0, -33],
    color: '#fbbf24',
    description: 'Premier Cultural Auditorium & Amphitheater'
  },
  {
    id: 'lm-chaitra',
    name: 'Chaitra Kote',
    position: [-16, 0, -14],
    color: '#38bdf8',
    description: 'Heritage Campus Gate & Pavilion'
  },
  {
    id: 'lm-pink-tree',
    name: 'BIT Pink Tree',
    position: [-19, 0, 60],
    color: '#f472b6',
    description: 'Iconic Heritage Tabebuia Rosea'
  }
];

/**
 * Editable Block Names & Labels Configuration
 */
export const BLOCK_LABELS_CONFIG = [
  {
    id: 'bit-main',
    name: 'BIT Main Block',
    shortName: 'Main Block',
    code: 'BLK-A',
    accentColor: '#38bdf8',
    entranceLabel: 'Main Grand Entrance',
    floors: ['G', '1', '2', '3', '4']
  },
  {
    id: 'bit-block-central',
    name: 'BIT Block 2',
    shortName: 'Block 2',
    code: 'BLK-2',
    accentColor: '#a78bfa',
    entranceLabel: 'East Plaza Entry',
    floors: ['G', '1', '2', '3']
  },
  {
    id: 'bit-mechanical',
    name: 'BIT Mechanical',
    shortName: 'Mechanical',
    code: 'MECH',
    accentColor: '#34d399',
    entranceLabel: 'Tech Labs Entry',
    floors: ['G', '1', '2', '3']
  },
  {
    id: 'bit-block-east',
    name: 'BIT Block 3',
    shortName: 'Block 3',
    code: 'BLK-3',
    accentColor: '#fbbf24',
    entranceLabel: 'Block 3 Entry',
    floors: ['G', '1', '2']
  },
  {
    id: 'bit-block-strip',
    name: 'BIT Block 4',
    shortName: 'Block 4',
    code: 'BLK-4',
    accentColor: '#10b981',
    entranceLabel: 'Atrium Connector',
    floors: ['G', '1']
  },
  {
    id: 'bit-block-southeast',
    name: 'BIT Block 5',
    shortName: 'Block 5',
    code: 'BLK-5',
    accentColor: '#f97316',
    entranceLabel: 'South Annex Entry',
    floors: ['G', '1', '2']
  },
  {
    id: 'bit-parking',
    name: 'BIT Parking Lot',
    shortName: 'Parking',
    code: 'P-LOT',
    accentColor: '#006bff',
    entranceLabel: 'Main Parking Gate',
    floors: ['G']
  },
  {
    id: 'bit-guest-house',
    name: 'BIT Guest House',
    shortName: 'Guest House',
    code: 'GH',
    accentColor: '#14b8a6',
    entranceLabel: 'Reception & Suites',
    floors: ['G', '1']
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
 */
export const PARKING_CONFIG = {
  id: 'campus-parking',
  position: [12, 0, 32],
  width: 20,
  depth: 34,
  rows: 2,
  baysPerRow: 8,
  bayWidth: 2.6,
  bayDepth: 5.0,
  bikeSlots: 16,
  accessibleBays: 2,
  visitorBays: 4,
  carFillRatio: 0.65,
  bikeFillRatio: 0.60,
  barrierGatePos: [2.5, 0, 16],
  securityBoothPos: [1.0, 0, 16]
};

/**
 * Sky-Bridges between blocks
 */
export const CONNECTING_BRIDGES = [
  {
    id: 'bridge-a-b-fl2',
    fromBlock: 'bit-main',
    toBlock: 'bit-block-central',
    level: 2,
    start: [-6, (2 - 1) * FLOOR_HEIGHT + 1.2, 12],
    end: [8, (2 - 1) * FLOOR_HEIGHT + 1.2, 0],
    width: 2.8,
    height: 2.6
  },
  {
    id: 'bridge-b-c-fl2',
    fromBlock: 'bit-block-central',
    toBlock: 'bit-mechanical',
    level: 2,
    start: [20, (2 - 1) * FLOOR_HEIGHT + 1.2, -18],
    end: [38, (2 - 1) * FLOOR_HEIGHT + 1.2, -35],
    width: 2.6,
    height: 2.6
  }
];

/**
 * 8 Building Blocks Hierarchy matching the 2D Map Footprints & Telemetry
 */
export const BUILDINGS_CONFIG = [
  // 1. BIT Main Block (Largest on Left with Courtyard Void)
  {
    id: 'bit-main',
    name: 'BIT Main Block',
    code: 'BLK-A',
    shortName: 'Main Block',
    label: 'Bangalore Institute of Technology',
    baselineKw: 60,
    solarCapacityKw: 60,
    accentColor: '#38bdf8',
    position: [-26, 0, 16],
    width: 44,
    depth: 44,
    floorCount: 4,
    courtyard: {
      enabled: true,
      width: 18,
      depth: 18,
      center: [0, 0, 0]
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
        name: 'Floor 3 - Software Systems & Cloud Hub',
        classrooms: [
          {
            id: 'MB-301',
            name: 'SE-301 (Distributed Systems)',
            code: 'SE-301',
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
        name: 'Floor 4 - Quantum Computing & Innovation',
        classrooms: [
          {
            id: 'MB-401',
            name: 'RES-401 (Quantum Computing)',
            code: 'RES-401',
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

  // 2. BIT Block 2 (Stepped Top Outline, Right of Main Block)
  {
    id: 'bit-block-central',
    name: 'BIT Block 2',
    code: 'BLK-2',
    shortName: 'Block 2',
    label: 'BIT Block 2',
    baselineKw: 25,
    solarCapacityKw: 25,
    accentColor: '#a78bfa',
    position: [8, 0, -13],
    width: 26,
    depth: 32,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Electronics & VLSI Core',
        classrooms: [
          {
            id: 'B2-101',
            name: 'EC-101 (Microelectronics)',
            code: 'EC-101',
            offset: [0, 0, -8],
            width: 13,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electronics & Comm'
          },
          {
            id: 'B2-102',
            name: 'EC-102 (Signal Processing)',
            code: 'EC-102',
            offset: [0, 0, 8],
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
            offset: [0, 0, -8],
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
            offset: [0, 0, 8],
            width: 13,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electronics & Comm'
          }
        ]
      },
      {
        level: 3,
        name: 'Floor 3 - Telecommunications & Microwave Lab',
        classrooms: [
          {
            id: 'B2-301',
            name: 'EC-301 (Wireless Networks)',
            code: 'EC-301',
            offset: [0, 0, 0],
            width: 14,
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

  // 3. BIT Mechanical (Top Right)
  {
    id: 'bit-mechanical',
    name: 'BIT Mechanical',
    code: 'BLK-MECH',
    shortName: 'Mechanical',
    label: 'BIT Mechanical Engineering Block',
    baselineKw: 35,
    solarCapacityKw: 35,
    accentColor: '#34d399',
    position: [45, 0, -42],
    width: 26,
    depth: 26,
    floorCount: 2,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Thermodynamics & Heavy Machinery',
        classrooms: [
          {
            id: 'ME-101',
            name: 'ME-101 (Thermodynamics)',
            code: 'ME-101',
            offset: [0, 0, -5],
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
            offset: [0, 0, 5],
            width: 14,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Mechanical Engg'
          }
        ]
      },
      {
        level: 2,
        name: 'Floor 2 - Mechatronics & Robotics Wing',
        classrooms: [
          {
            id: 'ME-201',
            name: 'ME-201 (Industrial Automation)',
            code: 'ME-201',
            offset: [0, 0, 0],
            width: 14,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Mechanical Engg'
          }
        ]
      }
    ]
  },

  // 4. BIT Block 3 (Right Side Below Mechanical)
  {
    id: 'bit-block-east',
    name: 'BIT Block 3',
    code: 'BLK-3',
    shortName: 'Block 3',
    label: 'BIT Block 3',
    baselineKw: 28,
    solarCapacityKw: 20,
    accentColor: '#fbbf24',
    position: [50, 0, -12],
    width: 22,
    depth: 30,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Civil & Structural Engineering',
        classrooms: [
          {
            id: 'B3-101',
            name: 'CV-101 (Structural Design)',
            code: 'CV-101',
            offset: [0, 0, -6],
            width: 12,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Civil Engineering'
          },
          {
            id: 'B3-102',
            name: 'CV-102 (Surveying & GIS Studio)',
            code: 'CV-102',
            offset: [0, 0, 6],
            width: 12,
            depth: 8.5,
            rows: 3,
            columns: 2,
            seatsPerBench: 2,
            department: 'Civil Engineering'
          }
        ]
      },
      {
        level: 2,
        name: 'Floor 2 - Geotechnical & Materials Studio',
        classrooms: [
          {
            id: 'B3-201',
            name: 'CV-201 (Materials Testing)',
            code: 'CV-201',
            offset: [0, 0, 0],
            width: 12,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Civil Engineering'
          }
        ]
      }
    ]
  },

  // 5. BIT Block 4 (Thin Tall Strip Between Block 2 and Block 3)
  {
    id: 'bit-block-strip',
    name: 'BIT Block 4',
    code: 'BLK-4',
    shortName: 'Block 4',
    label: 'BIT Block 4',
    baselineKw: 10,
    solarCapacityKw: 10,
    accentColor: '#34d399',
    position: [34, 0, 0],
    width: 8,
    depth: 42,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Core Utilities & Pumps',
        classrooms: [
          {
            id: 'B4-101',
            name: 'UT-101 (Telemetry Node)',
            code: 'UT-101',
            offset: [0, 0, 0],
            width: 6.5,
            depth: 12,
            rows: 3,
            columns: 1,
            seatsPerBench: 2,
            department: 'Campus Infrastructure'
          }
        ]
      }
    ]
  },

  // 6. BIT Block 5 (Bottom Right)
  {
    id: 'bit-block-southeast',
    name: 'BIT Block 5',
    code: 'BLK-5',
    shortName: 'Block 5',
    label: 'BIT Block 5',
    baselineKw: 15,
    solarCapacityKw: 15,
    accentColor: '#f97316',
    position: [56, 0, 34],
    width: 20,
    depth: 38,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Research Clusters & Computing',
        classrooms: [
          {
            id: 'B5-101',
            name: 'RD-101 (Applied Computing)',
            code: 'RD-101',
            offset: [0, 0, -8],
            width: 12,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Special Research'
          },
          {
            id: 'B5-102',
            name: 'RD-102 (Biotech Analytics)',
            code: 'RD-102',
            offset: [0, 0, 8],
            width: 12,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Special Research'
          }
        ]
      }
    ]
  },

  // 7. BIT Guest House (Below and Right of Parking Lot)
  {
    id: 'bit-guest-house',
    name: 'BIT Guest House',
    code: 'GH',
    shortName: 'Guest House',
    label: 'BIT Guest House',
    baselineKw: 8,
    solarCapacityKw: 8,
    accentColor: '#a855f7',
    position: [34, 0, 43],
    width: 14,
    depth: 22,
    floorCount: 2,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Executive Guest Suites & Foyer',
        classrooms: [
          {
            id: 'GH-101',
            name: 'GH-101 (Executive Suite)',
            code: 'GH-101',
            offset: [0, 0, 0],
            width: 11,
            depth: 8,
            rows: 2,
            columns: 2,
            seatsPerBench: 2,
            department: 'Hospitality'
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
