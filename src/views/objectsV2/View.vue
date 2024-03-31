<template>
  <div>
    <AppHeader>
      <template #header-breadcrumb>
        <div class="navigation__content justify-content-between" v-if="object">
          <div class="d-flex align-items-center">
            <div class="go__back" @click="backNavigation">
              <BaseArrowLeft :width="32" :height="32" />
            </div>
            <div class="breadcrumb__content">
              <div>
                {{ $t("Объекты") }}
              </div>
              <span class="head">
                <span class="contract__number">{{ object.name }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>

    <div class="info">
      <div class="image">
        <img v-if="object?.image" v-lazy="object.image" alt="" />
        <img v-else v-lazy="require('@/assets/img/not-found.png')" alt="" />
      </div>
      <div class="main">
        <div class="section">
          <div class="entry" v-for="entry in entries1" :key="entry.key">
            <div class="label">{{ $t(entry.label) }}</div>
            <div class="value">
              {{ getValue(entry.key, entry.multilingual) }}
            </div>
          </div>
        </div>
        <div class="section">
          <div class="entry" v-for="entry in entries2" :key="entry.key">
            <div class="label">{{ $t(entry.label) }}</div>
            <div class="value">
              {{ getValue(entry.key, entry.multilingual) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div style="position: relative; min-height: 400px">
      <div class="buildings">
        <div class="title">Здания</div>
        <div class="controls">
          <base-button text="Добавить здание" @click="openModal">
            <template #left-icon>
              <x-icon
                name="add"
                :size="20"
                class="violet-600"
                color="var(--violet-600)"
              />
            </template>
          </base-button>
          <router-link
            :to="{
              name: 'objects2-tariffs',
              params: { objectid: $route.params.objectid },
            }"
          >
            <base-button text="Тарифы"></base-button>
          </router-link>
          <router-link
            :to="{
              name: 'objects2-plans',
              params: { objectid: $route.params.objectid },
            }"
          >
            <base-button text="Планы"></base-button>
          </router-link>
        </div>
      </div>
      <div class="building-list row" v-if="buildings">
        <div class="col-3 px-3" v-for="b in buildings" :key="b.id">
          <router-link
            :to="{
              name: 'objects2-building',
              params: {
                objectid: $route.params.objectid,
                building: b.id,
              },
            }"
          >
            <info-card
              :title="b.name"
              :entries="buildingInfo(b)"
              icon="apartment"
            />
          </router-link>
        </div>
      </div>
      <div v-else class="no-data">На данный момент нет зданий.</div>

      <div class="pagination__vue">
        <!--   Pagination   -->
        <vue-paginate
          v-if="!isLoadingBuildings && pagination.total"
          :page-count="pagination.total"
          :value="pagination.current"
          :container-class="'container'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :next-class="'page-item'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
          @change-page="changeCurrentPage"
        >
          <template #next-content>
            <span class="d-flex align-items-center justify-content-center">
              <base-arrow-right-icon />
            </span>
          </template>

          <template #prev-content>
            <span class="d-flex align-items-center justify-content-center">
              <base-arrow-left-icon />
            </span>
          </template>
        </vue-paginate>
      </div>
      <b-overlay :show="isLoadingBuildings" no-wrap opacity="0.5">
        <template #overlay>
          <div class="d-flex justify-content-center w-100">
            <div class="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </template>
      </b-overlay>
    </div>

    <base-modal ref="object-modal" design="large-modal">
      <template #header>
        <div class="d-flex align-items-center">
          <div class="modal-title">Добавить здание</div>
          <div style="width: 50px"></div>
          <div @click="closeModal">
            <BaseCloseIcon class="cursor-pointer" />
          </div>
        </div>
      </template>
      <template #main>
        <ValidationObserver ref="validation-observer">
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

          <!-- Начало строительства -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <base-date-picker
              v-model="modalData.completion_date"
              :range="false"
              class="data-picker mt-2"
              :class="{ warning__border: errors[0] }"
              format="DD.MM.YYYY"
              :placeholder="'завершение строительства'"
              icon-fill="var(--violet-600)"
            />
          </ValidationProvider>
          <!-- Дата окончания строительства -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <base-date-picker
              v-model="modalData.installment_month"
              :range="false"
              class="data-picker mt-2"
              :class="{ warning__border: errors[0] }"
              format="DD.MM.YYYY"
              :placeholder="'InstallmentMonth'"
              icon-fill="var(--violet-600)"
            />
          </ValidationProvider>
          <base-checkbox
            class="ml-3 checkbox mt-2"
            v-model="modalData.is_published"
            label="is_published"
          >
          </base-checkbox>
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
            @click="createBuilding"
            :loading="isCreating"
          >
          </base-button>
        </div>
      </template>
    </base-modal>

    <b-overlay :show="isLoading" no-wrap opacity="0.5">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch, onMounted } from "vue";
import AppHeader from "@/components/Header/AppHeader";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import BaseModal from "@/components/Reusable/BaseModal2.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import { XFormInput } from "@/components/ui-components/form-input";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox2";

