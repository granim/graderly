<template>
  <q-page>
    <div class="q-pa-md">
      <div class="text-h4">My Classes</div>
      <div v-if="toggleForm">
        <q-btn
          color="primary"
          icon="cancel"
          label="Cancel"
          @click="toggleForm = false"
        />
      </div>
    </div>

    <!-- Form for createing a new Class Toggelable -->

    <div v-if="toggleForm">
      <class-form @save-data="saveData" />
    </div>

    <ClassNav v-if="!toggleForm" @goTo="goTo" @setValue="setValue" />

    <!-- List of classes -->
    <div v-if="!toggleForm">
      <q-page-container>
        <div>
          <keep-alive>
            <router-view :key="this.$route.fullPath" />
          </keep-alive>
        </div>
      </q-page-container>
    </div>
  </q-page>
</template>

<script>
import ClassForm from "../components/forms/ClassForm.vue";
import ClassNav from "../components/Navigations/ClassNav.vue";

export default {
  components: {
    ClassForm,
    ClassNav
  },

  data() {
    return {
      filter: "",
      model: "Choose a icon",
      scrollInfo: {},
      classes: [],
      toggleForm: false,
      loading: false,
      accept: false,
      confirm: false,
      loading: false,
      class: null,
      error: null
    };
  },

  methods: {
    goTo(id) {
      console.log(id);
      console.log("router path", this.$router.app._route.params.id);
      if (this.$router.app._route.params.id === id) {
        return;
      }
      this.$router.push({ path: `/classes/${id}` });
      // this.error = this.post = null
      // this.loading = true
      // const fetchedId = this.$route.params.id
      //    getPost(fetchedId, (err, post) => {
      //   // make sure this request is the last one we did, discard otherwise
      //   if (this.$route.params.id !== fetchedId) return
      //   this.loading = false
      //   if (err) {
      //     this.error = err.toString()
      //   } else {
      //     this.post = post
      //   }
      // })
    },

    setValue(val) {
      console.log(val);
      this.toggleForm = val;
    },

    saveData(data) {
      console.log(data);
      if (data === true) {
        this.toggleForm = false;
      }
    },

    selectIcon(iconString) {
      this.subjectIcon = iconString;
    },

    showTitle() {
      if (this.toggleForm) {
        return "Create Your Class";
      } else {
        return "My Classes";
      }
    }
  },

  computed: {
    courses() {
      return this.$store.getters["courses/getCourses"];
    },

    options() {
      return this.$store.getters["asignments/getSubjects"];
    },

    getIconNames() {
      let icons = this.$store.getters["asignments/getIconNames"];
      icons = Object.freeze(icons);
      return icons;
    }
  }
  // mounted: function() {
  //   this.$nextTick(function() {
  //     const course = this.courses.some(course => course.courseId === true);
  //     this.$router.push({ path: `/classes/${course.courseId}` });
  //   });
  // }
};
</script>

<style lang="scss" scoped>
.custBtn {
  font-size: 18px;
  width: 50%;
  height: 100px;
  border-left: 3px solid white;
  border-bottom: 3px solid white;
}
</style>
