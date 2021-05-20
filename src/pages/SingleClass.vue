<template>
  <q-page>
    <!-- Change course name -->
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-form
          @submit="submitCourseName()"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            :ref="courseName"
            filled
            v-model="courseName"
            label="Change Course Name *"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
          <q-toggle
            v-model="accept"
            :label="accept ? 'Yes I am sure!' : 'Are you sure?'"
          />
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
        <p v-if="error">{{ error }}</p>
      </q-card>
    </q-dialog>

    <q-card v-if="course.initilizedStudents" class="tran">
      <!-- List of each student per class -->

      <q-table
        bordered
        grid
        :data="course.courseStudents"
        :columns="columns"
        row-key="id"
        :filter="filter"
        hide-header
        dense
        :selected.sync="selection"
        selection="single"
        card-container-class="tableDisplay"
      >
        <template v-slot:item="props">
          <!-- class="fit
              column" -->
          <transition-group name="list-complete" tag="ul" class="content__list">
            <q-card
              square
              :props="props"
              :key="props.row.id"
              class="customCard  list-complete-item"
            >
              <div>
                <q-tr>
                  <q-td>
                    <router-link
                      class="rmvStyle"
                      :to="{
                        name: 'SingleStudent',
                        params: { id: props.row.id }
                      }"
                    >
                      {{ props.row.name }}
                    </router-link>
                  </q-td>
                </q-tr>

                <q-tr @click="props.selected = !props.selected">
                  <!-- Open the score dialog -->
                  <q-chip
                    icon-right
                    clickable
                    square
                    text-color="primary"
                    color="warning"
                    icon="delete_forever"
                    @click="setVerify(props.row.name, props.row.id)"
                  />
                  <q-dialog v-model="verifyRemove">
                    <q-card class="q-pa-md">
                      <h5>Delete {{ studentName }}</h5>
                      <q-toggle
                        v-model="accept"
                        :label="accept ? 'Yes I am sure!' : 'Are you sure?'"
                      />

                      <q-card-actions>
                        <q-btn
                          flat
                          label="OK"
                          color="primary"
                          v-close-popup
                          @click="removeStudent"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </q-tr>
              </div>
            </q-card>
          </transition-group>
        </template>

        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="500"
            v-model="filter"
            placeholder="Search"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <div class="row  q-pa-md">
        <!-- Form for createing a single student -->
        <CreateStudentForm class="col" :id="course.courseId" />
        <!-- Form for creating a single subject -->
        <create-subject class="col" :id="course.courseId" />

        <q-btn
          class="col"
          color="info"
          label-color="info"
          filled
          v-if="course"
          @click="prompt = true"
          :label="course.courseName"
        >
          <q-tooltip content-class="bg-accent">Change Class Name</q-tooltip>
        </q-btn>
      </div>
    </q-card>

    <!-- Create names for each student -->
    <q-btn
      v-if="!course.initilizedStudents"
      @click="createStudents(course.numberOfStudents)"
      >Create Students</q-btn
    >

    <div v-if="create">
      <div>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-pa-sm">
          <q-input
            v-for="num in studentNames"
            :key="num.id"
            filled
            v-model="num.name"
            label="Student Name *"
            hint="Name of Student"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />

          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </q-form>
      </div>
      <div class="q-ma-sm q-pa-sm">
        {{ studentNames }}
      </div>
    </div>
    <div
      v-if="course.initilizedStudents"
      class="q-pa-md"
      style="max-width: 400px"
    >
      <h4>Create an asignment for the Entire Class</h4>
      <q-form
        @submit.prevent="onSubmitAsignment"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-btn-dropdown
          color="secondary"
          :label="subjectName"
          :dropdown-icon="subjectIcon"
        >
          <!-- DropDown for subject -->
          <q-list v-for="subject in subjects" :key="subject.id">
            <q-item clickable v-close-popup @click="filterdSubject(subject)">
              <q-item-section>
                <q-icon
                  :name="subject.icon"
                  color="primary"
                  style="font-size: 42px;"
                />
                <q-item-label>{{ subject.name }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-badge
                  @click="removeSubject(subject)"
                  color="teal"
                  label="Remove"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-dialog v-model="message" persistent>
          <q-card class="q-pa-sm">
            <h6>
              Removeing a subject will also remove all asignments. Do you want
              to do this?
            </h6>
            <q-checkbox
              v-model="accept"
              :label="accept ? 'Yes Remove Subject' : 'No'"
            />
            <q-btn flat label="Cancel" color="primary" v-close-popup />
          </q-card>
        </q-dialog>
        <div>
          <q-btn-dropdown
            color="secondary"
            :label="quaName"
            dropdown-icon="change_history"
          >
            <!-- DropDown for quater -->
            <q-list v-for="qua in quaters" :key="qua.id">
              <q-item clickable v-close-popup @click="filterdQuater(qua)">
                <q-item-section>
                  <q-item-label>{{ qua.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <q-input
          filled
          ref="name"
          v-model="name"
          label="Asignment Name *"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          ref="possibleScore"
          type="number"
          v-model.number="possibleScore"
          label="Add possible score*"
          lazy-rules
          :rules="[val => (val !== null && val !== '') || 'Please add a value']"
        />

        <q-input
          filled
          ref="chapter"
          type="number"
          v-model="chapter"
          label="Add chapter*"
          lazy-rules
          :rules="[val => (val !== null && val > 0) || 'Please add a value']"
        />

        <div class="q-gutter-sm">
          <q-checkbox v-model="accept" label="Accept" />
        </div>
        <div>
          <q-btn label="Submit" type="submit" color="positive" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import CreateStudentForm from "../components/forms/CreateStudentForm.vue";
import CreateSubject from "../components/forms/CreateSubject.vue";
export default {
  components: {
    CreateStudentForm: CreateStudentForm,
    CreateSubject: CreateSubject
  },

  data() {
    return {
      message: false,
      selected: [],
      selection: [],
      filter: "",
      create: false,
      studentNames: [],
      possibleScore: 0,
      quaName: "Quater",
      subjectName: "Subject",
      chapter: "",
      time: 0,
      name: "",
      accept: false,
      subjectIcon: "change_history",
      prompt: false,
      studentName: "",
      stuId: "",
      courseName: "",
      error: "",
      columns: [
        {
          name: "desc",
          required: true,
          label: "Student name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "name",
          align: "center",
          label: "Name",
          field: "name",
          sortable: true
        },
        {
          name: "id",
          align: "center",
          label: "id",
          field: "id",
          sortable: true
        }
      ],
      verifyRemove: false
    };
  },

  computed: {
    course() {
      console.log("course id ", this.$route.params.id);
      if (this.$route.params.id === undefined || null) {
        this.$route.go("/");
      }
      return this.$store.getters["courses/getCourses"].find(
        c => c.courseId === this.$route.params.id
      );
    },
    subjects() {
      return this.$store.getters["asignments/getCourseSubjects"].filter(
        sub => sub.courseId === this.$route.params.id
      );
    },

    quaters() {
      return this.$store.getters["asignments/getTimes"];
    }

    // formSurnameCapital: {
    //   get: function() {
    //     return this.formSurname;
    //   },
    //   // setter
    //   set: function(newSurname) {
    //     if (newSurname.length < 1) {
    //       this.formSurname = "";
    //       return;
    //     }
    //     this.formSurname = newSurname.replace(
    //       /^./,
    //       newSurname[0].toUpperCase()
    //     );
    //   }
    // }
  },

  methods: {
    removeSubject(sub) {
      this.message = true;
      console.log(sub);
    },

    setVerify(name, id) {
      console.log("name and id ", name, id);
      this.verifyRemove = true;
      this.studentName = name;
      this.stuId = id;
      console.log(this.verifyRemove);
    },

    async submitCourseName() {
      this.$refs.courseName.validate();

      if (this.$refs.courseName.hasError) {
        this.formHasError = true;
      } else if (this.accept !== true) {
        this.$q.notify({
          color: "negative",
          message: "Name appears to be empty."
        });
      } else {
        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "Submitted"
        });
      }

      let result = await this.$store.dispatch("courses/changeCourseName", {
        courseId: this.$route.params.id,
        courseName: this.courseName
      });
      console.log("result", result);
      this.error = result;
    },

    onReset() {
      this.name = "";
      this.accept = false;
    },

    goBack() {
      this.$router.go(-1);
    },

    removeStudent() {
      if (this.accept === false) {
        return;
      }
      if (this.accept === true) {
        this.$store.dispatch("students/removeStudentById", { id: this.stuId });
        this.$store.dispatch("courses/removeStudent", {
          id: this.stuId,
          courseId: this.$route.params.id
        });
      }
      this.verifyRemove = false;
      this.accept = false;
    },
    //Show form for creating all students
    createStudents(data) {
      console.log(data);
      for (let i = 1; i <= data; i++) {
        this.studentNames.push({
          id: Math.random(1).toString(),
          name: "",
          courseId: this.$route.params.id,
          asignments: [],
          grades: []
        });
      }
      this.create = !this.create;
      console.log(this.create);
    },
    onSubmit() {
      console.log(this.studentNames);
      this.$store.dispatch("students/initializeStudents", this.studentNames);
      this.$store.dispatch("courses/initializeCourseStudents", {
        id: this.$route.params.id,
        students: this.studentNames
      });
      this.create = false;
    },

    //Create an asignment
    onSubmitAsignment() {
      console.log(this.$refs);
      this.$refs.chapter.validate();
      this.$refs.name.validate();
      this.$refs.possibleScore.validate();
      if (
        this.$refs.chapter.hasError ||
        this.$refs.name.hasError ||
        this.$refs.possibleScore.hasError
      ) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to fill our the form properly"
        });
        return;
      }

      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to approve the change first"
        });
        return;
      } else {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted"
        });
      }

      this.$store.dispatch("asignments/addAsignment", {
        subject: this.subjectName,
        chapter: this.chapter,
        time: this.time,
        name: this.name,
        possibleScore: new Intl.NumberFormat().format(this.possibleScore),
        courseId: this.$route.params.id
      });

      (this.subjectName = "Subject"),
        (this.chapter = ""),
        (this.time = 0),
        (this.name = ""),
        (this.possibleScore = 0),
        (this.accept = false);
      this.$refs.chapter.resetValidation();
      this.$refs.name.resetValidation();
      this.$refs.possibleScore.resetValidation();
    },

    onReset() {
      (this.chapter = ""),
        (this.time = 0),
        (this.name = ""),
        (this.possibleScore = 0),
        (this.accept = false);
    },

    filterdSubject(subject) {
      this.subjectIcon = subject.icon;
      this.subjectName = subject.name;
    },
    filterdChapter(chapter) {
      this.activeChapter = chapter;
      console.log(this.activeChapter);
    },
    filterdQuater(quarter) {
      this.quaName = quarter.name;
      this.time = quarter.quater;
    }
  }
};
</script>