import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";

import InfoCard from "./components/InfoCard.vue";

import { testApi } from "@/services/v3/test";

export default {
  components: {
    AppHeader,
    BaseArrowLeft,
    BaseButton,
    XIcon,
    InfoCard,
    BaseModal,
    BaseDatePicker,
    XFormInput,
    BaseCloseIcon,
    BaseCheckbox,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
  },
  data() {
    return {
      entries1: [
        {
          label: "object_name",
          key: "name",
        },
        {
          label: "address",
          key: "address",
        },
        {
          label: "builder",
          key: "builder",
        },
        {
          label: "legal_address",
          key: "",
        },
        {
          label: "Валюта",
          key: "currency.name",
          multilingual: true,
        },
      ],
      entries2: [
        {
          label: "Количество зданий",
          key: "buildings_count",
        },
        {
          label: "Количество блоков",
          key: "block_count",
        },
        {
          label: "Количество помещений",
          key: "apartment_count",
        },
        {
          label: "Количество парковок",
          key: "parking_count",
        },
      ],
      modalData: {
        name: "",
        completion_date: null,
        installment_month: null,
        is_published: false,
      },
    };
  },
  methods: {
    openModal() {
      this.$refs["object-modal"].openModal();
    },
    closeModal() {
      this.$refs["object-modal"].closeModal();
    },
    clearModal() {
      this.modalData = {
        name: "",
        completion_date: null,
        installment_month: null,
        is_published: false,
      };
    },
    buildingInfo(b) {
      return [
        `${b.number_of_blocks} блок(ов)`,
        `${b.max_floor} этажа(ей)`,
        `${b.number_of_apartments} помещений`,
      ];
    },
  },
  setup() {
    const vm = getCurrentInstance().proxy;
    const objectId = vm.$route.params.objectid;
    function backNavigation() {
      vm.$router.back();
    }
    const isLoading = ref(true);
    const object = ref(null);

    function getValue(key, multilingual) {
      if (!vm.object) return "";
      const keys = key.split(".");
      let result = object.value;
      for (let value of keys) {
        result = result?.[value];
      }
      if (multilingual) {
        result = result?.[vm.$i18n.locale];
      }
      return result ?? "???";
    }

    const buildings = ref(null);
    const isLoadingBuildings = ref(false);

    const pagination = ref({
      current: vm.$route.query.page || 1,
      previous: null,
      next: null,
      total: 1,
      perPage: vm.$route.query.limit || 12,
      totalItems: 1,
    });
    const query = computed(() => ({
      page: pagination.value.current,
      limit: pagination.value.perPage,
    }));
    async function getBuildings() {
      isLoadingBuildings.value = true;
      const res = await testApi.objects.getObjectBuildings(
        objectId,
        query.value
      );
      buildings.value = res.data.result;
      pagination.value = res.data.pagination;
      isLoadingBuildings.value = false;
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
        getBuildings();
      }
    );
    onMounted(() => {
      testApi.objects.view({ id: objectId }).then((res) => {
        object.value = res.data.result;
        isLoading.value = false;
      });
      getBuildings();
    });
    const isCreating = ref(false);
    async function createBuilding() {
      if (isCreating.value) return;
      try {
        isCreating.value = true;
        const res = await testApi.objects.createBuilding(
          objectId,
          vm.modalData
        );
        vm.closeModal();
        vm.clearModal();
        getBuildings();
      } catch (err) {
        vm.toastedWithErrorCode(err);
      }
      isCreating.value = false;
    }

    return {
      object,
      isLoading,
      backNavigation,
      getValue,

      buildings,
      isLoadingBuildings,
      createBuilding,
      isCreating,
      pagination,
      changeCurrentPage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

.building-list {
  margin-top: 32px;
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
.info {
  display: flex;
  gap: 50px;
  align-items: stretch;
  & .image {
    height: 100%;
    & img {
      height: 100%;
      width: auto;
      min-width: 300px;
      border-radius: 16px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    }
  }

  & .main {
    display: flex;
    gap: 5%;
    flex-grow: 1;
    & .section {
      max-width: 70%;
      flex-grow: 1;
      flex-basis: 0;
      & .entry {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        margin-bottom: 18px;
        & .label {
          min-width: 200px;
          color: var(--gray-400);
        }
        & .value {
          color: var(--gray-600);
        }
      }
    }
  }
}
.line {
  border-bottom: 6px solid var(--gray-100);
  margin-top: 48px;
  margin-bottom: 32px;
}
.buildings {
  display: flex;
  justify-content: space-between;
  & .title {
    font-weight: 900;
    font-family: CraftworkSans, serif;

    font-size: 24px;
    color: var(--gray-600);
  }
  & .controls {
    display: flex;
    gap: 20px;
  }
}

// FORM
.warning__border {
  border: 1px solid var(--red-600) !important;
  border-radius: 32px;
}

.modal-title {
  font-size: 36px;
  font-weight: 900;
  color: var(--gray-600);
}
</style>