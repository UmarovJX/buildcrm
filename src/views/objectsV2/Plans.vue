<template>
  <div>
    <AppHeader>
      <template #header-breadcrumb>
        <div class="navigation__content justify-content-between">
          <div class="d-flex align-items-center">
            <div class="go__back" @click="backNavigation">
              <BaseArrowLeft :width="32" :height="32" />
            </div>
            <div class="breadcrumb__content">
              <div>
                {{ $t("Объекты") }}
              </div>
              <span class="head">
                Планы
                <span class="contract__number"> {{ objectName }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>

    <div>
      <div class="d-flex justify-content-end">
        <base-button text="Добавить" @click="openModal">
          <template #left-icon>
            <x-icon
              name="add"
              :size="24"
              class="violet-600 cursor-pointer"
              color="var(--violet-600)"
            />
          </template>
        </base-button>
      </div>
      <b-table
        sticky-header
        borderless
        responsive
        :items="items"
        :fields="fields"
        class="table__list"
        :empty-text="$t('no_data')"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border cursor-pointer"
        show-empty
        sort-icon-left
        :busy="isLoading"
      >
        <template #cell(area)="{ item }">
          <span>{{ item.area }} m<sup>2</sup></span>
        </template>
        <template #cell(balcony_area)="{ item }">
          <span>{{ item.balcony_area }} m<sup>2</sup></span>
        </template>
        <template #cell(actions)="{ item }">
          <div class="d-flex">
            <x-circular-background
              class="bg-violet-600 ml-2"
              @click="updateItem(item)"
            >
              <x-icon
                name="edit"
                class="color-white user-select-none cursor-pointer"
              />
            </x-circular-background>
            <x-circular-background
              class="bg-red-600 ml-2"
              @click="deleteItem(item)"
            >
              <x-icon
                name="delete"
                class="color-white user-select-none cursor-pointer"
              />
            </x-circular-background>
          </div>
        </template>

        <template #table-busy>
          <base-loading />
        </template>
      </b-table>
      <pagination-block
        :pagination="pagination"
        :is-loading="isLoading"
        @change-page="changeCurrentPage"
      />

      <base-modal ref="object-modal" design="large-modal">
        <template #header>
          <div class="d-flex align-items-center">
            <div class="modal-title">
              {{ currentPlan ? "Редактировать" : "Добавить" }} план
            </div>
            <div style="width: 200px"></div>
            <div @click="closeModal">
              <BaseCloseIcon class="cursor-pointer" />
            </div>
          </div>
        </template>
        <template #main>
          <ValidationObserver ref="validation-observer">
            <div
              class="row align-items-stretch mt-3"
              style="flex-wrap: wrap; width: 450px; row-gap: 5px"
            >
              <div class="col-4" v-for="(img, i) in modalData.images" :key="i">
                <div class="image-container">
                  <img
                    :src="getImageUrl(img)"
                    alt=""
                    style="aspect-ratio: 1/1; width: 100%"
                  />
                  <div class="deleter">
                    <x-circular-background
                      class="bg-red-600"
                      @click="removeImg(i)"
                    >
                      <x-icon name="delete" class="color-white" />
                    </x-circular-background>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <image-uploader
                  multiple
                  @upload-image="addImage"
                ></image-uploader>
              </div>
            </div>
            <!-- NAME -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-input
                :class="{ warning__border: errors[0] }"
                v-model="modalData.name"
                :label="true"
                class="w-100 mt-3"
                type="text"
                placeholder="Название"
              />
            </ValidationProvider>

            <!-- rooms -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-input
                :class="{ warning__border: errors[0] }"
                v-model="modalData.rooms"
                :label="true"
                class="w-100 mt-3"
                type="text"
                placeholder="Комнаты"
              />
            </ValidationProvider>

            <!-- area -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-input
                :class="{ warning__border: errors[0] }"
                v-model="modalData.area"
                :label="true"
                class="w-100 mt-3"
                type="text"
                placeholder="Площадь"
              />
            </ValidationProvider>

            <!-- balcony area -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-input
                :class="{ warning__border: errors[0] }"
                v-model="modalData.balcony_area"
                :label="true"
                class="w-100 mt-3"
                type="text"
                placeholder="Площадь балкона"
              />
            </ValidationProvider>
          </ValidationObserver>
        </template>
        <template #footer>
          <div class="d-flex jusify-content-center w-100 mt-3">
            <base-button text="Отменить" class="mr-3" fixed @click="closeModal">
            </base-button>
            <base-button
              text="Добавить"
              design="violet"
              fixed
              @click="savePlan"
              :loading="isSaving"
            >
            </base-button>
          </div>
        </template>
      </base-modal>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch, onMounted } from "vue";

import AppHeader from "@/components/Header/AppHeader";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseModal from "@/components/Reusable/BaseModal2.vue";
import BaseLoading from "@/components/Reusable/BaseLoading";

import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import { XFormInput } from "@/components/ui-components/form-input";
import { XFormSelect } from "@/components/ui-components/form-select";
import ImageUploader from "@/components/Reusable/ImageUploader";
import PaginationBlock from "@/components/Reusable/PaginationBlock";

import { testApi } from "@/services/v3/test";

