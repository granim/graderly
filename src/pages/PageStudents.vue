<template>
  <div class="q-pa-sm" style="max-width: 700px">
    <div class="q-mb-sm">
      <h5 class="text-left">Student Information</h5>
      <p>
        First Choose a class, then choose a student.
      </p>
    </div>
    <div class="q-mb-sm">
      <div>
        <!-- Form will show when editForm is toggled -->
        <div v-if="editForm" overlay>
          <div>
            <div class="q-pa-sm" style="max-width: 700px">
              <!-- Form to edit student assignment -->
              <h6>Edit Or Delete Asignments</h6>
              <q-form class="q-gutter-md">
                <q-input
                  v-for="select in selected"
                  :key="select.idFortable"
                  error-message="Please mark as ok"
                  filled
                  :label="select.name"
                  v-model.number="select.score"
                  :hint="
                    'Possible: ' +
                      select.possibleScore +
                      ' ' +
                      'Subject: ' +
                      select.subject
                  "
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length >= 0) ||
                      'Please add a score of at least 0'
                  ]"
                />

                <div
                  class=" q-pa-sm full-width row no-wrap justify-between items-start "
                >
                  <q-checkbox v-model="accept" label="Accept" />
                  <q-checkbox v-model="option" label="Delete?" />
                  <transition name="slide-fade" mode="out-in">
                    <div :key="this.option">
                      <q-btn
                        :label="
                          this.option ? 'Delete selected Asignments!' : 'Submit'
                        "
                        @click="onSubmit(option)"
                        :color="this.option ? 'negative' : 'positive'"
                      />
                    </div>
                  </transition>
                  <q-btn
                    label="Reset"
                    type="reset"
                    color="info"
                    flat
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </div>
          </div>
        </div>
        <!-- Parent div for choosing options -->
        <div class="space-between flex ">
          <!-- Drop down for chooseing your course -->

          <q-btn
            class="col  q-pa-sm q-ma-sm"
            color="primary"
            :label="activeCouse"
            icon-right="expand_more"
            no-caps
          >
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list
                style="min-width: 100px max-width: 150px"
                v-for="course in getCourses"
                :key="course.courseId"
              >
                <q-item clickable>
                  <q-item-section
                    v-close-popup
                    @click="setActiveCourse(course.courseId)"
                    >{{ course.courseName }}</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Drop down for chooseing your student-->
        </div>
      </div>
    </div>

    <div class="flex colum justify-evenly items-center ">
      <q-btn
        no-caps
        class="col  q-pa-sm q-ma-sm"
        color="primary "
        :label="studentName"
        icon-right="expand_more"
      >
        <q-menu transition-show="flip-right" transition-hide="flip-left">
          <q-list
            style="min-width: 50px max-width: 50px"
            v-for="student in course.courseStudents"
            :key="student.id"
            no-caps
          >
            <q-item clickable>
              <q-item-section
                v-close-popup
                @click="setActiveStudent(student.id)"
                >{{ student.name }}</q-item-section
              >
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <p class="text-center">Or</p>
      <q-chip
        clickable
        color="secondary"
        text-color="white"
        icon="published_with_changes"
        label="Load All Students"
        @click="getEveryAsignment"
      />
    </div>

    <!-- Asignments table -->
    <!-- card-class="bg-amber-5 text-brown"
        table-class="text-grey-8"
        table-header-class="text-brown" -->

    <div>
      <q-card>
        <q-table
          color="primary"
          dense
          title="Asignments"
          :data="filteredAsignments"
          :columns="columns"
          row-key="idFortable"
          :visible-columns="visibleColumns"
          :selected-rows-label="getSelectedString"
          selection="multiple"
          :selected.sync="selected"
          @selection="showSelection(details)"
        >
          <template v-slot:top="props">
            <div class="col-2 q-table__title">Filters</div>
            <q-space />
            <!--Filter Menu for small screens -->
            <div v-if="$q.screen.gt.xs" class="col">
              <q-toggle
                v-model="visibleColumns"
                val="desc"
                label="Asignments"
              />
              <q-toggle
                v-model="visibleColumns"
                val="subject"
                label="Subject"
              />
              <q-toggle
                v-model="visibleColumns"
                val="possibleScore"
                label="Possible Score"
              />
              <q-toggle
                v-model="visibleColumns"
                val="score"
                label="Student Score"
              />
              <q-toggle
                v-model="visibleColumns"
                val="studentName"
                label="Student"
              />
            </div>
            <!-- Filter for table -->
            <q-select
              v-else
              v-model="visibleColumns"
              multiple
              borderless
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="columns"
              option-value="name"
              style="min-width: 150px"
            />
            <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md"
              no-caps
            />
          </template>

          <!-- Template for Subjects Cells -->
          <template v-slot:body-cell-subject="props">
            <q-td :props="props" class="text-left">
              <q-btn
                :class="{ foucusMe: isActive }"
                :key="props.key"
                color="green"
                size="sm"
                @click="sortBySubject(props.row.subject)"
                no-caps
              >
                <transition name="fade">
                  <div :key="isActive">
                    <!-- {{ isActive ? "Filter Me" : props.row.subject }} -->
                    {{ props.row.subject }}
                  </div>
                </transition>
              </q-btn>
            </q-td>
          </template>

          <!-- Template for the Asignment name Cells -->
          <template v-slot:body-cell-desc="props">
            <q-td :props="props">
              <q-btn
                color="secondary"
                size="sm"
                @click="sortByAsignment(props.row.id)"
                no-caps
                :label="props.row.name"
              >
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
      <q-card class="q-mb-sm">
        <div v-if="calculating">
          <q-spinner color="primary" size="3em" :thickness="10" />
        </div>
        <div v-if="!calculating" class="q-pa-md flex colum">
          <div class="q-gutter-xs col">
            <!-- createGradesForAllStudents -->
            <h6>Options</h6>
            <div>
              <q-chip
                square
                :disable="!student"
                clickable
                color="primary"
                text-color="white"
                icon="file_download"
                label="Export Selected Student"
                @click="exportTable"
              />
              <span v-if="student">{{ student.name }}</span>
            </div>
            <div>
              <q-chip
                square
                clickable
                :disable="
                  !allStudentAsignments.length && !pushedAsignments.length
                "
                color="primary"
                text-color="white"
                icon="file_download"
                @click="createGradesForAllStudents"
                no-caps
                >Create Grades</q-chip
              >
              <q-chip
                square
                clickable
                color="primary"
                text-color="white"
                icon="file_download"
                @click="exportGrades"
                :label="gradeLabel"
                no-caps
              ></q-chip>
              <q-checkbox v-model="combineGrades">Add Grades</q-checkbox>
              <q-checkbox v-model="printGrades">Export Grades</q-checkbox>
            </div>
            <div>
              <q-chip
                square
                :disable="
                  !allStudentAsignments.length && !pushedAsignments.length
                "
                clickable
                color="primary"
                text-color="white"
                icon="file_download"
                :label="
                  pushedAsignments.length
                    ? 'Export Selected Students'
                    : 'Export All Students'
                "
                @click="exportTableTest"
              />
              <span v-for="asign in pushedAsignments" :key="asign.id">{{
                asign[0].studentName + " "
              }}</span>
            </div>

            <div>
              <q-chip
                square
                :disable="!selected.length"
                clickable
                color="primary"
                text-color="white"
                icon="file_download"
                @click="exportSelected"
                no-caps
                >Export Selected</q-chip
              >
            </div>

            <div class="row q-pa-xs items-center ">
              <q-chip
                square
                :disable="!student"
                clickable
                color="primary"
                text-color="white"
                icon="published_with_changes"
                @click="pushAsignment"
              />
              <span v-if="activeStudent.name"
                >Add {{ activeStudent.name }}s asignments to CSV file</span
              >
            </div>
            <div class="q-gutter-xs row" style="max-width: 300px">
              <q-chip
                square
                clickable
                color="secondary"
                text-color="white"
                icon="clear"
                label="Clear Data"
                @click="resetWindow"
              />
            </div>
          </div>
        </div>
      </q-card>
      <q-page-sticky
        class="bg-secondary text-white"
        expand
        position="top-right"
        :offset="[25, 0]"
        v-if="selected.length"
      >
        <transition in-out>
          <q-btn @click="editAsignment">Edit Asignment</q-btn>
        </transition>
      </q-page-sticky>
    </div>
    <q-btn @click="clearAsignments">Clear</q-btn>
    <q-btn @click="exportTableTestTwo">Test </q-btn>
  </div>
