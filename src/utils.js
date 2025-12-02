// src/utils.js

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const calculateDailyRevenue = (enrollments) => {
  const today = new Date().toDateString();
  let dailyRevenue = 0;

  enrollments.forEach(enrollment => {
    // Ensure enrollment has a price and a completionTimestamp
    if (enrollment.price && enrollment.completionTimestamp) {
      let completionDate;
      // Check if completionTimestamp is a Firestore Timestamp object
      if (typeof enrollment.completionTimestamp.toDate === 'function') {
        completionDate = enrollment.completionTimestamp.toDate().toDateString();
      } else {
        // Assume it's already a Date object or a string parseable by Date
        completionDate = new Date(enrollment.completionTimestamp).toDateString();
      }

      if (completionDate === today) {
        dailyRevenue += enrollment.price;
      }
    }
  });

  return dailyRevenue;
};

export const getCompletedSessionsToday = (enrollments) => {
    const today = new Date().toDateString();
    return enrollments.filter(enrollment => {
        if (enrollment.completionTimestamp) {
            let completionDate;
            if (typeof enrollment.completionTimestamp.toDate === 'function') {
                completionDate = enrollment.completionTimestamp.toDate().toDateString();
            } else {
                completionDate = new Date(enrollment.completionTimestamp).toDateString();
            }
            return completionDate === today;
        }
        return false;
    });
};

export const exportHistoryToPDF = (enrollments) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Enrollment History Report", 14, 22);

  const tableColumn = ["Date", "Student Name", "Course Name", "Price", "Status"];
  const tableRows = [];

  enrollments.forEach(enrollment => {
    const enrollmentData = [
      new Date(enrollment.date).toLocaleDateString(),
      enrollment.studentName,
      enrollment.courseName,
      `EGP ${enrollment.price.toLocaleString()}`,
      enrollment.status
    ];
    tableRows.push(enrollmentData);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 30 });
  doc.save('enrollment_history_report.pdf');
};