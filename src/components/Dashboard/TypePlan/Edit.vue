<template>
  <main>
    <div class="app-content">
      <div
          class="
          d-flex
          justify-content-between
          align-items-center
          flex-md-row flex-column
        "
      >
        <div
            class="
            d-flex
            w-100
            align-items-center
            flex-md-row flex-column
            mb-md-0 mb-3
          "
        >
          <h1 class="title__big my-0 order-md-0 order-1">{{ $t("edit") }}</h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0 align-self-start">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <router-link :to="{name: 'type_plan'}">
                {{ $t("type_plan.title") }}
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <router-link
                  :to="{name: 'type-plan-view', params: {id: getPlan.object.id}}"
              >
                {{ getPlan.object.name }}
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <a href="#">
                {{ getPlan.name }}
              </a>
            </li>

            <li class="breadcrumb-item active">
              {{ $t("edit") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="alert alert-danger mt-3" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </div>

      <div class="new-object mt-3">
        <form @submit.prevent="SavePlan">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="title" class="d-block text-uppercase">
                    {{ $t("type_plan.name") }}
                  </label>
                  <input
                      id="title"
                      v-model="getPlan.name"
                      type="text"
                      required
                      :placeholder="$t('type_plan.name')"
                      class="my-form__input"
                  />
                </div>

                <div class="mb-3">
                  <label for="area" class="d-block text-uppercase">
                    {{ $t("objects.create.plan.area") }}
                  </label>
                  <input
                      id="area"
                      v-model="getPlan.area"
                      type="text"
                      required
                      :placeholder="$t('type_plan.area')"
                      class="my-form__input"
                  />
                </div>

                <div class="mb-3">
                  <label for="balcony" class="d-block text-uppercase">
                    {{ $t("objects.create.plan.balcony") }}
                  </label>
                  <input
                      id="balcony"
                      v-model="getPlan.balcony"
                      type="checkbox"
                  />
                </div>

                <div class="mb-3">
                  <label for="balcony_area" class="d-block text-uppercase">
                    {{ $t("objects.create.plan.balcony_area") }}
                  </label>
                  <input
                      id="balcony_area"
                      v-model="getPlan.balcony_area"
                      type="text"
                      required
                      :placeholder="$t('type_plan.balcony_area')"
                      class="my-form__input"
                  />
                </div>

                <div class="mb-3">
                  <label for="plan" class="d-block text-uppercase">
                    {{ $t("type_plan.plan") }}
                    <span
                        :class="getPlan.image ? 'text-success' : 'text-danger'"
                    >{{
                        getPlan.image
                            ? $t("type_plan.yes_img")
                            : $t("type_plan.no_img")
                      }}</span
                    >
                  </label>
                  <input
                      id="plan"
                      type="file"
                      @change="compressImage($event)"
                  />
                  <img
                      class="mt-4 img-fluid"
                      v-if="getPlan.image && !inputURL"
                      :data-fancybox="getPlan.image"
                      v-lazy="getPlan.image"
                      alt="Plan image"
                  />
                </div>
                <img
                    v-if="inputURL"
                    :data-fancybox="inputURL"
                    class="img-fluid"
                    :src="inputURL"
                    alt="image"
                />
              </div>
            </div>
          </div>
          <div class="container-fluid">
            <div
                class="
                mt-4
                d-flex
                justify-content-md-start justify-content-center
              "
            >
              <button type="submit" class="btn btn-primary mr-0">
                <i class="fa fa-save"></i> {{ $t("contracts.view.save_btn") }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <b-overlay :show="loading" no-wrap opacity="0.5" style="z-index: 2222">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import Compressor from "compressorjs";
import api from "@/services/api";

export default {
  data() {
    return {
      plan: {
        image: "",
      },
      error: false,
      errors: [],
      output: null,
      inputURL: null,
      loading: false
    };
  },

  mounted() {
    this.fetchPlan(this);
    Fancybox.bind("[data-fancybox]");
  },
  computed: {
    ...mapGetters(["getPermission", "getPlan"]),
  },
  methods: {
    ...mapActions(["fetchPlan"]),

    compressImage(file) {
      const fileUpl = file.target.files ? file.target.files[0] : null;
      if (!fileUpl) {
        return;
      }

      new Compressor(fileUpl, {
        maxWidth: 1200,
        quality: 0.8,
        convertSize: 5000000,
        success: (result) => {
          this.output = new File([result], result.name, {
            type: result.type,
            lastModified: Date.now(),
          });
          this.inputURL = URL.createObjectURL(this.output);
        },
      });
    },

    SavePlan() {
      let formData = new FormData();
      if (this.output) {
        formData.append("image", this.output);
      }
      formData.append("name", this.getPlan.name);
      formData.append("area", this.getPlan.area);
      formData.append("balcony", this.getPlan.balcony);
      formData.append("balcony_area", this.getPlan.balcony_area);

      let vm = this;

      const {object, id} = this.$route.params
      api.objectsV2.updateObjectPlan(object, id, formData)
          .then((response) => {
            if (response.status === 202) {
              vm.$router.back(-1);
            }
          })
          .catch((error) => {
            if (!error.response) {
              this.toasted("Error: Network Error", "error");
            } else {
              if (error.response.status === 403) {
                this.toasted(error.response.data.message, "error");
              } else if (error.response.status === 401) {
                this.toasted(error.response.data.message, "error");
              } else if (error.response.status === 500) {
                this.toasted(error.response.data.message, "error");
              } else {
                this.error = true;
                this.errors = error.response.data.errors;
              }
            }
          });
    },
  },
};
</script>

<style>
.new-object img {
  cursor: pointer;
}
</style>
