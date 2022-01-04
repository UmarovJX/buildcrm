<template>
  <!-- Error page-->
  <main>
    <div class="app-content">
      <div class="misc-wrapper mt-5">
        <div class="misc-inner p-2 p-sm-3">
          <div class="w-100 text-center">
            <h2 class="mb-1">
              Page Not Found 🕵🏻‍♀️
            </h2>
            <p class="mb-2">
              Oops! 😖 The requested URL was not found on this server.
            </p>

            <b-button
              variant="primary"
              class="mx-auto"
              style="max-width: 200px"
              :to="{path: '/home'}"
            >
              Back to home
            </b-button>

            <!-- image -->
            <b-img fluid class="mt-4" :src="imgUrl" alt="Error page" />
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import {BButton, BImg} from "bootstrap-vue";

export default {
  components: {
    BButton,
    BImg,
  },
  data() {
    return {
      imgUrl: require("@/assets/img/error.svg"),
    };
  },
  computed: {},
};
</script>

<style lang="scss"></style>
