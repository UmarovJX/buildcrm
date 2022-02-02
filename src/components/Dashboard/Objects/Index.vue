<template>
  <main>
    <div class="app-content">
      <div class="object">
        <div
            class="object__item object__item--manager"
            v-for="(object, index) in getObjects"
            :key="index"
        >
          <div
              class="object__more-info"
              v-if="getPermission.objects.delete || getPermission.objects.update"
          >
            <div class="dropdown my-dropdown dropleft">
              <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
              >
                <i class="far fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu">
                <router-link
                    v-if="getPermission.objects.update"
                    :class="'dropdown-item'"
                    :to="{name: 'objectsEdit', params: {id: object.id}}"
                >
                  <i class="fas fa-pen"></i> {{ $t("edit") }}
                </router-link>

                <router-link
                    v-if="getPermission.objects.update"
                    :to="{name:'object-deal-template',params:{id:object.id}}"
                    :class="'dropdown-item'"
                >
                  <i class="far fa-file-alt"></i> {{ $t('objects.deal_template.name') }}
                </router-link>

                <b-link
                    class="dropdown-item"
                    v-if="getPermission.objects.update"
                    @click="object_id = object.id"
                    v-b-modal.modal-upload-logo
                >
                  <i class="fas fa-image"></i> {{ $t("upload_logo") }}
                </b-link>

                <a
                    class="dropdown-item"
                    v-if="getPermission.objects.delete"
                    @click="DeleteObject(object.id)"
                    href="#"
                >
                  <i class="fas fa-trash"></i> {{ $t("delete") }}
                </a>
              </div>
            </div>
          </div>

          <router-link
              v-if="getPermission.objects.apartments"
              :class="'object__link'"
              :to="{name: 'apartments', params: {object: object.id}}"
          >
            <!-- <div class="object__img" v-if="object.image" :style="'background-image: url(' + object.image +');'"></div> -->
            <div
                class="object__img"
                v-if="object.image"
                v-lazy:background-image="object.image"
            ></div>
            <div
                class="object__img"
                v-else
                :style="
                'background-image: url(' +
                  require('@/assets/img/not-found.png') +
                  ');'
              "
            ></div>
            <div class="object__name">{{ object.name }}</div>
            <div class="object__info">
              {{ $t("objects.apartments") }}: {{ object.apartments_count }}
            </div>
            <div class="object__address my-2">{{ object.address }}</div>
          </router-link>

          <a href="#" :class="'object__link'" v-else>
            <div
                class="object__img"
                :style="
                'background-image: url(' +
                  require('@/assets/img/object__img1.png') +
                  ');'
              "
            ></div>
            <div class="object__name">{{ object.name }}</div>
            <div class="object__info">
              {{ $t("objects.apartments") }}: {{ object.apartment_count }}
            </div>
            <div class="object__address my-2">{{ object.address }}</div>
          </a>
        </div>

        <div
            v-if="getPermission.objects.create"
            class="object__item object__item-last object__item--manager"
            @click="createBlock"
        >
          <a href="#" class="object__link">
            <div class="object__add"><i class="fal fa-plus"></i></div>
            <div class="object__name">
              {{ $t("add") }}
            </div>
          </a>
        </div>
      </div>

      <!--        <div class="app-content px-0 mx-0 my-4" v-if="getPermission.apartments.filter">-->
      <!--            <div class="d-flex justify-content-md-end justify-content-center">-->

      <!--                <router-link :to="{'name': 'objects-filter'}" class="btn btn-primary" >-->
      <!--                    <i class="far fa-sliders-h mr-2"></i> {{ $t('apartments.list.filter') }}-->
      <!--                </router-link>-->
      <!--            </div>-->
      <!--        </div>-->

      <!-- <filter-form v-if="getPermission.apartments.filter"></filter-form> -->
      <upload-logo
          :object-id="object_id"
          @UploadLogo="uploadLogo"
          v-if="getPermission.objects.update"
      ></upload-logo>

      <b-overlay :show="getLoading" no-wrap opacity="0.5">
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
    </div>
  </main>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
// import Filter from './Components/Filter/Index';
import UploadLogo from "./Components/UploadLogo";

export default {
  components: {
    // 'filter-form': Filter,
    "upload-logo": UploadLogo,
  },

  data: () => ({
    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },

    object_id: 0,
    filter: {
      rooms: [],
      floors: [],
      price_from: null,
      price_to: null,
      status: 0,
      objects: [],

      area_from: null,
      area_to: null,
    },

    getLoading: false,
  }),

  mounted() {
    this.fetchObjects(this);
    //this.fetchApartmentsRooms(this);
  },

  computed: mapGetters(["getObjects", "getPermission"]),

  methods: {
    ...mapActions(["fetchObjects"]),

    createBlock() {
      this.$router.push({name: "objectsStore"});
    },

    uploadLogo() {
      this.getLoading = true;
      this.fetchObjects(this).then(() => {
        this.getLoading = false;
      });
    },

    filterSend() {
      this.getLoading = true;
      this.fetchFilterApartments(this).then(() => {
        this.getLoading = false;
      });
      this.$router.push({name: "objects-filter"});
    },

    DeleteObject(object) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          this.getLoading = true;
          this.axios
              .delete(process.env.VUE_APP_URL + "/objects/" + object, this.header)
              .then((response) => {
                this.toasted(response.data.message, "success");
                this.fetchObjects(this).then(() => {
                  this.getLoading = false;
                });

                this.$swal(this.$t("sweetAlert.deleted"), "", "success");
              })
              .catch((error) => {
                this.getLoading = false;
                this.toastedWithErrorCode(error);
              });
        }
      });
    },
  },
};
</script>

<style scoped></style>
