<template>
  <div class="q-pa-md">
    <q-btn @click="addSub = true">Add A subject</q-btn>
    <q-dialog v-model="addSub" full-width>
      <q-card>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            :name="sB"
            v-model="sB"
            label="Subject Name *"
            hint="Name of Subject"
          />
          <div>
            <q-input
              name="classIcon"
              v-model.trim="tag"
              placeholder="Search For Icon, Example: Math"
            ></q-input>
          </div>
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

          <q-checkbox
            v-model="accept"
            :label="accept ? 'I accept' : 'accept?'"
          />
          <div class="q-pa-md">
            <p>Subject Name: {{ sB }}</p>
            <p>
              <q-icon
                label="Class Icon"
                :name="classIcon"
                color="primary"
                style="font-size: 42px;"
              ></q-icon>
            </p>
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Cancel"
              @click="onReset"
              color="primary"
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
import states from "../../assets/icons.json";
import BaseSpinner from "../ui/BaseSpinner.vue";
const allIcons = [];
states.icons.map(icon => {
  allIcons.push({ name: icon.name, tags: icon.tags });
});
Object.freeze(allIcons);
export default {
  props: ["id"],
  components: {
    BaseSpinner: BaseSpinner
  },
  data() {
    return {
      sB: "",
      allIcons,
      accept: false,
      classIcon: "",
      tag: "",
      accept: false,
      addSub: false
    };
  },

  methods: {
    onSubmit() {
      console.log("submit");

      if (this.sB === "" || null) {
        console.log("empty string");
        return;
      } else if (this.accept !== true) {
        console.log(this.accept);
        return;
      } else {
        console.log("submit!");
      }
      this.$store.dispatch("asignments/addSubject", {
        courseId: this.id,
        icon: this.classIcon,
        name: this.sB
      });
      this.sB = "Add";
      this.classIcon = "";
      this.accept = false;
      this.addSub = false;
    },

    async onReset() {
      this.classIcon = "";
      this.accept = false;
      this.addSub = false;

      console.log("reset 2");
      this.sB = "";
    },

    pushsubjectIcon(name) {
      this.classIcon = name;
      this.tag = "";
    }
  },

  computed: {
    filterIcons() {
      //    let test = allIcons
      let filteredIcons = [];
      console.log(this.tag);
      filteredIcons = allIcons.filter(icons =>
        icons.tags.includes(this.tag.toLowerCase())
      );
      console.log("iconsToFilter", filteredIcons);
      return filteredIcons;
    }
  }
};
</script>

<style lang="scss" scoped></style>
