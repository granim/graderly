import Localbase from "localbase";
import { date } from "quasar";
let db = new Localbase("db");

export default {
  initializeStudents(context, data) {
    console.log("data in ini students", data);
    data.forEach(student => {
      db.collection("students").add(student);
    });

    context.commit("initializeStudents", data);
  },
  // const asignment = {
  //     id: Math.random().toString(),
  //     name: data.name,
  //     subject: data.subject,
  //     possibleScore: data.possibleScore,
  //     time: data.time,
  //     chapter: data.chapter,
  //     courseId: data.courseId

  // }

  async addStudent(context, data) {
    try {
      const result = await db.collection("students").add(data);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    context.commit("addAStudent", data);
  },

  async removeStudentById(context, data) {
    console.log("data in removeStudent ", data);

    try {
      const result = await db
        .collection("students")
        .doc({ id: data.id })
        .delete();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    context.commit("removeStudentById", data);
  },

  // Needed for when you delete a whole class.
  async removeStudentByCourseId(context, data) {
    console.log("data in removeStudent ", data);

    try {
      result = await db
        .collection("students")
        .doc({ courseId: data.courseId })
        .delete();
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    context.commit("removeStudentByCourseId", data);
  },

  async changeStudentName(context, data) {
    try {
      const result = await db
        .collection("students")
        .doc({ id: data.id })
        .update({ name: date.name });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    context.commit("changeStudentName", data);
  },

  async addMassAsignments(context, data) {
    console.log("mass asignment ", data);
    //Student asignments are stored with only the asignment ID and the score
    const asignment = {
      id: data.id,
      score: 0
    };
    let students = [];
    try {
      students = await db.collection("students").get();
      students.forEach(student => {
        student.asignments.push(asignment);
        db.collection("students")
          .doc({ id: student.id })
          .update({ asignments: student.asignments });
      });
    } catch (error) {
      console.log(error);
    }

    context.commit("addMassAsignments", {
      asignement: asignment,
      courseId: data.courseId
    });
  },

  // Change the score on a student asignment
  async changeSingleAsignment(context, data) {
    console.log("data in student action ", data);
    let studentToUpdate = {};
    try {
      const result = await db
        .collection("students")
        .doc({ id: data.studentId })
        .get();
      console.log(result);
      studentToUpdate = result;
      console.log("before", studentToUpdate.asignments);
      const asignIndex = studentToUpdate.asignments.findIndex(
        asign => asign.id === data.id
      );
      studentToUpdate.asignments[asignIndex].score = data.score;
      console.log("after", studentToUpdate.asignments);
    } catch (error) {
      console.log(error);
    }

    try {
      let result = await db
        .collection("students")
        .doc({ id: data.studentId })
        .update({ asignments: studentToUpdate.asignments });
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    context.commit("updateAsignment", {
      studentId: data.studentId,
      asignments: studentToUpdate.asignments
    });
  },

  async addSingleAsignment(context, data) {
    console.log("data in student action ", data);
    let studentToUpdate = {};
    try {
      studentToUpdate = await db
        .collection("students")
        .doc({ id: data.studentId })
        .get();
    } catch (error) {
      console.log(error);
    }

    const asignment = {
      id: data.id,
      score: 0
    };
    studentToUpdate.asignments.push(asignment);
    try {
      await db
        .collection("students")
        .doc({ id: data.studentId })
        .update({ asignments: studentToUpdate.asignments });
    } catch (error) {
      console.log(error);
    }

    context.commit("addAsignment", {
      asignment,
      courseId: data.courseId,
      studentId: data.studentId
    });
  },

  async changeStudentInfo(_, data) {
    console.log("data", data);
    let students = [];
    let newAsignmentArray = [];
    try {
      students = await db.collection("students").get();
      console.log("studnets before", students);
      for (let student of students) {
        data.asignments.forEach(asignment => {
          if (student.name.includes(asignment.studentName)) {
            newAsignmentArray = student.asignments.filter(
              asign => asign.id != asignment.id
            );
            try {
              db.collection("students")
                .doc({ id: student.id })
                .update({ asignments: newAsignmentArray });
            } catch (error) {
              console.log(error);
            }
          }
          newAsignmentArray = [];
        });
      }
    } catch (error) {
      console.log(error);
    }

    console.log("studnets after", students);
    // try {
    //   students = await db.collection("students").get();
    //   students.forEach(student => {
    //     student.asignments.push(asignment);
    //     db.collection("students")
    //       .doc({ id: student.id })
    //       .update({ asignments: student.asignments });
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    //  context.commit("changeStudentInfo", data);
  },

  async removeAsignment(context, data) {
    let studentToUpdate = {};
    try {
      studentToUpdate = await db
        .collection("students")
        .doc({ id: data.studentId })
        .get();
    } catch (error) {
      console.log(error);
    }

    studentToUpdate.asignments.filter(asignment => asignment.id != data.id);
    try {
      await db
        .collection("students")
        .doc({ id: data.studentId })
        .update({ asignments: studentToUpdate.asignments });
    } catch (error) {
      console.log(error);
    }
    context.commit("removeAsignment", data);
  },

  addToGrade(context, data) {
    context.commit("addToGrade", data);
  },

  setLocalStudents(context) {
    db.collection("students")
      .get()
      .then(students => {
        console.log("ss", students);
        context.commit("setStudents", students);
      });
  }
};
