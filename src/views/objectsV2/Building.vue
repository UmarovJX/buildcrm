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
                <BaseArrowRight :width="18" :height="18" />
                {{ building?.object?.name || "" }}
              </div>
              <span class="head">
                Здание
                <span class="contract__number">
                  {{ building?.name || "" }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>

    <!-- <div class="info row">
      <div class="col-3 px-3">
        <div class="building-card">
          <div class="title">
            <x-icon
              name="grid_view"
              :size="24"
              class="violet-600"
              color="var(--violet-600)"
            />
            Title
          </div>
          <div class="primary">412 квартир</div>
          <div class="secondary">Осталось: 0 квартир</div>
          <div class="building-progress">
            <div class="bar">
              <div class="inner" style="width: 75%"></div>
            </div>
            <div class="value">75%</div>
          </div>
        </div>
      </div>

      <div class="col-3 px-3">
        <div class="building-card">
          <div class="title">
            <x-icon
              name="grid_view"
              :size="24"
              class="violet-600"
              color="var(--violet-600)"
            />
            Title
          </div>
          <div class="primary">412 квартир</div>
          <div class="secondary">Осталось: 0 квартир</div>
          <div class="building-progress">
            <div class="bar">
              <div class="inner" style="width: 75%"></div>
            </div>
            <div class="value">75%</div>
          </div>
        </div>
      </div>

      <div class="col-3 px-3">
        <div class="building-card">
          <div class="title">
            <x-icon
              name="grid_view"
              :size="24"
              class="violet-600"
              color="var(--violet-600)"
            />
            Title
          </div>
          <div class="primary">412 квартир</div>
          <div class="secondary">Осталось: 0 квартир</div>
          <div class="building-progress">
            <div class="bar">
              <div class="inner" style="width: 75%"></div>
            </div>
            <div class="value">75%</div>
          </div>
          <div class="mt-3 justify-content-end row">
            <base-button
              text="Наполнить"
              style="background-color: var(--gray-200)"
            >
            </base-button>
          </div>
        </div>
      </div>
      <div class="col-3 px-3">
        <div class="building-card">
          <div class="title">
            <x-icon
              name="grid_view"
              :size="24"
              class="violet-600"
              color="var(--violet-600)"
            />
            Title
          </div>
          <div class="primary">412 квартир</div>
          <div class="secondary">Осталось: 0 квартир</div>
          <div class="building-progress">
            <div class="bar">
              <div class="inner" style="width: 75%"></div>
            </div>
            <div class="value">75%</div>
          </div>
          <div class="mt-3 justify-content-end row">
            <base-button
              text="Наполнить"
              style="background-color: var(--gray-200)"
            >
            </base-button>
          </div>
        </div>
      </div>
    </div>

    <div class="line-divider"></div> -->

    <div style="position: relative; min-height: 400px">
      <div class="d-flex justify-content-between">
        <div class="list-title">Блоки</div>
        <base-button text="Добавить" @click="openModal">
          <template #left-icon>
            <x-icon
              name="add"
              :size="20"
              class="violet-600"
              color="var(--violet-600)"
            />
          </template>
        </base-button>
      </div>
      <div class="block-list row">
        <div class="col-3 px-3" v-for="b in blocks" :key="b.id">
          <router-link
            :to="{
              name: 'objects2-block',
              params: blockParams(b.id),
            }"
          >
            <info-card
              :title="b.name"
              :entries="[
                `${b.floors.length} этажа(ей)`,
                `${b.apartment_count} помещений`,
              ]"
              icon="meeting_room"
            />
          </router-link>
        </div>
      </div>
      <div class="pagination__vue">
        <!--   Pagination   -->
        <vue-paginate
          v-if="!isLoading && pagination.total"
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

    <base-modal ref="object-modal" design="large-modal">
      <template #header>
        <div class="d-flex align-items-center">
          <div class="modal-title">Добавить блок</div>
          <div style="width: 150px"></div>
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

          <base-checkbox
            class="ml-3 checkbox mt-2"
            v-model="modalData.is_published"
            label="is_published"
          >
          </base-checkbox>
          <div class="d-flex justify-content-between my-2 align-items-center">
            <p class="modal-subtitle">Этажи</p>
          </div>
          <div
            class="row mr-2 mt-2"
            v-for="(f, i) in modalData.floors"
            :key="i"
          >
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100 col-4 pr-0"
            >
              <x-form-select
                v-model="modalData.floors[i].floor_id"
                :class="{ warning__border: errors[0] }"
                value-field="value"
                text-field="name"
                :options="floorOptions(i)"
                :placeholder="'Этаж'"
              />
            </ValidationProvider>
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100 col-7 px-1"
            >
              <x-form-select
                v-model="modalData.floors[i].apartment_type_id"
                :class="{ warning__border: errors[0] }"
                value-field="value"
                text-field="name"
                :options="apartmentOptions"
                :placeholder="'Тип'"
              />
            </ValidationProvider>
            <div class="col-1 d-flex align-items-center pl-0">
              <x-circular-background
                class="bg-red-600 cursor-pointer"
                @click="removeFloor(i)"
              >
                <x-icon name="delete" class="color-white" size="30" />
              </x-circular-background>
            </div>
          </div>
          <div class="d-flex justify-content-center mb-5 mt-3">
            <base-button text="Новый этаж" @click="addFloor">
              <template #left-icon>
                <x-icon
                  name="add"
                  :size="20"
                  class="violet-600"
                  color="var(--violet-600)"
                />
              </template>
            </base-button>
          </div>
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
            @click="saveBlock"
            :loading="isCreating"
          >
          </base-button>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch, onMounted } from "vue";

