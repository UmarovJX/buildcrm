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
                {{ block?.object?.name || "" }}
                <BaseArrowRight :width="18" :height="18" />
                {{ block?.building?.name || "" }}
              </div>
              <span class="head">
                Block
                <span class="contract__number"> {{ block?.name }} </span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>
    <div
      class="d-flex justify-content-between align-items-center"
      style="margin-top: 32px"
    >
      <div class="list-title">Помещения</div>
      <div class="d-flex">
        <base-button text="Импортировать помещения" class="mr-3">
          <template #left-icon>
            <x-icon
              name="south"
              :size="20"
              class="violet-600"
              color="var(--violet-600)"
            />
          </template>
        </base-button>
        <base-button text="Добавить" class="mr-3" @click="openModal">
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
    </div>
    <base-filter-tabs-content
      style="margin-top: 32px"
      :current="currentTab"
      :filter-tab-list="floors"
      @get-new-content="changeFloor"
    />
    <div
      class="d-flex justify-content-between align items-center w-100"
      style="margin-top: 32px; margin-bottom: 32px"
    >
      <base-search-input
        class="base-search-input w-50"
        placeholder="Номер помещения"
      />
      <base-button text="Дублировать этаж"> </base-button>
    </div>

    <b-table
      sticky-header
      borderless
      responsive
      :items="items"
      :fields="apartmentFields"
      class="table__list"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border cursor-pointer"
      show-empty
      sort-icon-left
      :busy="isLoading"
    >
      <!--!   STATUS   -->
      <template #cell(status)="{ item }">
        <span
          class="current__status"
          :style="`background-color: ${item.status.color}`"
        >
          {{ $t(item.status.name) }}
        </span>
      </template>

      <template #cell(area)="{ item }">
        <span>{{ item.plan.area }} m<sup>2</sup></span>
      </template>
      <!--!  ACTIONS    -->
      <template #cell(actions)>
        <div>
          <x-circular-background class="bg-violet-600 ml-2">
            <x-icon
              name="edit"
              class="color-white user-select-none cursor-pointer"
            />
          </x-circular-background>
        </div>
      </template>

      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading />
      </template>

      <template #empty>
        <div
          class="d-flex justify-content-center align-items-center flex-column not__found"
        >
          <p class="head">
            {{ $t("no_data") }}
          </p>
        </div>
      </template>
    </b-table>
    <pagination-block :pagination="pagination" :is-loading="isLoading" />

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
          <!-- number -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.number"
              :label="true"
              class="w-100 mt-3"
              type="text"
              placeholder="Номер квартиры"
            />
          </ValidationProvider>

          <!-- BLOCK_FLOOR_ID -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-select
              v-model="modalData.block_floor_id"
              :class="{ warning__border: errors[0] }"
              class="mt-2"
              value-field="value"
              text-field="name"
              :options="blockOptions"
              :placeholder="'Этаж'"
            />
          </ValidationProvider>

          <!-- entrance -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.entrance"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Подъезд"
            />
          </ValidationProvider>

          <!-- plan_id -->
          <x-form-select
            v-model="modalData.plan_id"
            class="mt-2"
            value-field="value"
            text-field="name"
            :options="planOptions"
            :placeholder="'План'"
          />

          <!--  -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
            v-if="!modalData.plan_id"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.rooms"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Комнаты"
            />
          </ValidationProvider>
          <x-form-input
            v-else
            v-model="modalData.rooms"
            :label="true"
            class="w-100 mt-2"
            type="text"
            placeholder="Комнаты"
          />

          <!-- area -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
            v-if="!modalData.plan_id"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.area"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Площадь"
            />
          </ValidationProvider>
          <x-form-input
            v-else
            v-model="modalData.area"
            :label="true"
            class="w-100 mt-2"
            type="text"
            placeholder="Площадь"
          />

          <!-- price -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.price"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Цена"
            />
          </ValidationProvider>

          <!-- Currency -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-select
              v-model="modalData.currency_type_id"
              :class="{ warning__border: errors[0] }"
              class="mt-2"
              value-field="value"
              text-field="name"
              :options="currencyOptions"
              :placeholder="'Валюта'"
            />
          </ValidationProvider>

          <!-- apartmentType -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-select
              v-model="modalData.apartment_type_id"
              :class="{ warning__border: errors[0] }"
              class="mt-2"
              value-field="value"
              text-field="name"
              :options="apartmentTypeOptions"
              :placeholder="'Тип помещения'"
              bottom-to-top
            />
          </ValidationProvider>

          <base-checkbox
            class="ml-3 checkbox mt-2"
            v-model="modalData.is_published"
            label="is_published"
          >
          </base-checkbox>
          <base-checkbox
            class="ml-3 checkbox mt-2"
            v-model="modalData.is_available"
            label="is_available"
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
            @click="saveApartment"
            :loading="isSaving"
          >
          </base-button>
        </div>
      </template>
    </base-modal>
    <b-overlay :show="isInitiating" no-wrap opacity="0.5">
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
import { formatToPrice } from "@/util/reusable";

import AppHeader from "@/components/Header/AppHeader";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import BaseTabPicker from "@/components/Reusable/BaseTabPicker";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent2";
import BaseModal from "@/components/Reusable/BaseModal2.vue";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox2";

import { XFormInput } from "@/components/ui-components/form-input";
import { XFormSelect } from "@/components/ui-components/form-select";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import PaginationBlock from "@/components/Reusable/PaginationBlock";

import InfoCard from "./components/InfoCard.vue";
import { testApi } from "@/services/v3/test";

