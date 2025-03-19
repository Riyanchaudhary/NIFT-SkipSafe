// content.js
(function() {
    // Minimum required attendance percentage
    const MIN_ATTENDANCE = 75;
  
    // Function to insert custom CSS
    function addCustomStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .below-minimum {
          background-color: #ffcccc !important;
        }
        .attendance-info {
          padding: 5px;
          margin-bottom: 5px;
          border-radius: 4px;
          font-size: 12px;
        }
        .attendance-warning {
          background-color: #ffcccc;
          color: #cc0000;
        }
        .attendance-good {
          background-color: #ccffcc;
          color: #006600;
        }
        .attendance-stats {
          margin-top: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .skippable-classes {
          font-weight: bold;
          color: #006600;
        }
        .classes-needed {
          font-weight: bold;
          color: #cc0000;
        }
      `;
      document.head.appendChild(style);
    }
  
    // Function to calculate how many classes can be skipped while maintaining minimum attendance
    function calculateSkippableClasses(present, total) {
      // Calculate current attendance percentage
      const currentAttendance = (present / total) * 100;
      
      if (currentAttendance < MIN_ATTENDANCE) {
        return 0;
      }
      
      // Calculate how many classes can be skipped while maintaining minimum attendance
      // Formula: (present / (total + x)) >= MIN_ATTENDANCE/100
      // Solving for x: x <= (present * 100 / MIN_ATTENDANCE - total)
      const skippableClasses = Math.floor((present * 100 / MIN_ATTENDANCE) - total);
      return Math.max(0, skippableClasses);
    }
  
    // Function to calculate how many more classes need to be attended
    function calculateClassesToAttend(present, total) {
      // Calculate current attendance percentage
      const currentAttendance = (present / total) * 100;
      
      if (currentAttendance >= MIN_ATTENDANCE) {
        return 0;
      }
      
      // Calculate how many more classes need to be attended
      // Formula: (present + x) / total >= MIN_ATTENDANCE/100
      // Solving for x: x >= (total * MIN_ATTENDANCE/100) - present
      const classesNeeded = Math.ceil((total * MIN_ATTENDANCE / 100) - present);
      return classesNeeded;
    }
  
    // Function to process the attendance table
    function processAttendanceTable() {
      // Check if we're on the attendance page
      if (!document.querySelector('table')) {
        return;
      }
  
      // Get all rows in the attendance table
      const table = document.querySelector('table');
      const rows = table.querySelectorAll('tbody tr');
      
      // Track overall statistics
      let totalSubjects = 0;
      let subjectsBelowMinimum = 0;
      let overallAttendance = 0;
      
      // Process each row
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 6) return; // Skip rows that don't have enough cells
        
        // Get subject information
        const subjectName = cells[2].textContent.trim();
        const sessionsPresent = parseInt(cells[3].textContent.trim());
        const totalSessions = parseInt(cells[4].textContent.trim());
        const attendanceCell = cells[5];
        const attendancePercentage = parseFloat(attendanceCell.textContent.trim());
        
        // Skip if we can't parse the values
        if (isNaN(sessionsPresent) || isNaN(totalSessions) || isNaN(attendancePercentage)) {
          return;
        }
        
        // Add to overall statistics
        totalSubjects++;
        overallAttendance += attendancePercentage;
        
        // Apply red background for subjects below minimum attendance
        if (attendancePercentage < MIN_ATTENDANCE) {
          subjectsBelowMinimum++;
          row.classList.add('below-minimum');
          attendanceCell.style.backgroundColor = '#ffcccc';
          attendanceCell.style.color = '#cc0000';
          attendanceCell.style.fontWeight = 'bold';
          
          // Calculate classes needed to reach minimum attendance
          const classesNeeded = calculateClassesToAttend(sessionsPresent, totalSessions);
          
          // Add information about classes needed
          const infoCell = document.createElement('td');
          infoCell.className = 'attendance-info attendance-warning';
          infoCell.innerHTML = `Need to attend ${classesNeeded} more class(es)`;
          
          // Find the "Click here" cell
          const lastCell = cells[cells.length - 1];
          row.insertBefore(infoCell, lastCell);
        } else {
          // Calculate classes that can be skipped
          const skippableClasses = calculateSkippableClasses(sessionsPresent, totalSessions);
          
          // Add information about skippable classes
          const infoCell = document.createElement('td');
          infoCell.className = 'attendance-info attendance-good';
          infoCell.innerHTML = `Can skip ${skippableClasses} class(es)`;
          
          // Find the "Click here" cell
          const lastCell = cells[cells.length - 1];
          row.insertBefore(infoCell, lastCell);
        }
      });
      
      // Add overall statistics
      if (totalSubjects > 0) {
        const averageAttendance = overallAttendance / totalSubjects;
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'attendance-stats';
        statsDiv.innerHTML = `
          <h3>Overall Attendance Statistics</h3>
          <p>Average Attendance: <strong>${averageAttendance.toFixed(2)}%</strong></p>
          <p>Subjects Below Minimum (${MIN_ATTENDANCE}%): <strong>${subjectsBelowMinimum}</strong> out of ${totalSubjects}</p>
        `;
        
        // Insert stats after the table
        table.parentNode.insertBefore(statsDiv, table.nextSibling);
      }
    }
  
    // Add custom styles
    addCustomStyles();
    
    // Run the processor
    processAttendanceTable();
    
    // Optional: Add a button to recalculate if needed
    const recalculateButton = document.createElement('button');
    recalculateButton.textContent = 'Recalculate Attendance';
    recalculateButton.style.margin = '10px';
    recalculateButton.style.padding = '5px 10px';
    recalculateButton.style.backgroundColor = '#3498db';
    recalculateButton.style.color = 'white';
    recalculateButton.style.border = 'none';
    recalculateButton.style.borderRadius = '4px';
    recalculateButton.style.cursor = 'pointer';
    recalculateButton.addEventListener('click', processAttendanceTable);
    
    // Insert the button before the table
    const table = document.querySelector('table');
    if (table) {
      table.parentNode.insertBefore(recalculateButton, table);
    }
  })();