</template>

<script>
import { exportFile } from "quasar";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}
function initialState() {
  return {
    activeAsignmentId: "",
    activeSubject: "",
    selectedSub: "",
    activeStudent: {},
    pushedAsignments: [],
    allStudentAsignments: [],
    compiledStudentAsignments: [],
    studentName: "Student"
  };
}

export default {
  name: "PageStudents",
  data() {
    return {
      function() {
        return initialState();
      },
      isActive: false,
      calculating: false,
      error: false,
      accept: false,
      details: ["Choose A Student"],
      editForm: false,
      selected: [],
      option: false,
      activeCouse: "Choose ",
      course: {},
      visibleColumns: [
        "subject",
        "studentName",
        "desc",
        "possibleScore",
        "score"
      ],
      columns: [
        {
          name: "desc",
          label: "Asignment",
          align: "left",
          field: row => row.name || row.studentName,
          format: val => `${val}`,
          sortable: true,
          headerStyle: "font-size: .8em"
        },
        {
          name: "studentName",
          label: "Student",
          align: "left",
          field: row => row.studentName || "" || this.studentName,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "subject",
          align: "center",
          label: "Subject: Click A Subject",
          field: "subject",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "possibleScore",
          label: "Possible Score",
          field: "possibleScore",
          sortable: true
        },
        {
          name: "score",
          label: "Student Score",
          field: "score",
          sortable: true
        }
      ],
      studentName: "Student",
      activeFilter: "Students",
      activeSubject: "all",
      activeAsignmentId: "all",
      model: "one",
      current: 3,
      selectedSub: "",
      activeStudent: {},
      pushedAsignments: [],
      allStudentAsignments: [],
      compiledStudentAsignments: [],
      studentGrades: [],
      combineGrades: false,
      printGrades: false
    };
  },

  computed: {
    gradeLabel() {
      console.log(this.combineGrades);
      if (!this.activeStudent.name) {
        return "Choose A student";
      }
      if (this.activeStudent.name && this.combineGrades === false) {
        return `Create and Export Grades for ${this.activeStudent.name}.`;
      }
      if (this.combineGrades && this.printGrades != true) {
        return `Add ${this.activeStudent.name}s Grades for export.`;
      }
      if (this.printGrades === true) {
        return `Export all compiled grades to csv.`;
      }
    },

    showFilterAble() {
      this.isActive = true;
      this.isActive = false;
    },

    getCourses() {
      return this.$store.getters["courses/getCourses"];
    },

    // Filter assignment by subject name
    filteredAsignments() {
      let allAsignment = [];
      let alterAsignments = [];
      alterAsignments = this.allStudentAsignments;
      allAsignment = this.asignments;
      if (allAsignment.length <= 0) {
        alterAsignments.forEach(studentAsignments => {
          let name = studentAsignments.pop();
          for (let asignment of studentAsignments) {
            //create a unique id for the q-table
            asignment.idFortable = Math.random().toString();
            asignment.score = parseInt(asignment.score);
            asignment.possibleScore = parseInt(asignment.possibleScore);
            if (name.studentName) {
              asignment.studentName = name.studentName;
            }
            allAsignment.push(asignment);
          }
        });
      }

      let filters = [this.activeSubject, this.activeAsignmentId];
      if (allAsignment.length >= 1) {
        return allAsignment.filter(asign =>
          filters.every(
            f =>
              asign.subject.includes(f) ||
              f.includes("all") ||
              f.includes(asign.id)
          )
        );
      }
    },

    //Seperate filter for pushing individual student assignment example: Susan and Marks Math assignment
    filterForPushing() {
      return this.asignments.filter(asignment => {
        if (asignment.subject.includes(this.activeSubject)) {
          return true;
        }
        if (this.activeSubject === "all" && this.activeAsignmentId === "all") {
          return true;
        }
        return false;
      });
    },

    // get a single student
    student() {
      let student = this.$store.getters["students/getStudents"].find(
        s => s.id === this.activeStudent.id
      );
      console.log("student ", student);
      return student;
    },

    // Merge all assignment by subject and ouput the result of possibleScore and totalScore
    createGrades() {
      this.calculating = true;

      let singleStudentArray = [];
      let result = [];
      singleStudentArray = this.asignments;

      // Grades for a signle student
      result = this.$_(singleStudentArray)
        .groupBy(x => x.subject)
        .map((value, key) => ({ subject: key, asignment: value }))
        .value();
      console.log("single student result", result);
      let compiledSubject = [];
      let pScore = 0;
      let score = 0;
      const letterGrade = [
        { letter: "A", score: 90 },
        { letter: "B", score: 80 },
        { letter: "C", score: 70 },
        { letter: "D", score: 60 }
      ];

      result.forEach(aa => {
        aa.asignment.forEach(asign => {
          pScore += parseInt(asign.possibleScore);
          score += parseInt(asign.score);
        });
        const subject = {
          subject: aa.subject,
          possibleScore: pScore,
          score: score,
          grade: (score / pScore) * 100
        };
        for (const grade of letterGrade) {
          if (subject.grade >= grade.score) {
            subject.letterGrade = grade.letter;
            break;
          }
          if (subject.grade <= 59) {
            subject.letterGrade = "F";
          }
        }
        pScore = 0;
        score = 0;
        compiledSubject.push(subject);
      });
      this.calculating = false;

      return compiledSubject;
    },

    // Grade filter for single student
    compiledGrades() {
      return this.createGrades.filter(grade => {
        if (grade.subject.includes(this.activeSubject)) {
          return true;
        }
        if (this.activeSubject === "all") {
          return true;
        }
        return false;
      });
    },

    //gets assignment and student assignment ids/scores and merges them
    asignments() {
      let ids = [];
      let studentAsignement = [];

      if (this.student) {
        ids = this.student.asignments.map(e => e.id);
        studentAsignement = this.student.asignments.map(e => e);
      }

      let matchedAsignments = [];
      if (
        this.$store.getters["asignments/getAsignments"].filter(asignment =>
          ids.includes(asignment.id)
        )
      ) {
        matchedAsignments = this.$store.getters[
          "asignments/getAsignments"
        ].filter(asignment => ids.includes(asignment.id));
      }

      let allAsignment = [];
      //Merge the student score with the existing assignment
      matchedAsignments.forEach(asignment => {
        studentAsignement.forEach(asign => {
          if (asignment.id === asign.id) {
            const newasignment = {
              ...asignment,
              ...asign,
              //create a unique id for the q-table
              idFortable: Math.random().toString()
            };
            allAsignment.push(newasignment);
          }
        });
      });

      return allAsignment;
    }
    //_.orderBy(users, ['user', 'age'], ['asc', 'desc']);
  },

  methods: {
    showSelection(details) {
      console.log("d", details);
    },

    testFun() {
      this.isActive = !this.isActive;
    },

    resetWindow: function() {
      Object.assign(this.$data, initialState());
    },

    clearAsignments() {
      console.log(this.$q);
      this.allStudentAsignments = [];
    },

    //Push current student assignment to this.allStudentAsignments array
    pushAsignment() {
      this.allStudentAsignments = [];
      this.filterForPushing[0].studentName = this.studentName;
      this.pushedAsignments.push(this.filterForPushing);
      console.log("push asignment ", this.pushedAsignments);
    },

    sortBySubject(sub) {
      this.isActive = !this.isActive;
      if (this.activeSubject === "all") {
        this.activeSubject = sub;
      } else {
        this.activeSubject = "all";
      }
    },

    sortByAsignment(asign) {
      if (this.activeAsignmentId === "all") {
        this.activeAsignmentId = asign;
      } else {
        this.activeAsignmentId = "all";
      }
      console.log(this.activeAsignmentId);
    },

    //Submission for editing student points or deleteing a asignment
    onSubmit(option) {
      console.log(option);

      if (this.accept === false) {
        this.error = true;
        return;
      }

      this.editForm = false;
      this.error = false;
      this.$store.dispatch("students/changeStudentInfo", {
        id: this.activeStudent.id,
        asignments: this.selected,
        option: option
      });
      this.selected = [];
    },
    // Toggle for editing assignment
    editAsignment() {
      this.editForm = !this.editForm;
    },

    getSelectedString() {
      console.log("this.selected", this.selected);
    },

    //change the active course
    setActiveCourse(id) {
      this.course = this.getCourses.find(course => course.courseId === id);
      this.activeCouse = this.course.courseName;
      console.log("activeCourse ", this.course);
      this.details[0] = this.course.courseName;
    },

    createGradesForAllStudents() {
      this.calculating = true;
      console.log("cal ?", this.calculating);
      let results = [];
      let as2 = this.allStudentAsignments;

      let compiledStudent = [];
      let compiledSubject = [];
      let pScore = 0;
      let score = 0;
      const letterGrade = [
        { letter: "A", score: 90 },
        { letter: "B", score: 80 },
        { letter: "C", score: 70 },
        { letter: "D", score: 60 }
      ];

      if (as2.length) {
        as2.forEach(studentArray => {
          console.log("studentarray ", studentArray);
          let result = this.$_(studentArray)
            .groupBy(x => x.studentName)
            .map((value, key) => ({ studentName: key, asignment: value }))
            .value();
          result[0].asignment = this.$_(result[0].asignment)
            .groupBy(x => x.subject)
            .map((value, key) => ({ subject: key, asignment: value }))
            .value();
          results.push(result);
        });
      }
      console.log("resultssss ", results);
      // Grades for the entire class
      results.forEach(aa => {
        aa.forEach(student => {
          student.asignment.forEach(asignmentArray => {
            asignmentArray.asignment.forEach(asign => {
              pScore += parseInt(asign.possibleScore);
              score += parseInt(asign.score);
            });
            const subject = {
              subject: asignmentArray.subject,
              possibleScore: pScore,
              score: score,
              grade: (score / pScore) * 100
            };
            console.log("subject ", subject);
            for (const grade of letterGrade) {
              if (subject.grade >= grade.score) {
                subject.letterGrade = grade.letter;
                break;
              }
              if (subject.grade <= 59) {
                subject.letterGrade = "F";
              }
            }
            pScore = 0;
            score = 0;
            compiledSubject.push(subject);
            console.log("compiledSubject", compiledSubject);
          });
          compiledStudent.push({
            studentName: student.studentName,
            compiledSubject
          });
          student.compiled = compiledSubject;
          compiledSubject = [];
        });
      });
      console.log("compiledStudent ", compiledStudent);
      console.log("results again", results);

      this.compiledStudentAsignments = results;
      this.calculating = false;
      return compiledStudent;
    },

    //Get every asignment for the entire class to export to csv
    getEveryAsignment() {
      this.resetWindow();
      let studentAsignements = [];
      const allStudents = this.$store.getters["students/getStudents"].filter(
        student => student.courseId === this.course.courseId
      );

      let mergedAsignments = [];
      if (allStudents) {
        //   loop thru array of each student, map ids and map assignment
        allStudents.forEach(student => {
          if (student.asignments.length >= 1) {
            studentAsignements.push({
              studentName: student.name,
              studentId: student.id,
              asignments: student.asignments.map(e => e),
              idsToMap: student.asignments.map(e => e.id)
            });
          }
        });
      }

      studentAsignements.forEach(student => {
        let a1 = this.$store.getters[
          "asignments/getAsignments"
        ].filter(asignment => student.idsToMap.includes(asignment.id));
        let arr3 = a1.map((item, i) =>
          Object.assign({}, item, student.asignments[i])
        );
        arr3.push({ studentName: student.studentName });

        mergedAsignments.push(arr3);
      });
      console.log("merged", mergedAsignments);
      this.allStudentAsignments = mergedAsignments;
    },

    setActiveStudent(id) {
      this.activeSubject = "all";
      this.activeAsignmentId = "all";
      this.activeStudent = this.course.courseStudents.find(
        student => student.id === id
      );
      this.studentName = this.activeStudent.name;
      this.details[1] = this.activeStudent.name;
    },

    filterType(name) {
      if (this.activeFilter != "all") {
        this.activeFilter = "all";
      } else {
        this.activeFilter = name;
      }
    },

    onItemClick(name) {
      this.selectedSub = name;
    },

    onReset() {
      this.selectedSub = null;
    },

    // Method for exporting data to CSV provided by quasar
    exportTable() {
      // naive encoding to csv format

      //Filter out StudnetName from columns
      let colums = this.columns.filter(c => c.label != "Student");

      let content = [colums.map(col => wrapCsvValue(col.label))]
        .concat(
          this.filteredAsignments.map(row =>
            colums
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n")
        .concat("\n");
      content = content.concat(
        '"',
        this.studentName,
        '"',
        ",",
        '"',
        this.activeCouse,
        '"'
      );
      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },

    // Export for
    // Adding individual
    // Selected students
    exportTableTest() {
      console.log("Export Table Test");
      // naive encoding to csv format
      console.log(this.activeCouse, this.studentName);
      let asignments;
      if (this.pushedAsignments.length >= 1) {
        asignments = this.pushedAsignments;
      }
      if (this.allStudentAsignments.length >= 1) {
        asignments = this.allStudentAsignments;
      }

      console.log("asignment aa", asignments);
      let colums = this.columns.filter(c => c.label != "Student");
      console.log("colums", colums);
      const csvString = [colums.map(col => wrapCsvValue(col.label))]
        .join("\r\n")
        .concat("\n")
        .concat(
          asignments
            .map(item =>
              item
                .map(prop => [
                  prop.name,
                  prop.subject,
                  prop.possibleScore,
                  prop.score
                ])
                .join("\r\n")
                .concat("\n", item[0].studentName)
                .concat(",", this.activeCouse)
                .concat("\n", " ", "\n")
            )
            .join("\r\n")
        );

      console.log(csvString);
      // .concat('\n') .replace(/,\s*$/, "")

      const status = exportFile("table-export.csv", csvString, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
    // rows.forEach(function(rowArray) {
    //     let row = rowArray.join(",");
    //     csvContent += row + "\r\n";
    // });
    exportGrades() {
      // [grades.map(col => wrapCsvValue(col))]
      let grades = ["Subject", "Possible", "Actual", "Grade", "Letter Grade"];

      const csvGrades = [grades.map(item => item).join(",")]
        .join("\n")
        .concat("\n")
        .concat(
          this.createGrades
            .map(prop => [
              prop.subject,
              prop.possibleScore,
              prop.score,
              prop.grade,
              prop.letterGrade
            ])
            .concat("\n")
            .join("\r")
        )
        .concat(this.activeStudent.name, "\r");
      console.log("csvGrades", csvGrades);
      if (this.printGrades === true) {
        status = exportFile("table-export.csv", this.studentGrades, "text/csv");
        this.combineGrades = false;
        this.printGrades = false;
        return;
      }

      if (this.combineGrades === true) {
        this.studentGrades.push(csvGrades);
      }
      console.log(this.studentGrades);
      if (this.combineGrades === true || this.printGrades === true) {
        return;
      }
      if (this.combineGrades === false || this.printGrades === false) {
        status = exportFile("table-export.csv", csvGrades, "text/csv");
      }
      console.log("should not work if combineing grades");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },

    //Export for all students
    // based on class and
    // their grades for each subject
    exportTableTestTwo() {
      console.log("Export Table Test TWo");
      // naive encoding to csv format

      console.log(this.allStudentAsignments);
      //Subject headers
      let cococs = ["Asignment", "Subject", "Possible", "Actual"];
      //Grade Headers
      let grades = ["Subject", "Possible", "Actual", "Grade", "Letter Grade"];

      const testString = this.compiledStudentAsignments.map(
        arrayOfStudents =>
          arrayOfStudents.map(student =>
            student.asignment
              .map(item =>
                item.asignment.map(pp => [
                  pp.name,
                  pp.subject,
                  pp.possibleScore,
                  pp.score
                ])
              )
              .map(e => e.join("\n"))
              .join("\n")
          ) + "\n"
      );

      console.log("testString", testString);

      const csvTest =
        [cococs.map(col => wrapCsvValue(col))].join("\r\n").concat("\n") +
        this.compiledStudentAsignments.map(arrayOfStudents =>
          arrayOfStudents.map(
            student =>
              student.asignment
                .map(item =>
                  item.asignment
                    .map(pp => [
                      pp.name,
                      pp.subject,
                      pp.possibleScore,
                      pp.score
                    ])
                    .join("\n")
                )
                .concat("\n")
                .concat([grades.map(col => wrapCsvValue(col))])
                .concat(
                  student.compiled.map(prop => [
                    prop.subject,
                    prop.possibleScore,
                    prop.score,
                    prop.grade,
                    prop.letterGrade
                  ])
                )
                .concat("\n")
                .join("\r")
                .concat(student.studentName)
                .concat("\n", "\n") +
              [cococs.map(col => wrapCsvValue(col))] +
              "\r\n"
          )
        );

      console.log("csvTets ", csvTest);

      // const csvGrade = [grades.map(col => wrapCsvValue(col))]
      //   .join("\r\n")
      //   .concat("\n")
      //   .concat(
      //     this.createGradesForAllStudents
      //       .map(item =>
      //         item.compiledSubject
      //           .map(prop => [
      //             prop.subject,
      //             prop.possibleScore,
      //             prop.score,
      //             prop.grade,
      //             prop.letterGrade
      //           ])
      //           .join("\r\n")
      //           .concat("\n", item.studentName)
      //       )
      //       .join("\r\n")
      //   );
      // console.log(csvGrade);

      // let cols = this.columns.filter(c => c.label != 'studentName')
      //  const csvString = ([ cols.map(col => wrapCsvValue(col.label)).concat('Student') ]).join('\r\n').concat('\n').concat(
      //    this.allStudentAsignments.map(item =>
      //     item.map(prop => [
      //       prop.name,
      //       prop.subject,
      //       prop.possibleScore,
      //       prop.score,
      //       prop.studentName
      //     ]).join('\r\n')
      //    ).join('\r\n')
      //  )

      //   console.log(csvString)
      // .concat('\n') .replace(/,\s*$/, "")

      const status = exportFile("table-export.csv", csvTest, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },

    //Export for indivualy
    //selected table rows
    exportSelected() {
      // naive encoding to csv format

      //Filter out StudnetName from columns
      let colums = this.columns.filter(c => c.label != "studentName");

      let content = [colums.map(col => wrapCsvValue(col.label))]
        .join("\r\n")
        .concat("\n")
        .concat(
          this.selected
            .map(prop => [
              prop.name,
              prop.studentName,
              prop.subject,
              prop.possibleScore,
              prop.score
            ])
            .join("\r\n")
            .concat("\n", " ", "\n")
        );

      const status = exportFile("table-export.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.truncate-chip-labels > .q-chip {
  max-width: 140px;
}

.flexFix {
  flex-grow: 1;
}

.foucusMe {
  font-weight: bold;
  background-color: $blue-11;
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
  // transform: translateX(0);
  position: absolute;
}
.fade-move {
  transition: transform 1s;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
