export default {
  getAsignments(state) {
    return state.allAsignments;
  },

  //Default subject array
  getSubjects(state) {
    return state.allSubjects;
  },
  //Created subject array
  getCourseSubjects(state) {
    console.log("getter for subject", state.courseSubjects);
    return state.courseSubjects;
  },

  getNotes(state) {
    return state.notes;
  },

  getSubjectNames(state) {
    return state.subjectNames;
  },

  getIconNames(state) {
    return state.iconNames;
  },

  getTimes(state) {
    return state.allTimes;
  },

  getSingleAsignment(state, data) {
    return state.allAsignments.find(asignment => asignment.id == data.id);
  },

  getAsignmentBySubject(state, data) {
    return state.allAsignments.find(
      asignment => asignment.subject == data.subject
    );
  },

  getAsignmentByName(state, data) {
    return state.allAsignments.find(asignment => asignment.name == data.name);
  }
};
