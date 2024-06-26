<script>
import api from "@/services/api";
import { mapGetters, mapActions } from "vuex";
import { formatToPrice } from "@/util/reusable";
import ObjectsPermission from "@/permission/objects";
import ApartmentsPermission from "@/permission/apartments";
import PromosPermission from "@/permission/promos";
import PlansPermission from "@/permission/plans";
import UploadLogo from "./Components/UploadLogo";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";
import AppHeader from "@/components/Header/AppHeader";
import { XButton } from "@/components/ui-components/button";

export default {
  name: "Objects",
  components: {
    XButton,
    AppHeader,
    UploadLogo,
    BaseDotsIcon,
  },

  data: () => ({
    archived: false,
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
    createPermission: ObjectsPermission.getObjectsPermission("create"),
    deletePermission: ObjectsPermission.getObjectsPermission("delete"),
    editPermission: ObjectsPermission.getObjectsPermission("edit"),
    viewPermission: ObjectsPermission.getObjectsPermission("view"),
    logoUploadPermission: ObjectsPermission.getObjectsPermission("upload_logo"),
    apartmentsViewPermission:
      ApartmentsPermission.getApartmentsPermission("view"),
    promosViewPermission: PromosPermission.getPromosViewPermission(),
    plansViewPermission: PlansPermission.getPlansViewPermission(),
  }),

  mounted() {
    this.fetchObjects(this);
  },

  computed: {
    ...mapGetters(["getObjects", "getPermission"]),
    activeContent() {
      return this.$t("objects.title");
    },

    archivedButtonText() {
      return this.archived
        ? this.$t("objects.active")
        : this.$t("objects.archived");
    },
  },

  methods: {
    async setArchive() {
      this.archived = !this.archived;
      this.getLoading = true;
      await this.fetchObjects(this);
      this.getLoading = false;
    },
    archiveObject(item) {
      const d = new FormData();
      d.append("id", item.id);

      this.$swal({
        title: this.$t(item.name),
        text: this.archived
          ? this.$t("sweetAlert.want_unarchive")
          : this.$t("sweetAlert.want_archive"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yesPure"),
      }).then((result) => {
        if (result.value) {
          this.getLoading = true;
          api.objectsV3
            .setArchive(d)
            .then((response) => {
              this.fetchObjects(this).then(() => {
                this.getLoading = false;
              });
              this.$swal(
                response.data.result.is_archive
                  ? this.$t("sweetAlert.archived")
                  : this.$t("sweetAlert.unarchived"),
                "",
                "success"
              );
            })
            .catch((error) => {
              this.getLoading = false;
              this.toastedWithErrorCode(error);
            });
        }
      });
    },
    ...mapActions(["fetchObjects"]),
    createBlock() {
      this.$router.push({ name: "objectsStore" });
    },

    priceFormat(value) {
      return formatToPrice(value);
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
      this.$router.push({ name: "objects-filter" });
    },

    deleteObject(object) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          this.getLoading = true;
          api.objects
            .deleteObject(object)
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

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("objects.title") }}
      </template>
    </app-header>
    <div class="search__content">
      <div></div>
      <div class="d-flex x-gap-1">
        <x-button
          left-icon="search"
          color-icon="primary"
          @click="setArchive"
          :text="archivedButtonText"
          variant="primary"
        />
      </div>
    </div>
    <div class="object-cards">
      <template v-if="viewPermission">
        <div class="card" v-for="(object, index) in getObjects" :key="index">
          <div
            v-if="
              deletePermission ||
              editPermission ||
              logoUploadPermission ||
              promosViewPermission ||
              plansViewPermission
            "
            class="object__more-info"
          >
            <div class="my-dropdown dropleft">
              <button
                type="button"
                class="dropdown-toggle card-link"
                data-toggle="dropdown"
                style="background-color: transparent"
              >
                <!-- <base-edit-icon fill="#7C3AED"/>-->
                <base-dots-icon fill="#7C3AED" />
              </button>
              <div class="dropdown-menu">
                <router-link
                  v-if="editPermission"
                  :class="'dropdown-item'"
                  :to="{ name: 'objectsEdit', params: { id: object.id } }"
                >
                  <i class="fas fa-pen"></i> {{ $t("edit") }}
                </router-link>

                <b-link class="dropdown-item" @click="archiveObject(object)">
                  <i class="fas fa-archive"></i>
                  {{ archived ? $t("unarchiveV") : $t("archiveV") }}
                </b-link>

                <!--                <router-link-->
                <!--                    v-if="getPermission.objects.update"-->
                <!--                    :to="{name:'object-deal-template',params:{id:object.id}}"-->
                <!--                    :class="'dropdown-item'"-->
                <!--                >-->
                <!--                  <i class="far fa-file-alt"></i> {{ $t('objects.deal_template.name') }}-->
                <!--                </router-link>-->

                <router-link
                  v-if="promosViewPermission"
                  :to="{ name: 'objects-promo', params: { id: object.id } }"
                  :class="'dropdown-item'"
                >
                  <i class="fas fa-gift"></i>
                  <span>
                    {{ $t("promo.promos") }}
                  </span>
                </router-link>

                <router-link
                  v-if="plansViewPermission"
                  :to="{ name: 'type-plan-view', params: { id: object.id } }"
                  :class="'dropdown-item'"
                >
                  <i class="fal fa-credit-card"></i>
                  <span>
                    {{ $t("type_plan.title") }}
                  </span>
                </router-link>

                <router-link
                  :to="{ name: 'type-parking-view', params: { id: object.id } }"
                  :class="'dropdown-item'"
                >
                  <i class="fal fa-parking"></i>
                  <span>
                    {{ $t("parkings") }}
                  </span>
                </router-link>

                <b-link
                  class="dropdown-item"
                  v-if="logoUploadPermission"
                  @click="object_id = object.id"
                  v-b-modal.modal-upload-logo
                >
                  <i class="fas fa-image"></i> {{ $t("upload_logo") }}
                </b-link>

                <a
                  class="dropdown-item"
                  v-if="deletePermission"
                  @click="deleteObject(object.id)"
                  href="#"
                >
                  <i class="fas fa-trash"></i> {{ $t("delete") }}
                </a>
              </div>
            </div>
          </div>
          <router-link
            class="card-body"
            :event="apartmentsViewPermission ? 'click' : ''"
            :to="{ name: 'apartments', params: { object: object.id } }"
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
                <p class="card-block__title">
                  {{ object.apartments_count }}
                  {{ $t("objects.view_apartments") }}
                </p>
                <p class="card-block__subtitle price">
                  {{
                    $t("price_from", {
                      msg: priceFormat(object.apartment_price),
                    })
                  }}
                </p>
              </div>
              <div class="card-block">
                <p class="card-block__title">
                  {{ object.floors_count }} {{ $t("objects.view_level") }}
                </p>
                <p
                  v-if="!object.is_hide_m2_price"
                  class="card-block__subtitle"
                  v-html="
                    $t('price_from_m2', {
                      msg: `${priceFormat(object.apartment_price_m2)}`,
                    })
                  "
                />
              </div>
              <div class="card-block">
                <p class="card-block__title">
                  {{ object.parking_count }} {{ $t("objects.view_parkings") }}
                </p>
                <p
                  v-if="!object.is_hide_m2_price"
                  class="card-block__subtitle"
                  v-html="
                    $t('price_from_m2', {
                      msg: `${priceFormat(object.parking_initial_price)}`,
                    })
                  "
                />
              </div>
            </div>
          </router-link>

          <router-link
            class="card-img"
            :event="apartmentsViewPermission ? 'click' : ''"
            :to="{ name: 'apartments', params: { object: object.id } }"
          >
            <img v-if="object.image" v-lazy="object.image" alt="" />
            <img v-else v-lazy="require('@/assets/img/not-found.png')" alt="" />
          </router-link>
        </div>
      </template>
      <div class="card" v-if="createPermission">
        <div class="card-body card-empty" @click="createBlock">
          <img :src="require('@/assets/icons/icon-plus.svg')" alt="" />
          <p>{{ $t("object_create") }}</p>
        </div>
      </div>
    </div>
    <upload-logo
      v-if="logoUploadPermission"
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
</template>

<style lang="scss" scoped>
.object-cards {
  margin-top: 3rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  //row-gap: 24px;
  margin-right: -24px;

  .card {
    //border-radius: 1rem;
    width: 100%;
    height: 30rem;
    //max-width: 400px;
    border: none;
    display: flex;
    border-radius: 2rem;
    flex: 0 0 calc(25% - 24px);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);

    &-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 2rem 2rem 0 0;
      padding: 28px;
      background-color: var(--gray-100);
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

    &-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 2rem;
      min-height: 450px;
      height: 100%;

      p {
        font-weight: 600;
        font-size: 24px;
        line-height: 30px;
        margin-bottom: 0;
        margin-top: 23px;
        color: var(--violet-600);
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
      min-height: 72px;
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
        border-radius: 0 0 2rem 2rem;
        //max-height: 100%;
        width: 100%;
        //max-width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

@media screen and (max-width: 1720px) {
  .object-cards {
    .card {
      flex: 0 0 calc(33.333333% - 24px);

      &-img {
        img {
          width: 100%;
        }
      }
    }
  }
}

@media screen and (max-width: 1360px) {
  .object-cards {
    .card {
      flex: 0 0 calc(50% - 24px);

      &-img {
        img {
          width: 100%;
        }
      }
    }
  }
}

.search__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}
</style>
