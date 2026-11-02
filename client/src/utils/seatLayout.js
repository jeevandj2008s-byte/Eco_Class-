/**
 * Seat Layout Engine
 * Computes exact world-space bench, desk, aisle, and seat coordinates
 * for any classroom specification.
 */

export const BENCH_CONFIG = {
  BENCH_DEPTH: 0.65,       // Desk depth
  SEAT_DEPTH: 0.45,        // Chair depth
  SEAT_WIDTH: 0.65,        // Width allocated per student
  DESK_HEIGHT: 0.75,       // Top of desk
  SEAT_HEIGHT: 0.45,       // Seated hip height
  ROW_SPACING: 1.25,       // Distance from front of one desk to front of next
  AISLE_WIDTH: 0.85,       // Center or side walkway
  FRONT_BUFFER: 2.2,       // Space for teacher desk & whiteboard
  BACK_BUFFER: 0.8         // Space behind last row
};

/**
 * Generates bench and seat layout for a classroom
 * @param {Object} options
 * @param {number} options.rows - Number of rows (front to back)
 * @param {number} options.columns - Benches per row (left to right)
 * @param {number} options.seatsPerBench - Number of students per bench (typically 2 or 3)
 * @param {number} options.roomWidth - Total classroom width (X axis)
 * @param {number} options.roomDepth - Total classroom depth (Z axis)
 * @param {string} options.classroomId - Unique room identifier
 * @returns {Object} Layout object with benches, seats, teacherDesk, whiteboard
 */
export function generateClassroomLayout({
  rows = 4,
  columns = 2,
  seatsPerBench = 3,
  roomWidth = 9.0,
  roomDepth = 8.0,
  classroomId = 'room-1'
}) {
  const benchWidth = seatsPerBench * BENCH_CONFIG.SEAT_WIDTH;
  const totalBenchesWidth = columns * benchWidth + (columns - 1) * BENCH_CONFIG.AISLE_WIDTH;
  const totalBenchesDepth = (rows - 1) * BENCH_CONFIG.ROW_SPACING;

  // Center bench block inside room (leaving front buffer for teacher)
  const startX = -totalBenchesWidth / 2 + benchWidth / 2;
  const startZ = -roomDepth / 2 + BENCH_CONFIG.FRONT_BUFFER + BENCH_CONFIG.BENCH_DEPTH / 2;

  const benches = [];
  const seats = [];

  for (let r = 0; r < rows; r++) {
    const benchZ = startZ + r * BENCH_CONFIG.ROW_SPACING;

    for (let c = 0; c < columns; c++) {
      const benchX = startX + c * (benchWidth + BENCH_CONFIG.AISLE_WIDTH);
      const benchId = `bench-${classroomId}-r${r}-c${c}`;

      const bench = {
        id: benchId,
        classroomId,
        row: r,
        column: c,
        position: [benchX, 0, benchZ],
        width: benchWidth,
        depth: BENCH_CONFIG.BENCH_DEPTH,
        seatsPerBench
      };
      benches.push(bench);

      // Generate individual seats on this bench
      for (let s = 0; s < seatsPerBench; s++) {
        // Seat offset relative to bench center (left to right)
        const seatOffsetX = (s - (seatsPerBench - 1) / 2) * BENCH_CONFIG.SEAT_WIDTH;
        const seatX = benchX + seatOffsetX;
        const seatZ = benchZ + 0.35; // Chair positioned slightly behind desk
        const seatId = `seat-${classroomId}-r${r}-c${c}-s${s}`;

        seats.push({
          id: seatId,
          benchId,
          classroomId,
          row: r,
          column: c,
          seatIndex: s,
          position: [seatX, BENCH_CONFIG.SEAT_HEIGHT, seatZ],
          deskPosition: [seatX, BENCH_CONFIG.DESK_HEIGHT, benchZ]
        });
      }
    }
  }

  // Teacher desk position (facing students at the front)
  const teacherDesk = {
    position: [0, 0, -roomDepth / 2 + 1.1],
    width: 1.6,
    depth: 0.75,
    height: 0.75
  };

  // Whiteboard position on front wall
  const whiteboard = {
    position: [0, 1.8, -roomDepth / 2 + 0.05],
    width: Math.min(roomWidth * 0.65, 4.8),
    height: 1.4
  };

  return {
    classroomId,
    roomWidth,
    roomDepth,
    rows,
    columns,
    seatsPerBench,
    capacity: rows * columns * seatsPerBench,
    benches,
    seats,
    teacherDesk,
    whiteboard
  };
}

