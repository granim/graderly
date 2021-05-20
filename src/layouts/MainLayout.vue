<template>
  <q-layout view="lHr lpR fFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }} </span>

          <q-icon
            name="fas fa-dove"
            size="sm"
            color="primary"
            class="q-pa-md lt-md header-icon"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered :width="283">
      <q-icon name="fas fa-dove" size="lg" color="primary" class="q-pa-md " />
      <q-list>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon
              color="primary"
              style="font-size: 42px;"
              name="home"
              size="md"
            />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/students" exact>
          <q-item-section avatar>
            <q-icon
              color="primary"
              style="font-size: 42px;"
              name="group"
              size="md"
            />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold"
            >Students</q-item-section
          >
        </q-item>
        <q-item clickable v-ripple to="/asignments" exact>
          <q-item-section avatar>
            <q-icon
              color="primary"
              style="font-size: 42px;"
              name="grading"
              size="md"
            />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold"
            >Asignments</q-item-section
          >
        </q-item>
        <q-item clickable v-ripple to="/classes" exact>
          <q-item-section avatar>
            <q-icon
              color="primary"
              style="font-size: 42px;"
              name="school"
              size="md"
            />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold"
            >My Classes</q-item-section
          >
        </q-item>
        <q-item class="marginTop" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon
              color="info"
              style="font-size: 22px;"
              name="delete"
              size="md"
              @click="removeData()"
            />
          </q-item-section>

          <q-item-section class="text-weight-thin"
            >Remove Place Holder Data</q-item-section
          >
        </q-item>
        <q-item class="col self-end" clickable v-ripple to="/feedback" exact>
          <q-item-section avatar>
            <q-icon
              color="info"
              style="font-size: 22px;"
              name="feedback"
              size="md"
            />
          </q-item-section>

          <q-item-section class=" text-weight-thin">FeedBack</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>
          ADD Goes Here

          <br />
          <div></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false,
      right: false,
      note: ""
    };
  },

  mounted() {
    this.$store.dispatch("courses/setLocalCourse");
    this.$store.dispatch("students/setLocalStudents");
    this.$store.dispatch("asignments/setAsignmentData");
  }
};
</script>

<style lang="scss">
.header-icon {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.marginTop {
  margin-top: auto;
}
</style>
