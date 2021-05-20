import Localbase from "localbase";
let db = new Localbase("db");

export default {
  // courses: [
  //     {
  //       courseId: 'c1',
  //       courseName: 'second grade',
  //       courseStudents: [],
  //        }
  //   ]

  // {
  //     courseId: 'c1',
  //     courseName: 'second grade',
  //     numberOfStudents: 0,
  //     initilizedStudents: true,
  //     courseStudents: [],
  //   },

  addCourse(context, data) {
    console.log("data in addCoure", data);
    const course = {
      classIcon: data.classIcon,
      courseId: Math.random().toString(),
      courseName: data.courseName,
      courseStudents: [],
      numberOfStudents: data.numberOfStudents,
      initilizedStudents: false
    };
    console.log(course);
    db.collection("courses").add(course);

    console.log(context);

    context.dispatch(
      "asignments/createSubjects",
      { courseId: course.courseId, subjects: data.subjects },
      { root: true }
    );
    context.commit("addCourse", { course: course });
  },

  async removeCourseById(context, data) {
    console.log("data in removeCOurse", data);
    try {
      let result = await db
        .collection("courses")
        .doc({ courseId: data.courseId })
        .delete();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    // If a course is deleted before students are added
    if (data.students.length >= 1) {
      context.dispatch(
        "students/removeStudentByCourseId",
        { courseId: data.courseId },
        { root: true }
      );
    }

    context.commit("removeCourseById", data);
  },

  async removeStudent(context, data) {
    let students = [];
    try {
      let course = await db
        .collection("courses")
        .doc({ courseId: data.courseId })
        .get();
      students = course.courseStudents.filter(student => student.id != data.id);
    } catch (error) {
      console.log(error);
    }

    try {
      let result = await db
        .collection("courses")
        .doc({ courseId: data.courseId })
        .update({ courseStudents: students });
      console.log(result);
    } catch (error) {
      console.log("error: ", error);
    }

    context.commit("removeStudent", data);
  },

  async addSingleStudent(context, data) {
    console.log("data in addStudentToCourse", data);
    let students = [];
    let studentForCourse = {};
    try {
      let result = await db
        .collection("courses")
        .doc({ courseId: data.courseId })
        .get();
      students = result.courseStudents;
      studentForCourse = {
        name: data.name,
        id: data.id
      };
      students.push(studentForCourse);
    } catch (error) {
      console.log(error);
    }
    students.push();
    try {
      let result = await db
        .collection("courses")
        .doc({ courseId: data.courseId })
        .update({ courseStudents: students });
      console.log("result", result);
    } catch (error) {
      console.log(error);
      return error;
    }
    context.commit("addStudent", {
      student: studentForCourse,
      courseId: data.courseId
    });
  },

  async changeCourseName(context, data) {
    try {
      let result = await db
        .collection("courses")
        .doc({ courseId: data.courseId })
        .update({ courseName: data.courseName });
      console.log("result", result);
    } catch (error) {
      console.log(error);
      return error;
    }
    context.commit("changeCourseName", data);
  },

  //Need course ID and a student Array
  //   this.$store.dispatch('courses/initializeCourseStudents', {id: this.$route.params.id, students:  this.studentNames} )
  async initializeCourseStudents(context, data) {
    console.log("Ini course students action ", data);
    let students = [];
    data.students.forEach(student => {
      const studentToAdd = {
        id: student.id,
        name: student.name
      };
      students.push(studentToAdd);
    });

    try {
      await db
        .collection("courses")
        .doc({ courseId: data.id })
        .update({ courseStudents: students });
    } catch (error) {
      console.log("error: ", error);
    }
    //  Have to await multiple collection calls or else the next one will not fire.
    try {
      await db
        .collection("courses")
        .doc({ courseId: data.id })
        .update({ numberOfStudents: 0 });
    } catch (error) {
      console.log("error: ", error);
    }
    db.collection("courses")
      .doc({ courseId: data.id })
      .update({ initilizedStudents: true });

    context.commit("initializeCourseStudents", data);
  },

  //   db.collection('students').doc({studentId: data.studentId}).add(asignment)
  setLocalCourse(context) {
    db.collection("courses")
      .get()
      .then(courses => {
        console.log("cc", courses);
        context.commit("setCourses", courses);
      });
  }
};