import AppHeader from "@/components/Header/AppHeader";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";

import InfoCard from "./components/InfoCard.vue";
import { testApi } from "@/services/v3/test";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseModal from "@/components/Reusable/BaseModal2.vue";

import { XFormInput } from "@/components/ui-components/form-input";
import { XFormSelect } from "@/components/ui-components/form-select";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox2";

export default {
  components: {
    AppHeader,
    BaseArrowLeft,
    BaseArrowRight,
    BaseButton,
    XIcon,
    XCircularBackground,
    InfoCard,
    BaseModal,
    BaseCloseIcon,
    XFormInput,
    XFormSelect,
    BaseCheckbox,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
  },
  methods: {
    backNavigation() {
      this.$router.back();
    },
  },

  setup() {
    const vm = getCurrentInstance().proxy;
    const object_id = vm.$route.params.objectid;
    const building_id = vm.$route.params.building;
    const building = ref(null);

    const floors = ref([]);
    const apartment_types = ref([]);
    const apartmentOptions = computed(() =>
      apartment_types.value.map((el) => ({
        value: el.id,
        name: el.name[vm.$i18n.locale],
      }))
    );

    // PAGINATED CHIDLREN
    const blocks = ref(null);
    const isLoading = ref(false);
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
    async function getBlocks() {
      isLoading.value = true;
      const res = await testApi.buildings.getBlocks(
        object_id,
        building_id,
        query.value
      );
      blocks.value = res.data.result;
      pagination.value = res.data.pagination;
      isLoading.value = false;
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
        getBlocks();
      }
    );
    // PAGINATED CHIDLREN END

    const modalData = ref({
      name: "",
      is_published: false,
      floors: [],
    });
    function openModal() {
      vm.$refs["object-modal"].openModal();
    }
    function closeModal() {
      vm.$refs["object-modal"].closeModal();
      modalData.value = {
        name: "",
        is_published: false,
        floors: [],
      };
    }
    const isCreating = ref(false);
    function addFloor() {
      modalData.value.floors.push({
        floor_id: null,
        apartment_type_id: null,
      });
    }
    function removeFloor(i) {
      modalData.value.floors.splice(i, 1);
    }
    function floorOptions(i) {
      const usedFloors = modalData.value.floors.map((e) => e.floor_id);
      return floors.value
        .filter(
          (el) =>
            !usedFloors.includes(el.id) ||
            el.id === modalData.value.floors[i].floor_id
        )
        .map((el) => ({ value: el.id, name: el.name }));
    }

    async function saveBlock() {
      const validation = await vm.$refs["validation-observer"].validate();
      if (!validation || isCreating.value) return;
      try {
        isCreating.value = true;
        await testApi.buildings.createBlock(object_id, building_id, {
          name: modalData.value.name,
          is_published: modalData.value.is_published,
          floors: modalData.value.floors.map((el, i) => ({
            ...el,
            position: i + 1,
          })),
        });
        isCreating.value = false;
        vm.closeModal();
        getBlocks();
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
    }

    onMounted(() => {
      testApi.buildings
        .view(object_id, building_id)
        .then((res) => (building.value = res.data.result));
      getBlocks();
      testApi.floors.getAll().then((res) => (floors.value = res.data.result));
      testApi.apartmentTypes.getAll().then((res) => {
        apartment_types.value = res.data.result;
      });
    });
    function blockParams(id) {
      return {
        objectid: object_id,
        building: building_id,
        block: id,
      };
    }
    return {
      building,
      blocks,
      isLoading,
      changeCurrentPage,
      pagination,

      openModal,
      closeModal,
      modalData,
      isCreating,
      addFloor,
      removeFloor,
      floorOptions,
      apartmentOptions,
      saveBlock,
      blockParams,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

.block-list {
  margin-top: 32px;
}
.list-title {
  font-weight: 900;
  font-family: CraftworkSans, serif;
  font-size: 24px;
  color: var(--gray-600);
}
.line-divider {
  border-bottom: 6px solid var(--gray-100);
  margin-top: 48px;
  margin-bottom: 32px;
}
.info {
  align-items: stretch;
  & .building-card {
    height: 100%;
    font-family: CraftworkSans;
    border-radius: 32px;
    border: 2px solid var(--gray-200);
    padding: 24px;
    background-color: var(--gray-100);
    & .title {
      color: var(--violet-600);
      font-size: 12px;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    & .primary {
      font-size: 24px;
      font-weight: 900;
      color: var(--gray-600);
    }
    & .secondary {
      font-size: 14px;
      font-weight: 600;
      font-family: Inter;
      margin-top: 4px;
      color: var(--gray-400);
    }
    & .building-progress {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      & .bar {
        flex-grow: 1;
        height: 6px;
        border-radius: 16px;
        background-color: var(--gray-200);
        & .inner {
          background: linear-gradient(to right, #7c3aed, #818cf8 100%);
          height: 6px;
          border-radius: 16px;
        }
      }
    }
  }
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

.modal-subtitle {
  font-size: 24px;
  font-weight: 900;
  color: var(--gray-600);
  margin: 0;
}
</style>