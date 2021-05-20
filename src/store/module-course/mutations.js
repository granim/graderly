export default {
  addCourse(state, data) {
    state.courses.push(data.course);
    console.log("courses", state.courses);
  },

  removeCourseById(state, data) {
    console.log(data);
    state.courses = state.courses.filter(
      course => course.courseId != data.courseId
    );
  },

  addStudent(state, data) {
    const course = state.courses.find(
      course => course.courseId === data.courseId
    );
    course.courseStudents.push(data.student);
  },

  changeCourseName(state, data) {
    const course = state.courses.find(
      course => course.courseId === data.courseId
    );
    course.courseName = data.courseName;
  },

  setCourses(state, data) {
    console.log("data in setCourse ", data);
    data.forEach(course => {
      if (!state.courses.some(c => c.courseId === course.courseId)) {
        state.courses.push(course);
      }
    });
    console.log(state.courses);
    //  state.courses = data
  },

  removeStudent(state, data) {
    const course = state.courses.find(
      course => course.courseId === data.courseId
    );
    course.courseStudents = course.courseStudents.filter(
      stu => stu.id != data.id
    );
  },

  changeCourseName(state, data) {
    const course = state.courses.find(course => course.id === data.id);
    course.courseName === data.courseName;
  },

  changeCourseStudents(state, data) {
    const course = state.courses.find(course => course.id === data.id);
    course.courseStudents.filter(id => id != data.id);
  },

  initializeCourseStudents(state, data) {
    console.log("Initial course students ", data);
    const course = state.courses.find(course => course.courseId === data.id);
    console.log(course);
    course.courseStudents = data.students;
    course.initilizedStudents = true;
  }
};
