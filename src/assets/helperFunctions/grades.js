export function createGradesForAllStudents() {
  let results = [];
  let as2 = this.allStudentAsignments;
  let compiledStudent = [];
  let compiledSubject = [];
  let pScore = 0;
  let score = 0;
  const letterGrade = [
    { letter: "A", score: 90 },
    { letter: "B", score: 80 },
    { letter: "C", score: 70 },
    { letter: "D", score: 60 }
  ];

  if (as2.length) {
    as2.forEach(studentArray => {
      console.log("studentarray ", studentArray);
      let result = this.$_(studentArray)
        .groupBy(x => x.studentName)
        .map((value, key) => ({ studentName: key, asignments: value }))
        .value();
      result[0].asignments = this.$_(result[0].asignments)
        .groupBy(x => x.subject)
        .map((value, key) => ({ subject: key, asignments: value }))
        .value();
      results.push(result);
    });
  }
  // Combined asignments by subject
  console.log("resultssss ", results);
  // Grades for the entire class
  results.forEach(aa => {
    aa.forEach(student => {
      console.log("student", student);
      student.asignments.forEach(asignmentArray => {
        console.log("asignment array ", asignmentArray);
        asignmentArray.asignments.forEach(asign => {
          console.log("asign ", asign);
          pScore += asign.possibleScore;
          score += asign.score;
        });
        const subject = {
          subject: asignmentArray.subject,
          possibleScore: pScore,
          score: score,
          grade: (score / pScore) * 100
        };
        console.log("subject ", subject);
        for (const grade of letterGrade) {
          if (subject.grade >= grade.score) {
            subject.letterGrade = grade.letter;
            break;
          }
          if (subject.grade <= 59) {
            subject.letterGrade = "F";
          }
        }
        pScore = 0;
        score = 0;
        compiledSubject.push(subject);
        console.log("compiledSubject", compiledSubject);
      });
      compiledStudent.push({
        studentName: student.studentName,
        compiledSubject
      });
      student.compiled = compiledSubject;
      compiledSubject = [];
    });
  });
  console.log("compiledStudent ", compiledStudent);
  console.log("results again", results);
  this.compiledStudentAsignments = results;
  return compiledStudent;
}
