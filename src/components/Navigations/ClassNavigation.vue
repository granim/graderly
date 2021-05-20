<template>
  <div>
    <q-carousel
      v-model="courseName"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      padding
      arrows
      height="300px"
      navigation
      class="bg-info text-white shadow-1 rounded-borders"
      @input="setCourseId(courseName)"
    >
      <template v-slot:navigation-icon="{ active, btnProps, onClick }">
        <q-btn
          v-if="active"
          size="lg"
          :icon="courseIcon"
          color="yellow"
          flat
          round
          dense
          @click="onClick"
        />
        <q-btn
          v-else
          size="sm"
          :icon="btnProps.icon"
          color="white"
          flat
          round
          dense
          @click="onClick"
        />
      </template>

      <q-carousel-slide
        v-for="c in courses"
        :key="c.id"
        :name="c.courseName"
        class="row no-wrap flex-center"
      >
        <div>
          <q-icon :name="c.classIcon ? c.classIcon : 'style'" size="75px" />
        </div>

        <div class="q-pa-md white ">
          {{ c.courseName }}
          <!-- Popup for deleteing a course -->
          <q-dialog v-model="confirm" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="check" color="primary" text-color="white" />
                <span class="q-ml-sm"
                  >Deleting a course will delete all asignmetns and students
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
      </q-carousel-slide>
    </q-carousel>

    <div>
      <q-btn-group spread outline justify-evenly>
        <q-btn
          class="custBtn"
          label="Load Class"
          color="secondary"
          size="18px"
          @click="goTo()"
        >
        </q-btn>

        <q-btn
          class="custBtn"
          label="Remove Class"
          color="warning"
          size="18px"
          @click="confirm = true"
        />
      </q-btn-group>
    </div>
    {{ courseIcon }}
  </div>
</template>

<script>
export default {
  emits: ["goTo"],
  data() {
    return {
      slide: "style",
      lorem: "",
      default: "Default",
      courseName: "",
      confirm: false,
      courseId: "",
      courseIcon: "home"
    };
  },

  mounted() {
    this.courseName = this.courses[0].courseName;
  },

  methods: {
    setCourseId(name) {
      const course = this.courses.find(course => course.courseName === name);
      this.courseId = course.courseId;
      this.courseIcon = course.classIcon;
      console.log(this.courseId);
    },

    goTo() {
      this.$emit("goTo", this.courseId);
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
</style>
