/**
 * Buildings & Floor Interior Architecture Configuration
 * Defines building dimensional properties, floor stacks, corridors, and classroom bounding cells.
 * Edit rooms, capacities, and layout parameters here without altering 3D engine code.
 */

import { generateClassroomLayout } from '../utils/seatLayout.js';

export const FLOOR_HEIGHT = 3.6; // Floor-to-floor vertical distance in 3D units

export const BUILDINGS_CONFIG = [
  {
    id: 'bit-main',
    name: 'BIT Main Block',
    code: 'MB',
    color: '#3b82f6',
    accentColor: '#60a5fa',
    position: [-27, 0, 24],
    width: 44,
    depth: 48,
    floorCount: 5,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Computer Science & Dean',
        classrooms: [
          {
            id: 'MB-101',
            name: 'CS-101 (Data Structures)',
            code: 'CS-101',
            type: 'LECTURE_HALL',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.5,
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
            offset: [0, 0, -12],
            width: 10,
            depth: 9.5,
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
            offset: [12, 0, -12],
            width: 11,
            depth: 9.5,
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
            offset: [-12, 0, 12],
            width: 11,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Computer Science'
          },
          {
            id: 'MB-105',
            name: 'CS-105 (Computer Networks)',
            code: 'CS-105',
            type: 'LECTURE_HALL',
            offset: [12, 0, 12],
            width: 11,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Computer Science'
          }
        ]
      },
      {
        level: 2,
        name: 'Floor 2 - AI & Machine Learning Hub',
        classrooms: [
          {
            id: 'MB-201',
            name: 'AI-201 (Deep Learning Studio)',
            code: 'AI-201',
            type: 'AI_LAB',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'AI & Machine Learning'
          },
          {
            id: 'MB-202',
            name: 'AI-202 (Computer Vision Lab)',
            code: 'AI-202',
            type: 'AI_LAB',
            offset: [0, 0, -12],
            width: 10,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'AI & Machine Learning'
          },
          {
            id: 'MB-203',
            name: 'AI-203 (Neural Networks)',
            code: 'AI-203',
            type: 'LECTURE_HALL',
            offset: [12, 0, -12],
            width: 11,
            depth: 9.5,
            rows: 5,
            columns: 2,
            seatsPerBench: 3,
            department: 'AI & Machine Learning'
          },
          {
            id: 'MB-204',
            name: 'AI-204 (Robotics & Edge AI)',
            code: 'AI-204',
            type: 'SMART_CLASS',
            offset: [-12, 0, 12],
            width: 11,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'AI & Machine Learning'
          }
        ]
      },
      {
        level: 3,
        name: 'Floor 3 - Information Science',
        classrooms: [
          {
            id: 'MB-301',
            name: 'IS-301 (Cloud Computing)',
            code: 'IS-301',
            type: 'LECTURE_HALL',
            offset: [-12, 0, -12],
            width: 11,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Information Science'
          },
          {
            id: 'MB-302',
            name: 'IS-302 (Cyber Security)',
            code: 'IS-302',
            type: 'SMART_CLASS',
            offset: [12, 0, -12],
            width: 11,
            depth: 9.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Information Science'
          }
        ]
      }
    ]
  },
  {
    id: 'bit-block-central',
    name: 'BIT Academic Block 2',
    code: 'B2',
    color: '#f97316',
    accentColor: '#fb923c',
    position: [18, 0, -10],
    width: 36,
    depth: 28,
    floorCount: 4,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Electronics & Comm (ECE)',
        classrooms: [
          {
            id: 'B2-101',
            name: 'EC-101 (VLSI Design)',
            code: 'EC-101',
            type: 'LECTURE_HALL',
            offset: [-9, 0, -6],
            width: 10,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electronics & Communication'
          },
          {
            id: 'B2-102',
            name: 'EC-102 (Embedded Systems)',
            code: 'EC-102',
            type: 'SMART_CLASS',
            offset: [9, 0, -6],
            width: 10,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Electronics & Communication'
          },
          {
            id: 'B2-103',
            name: 'EC-103 (Digital Signal Processing)',
            code: 'EC-103',
            type: 'LECTURE_HALL',
            offset: [-9, 0, 6],
            width: 10,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electronics & Communication'
          }
        ]
      },
      {
        level: 2,
        name: 'Floor 2 - Electrical & Electronics (EEE)',
        classrooms: [
          {
            id: 'B2-201',
            name: 'EE-201 (Power Grid & Microgrids)',
            code: 'EE-201',
            type: 'LECTURE_HALL',
            offset: [-9, 0, -6],
            width: 10,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Electrical Engineering'
          },
          {
            id: 'B2-202',
            name: 'EE-202 (Renewable Energy Lab)',
            code: 'EE-202',
            type: 'SMART_CLASS',
            offset: [9, 0, -6],
            width: 10,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Electrical Engineering'
          }
        ]
      }
    ]
  },
  {
    id: 'bit-mechanical',
    name: 'BIT Mechanical Engineering',
    code: 'ME',
    color: '#ef4444',
    accentColor: '#f87171',
    position: [53, 0, -23],
    width: 26,
    depth: 26,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - CAD & CNC Workshop',
        classrooms: [
          {
            id: 'ME-101',
            name: 'ME-101 (CAD / CAM Lab)',
            code: 'ME-101',
            type: 'WORKSHOP',
            offset: [-6, 0, -6],
            width: 9,
            depth: 8,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Mechanical Engineering'
          },
          {
            id: 'ME-102',
            name: 'ME-102 (Thermodynamics Hall)',
            code: 'ME-102',
            type: 'LECTURE_HALL',
            offset: [6, 0, -6],
            width: 9,
            depth: 8,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Mechanical Engineering'
          }
        ]
      }
    ]
  },
  {
    id: 'bit-block-east',
    name: 'BIT Academic Block 3',
    code: 'B3',
    color: '#eab308',
    accentColor: '#facc15',
    position: [58, 0, 12],
    width: 22,
    depth: 30,
    floorCount: 3,
    floors: [
      {
        level: 1,
        name: 'Floor 1 - Civil & Environmental',
        classrooms: [
          {
            id: 'B3-101',
            name: 'CV-101 (Structural Analysis)',
            code: 'CV-101',
            type: 'LECTURE_HALL',
            offset: [0, 0, -7],
            width: 14,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 3,
            department: 'Civil Engineering'
          },
          {
            id: 'B3-102',
            name: 'CV-102 (GIS & Remote Sensing)',
            code: 'CV-102',
            type: 'SMART_CLASS',
            offset: [0, 0, 7],
            width: 14,
            depth: 8.5,
            rows: 4,
            columns: 2,
            seatsPerBench: 2,
            department: 'Civil Engineering'
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

