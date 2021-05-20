<template>
  <div class="row  ">
    <q-btn-dropdown
      class="col"
      :loading="loading"
      fab
      split
      color="primary"
      no-caps
      :icon="courseIcon ? courseIcon : 'home'"
      :label="courseName"
      @click="setCourseId(courseName)"
    >
      <!-- @click="goTo" -->

      <q-list v-for="c in courses" :key="c.id">
        <q-item clickable v-close-popup @click="setCourseId(c.courseName)">
          <q-item-section avatar>
            <q-avatar
              left
              :icon="c.classIcon ? c.classIcon : 'folder'"
              color="primary"
              text-color="white"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ c.courseName }}</q-item-label>
            <q-item-label caption>{{
              c.courseStudents.length
                ? c.courseStudents.length + " Students"
                : "Students Not initialized"
            }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon @mouseover="getAsignments" name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-item clickable v-close-popup @click="setTrue">
        <q-item-section avatar>
          <q-avatar icon="add" color="secondary" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Create A new Class?</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="info" color="amber" />
        </q-item-section>
      </q-item>
    </q-btn-dropdown>

    <q-chip
      class="col square"
      color="warning text-white"
      size="16px"
      @click="setConfirm"
      no
      caps
      clickable
    >
      Remove class
    </q-chip>
    <!-- Popup for deleteing a course -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check" color="primary" text-color="white" />
          <span class="q-ml-sm"
            >Deleting a course will delete all asignments and students
            associated with that course</span
          >
          <span class="q-ml-sm">Are you sure you want to proceed?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Confirm"
            color="primary"
            @click="deleteCourse(c.courseId, c.courseStudents)"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  emits: ["goTo", "setValue"],

  data() {
    return {
      slide: "style",
      lorem: "",
      default: "Default",
      courseName: "",
      confirm: false,
      courseId: "",
      courseIcon: "home",
      loading: false
    };
  },

  mounted() {
    this.courseName = this.courses[0].courseName;
    this.courseIcon = this.courses[0].classIcon;
  },

  watch: {
    courseId: function(newVale, oldVale) {
      console.log(newVale, oldVale);
      if (oldVale === newVale) {
        return;
      } else {
        this.$emit("goTo", this.courseId);
      }
    }
  },

  methods: {
    setConfirm() {
      console.log(this.confirm);
      this.confirm = !this.confirm;
    },

    setCourseId(name) {
      const course = this.courses.find(course => course.courseName === name);
      this.courseId = course.courseId;
      this.courseIcon = course.classIcon;
      this.courseName = course.courseName;
      console.log(this.courseId);
    },

    setTrue() {
      this.$emit("setValue", true);
    },

    deleteCourse(id, courseStudents) {
      this.accept = true;
      this.removeClass(id, courseStudents);
    },

    removeClass() {
      console.log(this.courseName);
      const course = this.courses.find(
        course => course.courseName === this.courseName
      );

      console.log(course);
      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to approve the change first"
        });
      } else {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted"
        });
      }

      console.log(course.courseId);
      this.$store.dispatch("courses/removeCourseById", {
        courseId: course.courseId,
        students: course.courseStudents
      });
      this.$store.dispatch("students/removeStudentByCourseId", {
        courseId: course.courseId
      });
      this.$store.dispatch("asignments/removeAsignmentByCourseId", {
        id: course.courseId
      });
      course = {};
      this.$router.push({ path: `/classes/` });
    }
  },
  computed: {
    courses() {
      return this.$store.getters["courses/getCourses"];
    },

    getAsignments() {
      return "Some Asignments";
    }
  }
};
</script>

<style lang="scss" scoped>
.custBtn {
  font-size: 18px;
  width: 50%;
  height: 100px;
  border-bottom: 3px solid white;
}

.row {
  display: flex;
}

.col {
  flex: 1;
}
</style>
