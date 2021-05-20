<template>
  <q-page flex flex-center column>
    <div class="q-pa-md">
      <h5 class="text-left">Welcome To Graderly</h5>
      <p class="text-left">
        Below is some information on how this application works.
      </p>
      <div style="max-width: 600px">
        <q-tabs
          v-model="tab"
          align="justify"
          narrow-indicator
          class="q-mb-lg text-left"
        >
          <q-tab class="text-primary" name="students" label="Students" />
          <q-tab class="text-accent" name="asignments" label="Asignments" />
          <q-tab class="text-positive" name="classes" label="Classes" />
        </q-tabs>

        <div class="q-gutter-y-sm">
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            transition-prev="slide-right"
            transition-next="slide-right"
            class="bgColor text-white text-center"
            scrollable
          >
            <q-tab-panel name="students" class="fixed-height">
              <div class="text-h6">On the students page you can.</div>

              <ul class="text-left ">
                <li>
                  Load students asignments based on each Class.
                </li>
                <li>
                  Load a single student or the entire class.
                </li>
                <li>Edit asignment scores or delete asignments</li>
                <li>
                  Filter Asignments by subject and or Asignment.
                </li>
                <li>
                  Export the entire class or individual students Asignment and
                  Grades to a CSV file.
                </li>
                <li>
                  Add selected asignments for each individual student for
                  export.
                </li>
                <span
                  ><q-btn class="bg-secondary q-mt-sm" to="/students"
                    >Go to</q-btn
                  ></span
                >
              </ul>
            </q-tab-panel>

            <q-tab-panel name="asignments" class="fixed-height">
              <div class="text-h6">On the assignments page you can.</div>

              <ul class="text-left ">
                <li>
                  View and search each asignment by class.
                </li>
                <li>Add scores for each student</li>
                <li>Edit a asignment</li>
                <li>Remove an asignment</li>
                <span><q-btn to="/asignments">Go to</q-btn></span>
              </ul>
            </q-tab-panel>

            <q-tab-panel name="classes" class="fixed-height">
              <div class="text-h6">On the classes page you can.</div>

              <ul class="text-left ">
                <li>Create a new class.</li>
                <li>Delete a class</li>
                <li>View Each class students in table format.</li>
                <li>Add or remove a student.</li>
                <li>Create an asignment for the entire class.</li>
                <span><q-btn to="/classes">Go to</q-btn></span>
              </ul>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",

  data() {
    return {
      tab: "students"
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.my-card {
  width: 100%;
  max-width: 250px;

  max-height: 400px;
  min-height: 250px;
}
.fixed-height {
  min-height: 400px;
  max-height: 400px;
  overflow: scroll;
}

ul {
  text-decoration: none;
  list-style: bullet;
}

ul li {
  margin-top: 1em;
  font-weight: bold;
}

.bgColor {
  background-color: #057a75;
}
</style>
