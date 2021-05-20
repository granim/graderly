export default  { 
   getCourses(state) {
        return state.courses
   },

   getCourse(state, data) {
      console.log(data)
      return state.courses.find(course => course.id === data.id)
   }
}
