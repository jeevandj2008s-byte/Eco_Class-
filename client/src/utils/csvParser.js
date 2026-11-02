/**
 * CSV Parser & Importer for Student Seat Allocation
 * Validates entries, prevents double-booking, and supports auto-assignment.
 */

import { findClassroomHierarchy, PROCESSED_BUILDINGS } from '../config/buildings.config.js';

/**
 * Generate a ready-to-use sample CSV template for users to download
 */
export function generateSampleCsv() {
  const header = 'name,usn,department,year,section,classroomId,benchId,seatIndex,avatarColor';
  const sampleRows = [
    'Aarav Sharma,1BI22CS091,Computer Science,3rd Year,A,MB-101,,,#38bdf8',
    'Pooja Hegde,1BI22CS092,Computer Science,3rd Year,A,MB-101,,,#34d399',
    'Rohan Varma,1BI22AI031,AI & Machine Learning,2nd Year,B,MB-201,,,#a78bfa',
    'Sneha Patel,1BI22EC015,Electronics & Comm,3rd Year,A,B2-101,,,#fb7185',
    'Karthik Raja,1BI22CS093,Computer Science,3rd Year,A,MB-102,,,#fbbf24'
  ];
  return [header, ...sampleRows].join('\n');
}

/**
 * Trigger download of the sample CSV template in the browser
 */
export function downloadSampleCsvFile(filename = 'aurasync_students_template.csv') {
  const csvContent = generateSampleCsv();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse and validate CSV text into structured student records
 * @param {string} csvText - Raw CSV text
 * @param {Array} existingStudents - Current list of students to check occupancy against
 * @returns {Object} { success: boolean, students: Array, errors: Array, summary: string }
 */
export function parseStudentsCsv(csvText, existingStudents = []) {
  if (!csvText || typeof csvText !== 'string') {
    return { success: false, students: [], errors: ['CSV content is empty or invalid.'], summary: 'Empty file' };
  }

  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    return { success: false, students: [], errors: ['CSV must have at least a header and one data row.'], summary: 'No data rows' };
  }

  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/[\"\'\s]/g, ''));

  // Required header indices
  const nameIdx = headers.findIndex(h => h.includes('name'));
  const usnIdx = headers.findIndex(h => h.includes('usn') || h.includes('roll') || h.includes('id'));
  const roomIdx = headers.findIndex(h => h.includes('classroom') || h.includes('room'));
  const benchIdx = headers.findIndex(h => h.includes('bench'));
  const seatIdx = headers.findIndex(h => h.includes('seat'));
  const deptIdx = headers.findIndex(h => h.includes('dept') || h.includes('department'));
  const yearIdx = headers.findIndex(h => h.includes('year'));
  const secIdx = headers.findIndex(h => h.includes('sec') || h.includes('section'));
  const colorIdx = headers.findIndex(h => h.includes('color') || h.includes('avatar'));

  if (nameIdx === -1 || usnIdx === -1 || roomIdx === -1) {
    return {
      success: false,
      students: [],
      errors: ['Missing mandatory columns. CSV requires at least: name, usn (or rollNo), classroomId.'],
      summary: 'Invalid headers'
    };
  }

  // Track occupied seat IDs: existing + newly assigned in this batch
  const occupiedSeatIds = new Set(existingStudents.map(s => s.seatId));
  const existingUsns = new Set(existingStudents.map(s => (s.usn || s.rollNo || '').toUpperCase()));

  const parsedStudents = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple CSV row parser (handles standard commas)
    const cols = rawLine.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

    const name = cols[nameIdx];
    const usn = cols[usnIdx];
    const classroomId = cols[roomIdx];

    if (!name || !usn || !classroomId) {
      errors.push(`Row ${i + 1}: Skipping because name, USN, or classroomId is blank.`);
      continue;
    }

    if (existingUsns.has(usn.toUpperCase())) {
      errors.push(`Row ${i + 1} (${name}): USN ${usn} already registered.`);
      continue;
    }

    // Lookup room hierarchy
    const hierarchy = findClassroomHierarchy(classroomId);
    if (!hierarchy || !hierarchy.classroom) {
      errors.push(`Row ${i + 1} (${name}): Classroom ID "${classroomId}" not found in campus architecture.`);
      continue;
    }

    const { building, floor, classroom } = hierarchy;
    const allSeats = classroom.layout?.seats || [];
    if (allSeats.length === 0) {
      errors.push(`Row ${i + 1} (${name}): Classroom ${classroomId} has no seat geometry defined.`);
      continue;
    }

    const rawBench = benchIdx !== -1 ? cols[benchIdx] : '';
    const rawSeat = seatIdx !== -1 ? parseInt(cols[seatIdx], 10) : NaN;

    let targetSeat = null;

    // If explicit bench and seat provided, check availability
    if (rawBench && !isNaN(rawSeat)) {
      const match = allSeats.find(s => s.benchId === rawBench && s.seatIndex === rawSeat);
      if (match && !occupiedSeatIds.has(match.id)) {
        targetSeat = match;
      }
    }

    // Auto-assignment fallback: find the first available seat in the room
    if (!targetSeat) {
      targetSeat = allSeats.find(s => !occupiedSeatIds.has(s.id));
    }

    if (!targetSeat) {
      errors.push(`Row ${i + 1} (${name}): No vacant seats remaining in room ${classroomId} (Capacity: ${allSeats.length}).`);
      continue;
    }

    // Reserve seat
    occupiedSeatIds.add(targetSeat.id);
    existingUsns.add(usn.toUpperCase());

    const avatarColors = ['#38bdf8', '#34d399', '#f472b6', '#a78bfa', '#fbbf24', '#2dd4bf'];
    const assignedColor = (colorIdx !== -1 && cols[colorIdx]) ? cols[colorIdx] : avatarColors[parsedStudents.length % avatarColors.length];

    parsedStudents.push({
      id: `stu-${targetSeat.id}`,
      name,
      rollNo: usn,
      usn,
      department: (deptIdx !== -1 && cols[deptIdx]) || classroom.department || 'Engineering',
      year: (yearIdx !== -1 && cols[yearIdx]) || '3rd Year',
      section: (secIdx !== -1 && cols[secIdx]) || 'A',
      avatarColor: assignedColor,
      buildingId: building.id,
      floorLevel: floor.level,
      classroomId: classroom.id,
      benchId: targetSeat.benchId,
      seatId: targetSeat.id,
      seatIndex: targetSeat.seatIndex,
      row: targetSeat.row,
      column: targetSeat.column,
      status: 'PRESENT',
      joinedAt: new Date().toISOString()
    });
  }

  return {
    success: parsedStudents.length > 0,
    students: parsedStudents,
    errors,
    summary: `Successfully parsed ${parsedStudents.length} student${parsedStudents.length === 1 ? '' : 's'}.${errors.length > 0 ? ` (${errors.length} skipped)` : ''}`
  };
}

