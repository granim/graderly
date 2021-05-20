<template>
  <div>
    <div>
      <q-btn color="positive" @click="createAStudent = !createAStudent"
        >Create Student</q-btn
      >
    </div>
    <q-dialog v-model="createAStudent">
      <q-card
        class="bg-secondary q-mt-md q-pa-md"
        v-if="createAStudent"
        style="max-width: 400px"
      >
        <q-form
          @submit="createStudent()"
          @reset="onReset"
          class="q-gutter-md text-white"
        >
          <q-input
            color="secondary"
            label-color="info"
            filled
            v-model.trim="name"
            label="Student Name *"
            hint="First or First and Last Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />

          <q-toggle v-model="accept" :label="accept ? 'accepted' : ''" />
          <q-toggle
            v-model="appendAsignments"
            :label="accept ? 'Yes add them.' : 'Append Course Asignments? '"
          />
          <div>
            <q-btn label="Submit" type="submit" color="positive" />
            <q-btn
              label="Reset"
              type="reset"
              color="warning"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      createAStudent: false,
      accept: false,
      name: "",
      appendAsignments: false
    };
  },

  methods: {
    onReset() {
      !this.name === "" ? (this.name = "") : this.name,
        (this.accept = false),
        (this.createAStudent = false);
    },

    createStudent() {
      if (this.accept === false) {
        return;
      }

      if (this.accept === true) {
        let student = {
          courseId: this.id,
          id: Math.random().toString(),
          name: this.name,
          grades: [],
          asignments: []
        };
        if (this.appendAsignments === true) {
          const existingAsignments = this.$store.getters[
            "asignments/getAsignments"
          ].filter(asign => asign.courseId === this.id);
          for (const asign of existingAsignments) {
            student.asignments.push({ id: asign.id, score: 0 });
          }
        }
        this.$store.dispatch("students/addStudent", student);
        this.$store.dispatch("courses/addSingleStudent", student);
        this.accept = false;
        this.createAStudent = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
