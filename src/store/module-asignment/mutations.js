export default {
  addAsignment(state, data) {
    console.log("addasignment ", data);
    state.allAsignments.push(data);
    console.log(state.allAsignments);
  },

  removeAsignmentById(state, data) {
    state.allAsignments = state.allAsignments.filter(
      asignment => asignment.id != data.id
    );
  },

  removeAsignmentByCourseId(state, data) {
    console.log(state.allAsignments);
    state.allAsignments = state.allAsignments.filter(
      asignment => asignment.courseId != data.id
    );
    console.log(state.allAsignments);
  },

  addSingleSubject(state, data) {
    console.log("addsignleSubject", data);
    state.courseSubjects.push(data);
  },

  removeSubject(state, data) {
    state.courseSubjects.filter(sub => sub.id != data.id);
  },

  pushNewSubjects(state, data) {
    const existingSubjects = state.courseSubjects;
    state.courseSubjects = [...existingSubjects, ...data];
  },

  changePossibleScore(state, data) {
    const asignmentToChange = state.allAsignments.find(
      asignment => asignment.id === data.id
    );
    asignmentToChange.possibleScore = data.score;
  },

  changeSubject(state, data) {
    const asignmentToChange = state.allAsignments.find(
      asignment => asignment.id === data.id
    );
    asignmentToChange.subject = data.subject;
  },

  changeAsignmentName(state, data) {
    const asignmentToChange = state.allAsignments.find(
      asignment => asignment.id === data.id
    );
    asignmentToChange.name === data.name;
  },

  addN(state, data) {
    state.notes.push(data);
  },

  // key: asignKey,
  // value: this.toEdit,
  // id: prop.id
  changeAsignmentValue(state, data) {
    const asignmentToChange = state.allAsignments.find(
      asignment => asignment.id === data.id
    );
    asignmentToChange.data.key === data.value;
  },

  setAsignmentData(state, data) {
    data.allAsignments.forEach(asign => {
      if (!state.allAsignments.some(a => a.id === asign.id)) {
        state.allAsignments.push(asign);
      }
    });
    console.log(state.allAsignments);
    data.courseSubjects.forEach(sub => {
      if (!state.courseSubjects.some(s => s.id === sub.id)) {
        state.courseSubjects.push(sub);
      }
    });
    console.log(state.courseSubjects);
  }
};