export default {
  components: {
    AppHeader,
    BaseArrowLeft,
    BaseArrowRight,
    BaseButton,
    BaseTabPicker,
    BaseFilterTabsContent,
    BaseSearchInput,
    BaseLoading,
    BaseModal,
    BaseCloseIcon,
    BaseCheckbox,
    XIcon,
    XCircularBackground,
    XFormInput,
    XFormSelect,
    InfoCard,
    PaginationBlock,
  },
  methods: {
    backNavigation() {
      this.$router.back();
    },
  },
  data() {
    return {
      apartmentFields: [
        { key: "number", label: "Номер" },
        { key: "rooms", label: "Комнатность" },
        { key: "area", label: "Площадь" },
        {
          key: "prices.price_m2",
          label: "Цена за кв.м (сум)",
          formatter: (v) => formatToPrice(v, 2),
        },
        {
          key: "price_usd",
          label: "Цена за кв.м ($)",
          formatter: (v) => formatToPrice(v, 2),
        },
        {
          key: "prices.price",
          label: "Полная цена (сум)",
          formatter: (v) => formatToPrice(v, 2),
        },
        {
          key: "full_price_usd",
          label: "Полная цена ($)",
          formatter: (v) => formatToPrice(v, 2),
        },
        { key: "status", label: "Статус" },
        { key: "actions", label: "" },
      ],
      apartments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => ({
        number: "P-20",
        rooms: 3,
        area: 80.44,
        price: 7_000_000,
        price_usd: 600,
        full_price: 560_000_000,
        full_price_usd: 48000,
        status: "Свободно",
      })),
    };
  },
  setup() {
    const vm = getCurrentInstance().proxy;
    const object_id = vm.$route.params.objectid;
    const building_id = vm.$route.params.building;
    const block_id = vm.$route.params.block;
    const block = ref(null);
    const floors = ref([]);

    const currentTab = ref("1");
    async function changeFloor(f) {
      console.log(f);
      currentTab.value = f;
    }

    const blockOptions = computed(() => {
      if (!block.value) return [];
      return block.value.floors.map((el) => ({
        name: el.floor,
        value: el.block_floor_id,
      }));
    });

    // PAGINATED CHIDLREN
    const items = ref(null);
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
    async function getItems() {
      isLoading.value = true;
      const res = await testApi.blocks.getApartments(
        object_id,
        building_id,
        block_id,
        currentTab.value,
        query.value
      );
      items.value = res.data.result;
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
      () => ({ q: vm.$route.query, f: currentTab.value }),
      () => {
        getItems();
      }
    );

    // PAGINATED CHIDLREN END
    function openModal() {
      vm.$refs["object-modal"].openModal();
    }
    function closeModal() {
      vm.$refs["object-modal"].closeModal();
    }

    const planOptions = ref([]);
    const currencyOptions = ref([]);
    const apartmentTypeOptions = ref([]);
    const isSaving = ref(false);

    const currentApartment = ref(null);
    function openEditModal(item) {
      currentApartment.value = item.id;
      modalData.value = {
        number: item.number,
        block_floor_id: item.floor_id,
        entrance: item.entrance,
        plan_id: item.plan.id,
        rooms: item.rooms,
        area: item.plan.area,
        price: "",
        currency_type_id: null,
        apartment_type_id: null,
        is_available: false,
        is_published: false,
      };
    }
    const modalData = ref({
      number: "",
      block_floor_id: null,
      entrance: "",
      plan_id: null,
      rooms: "",
      area: "",
      price: "",
      currency_type_id: null,
      apartment_type_id: null,
      is_available: false,
      is_published: false,
    });
    async function saveApartment() {
      const validation = await vm.$refs["validation-observer"].validate();
      if (!validation) return;
      try {
        await testApi.apartments.create(
          object_id,
          building_id,
          block_id,
          modalData.value
        );
      } catch (error) {
        vm.toastedWithErrorCode(err);
      }
    }
    const isInitiating = ref(true);
    onMounted(async () => {
      testApi.blocks.view(object_id, building_id, block_id).then((res) => {
        block.value = res.data.result;
      });
      const floorsRes = await testApi.blocks.getFloors(
        object_id,
        building_id,
        block_id
      );
      floors.value = floorsRes.data.result.map((el) => ({
        status: el.id,
        name: "Этаж " + el.name,
      }));
      currentTab.value = floors.value[0].status;
      getItems();
      isInitiating.value = false;

      testApi.plans.getAll(object_id).then((res) => {
        const { result } = res.data;
        planOptions.value = result.map((el) => ({
          name: el.name,
          value: el.id,
        }));
      });
      testApi.blocks.getCurrencyTypes().then((res) => {
        const { result } = res.data;
        currencyOptions.value = result.map((el) => ({
          name: el.name[vm.$i18n.locale],
          value: el.id,
        }));
      });
      testApi.apartmentTypes.getAll().then((res) => {
        const { result } = res.data;
        apartmentTypeOptions.value = result.map((el) => ({
          name: el.name[vm.$i18n.locale],
          value: el.id,
        }));
      });
    });
    return {
      isInitiating,
      block,
      pagination,
      changeCurrentPage,
      isLoading,
      items,
      floors,
      currentTab,
      changeFloor,

      openEditModal,
      openModal,
      closeModal,
      modalData,
      blockOptions,
      planOptions,
      currencyOptions,
      apartmentTypeOptions,
      isSaving,
      saveApartment,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}
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
// table
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

.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 9rem;
  border-radius: 2rem;
  padding: 0.5rem 0.5rem;

  &.sold {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.waiting {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  &.contract {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &.booked {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.closed,
  &.cancelled {
    background-color: var(--red-100);
    color: var(--red-600);
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
.checkbox {
  color: var(--gray-600);
  font-size: 18px;
  width: fit-content;
  cursor: pointer;
}
</style>