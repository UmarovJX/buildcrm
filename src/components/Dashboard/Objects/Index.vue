<template>
  <main>
    <div class="app-content">
      <base-bread-crumb
          :active-content="activeContent"
      >
      </base-bread-crumb>

      <div class="object-cards ">
        <div class="card"
             v-for="(object, index) in getObjects"
             :key="index">
          <div v-if="getPermission.objects.delete || getPermission.objects.update"
               class="object__more-info">
            <div class="my-dropdown dropleft">
              <button
                  type="button"
                  class="dropdown-toggle card-link"
                  data-toggle="dropdown"
                  style="background-color: transparent; box-shadow: none"
              >
                <!--                    <i class="far fa-ellipsis-h"></i>-->
                <base-edit-icon fill="#7C3AED"/>
              </button>
              <div class="dropdown-menu">
                <router-link
                    v-if="getPermission.objects.update"
                    :class="'dropdown-item'"
                    :to="{name: 'objectsEdit', params: {id: object.id}}"
                >
                  <i class="fas fa-pen"></i> {{ $t("edit") }}
                </router-link>

                <!--                <router-link-->
                <!--                    v-if="getPermission.objects.update"-->
                <!--                    :to="{name:'object-deal-template',params:{id:object.id}}"-->
                <!--                    :class="'dropdown-item'"-->
                <!--                >-->
                <!--                  <i class="far fa-file-alt"></i> {{ $t('objects.deal_template.name') }}-->
                <!--                </router-link>-->


                <router-link
                    v-if="getPermission.objects.view"
                    :to="{name:'objects-promo',params:{id:object.id}}"
                    :class="'dropdown-item'"
                >
                  <i class="fas fa-gift"></i>
                  <span>
                    {{ $t('promo.promos') }}
                  </span>
                </router-link>

                <router-link
                    v-if="getPermission.type_plan.view"
                    :to="{name:'type-plan-view',params:{id:object.id}}"
                    :class="'dropdown-item'"
                >
                  <i class="fal fa-credit-card"></i>
                  <span>
                    {{ $t("type_plan.title") }}
                  </span>
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
          <router-link class="card-body"
                       v-if="getPermission.objects.apartments"
                       :to="{name: 'apartments', params: {object: object.id}}"
          >
            <div class="card-top">
              <div class="card-top__content">
                <h5 class="card-title">
                  {{ object.name }}
                </h5>
                <div class="card-subtitle">
                  {{ object.address }}
                </div>
              </div>

            </div>
            <div class="card-content">
              <div class="card-block">
                <p class="card-block__title">{{ object.apartments_count }} квартиры</p>
                <p class="card-block__subtitle price">от 330,000,000 сум</p>
              </div>
              <div class="card-block">
                <p class="card-block__title">16 этажей</p>
                <p class="card-block__subtitle">от 3,500,000 сум/м<sup>2</sup></p>
              </div>
            </div>
          </router-link>

          <router-link class="card-img"
                       v-if="getPermission.objects.apartments"
                       :to="{name: 'apartments', params: {object: object.id}}"
          >
            <img v-if="object.image" v-lazy="object.image" alt="">
            <img v-else v-lazy="require('@/assets/img/not-found.png')" alt="">
          </router-link>
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
          v-if="getPermission.objects.update"
          :object-id="object_id"
          @UploadLogo="uploadLogo"
      />

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
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import api from "@/services/api";
import BaseEditIcon from "@/components/icons/BaseEditIcon";

export default {
  name: 'Objects',
  components: {
    // 'filter-form': Filter,
    "upload-logo": UploadLogo,
    BaseEditIcon,
    BaseBreadCrumb
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
    console.log(this.getPermission);
  },

  computed: {
    ...mapGetters(["getObjects", "getPermission"]),
    activeContent() {
      return this.$t('objects.title')
    },
    // permission(){
    //   const hasObjectPermission = this.getPermission.hasOwnProperty('objects')
    //   if(hasObjectPermission){
    //     return this.getPermission.objects
    //   }
    //
    //   return {
    //     update:false,
    //
    //   }
    // }
  },

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
          api.objects.deleteObject(object)
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

<style lang="scss" scoped>
.object-cards {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  border: none;
  display: flex;

  &-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 1rem 1rem 0 0;
    padding: 28px;
    background-color: var(--gray-100)
  }

  &-content {
    padding-top: 15px;
    border-top: 2px solid var(--gray-200);
  }

  &-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 15px;

    &__content {
      width: 100%;
    }
  }

  &-title {
    color: var(--violet-600);
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 12px;
  }

  &-subtitle {
    margin: 0;
  }

  &-button {
    width: max-content;
    border-radius: 1rem;
    background-color: var(--white);
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-400);
    margin-bottom: 12px;
    padding: 5px 10px;
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;


    p {
      margin-bottom: 0;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: var(--gray-500);
    }

    .price {
      font-size: 18px;
      line-height: 24px;
      color: var(--violet-600);
    }

    &__title {

    }
  }

  &-img {
    height: 206px;

    img {
      border-radius: 0 0 1rem 1rem;
      max-height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
