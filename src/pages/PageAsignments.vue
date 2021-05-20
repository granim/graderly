<template>
  <div class="q-ma-sm">
    <div q-pa-sm>
      <div class="text-h4">Asignments</div>
    </div>

    <q-table
      grid
      card-class="bg-primary text-white "
      :data="filteredAsignments"
      :columns="columns"
      row-key="id"
      :filter="filter"
      hide-header
      :selected.sync="selection"
      selection="single"
      card-container-class="full-width column wrap"
    >
      <template v-slot:item="props">
        <transition-group name="fade">
          <q-card :props="props" :key="props.row.id" class="customCard  ">
            <div class="flex">
              <q-tr>
                <q-td
                  >{{ props.row.name }}
                  <q-popup-edit
                    @cancel="resetToEdit()"
                    v-model="toEdit"
                    title="Edit the Name"
                  >
                    <q-input
                      @keypress.enter="
                        changeAsignmentData(props.row, props.row.name)
                      "
                      dense
                      autofocus
                      v-model="toEdit"
                    /> </q-popup-edit
                ></q-td>
              </q-tr>

              <q-tr
                ><q-td>{{ props.row.subject }} </q-td></q-tr
              >
              <q-tr
                ><q-td
                  >{{ props.row.possibleScore }}
                  <q-popup-edit
                    @cancel="resetToEdit()"
                    v-model="toEdit"
                    title="Edit PossibleScore"
                  >
                    <q-input
                      :label="props.row.possibleScore"
                      dense
                      autofocus
                      v-model="toEdit"
                      @keypress.enter="
                        changeAsignmentData(props.row, props.row.possibleScore)
                      "
                    /> </q-popup-edit></q-td
              ></q-tr>
              <q-tr
                ><q-td
                  >Quater: {{ props.row.time }}
                  <q-popup-edit
                    @cancel="resetToEdit()"
                    v-model="toEdit"
                    title="Edit the Quater"
                  >
                    <q-input
                      v-model="toEdit"
                      dense
                      autofocus
                      @keypress.enter="
                        changeAsignmentData(props.row, props.row.time)
                      "
                    /> </q-popup-edit
                ></q-td>
              </q-tr>
              <q-tr
                ><q-td
                  >Chapter: {{ props.row.chapter }}
                  <q-popup-edit
                    @cancel="resetToEdit()"
                    v-model="toEdit"
                    title="Edit the Chapter"
                  >
                    <q-input
                      v-model="toEdit"
                      dense
                      autofocus
                      @keypress.enter="
                        changeAsignmentData(props.row, props.row.chapter)
                      "
                    /> </q-popup-edit></q-td
              ></q-tr>

              <!-- form for adding asignment scores -->
              <div v-if="props.selected">
                <q-dialog v-model="toggleForm" persistent>
                  <q-card>
                    <q-card-section
                      v-for="student in studentsForGradeing"
                      :key="student.studentId"
                    >
                      <div class="text-h6">
                        {{ student.name }}
                        <q-form @submit.prevent="onSubmit">
                          <q-input
                            :name="student.name"
                            v-model="student.score"
                            dense
                            autofocus
                            @keyup.enter="prompt = false"
                          />
                        </q-form>
                      </div>
                    </q-card-section>
                    <q-card-actions align="right" class="text-primary">
                      <q-btn
                        label="Submit"
                        type="submit"
                        color="primary"
                        @click="
                          onSubmit();
                          props.selected = !props.selected;
                        "
                        v-close-popup
                      />
                      <q-btn
                        flat
                        label="Cancel"
                        v-close-popup
                        @click="
                          cancelScores();
                          props.selected = !props.selected;
                        "
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
            <div @click="props.selected = !props.selected">
              <!-- Open the score dialog -->
              <q-btn
                padding="xs"
                color="positive"
                size="sm"
                icon="eco"
                @click="addScore(props.row.id)"
                label="Add Scores"
                no-caps
              ></q-btn>
              <!-- <q-btn
                  padding="xs"
                  color="positive"
                  size="sm"
                  @click="changeAsignmentData(props.row)"
                  >Edit</q-btn
                > -->
            </div>
          </q-card>
        </transition-group>
      </template>
      <template v-slot:top-left>
        <div class="q-ma-sm flex row justify-between">
          <q-btn
            color="info"
            :label="activeCourse.courseName"
            icon-right="expand_more"
            no-caps
          >
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list
                style="min-width: 100px"
                v-for="course in getCourses"
                :key="course.courseId"
              >
                <q-item clickable>
                  <q-item-section
                    v-close-popup
                    @click="setCourse(course.courseId)"
                    >{{ course.courseName }}</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            no-caps
            color="info"
            :label="activeSubject"
            icon-right="expand_more"
          >
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list
                style="min-width: 100px"
                v-for="sub in getSubjects"
                :key="sub"
              >
                <q-item clickable>
                  <q-item-section v-close-popup @click="setFilter(sub)">{{
                    sub
                  }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
            <p>{{ toEdit }}</p>
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subjects: ["Math", "Reading", "Science", "Geography", "Music", "History"],
      filter: "",
      activeSubject: "All",
      activeCourse: { courseName: "Choose Grade" },
      submitResult: [0],
      selected: [],
      selection: [],
      toggleForm: false,
      students: [],
      studentsForGradeing: [],
      studentGrades: [],
      columns: [
        {
          name: "name",
          required: true,
          label: "Asignment Name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "possibleScore",
          align: "center",
          label: "Possible Score",
          field: "possibleScore",
          sortable: true
        },
        { name: "subject", label: "Subject", field: "subject", sortable: true },
        { name: "chapter", label: "Chapter", field: "chapter", sortable: true },
        { name: "Quarter", label: "Quarter", field: "time" }
      ],
      data: [],
      toEdit: ""
    };
  },
  methods: {
    // submit updated scores for each student

    resetToEdit(value, initialValue) {
      this.toEdit = "";
    },

    cancelScores() {
      this.toggleForm = false;
      this.studentsForGradeing = [];
      console.log(this.studentsForGradeing);
    },

    changeAsignmentData(prop, value) {
      let asignKey = Object.keys(prop).find(key => prop[key] === value);
      this.$store.dispatch("asignments/changeAsignmentData", [
        asignKey,
        this.toEdit,
        prop.id
      ]);
      this.toEdit = "";
    },

    async onSubmit() {
      for (const student of this.studentsForGradeing) {
        console.log("student", student);
        const result = await this.$store.dispatch(
          "students/changeSingleAsignment",
          {
            id: student.id,
            studentId: student.studentId,
            score: student.score.toString()
          }
        );
        console.log("result", result);
        this.submitResult.push(result);
      }
      this.studentsForGradeing = [];
      console.log(this.submitResult);
      this.toggleForm = false;
    },

    setFilter(name) {
      this.activeSubject = name;
    },

    setCourse(id) {
      console.log("idd", id);
      this.activeCourse = this.getCourses.find(
        course => course.courseId === id
      );
    },

    addScore(id) {
      if (this.studentsForGradeing.length >= 1) {
        this.toggleForm = true;
        return;
      }
      console.log(id);
      this.getStudentsForGrading();
      this.studentGrades.forEach(student => {
        console.log("studentt ", student);
        let foundAsignment = student.asignments.find(asign => asign.id === id);
        console.log("ff", foundAsignment);
        let newAsignment = {};
        if (foundAsignment && foundAsignment.score <= 0) {
          //  if (foundAsignment.score <= 0) {
          newAsignment = {
            name: student.name,
            studentId: student.id,
            score: foundAsignment.score,
            id: foundAsignment.id,
            studentId: student.id
          };
          // }

          if (!this.studentsForGradeing.includes(newAsignment)) {
            this.studentsForGradeing.push(newAsignment);
          }
        }
      });
      console.log("the list", this.studentsForGradeing);
      this.toggleForm = true;
    },

    getStudentsForGrading() {
      let students = [];
      students = [
        ...this.$store.getters["students/getStudents"].filter(
          stu => stu.courseId === this.activeCourse.courseId
        )
      ];
      this.studentGrades = students;
    }
  },
  computed: {
    getStudents() {
      let students = [...this.$store.getters["students/getStudents"]];
      console.log("students", students);
      return students;
    },

    getCourses() {
      return this.$store.getters["courses/getCourses"];
    },

    getAllAsignments() {
      console.log(this.activeCourse);
      let asignments = this.$store.getters["asignments/getAsignments"].filter(
        asign => asign.courseId === this.activeCourse.courseId
      );
      console.log(asignments);
      return asignments;
    },

    filteredAsignments() {
      return this.getAllAsignments.filter(asignment => {
        if (asignment.subject.includes(this.activeSubject)) {
          return true;
        }
        if (this.activeSubject === "All") {
          return true;
        }
        return false;
      });
    },

    // { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true }

    getSubjects() {
      const subjects = [];
      this.getAllAsignments.forEach(asignment => {
        if (!subjects.includes(asignment.subject)) {
          subjects.push(asignment.subject);
        }
      });
      console.log(subjects);
      subjects.push("all");
      return subjects;
    }
  }
};
</script>

<style lang="scss">
.customCard {
  background: #26a69a;
  vertical-align: top;
  padding: 12px;
  color: #fff;
  margin-bottom: 0.5em;
}

.fade-enter {
  transition: all 1s;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateX(30px);
  position: absolute;
}
.fade-move {
  transition: transform 1s;
}

tr {
  margin-right: 0.8em;
}
</style>