export default {
  components: {
    AppHeader,
    BaseArrowLeft,
    BaseArrowRight,
    BaseButton,
    BaseCloseIcon,
    BaseModal,
    BaseLoading,
    XIcon,
    XFormInput,
    XFormSelect,
    XCircularBackground,
    ImageUploader,
    ImageUploader,
    PaginationBlock,
  },
  methods: {
    backNavigation() {
      this.$router.back();
    },
    openModal() {
      this.$refs["object-modal"].openModal();
    },
    closeModal() {
      this.clearModal();
      this.$refs["object-modal"].closeModal();
    },
    getImageUrl(item) {
      if (item instanceof File) {
        return URL.createObjectURL(item) || null;
      }
      return item.path;
    },
  },
  data() {
    return {
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Название" },
        { key: "rooms", label: "rooms" },
        { key: "area", label: "area" },
        { key: "balcony_area", label: "balcony" },

        { key: "actions", label: "" },
      ],

      typeOptions: [
        { value: "apartment", name: "apartment" },
        { value: "parking", name: "parking" },
      ],
    };
  },
  setup() {
    const vm = getCurrentInstance().proxy;
    const object_id = vm.$route.params.objectid;
    // PAGINATED CHIDLREN
    const items = ref(null);
    const isLoading = ref(false);
    const pagination = ref({
      current: vm.$route.query.page || 1,
      previous: null,
      next: null,
      total: 1,
      perPage: vm.$route.query.limit || 5,
      totalItems: 1,
    });
    const query = computed(() => ({
      page: pagination.value.current,
      limit: pagination.value.perPage,
    }));
    async function getItems() {
      isLoading.value = true;
      const res = await testApi.plans.get(object_id, query.value);

      items.value = res.data.result;
      pagination.value = res.data.pagination;
      isLoading.value = false;
      if (pagination.value.current > pagination.value.total) {
        changeCurrentPage(pagination.value.current - 1);
      }
    }
    function changeCurrentPage(p) {
      if (vm.$route.query.page !== p) {
        pagination.value.current = p;
      }
      vm.$router.push({ query: query.value });
    }
    watch(
      () => vm.$route.query,
      () => {
        getItems();
      }
    );
    // PAGINATED CHIDLREN END

    const object = ref(null);
    const objectName = computed(() => {
      if (!object.value) return "";
      return object.value.name;
    });

    // CREATE/UPDATE
    const currentPlan = ref(null);
    const isSaving = ref(false);
    const modalData = ref({
      name: "",
      rooms: "",
      area: "",
      balcony_area: "",
      images: [],
    });
    const deletedImages = ref([]);
    function addImage(data) {
      modalData.value.images.push(...data);
    }
    function removeImg(i) {
      const [deleted] = modalData.value.images.splice(i, 1);
      if (deleted.id) {
        deletedImages.value.push(deleted);
      }
    }
    async function savePlan() {
      const validation = await vm.$refs["validation-observer"].validate();
      if (!validation) return;

      try {
        isSaving.value = true;
        const req = new FormData();
        req.append("name", modalData.value.name);
        req.append("rooms", modalData.value.rooms);
        req.append("area", modalData.value.area);
        req.append("balcony_area", modalData.value.balcony_area);
        modalData.value.images
          .filter((el) => el instanceof File)
          .forEach((el, i) => {
            req.append(`images[${i}]`, el);
          });
        if (currentPlan.value) {
          const promises = deletedImages.value.map((el) =>
            testApi.plans.deleteImage(object_id, currentPlan.value, {
              id: el.id,
            })
          );
          await Promise.all(promises);
        }
        let res;
        if (currentPlan.value)
          res = testApi.plans.update(object_id, currentPlan.value, req);
        else res = testApi.plans.create(object_id, req);
        await res;
        vm.closeModal();
        getItems();
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
      isSaving.value = false;
    }
    function clearModal() {
      currentPlan.value = null;
      modalData.value = {
        name: "",
        rooms: "",
        area: "",
        balcony_area: "",
        images: [],
      };
      deletedImages.value = [];
    }
    function updateItem(item) {
      currentPlan.value = item.id;
      modalData.value = item;
      vm.openModal();
    }

    async function deleteItem(item) {
      const res = await this.$swal({
        text: this.$t("Удалить этот план?"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("Да"),
      });
      if (!res.isConfirmed) return;
      try {
        await testApi.plans.delete(object_id, item.id);
        this.toasted(`План удален!`, "success");
        getItems();
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
    }
    onMounted(() => {
      testApi.objects
        .view({ id: object_id })
        .then((res) => (object.value = res.data.result));
      getItems();
    });
    return {
      modalData,
      addImage,
      removeImg,
      savePlan,
      clearModal,
      isSaving,
      updateItem,
      currentPlan,
      deleteItem,

      objectName,
      isLoading,
      pagination,
      changeCurrentPage,
      items,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination.scss";
.warning__border {
  border: 1px solid var(--red-600) !important;
  border-radius: 32px;
}
.navigation__content {
  display: flex;
  align-items: center;
  //margin-bottom: 52px;

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9ca3af;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4b5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}
.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-200);
  }
}
.image-container {
  position: relative;
  background-color: var(--gray-100);
  width: 100%;
  height: 100%;
  & img {
    border-radius: 12px;
  }
  & .deleter {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
// TABLE
.not__found {
  min-height: 30rem;

  p {
    color: var(--gray-400);
    line-height: 1.75rem;
  }

  p.head {
    font-size: 2rem;
  }
}
::v-deep .table__list {
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 600;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.25rem 1rem;
    }

    td {
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}
::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}
</style>