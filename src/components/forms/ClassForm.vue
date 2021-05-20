<template>
  <div>
    <div class="q-ma-sm">
      <h6>First create the subjects for your class.</h6>
      <p>You can choose from definded subjects or create our own.</p>
      <q-toggle
        v-model="showSubs"
        :label="showSubs ? 'Choose Subjects' : 'Create Subjects'"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div class="column " v-if="showSubs" key="subDiv">
        <!-- <q-item-label header></q-item-label> -->

        <!-- Rendering a <label> tag (notice tag="label")
        so QCheckboxes will respond to clicks on QItems to
        change Toggle state. -->

        <q-item
          tag="label"
          v-ripple
          dense
          v-for="subject in options"
          :key="subject.id"
        >
          <q-item-section avatar top>
            <q-checkbox v-model="classes" :val="subject" color="blue" />
          </q-item-section>
          <q-item-section>
            <q-icon
              color="primary"
              style="font-size: 32px;"
              :name="subject.icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ subject.name }}</q-item-label>
            <q-item-label caption>
              {{ subject.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <div v-if="!showSubs" class="column" key="subChoose">
        <div class="col-4 q-pa-sm col-md-6">
          <q-input
            @focus="showSubs = false"
            placeholder="Subject Name"
            v-model.trim="subjectName"
          ></q-input>
        </div>
        <div class="col-4 col-md-6">
          <div class="col-4 q-pa-sm col-md-6">
            <q-input
              v-model.trim="tag"
              placeholder="Search For Icon, Example: Math"
            ></q-input>
          </div>
          <div v-if="!subjectIcon" class="row  justify-between q-gutter-sm">
            <q-scroll-area v-if="tag" style="width: 400px; height: 300px;">
              <div class="row " style=" width: 100%;">
                <BaseSpinner v-if="filterIcons.length < 1" />

                <q-intersection
                  v-for="icon in filterIcons"
                  :key="icon.name"
                  transition="flip-right"
                  class="example-item"
                  swipeable
                >
                  <q-card clickable v-ripple class="q-ma-sm">
                    <q-card-section>
                      <q-icon
                        @click="pushsubjectIcon(icon.name)"
                        :name="icon.name"
                        color="primary"
                        style="font-size: 42px;"
                      />
                    </q-card-section>
                  </q-card>
                </q-intersection>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </transition>
    <div class="q-ma-sm alignItems">
      <q-btn
        :label="error ? error : 'Add Subject'"
        @click="addDisplaySubject"
      ></q-btn>
      <q-icon
        :name="subjectIcon"
        color="primary"
        style="font-size: 42px;"
      ></q-icon>
      <p>{{ subjectName }}</p>
    </div>

    <div class="q-pa-md">
      <q-input
        placeholder="Enter Class Name"
        v-model.trim="className"
      ></q-input>
    </div>
    <div class="col-4 col-md-6 q-pa-md">
      <div>
        <q-input
          v-model.trim="classTag"
          placeholder="Class Icon, Example: Math"
        ></q-input>
      </div>
      <div v-if="!subjectIcon" class="row  justify-between q-gutter-sm">
        <q-scroll-area v-if="classTag" style="width: 400px; height: 300px;">
          <div class="row " style=" width: 100%;">
            <q-intersection
              v-for="icon in filterIcons"
              :key="icon.name"
              transition="flip-right"
              class="example-item"
              swipeable
            >
              <q-card clickable v-ripple class="q-ma-sm">
                <q-card-section>
                  <q-icon
                    @click="pushClassIcon(icon.name)"
                    :name="icon.name"
                    color="primary"
                    style="font-size: 42px;"
                  />
                </q-card-section>
              </q-card>
            </q-intersection>
          </div>
        </q-scroll-area>
      </div>
    </div>
    <div class="q-pa-md">
      <q-badge color="secondary"> Students: {{ numStudents }} of 100 </q-badge>
      <q-slider v-model="numStudents" :min="1" :max="100" color="green" />
      <q-badge>You will create the student names in another step</q-badge>
    </div>
    <div class="q-pa-md">
      <p>Class Name: {{ className }}</p>
      <p>
        <q-icon
          label="Class Icon"
          :name="classIcon"
          color="primary"
          style="font-size: 42px;"
        ></q-icon>
      </p>
      <p>Subjects:</p>
      <div v-for="sub in displaySubject" :key="sub.name">
        <div>
          <q-chip
            @remove="removeSingleSubject(sub.name)"
            clickable
            removable
            color="primary"
            text-color="white"
            :icon="sub.icon"
          >
            {{ sub.name }}
          </q-chip>
          <q-tooltip>{{ removeSub }}</q-tooltip>
        </div>
      </div>
      <p>Number Of Students: {{ numStudents }}</p>
    </div>
    <div class="q-pa-md">
      <q-btn color="secondary" @click="createNewCourse('center')"
        >Create Course</q-btn
      >
    </div>
  </div>
</template>

<script>
import states from "../../assets/icons.json";
import BaseSpinner from "../ui/BaseSpinner.vue";
const allIcons = [];
states.icons.map(icon => {
  allIcons.push({ name: icon.name, tags: icon.tags });
});
Object.freeze(allIcons);

export default {
  emits: ["save-data"],
  components: {
    BaseSpinner: BaseSpinner
  },
  data() {
    return {
      classIcon: "",
      className: "",
      subjectName: "",
      subjectIcon: "",
      showSubs: true,
      tag: "",
      classTag: "",
      allIcons,
      icons: [],
      error: "",
      classes: [],
      numStudents: 1,
      subjectsToCreate: [],
      displaySubject: [],
      completed: false,
      finalSubs: [],
      removeSub: "I want to remove this Subject"
    };
  },
  computed: {
    options() {
      return this.$store.getters["asignments/getSubjects"];
    },

    courses() {
      return this.$store.getters["courses/getCourses"];
    },

    getIcons() {
      console.log(this.icons);
      return states.icons.map(icon => {
        return icon.name;
      });
    },

    filterIcons() {
      //    let test = allIcons
      let filteredIcons = [];
      console.log(this.tag);
      filteredIcons = allIcons.filter(icons =>
        icons.tags.includes(
          this.tag.toLowerCase() || this.classTag.toLowerCase()
        )
      );
      console.log("iconsToFilter", filteredIcons);
      return filteredIcons;
    }
  },

  mounted() {
    console.log("this refs", this.$refs);
  },

  methods: {
    removeSingleSubject(name) {
      this.displaySubject = this.displaySubject.filter(sub => sub.name != name);
    },

    createNewCourse(position) {
      if (this.displaySubject.length < 1 || this.courseName === "") {
        position = "center";
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          position,
          timeout: 2000,
          closeBtn: "Dismiss",
          icon: "warning",
          message: "You are missing a course name or Subjects"
        });
        return;
      } else {
        position = "bottom";
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          position,
          icon: "cloud_done",
          message: "Submitted"
        });
      }
      console.log("subjects to create ", this.subjectsToCreate);
      this.$store.dispatch("courses/addCourse", {
        classIcon: this.classIcon,
        courseName: this.className,
        numberOfStudents: this.numStudents,
        subjects: this.displaySubject
      });
      (this.subjectsToCreate = []),
        (this.displaySubject = []),
        (this.courseName = "");
      this.numStudents = 1;
      this.completed = true;
      this.$emit("save-data", this.completed);
    },

    toogleSubs() {
      this.showSubs = !this.showSubs;
    },

    pushsubjectIcon(name) {
      this.subjectIcon = name;
      console.log(this.subjectIcon);
    },

    pushClassIcon(name) {
      this.classIcon = name;
      this.classTag = "";
    },

    addDisplaySubject() {
      if (this.subjectName && this.subjectIcon) {
        let subject = {
          name: this.subjectName,
          icon: this.subjectIcon
        };

        this.displaySubject.push(subject);
      }

      if (this.classes) {
        this.classes.forEach(course => {
          const newSubject = {
            name: course.name,
            icon: course.icon
          };
          if (!this.displaySubject.includes(newSubject.name)) {
            this.displaySubject.push(newSubject);
          }
        });
        this.classes = [];
      }

      this.subjectName = "";
      this.subjectIcon = "";
      this.tag = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.alignItems {
  display: flex;
  justify-content: right;
  align-items: center;
  text-align: center;
  i {
    margin-right: 1em;
  }

  p {
    margin: 0em;
  }

  & button {
    margin-right: 1em;
  }
}
</style>
