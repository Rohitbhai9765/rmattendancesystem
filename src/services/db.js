import { getStudentsForSubject } from '../data/studentsData';

const API_URL = import.meta.env.VITE_API_URL || '';
let cachedRecords = {};

// Get all attendance records
export const getAttendanceRecords = async (subjectId) => {
  if (!subjectId) return {};
  try {
    const response = await fetch(`${API_URL}/api/attendance?subjectId=${subjectId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    cachedRecords[subjectId] = data;
    return data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return cachedRecords[subjectId] || {};
  }
};

// Save attendance for a specific date
export const saveAttendance = async (dateStr, subjectId, presentStudents, lectureConducted = false) => {
  if (!subjectId) return;
  try {
    await fetch(`${API_URL}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: dateStr, subjectId, presentStudents, lectureConducted }),
    });
    
    // Update local cache
    if (!cachedRecords[subjectId]) {
      cachedRecords[subjectId] = {};
    }
    cachedRecords[subjectId][dateStr] = { presentStudents, lectureConducted };
  } catch (error) {
    console.error("Error saving attendance:", error);
  }
};

// Get statistics for each student
export const getStudentStatistics = async (subjectId) => {
  if (!subjectId) return [];
  const records = await getAttendanceRecords(subjectId);
  const dates = Object.keys(records);
  
  // Only count dates where lecture was actually conducted
  const conductedDates = dates.filter(date => records[date]?.lectureConducted === true);
  const totalClasses = conductedDates.length;

  const currentStudents = getStudentsForSubject(subjectId);

  return currentStudents.map(student => {
    const classesAttended = conductedDates.reduce((count, date) => {
      const isPresent = records[date]?.presentStudents?.includes(student.mis);
      return isPresent ? count + 1 : count;
    }, 0);

    const percentage = totalClasses === 0 ? 0 : Math.round((classesAttended / totalClasses) * 100);

    return {
      ...student,
      classesAttended,
      totalClasses,
      percentage
    };
  });
};
