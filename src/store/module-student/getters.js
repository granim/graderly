export default  {
    getStudents(state) {
        return state.studentList
    },

    getSingleStudent(state, data) {
        return state.studentList.find(student => student.id == data.id)
    }

}


