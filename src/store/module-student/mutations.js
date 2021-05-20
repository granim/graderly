export default {
  initializeStudents(state, data) {
    console.log("initial students ", data);
    state.studentList.push(...data);
    console.log("studentslsit", state.studentList);
  },

  addAStudent(state, data) {
    state.studentList.push(data);
  },

  removeStudentById(state, data) {
    console.log(state.studentList);
    state.studentList = state.studentList.filter(
      student => student.id != data.id
    );
    console.log(state.studentList);
  },

  removeStudentByCourseId(state, data) {
    console.log(state.studentList);
    state.studentList = state.studentList.filter(
      student => student.courseId != data.id
    );
    console.log(state.studentList);
  },

  updateAsignment(state, data) {
    const student = state.studentList.find(
      student => student.id === data.studentId
    );
    student.asignments = data.asignments;
  },

  changeStudentInfo(state, data) {
    console.log("change student data ", data);

    const student = state.studentList.find(student => student.id === data.id);
    console.log("student ", student);

    student.asignments.forEach(asignement => {
      console.log("asignement ", asignement);
      data.asignments.forEach(changedAsignment => {
        console.log("changedasignment ", changedAsignment);
        if (data.option === true && changedAsignment.id === asignement.id) {
          student.asignments = student.asignments.filter(
            asign => asign.id != asignement.id
          );
        }
        if (changedAsignment.id === asignement.id) {
          asignement.score = changedAsignment.score;
        }
      });
    });
  },

  changeStudentName(state, data) {
    const student = state.studentList.find(student => student.id === data.id);
    student.name = data.name;
  },

  addMassAsignments(state, data) {
    console.log("add mass asignement ", data);
    console.log("all students ", state.studentList);
    const students = state.studentList.filter(
      student => student.courseId === data.courseId
    );
    students.forEach(student => {
      student.asignments.push(data.asignement);
    });
    console.log("student List ", state.studentList);
  },

  addAsignment(state, data) {
    console.log("data om add stidemt asignment ", data);
    const student = state.studentList.find(
      student => student.id === data.studentId
    );
    console.log(student.asignments.length);
    student.asignments.push(data.asignment);
    console.log(student.asignments.length);
  },

  removeAsignment(state, data) {
    const student = state.studentList.find(
      asignment => asignment.id === data.id
    );
    student.asignments.filter(asignment => asignment.id != data.asignmentId);
  },

  addToGrade(state, data) {
    const student = state.studentList.find(
      asignment => asignment.id === data.id
    );
    const grade = student.grades.find(grade => grade.id === data.gradeId);
    grade.avaibleScore += data.avaibleScore;
    grade.score += data.score;
  },

  setStudents(state, data) {
    console.log("data in setStudents ", data);
    data.forEach(student => {
      state.studentList.push(student);
    });
    console.log(state.studentList);
  }
};
