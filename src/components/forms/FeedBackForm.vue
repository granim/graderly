<template>
  <div class="q-pa-md" style="max-width: 400px">
    <h6>Submit FeedBack and Feature Requests</h6>
    <q-form @submit.prevent="sendEmailt" @reset="onReset" class="q-gutter-md">
      <q-input
        name="name"
        filled
        v-model.trim="name"
        label="Your name *"
        hint="Name and or surname"
        lazy-rules
        :rules="[
          val => (val && val.length > 3) || 'Length Must be greater then 3',
          val => (val && val.length < 30) || 'Name is too Long'
        ]"
      />
      <q-input
        filled
        name="email"
        type="email"
        v-model.trim="email"
        label="Your email *"
        hint="Email Address"
        lazy-rules
        :rules="[
          val => (val && val.length > 0) || 'Please type something',
          val => (val && val.length < 100) || 'Name is too Long'
        ]"
      />
      <q-input
        name="message"
        label="Suggestions"
        v-model.trim="message"
        filled
        type="textarea"
        lazy-rules
        :rules="[
          val => (val && val.length > 0) || 'Please type something',
          val => (val && val.length < 100) || 'Name is too Long'
        ]"
      />

      <q-input
        name="bugs"
        label="Please describe any issues you are having."
        v-model.trim="bugs"
        filled
        type="textarea"
        lazy-rules
        :rules="[
          val => (val && val.length > 0) || 'Please type something',
          val => (val && val.length < 100) || 'Name is too Long'
        ]"
      />

      <!-- <div class="q-pa-md">
        <q-badge color="secondary"
          >How Would You rate this app overall?
        </q-badge>

        <q-slider
          v-model="standard"
          label-always
          :min="0"
          :max="10"
          :color="standard >= 8 ? 'green' : standard >= 4 ? 'blue' : 'red'"
        />
      </div> -->

      <div class="q-pa-md  ">
        <q-date name="date" v-model="date" />
        <q-input name="date">{{ date }}</q-input>
      </div>

      <div class="myFlex">
        <q-checkbox v-model="accept" label="Confirm" />
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
</template>

<script>
import emailjs from "emailjs-com";
export default {
  data() {
    return {
      standard: "1",
      name: "",
      message: "",
      bugs: "",
      email: "",
      accept: false,
      date: ""
    };
  },

  methods: {
    sendEmailt: e => {
      console.log("e", e);
      emailjs
        .sendForm(
          "service_60m00al",
          "template_i8jp1v6",
          e.target,
          "user_pIuqsBgWNBEJoSaWsB1eR"
        )
        .then(
          result => {
            console.log("SUCCESS!", result.status, result.text);
          },
          error => {
            console.log("FAILED...", error);
          }
        );
    },

    sendEmail(e) {
      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first"
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
      try {
        emailjs.sendForm(
          "service_60m00al",
          "template_i8jp1v6",
          e.target,
          "user_pIuqsBgWNBEJoSaWsB1eR",
          {
            name: this.name,
            email: this.email,
            message: this.message,
            bugs: this.bugs,
            standard: this.standard,
            date: this.date
          }
        );
      } catch (error) {
        console.log({ error });
      }
      // Reset form field
      this.name = "";
      this.email = "";
      this.message = "";
      this.bugs = "";
      this.standard = 1;
    },

    onReset() {
      this.name = null;
      this.accept = false;
      (this.message = null), (this.bugs = null), (this.email = null);
    }
  },

  // 2019/02/01'
  mounted() {
    let date = new Date();
    date = date.toJSON().slice(0, 10).split`-`.join`/`;
    console.log(date);
    this.date = date;
  }
};
</script>

<style lang="scss" scoped>
.myFlex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
