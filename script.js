document.addEventListener('DOMContentLoaded', () => {
  const cgpaForm = document.getElementById('cgpaForm');
  const addCourseButton = document.getElementById('addCourse');
  const coursesContainer = document.getElementById('coursesContainer');
  const resultDiv = document.getElementById('result');
  const predictionForm = document.getElementById('predictionForm');
  const predictGradeButton = document.getElementById('predictGrade');
  const predictionResultDiv = document.getElementById('predictionResult');
  const totalCgpaForm = document.getElementById('totalCgpaForm');
  const addCgpaCourseButton = document.getElementById('addCgpaCourse');
  const cgpaCoursesContainer = document.getElementById('cgpaCoursesContainer');
  const totalCgpaResultDiv = document.getElementById('totalCgpaResult');

  addCourseButton.addEventListener('click', () => {
      const courseDiv = document.createElement('div');
      courseDiv.classList.add('course', 'mb-4');
      courseDiv.innerHTML = `
          <label class="block">Course Code:</label>
          <input type="text" class="border p-2 w-full course-code" placeholder="Course Code" required>
          <label class="block">Credits:</label>
          <input type="number" class="border p-2 w-full course-credits" placeholder="Credits" step="0.25" required>
          <label class="block">Mid Term Marks:</label>
          <input type="number" class="border p-2 w-full mid-marks" placeholder="Mid Term Marks" required>
          <label class="block">Assessment Marks:</label>
          <input type="number" class="border p-2 w-full assessment-marks" placeholder="Assessment Marks" required>
      `;
      coursesContainer.appendChild(courseDiv);
  });

  cgpaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const courses = document.querySelectorAll('.course');
      let totalCredits = 0;
      let totalPoints = 0;

      courses.forEach(course => {
          const credits = parseFloat(course.querySelector('.course-credits').value);
          const midMarks = parseFloat(course.querySelector('.mid-marks').value);
          const assessmentMarks = parseFloat(course.querySelector('.assessment-marks').value);
          const finalMarks = parseFloat(course.querySelector('.final-marks').value);

          // Calculate marks out of 50
          const midScore = midMarks / 3;
          const assessmentScore = assessmentMarks / 3;
          const totalScore = midScore + assessmentScore;

          // Calculate final score
          const finalScore = finalMarks / 3;
          const finalTotalScore = totalScore + finalScore;

          // Calculate GPA based on total score
          const gpa = calculateGPA(finalTotalScore);

          // Accumulate total points and credits
          totalPoints += gpa * credits;
          totalCredits += credits;
      });

      // Calculate CGPA
      const cgpa = totalPoints / totalCredits;
      document.getElementById('result').innerText = `Your CGPA is: ${cgpa.toFixed(2)}`;
  });

  predictGradeButton.addEventListener('click', () => {
      const desiredGrade = document.getElementById('desiredGrade').value;
      const courses = document.querySelectorAll('.course');
      let predictionText = '';

      courses.forEach(course => {
          const midMarks = parseFloat(course.querySelector('.mid-marks').value);
          const assessmentMarks = parseFloat(course.querySelector('.assessment-marks').value);
          const requiredFinalMarks = calculateRequiredFinalMarks(midMarks, assessmentMarks, desiredGrade);

          predictionText += `For course ${course.querySelector('.course-code').value}, you need ${requiredFinalMarks.toFixed(2)} marks in the final exam to achieve a grade of ${desiredGrade}.<br>`;
      });

      predictionResultDiv.innerHTML = predictionText;
  });

  addCgpaCourseButton.addEventListener('click', () => {
      const cgpaCourseDiv = document.createElement('div');
      cgpaCourseDiv.classList.add('cgpa-course', 'mb-4');
      cgpaCourseDiv.innerHTML = `
          <label class="block">Course Code:</label>
          <input type="text" class="border p-2 w-full cgpa-course-code" placeholder="Course Code" required>
          <label class="block">Credits:</label>
          <input type="number" class="border p-2 w-full cgpa-course-credits" placeholder="Credits" step="0.25" required>
          <label class="block">Grade Point:</label>
          <input type="number" class="border p-2 w-full cgpa-grade-point" placeholder="Grade Point" step="0.01" required>
      `;
      cgpaCoursesContainer.appendChild(cgpaCourseDiv);
  });

  document.getElementById('calculateTotalCgpa').addEventListener('click', () => {
      const cgpaCourses = document.querySelectorAll('.cgpa-course');
      let totalCredits = 0;
      let totalGradePoints = 0;

      cgpaCourses.forEach(course => {
          const credits = parseFloat(course.querySelector('.cgpa-course-credits').value);
          const gradePoint = parseFloat(course.querySelector('.cgpa-grade-point').value);

          totalCredits += credits;
          totalGradePoints += gradePoint * credits;
      });

      const totalCgpa = totalGradePoints / totalCredits;
      totalCgpaResultDiv.textContent = `Your Total CGPA is ${totalCgpa.toFixed(2)}`;
  });

  function calculateGPA(score) {
      if (score >= 80) return 4.00; // A+
      if (score >= 75) return 3.75; // A
      if (score >= 70) return 3.50; // A-
      if (score >= 65) return 3.25; // B+
      if (score >= 60) return 3.00; // B
      if (score >= 55) return 2.75; // B-
      if (score >= 50) return 2.50; // C+
      if (score >= 45) return 2.25; // C
      if (score >= 40) return 2.00; // D
      return 0.00; // F (Below 40)
  }

  function calculateRequiredFinalMarks(midMarks, assessmentMarks, desiredGrade) {
      const desiredGradePoint = {
          'A+': 4.0,
          'A': 3.75,
          'A-': 3.5,
          'B+': 3.25,
          'B': 3.0,
          'B-': 2.75,
          'C+': 2.5,
          'C': 2.25,
          'D': 2.0,
          'F': 0.0
      }[desiredGrade];

      const currentMarks = (midMarks / 3) + (assessmentMarks / 3);
      const requiredMarksOutOf50 = (desiredGradePoint * 20) - currentMarks;
      return requiredMarksOutOf50 * 3; // Convert to marks out of 150
  }
});