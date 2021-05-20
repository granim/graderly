<template>
  <div>
    <div class="h3" v-if="student">{{ student.name }}</div>
    <div>
      <q-btn @click="goBack">Return</q-btn>
      <q-btn @click="newAsignment">{{
        createAsign ? "Show Details " : "Add an Asignment"
      }}</q-btn>
    </div>

    <div v-if="createAsign" class="q-pa-md">
      <h5>Create an asignment for {{ student.name }}</h5>
      <q-form @submit="onSubmitAsignment" @reset="onReset" class="q-gutter-md">
        <q-btn-dropdown
          color="pink"
          :label="activeSubject"
          :dropdown-icon="subjectIcon"
        >
          <q-list v-for="subject in subjects" :key="subject.id">
            <q-item clickable v-close-popup @click="filterdSubject(subject)">
              <q-item-section>
                <q-icon :name="subject.icon" />
                <q-item-label>{{ subject.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <div>
          <q-btn-dropdown
            color="pink"
            :label="'quater ' + quaName"
            dropdown-icon="change_history"
          >
            <q-list v-for="qua in quaters" :key="qua.id">
              <q-item
                clickable
                v-close-popup
                @click="filterdQuater(qua.quater)"
              >
                <q-item-section>
                  <q-item-label>{{ qua.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-input
          filled
          v-model="name"
          label="Asignment Name *"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="number"
          v-model="possibleScore"
          label="Add possible score*"
          lazy-rules
          :rules="[val => (val !== null && val !== '') || 'Please add a value']"
        />
        <q-input
          filled
          type="number"
          v-model="chapter"
          label="Add chapter*"
          lazy-rules
          :rules="[val => (val !== null && val !== '') || 'Please add a value']"
        />

        <q-toggle v-model="accept" label="This looks good" />

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
    </div>
    <div v-if="!createAsign">
      <div
        class="full-width row no-wrap justify-start items-start content-start"
      >
        <div>
          <!-- Drop down menu for subjects -->
          <q-btn-dropdown
            color="pink"
            :label="activeSubject"
            :dropdown-icon="subjectIcon"
          >
            <q-list v-for="subject in subjects" :key="subject.id">
              <q-item clickable v-close-popup @click="filterdSubject(subject)">
                <q-item-section>
                  <q-item-label>{{ subject.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <div>
          <!-- Drop down menu for quaters -->
          <q-btn-dropdown
            color="pink"
            :label="'quater ' + quaName"
            dropdown-icon="change_history"
          >
            <q-list v-for="qua in simpleQuaters" :key="qua">
              <q-item clickable v-close-popup @click="filterdQuater(qua)">
                <q-item-section>
                  <q-item-label>{{ qua }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div>
          <!-- Drop down menu for chapter -->
          <q-btn-dropdown
            color="pink"
            :label="'Chapter ' + activeChapter"
            dropdown-icon="change_history"
          >
            <q-list v-for="chapter in setChapters" :key="chapter.id">
              <q-item
                clickable
                v-close-popup
                @click="filterdChapter(chapter.chapter)"
              >
                <q-item-section>
                  <q-item-label>{{ chapter.chapter }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>

      <div
        class="full-width column wrap justify-start items-start content-start"
      >
        <q-list
          v-for="asignment in studentByAsignment"
          :key="asignment.id"
          bordered
          class="rounded-borders full-width"
        >
          <q-item-label header>{{ asignment.name }}</q-item-label>
          <q-item>
            <q-item-section avatar top>
              <q-icon :name="asignment.icon" color="primary" size="34px" />
              <q-item-label>{{ asignment.subject }}</q-item-label>

              <!-- <q-btn :icon="$q.platform.is.ios ? 'settings' : 'ion-ios-gear-outline'"/> -->
            </q-item-section>
            <q-item-section top class="col-2 gt-sm">
              <q-item-label class="q-mt-sm">tt</q-item-label>
            </q-item-section>
            <q-item-section top>
              <q-item-label lines="1">
                <span class="text-weight-medium"
                  >Possible: {{ asignment.possibleScore }}</span
                >
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-grey-8">Actual: {{ asignment.score }}</span>
              </q-item-label>
              <q-item-label caption lines="1">
                Quater: {{ asignment.time }}
              </q-item-label>
              <q-item-label
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
              >
                <span class="cursor-pointer"
                  >Chapter: {{ asignment.chapter }}</span
                >
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  class="gt-xs"
                  size="12px"
                  flat
                  dense
                  round
                  icon="delete"
                />
                <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                <q-btn size="12px" flat dense round icon="more_vert" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // In order Math, science, writing, reading, geography, phonics, spelling, social studies
      create: false,
      quaName: "All",
      studentNames: [],
      accept: false,
      possibleScore: 0,
      name: "",
      subjectIcon: "change_history",
      chapter: "",
      time: 0,
      createAsign: false,
      subjectIcon: "change_history",
      activeSubject: "all",
      filterSubject: "all",
      activeChapter: "all",
      activeQuarter: "all",
      chapters: ["all"]
    };
  },
  methods: {
    onSubmitAsignment() {
      const asignment = {
        subject: this.activeSubject,
        chapter: this.chapter,
        time: this.time,
        name: this.name,
        possibleScore: this.possibleScore,
        courseId: this.student.courseId,
        studentId: this.student.id
      };
      console.log(asignment);
      this.$store.dispatch("asignments/addSingleAsignment", asignment);
    },

    onReset() {
      this.name = "";
      this.possibleScore = 0;
      this.chapter = "";
    },

    newAsignment() {
      this.createAsign = !this.createAsign;
    },

    goBack() {
      this.$router.go(-1);
    },

    filterdSubject(subject) {
      this.subjectIcon = subject.icon;
      this.activeSubject = subject.name;
      if (this.activeSubject === "all") {
        this.activeQuarter = "all";
        this.activeChapter = "all";
      }
    },

    filterdChapter(chapter) {
      this.activeChapter = chapter;
    },

    filterdQuater(quarter) {
      console.log(quarter);
      this.quaName = quarter;
      this.activeQuarter = quarter;
    }
  },
  computed: {
    //Get a signle student
    student() {
      console.log(this.$route.params.id);
      return this.$store.getters["students/getStudents"].find(
        s => s.id === this.$route.params.id
      );
    },
    //Gets all avaible chapters
    setChapters() {
      const chapters = [{ id: 12403, chapter: "all" }];
      if (!this.asignments) {
        return;
      }
      //Loop over asignments and set active chapters based on the active subject
      this.asignments.forEach(asignment => {
        if (chapters.some(chapter => chapter.chapter === asignment.chapter)) {
          return;
        }

        if (asignment.subject === this.activeSubject) {
          chapters.push({
            id: asignment.id,
            chapter: asignment.chapter
          });
        }
        console.log("chapters ", chapters);
      });

      return chapters;
    },
    //Create an array of quaters by number
    simpleQuaters() {
      let avaibleQuaters = [];
      this.asignments.forEach(asignment => {
        if (!avaibleQuaters.includes(asignment.time)) {
          avaibleQuaters.push(asignment.time);
        }
      });
      avaibleQuaters.push("all");
      console.log("avaibleQuaters", avaibleQuaters);
      return avaibleQuaters;
    },

    //Compare the array of student asignments to all asignments and merge then return them
    // Student asignments are an array of only the asignment ID and the students score
    asignments() {
      let ids = [];
      let studentAsignement = [];
      if (this.student.asignments) {
        ids = this.student.asignments.map(e => e.id);
        studentAsignement = this.student.asignments.map(e => e);
      } else {
        return;
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
      //Merge the student score with the existing asignments
      matchedAsignments.forEach(asignment => {
        studentAsignement.forEach(asign => {
          if (asignment.id === asign.id) {
            const newasignment = {
              ...asignment,
              ...asign
            };
            allAsignment.push(newasignment);
          }
        });
      });
      // Add icon names to asignments
      for (let asign of allAsignment) {
        const sub = this.subjects.find(
          subject => subject.name === asign.subject
        );
        asign.icon = sub.icon;
      }
      console.log(allAsignment);
      return allAsignment;
    },
    //Get all the subjects for this class
    subjects() {
      let subjects = this.$store.getters["asignments/getCourseSubjects"];
      console.log(subjects);
      return subjects;
    },

    quaters() {
      return this.$store.getters["asignments/getTimes"];
    },

    //  Filter method for students asignments based on user criteria.
    studentByAsignment() {
      if (!this.asignments) {
        return;
      }
      console.log("this.asignments ", this.asignments);
      const returendAsignments = this.asignments.filter(asignment => {
        if (
          this.activeSubject === "all" &&
          this.activeChapter === "all" &&
          this.activeQuarter === "all"
        ) {
          return true;
        }
        //  && asignment.time === this.activeQuarter && asignment.chapter === this.activeChapter
        if (
          asignment.subject.includes(this.activeSubject) &&
          this.activeQuarter === "all" &&
          this.activeChapter === "all"
        ) {
          return true;
        }
        if (
          asignment.subject.includes(this.activeSubject) &&
          asignment.time === this.activeQuarter &&
          this.activeChapter === "all"
        ) {
          return true;
        }
        if (
          asignment.subject.includes(this.activeSubject) &&
          asignment.chapter === this.activeChapter
        ) {
          return true;
        }
        return false;
      });
      return returendAsignments;
    }
  }
};
</script>

<style lang="scss" scoped></style>
