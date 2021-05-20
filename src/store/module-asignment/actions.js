import Localbase from "localbase";
let db = new Localbase("db");

export default {
  async addAsignment(context, data) {
    console.log("data in add asignment ", data);
    const asignment = {
      id: Math.random().toString(),
      name: data.name,
      subject: data.subject,
      possibleScore: data.possibleScore,
      time: data.time,
      chapter: data.chapter,
      courseId: data.courseId
    };
    try {
      const result = await db.collection("asignments").add(asignment);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    context.dispatch(
      "students/addMassAsignments",
      { id: asignment.id, courseId: asignment.courseId },
      { root: true }
    );
    context.commit("addAsignment", asignment);
  },

  addNotes(context, data) {
    db.collection("notes").add({ note: data.note });

    context.commit("addN", data);
  },

  //Receive id of course and array of subject names and icon names in pairs
  //   {
  //    courseId: someId
  //   id: 's9',
  //   name: 'Art',
  //   label: 'Art',
  //   value: 'Art',
  //   description: 'Art subject',
  //   icon: 'color_lens'
  // },
  //courseId: course.id, subjects: data.subjects

  // Add a single subject
  async addSubject(context, data) {
    const subject = {
      id: Math.random(),
      courseId: data.courseId,
      name: data.name,
      label: data.name,
      value: data.name,
      description: data.name + " subject",
      icon: data.icon
    };
    try {
      let result = await db.collection("subjects").add(subject);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    context.commit("addSingleSubject", subject);
  },

  async removeCourseSubject() {
    try {
      let result = await db
        .collection("subjects")
        .doc({ id: data.id })
        .delete();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  },

  async createSubjects(context, data) {
    let subjectArray = [];
    data.subjects.forEach(subject => {
      const newSubject = {
        id: Math.random(),
        courseId: data.courseId,
        name: subject.name,
        label: subject.name,
        value: subject.name,
        description: subject.name + " subject",
        icon: subject.icon
      };
      subjectArray.push(newSubject);
    });
    try {
      subjectArray.forEach(subject => {
        db.collection("subjects").add(subject);
      });
      const result = await db.collection("subjects").get();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    console.log("subjectArray ", subjectArray);
    context.commit("pushNewSubjects", subjectArray);
  },

  addSingleAsignment(context, data) {
    console.log("data in add asignment ", data);
    const asignment = {
      id: Math.random().toString(),
      name: data.name,
      subject: data.subject,
      possibleScore: data.possibleScore,
      time: data.time,
      chapter: data.chapter,
      courseId: data.courseId
    };
    db.collection("asignments").add(asignment);

    context.dispatch(
      "students/addSingleAsignment",
      {
        id: asignment.id,
        courseId: asignment.courseId,
        studentId: data.studentId
      },
      { root: true }
    );
    context.commit("addAsignment", asignment);
  },

  async removeAsignmentByCourseId(context, data) {
    console.log("data in remove asignment ", data);

    try {
      const result = await db
        .collection("asignments")
        .doc({ id: data.id })
        .delete();
    } catch (error) {
      console.log(error);
    }

    context.commit("removeAsignmentByCourseId", data);
  },

  async removeAsignmentById(context, data) {
    console.log("data in remove asignment ", data);

    try {
      const result = await db
        .collection("asignments")
        .doc({ id: data.id })
        .delete();
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    context.commit("removeAsignmentByCourseId", data);
  },

  //asignment object structure
  // chapter: "3"
  // courseId: "0.6316070954766402"
  // id: "0.055162933534108394"
  // name: "Sic Quiz 5"
  // possibleScore: "50"
  // subject: "Science"
  // time: 2
  async changeAsignmentData(_, data) {
    console.log("data ", data);
    let asignKey = data[0];
    let value = data[1];
    let id = data[2];
    console.log("data in changeAsignment", asignKey, value, id);
    // console.log("aa", asignKey);
    // try {
    //   const result = await db
    //     .collection("asignments")
    //     .doc({ id: data.id })
    //     .update({  asignKey: value });
    //   console.log(result);
    // } catch (error) {
    //   console.log(error);
    // }

    // context.commit("changeAsignmentValue", data);
  },

  async setAsignmentData(context) {
    let asignments = [];
    let subjects = [];
    try {
      asignments = await db.collection("asignments").get();
      console.log("asignments ", asignments);
    } catch (error) {
      console.log(error);
    }

    try {
      subjects = await db.collection("subjects").get();
      console.log("subjects ", subjects);
    } catch (error) {
      console.log(error);
    }
    const data = {
      allAsignments: asignments,
      courseSubjects: subjects
    };
    context.commit("setAsignmentData", data);
  }
};