<style lang="scss">
.tableDisplay {
  display: flex;
  flex-direction: row;

  /* margin-right: 1em; */
  margin: 0px;
  padding: 0;

  &-move {
    transition: all 600ms ease-in-out 50ms;
  }
  &-enter-active {
    transition: all 300ms ease-out;
  }

  &-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
    z-index: 0;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
  &-enter {
    transform: scale(0.9);
  }
}

.tran {
  /* margin-right: 1em; */
  margin: 0px;
  padding: 0;

  &-move {
    transition: all 600ms ease-in-out 50ms;
  }
  &-enter-active {
    transition: all 300ms ease-out;
  }

  &-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
    z-index: 0;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
  &-enter {
    transform: scale(0.9);
  }
}

.content_list {
  position: relative;
}

.customCard {
  background: #26a69a;
  vertical-align: top;
  padding: 12px;
  color: #fff;
}

.noMargin {
  margin: 0;
}

.rmvStyle {
  text-decoration: none;
  color: white;
}

.fixedHeight {
  display: block;
  width: 100%;

  overflow: scroll;
}

.list-complete-item {
  transition: all 1s;
  margin-right: 10px;
  width: 10em;
  height: 5em;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

.list-complete-move {
  transition: transform 1s;
}

.content {
  position: relative;
  font-family: "Nunito", sans-serif;
  font-weight: 300;
  color: #3d5358;
  margin: 0 auto;

  &__list {
    padding: 0.1em;
    position: relative;
    margin: 0.2rem;
    margin-block-start: 0em;

    backface-visibility: hidden;
  }
}
</style>
