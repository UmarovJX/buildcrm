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
                Тарифы
                <span class="contract__number"> {{ objectName }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>

    <div>
      <div class="d-flex justify-content-end">
        <base-button text="Добавить" @click="openCreateModal">
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
        <template #cell(status)="{ item }">
          <span class="current__status sold">
            {{ $t(item.status) }}
          </span>
        </template>

        <template #cell(area)="{ item }">
          <span>{{ item.area }} m<sup>2</sup></span>
        </template>
        <template #cell(actions)="{ item }">
          <div class="d-flex">
            <x-circular-background
              class="bg-violet-600 ml-2"
              @click="openEditModal(item)"
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
              {{ currentTariff ? "Редактировать" : "Создать" }} тариф
            </div>
            <div style="width: 100px"></div>
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

            <!-- percentage -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-input
                :class="{ warning__border: errors[0] }"
                v-model="modalData.percentage"
                :label="true"
                class="w-100 mt-3"
                type="text"
                placeholder="Процент"
              />
            </ValidationProvider>
            <!-- additional -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-input
                :class="{ warning__border: errors[0] }"
                v-model="modalData.additional_price"
                :label="true"
                class="w-100 mt-3"
                type="text"
                placeholder="Дополнительно"
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
            <!-- Currency -->
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              class="w-100"
            >
              <x-form-select
                v-model="modalData.type"
                bottom-to-top
                :class="{ warning__border: errors[0] }"
                class="mt-2"
                value-field="value"
                text-field="name"
                :options="typeOptions"
                :placeholder="'Тип тарифа'"
              />
            </ValidationProvider>
          </ValidationObserver>
        </template>
        <template #footer>
          <div class="d-flex jusify-content-center w-100 mt-3">
            <base-button text="Отменить" class="mr-3" fixed @click="closeModal">
            </base-button>
            <base-button
              text="Сохранить"
              design="violet"
              fixed
              @click="saveItem"
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
import PaginationBlock from "@/components/Reusable/PaginationBlock";

import AppHeader from "@/components/Header/AppHeader";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseModal from "@/components/Reusable/BaseModal2.vue";
import BaseLoading from "@/components/Reusable/BaseLoading";

import { XIcon } from "@/components/ui-components/material-icons";
import { XFormInput } from "@/components/ui-components/form-input";
import { XFormSelect } from "@/components/ui-components/form-select";
import { XCircularBackground } from "@/components/ui-components/circular-background";

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
    PaginationBlock,
  },
  methods: {
    backNavigation() {
      this.$router.back();
    },
  },
  data() {
    return {
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Название" },
        { key: "percentage", label: "%" },
        {
          key: "currency_type_id",
          label: "Валюта",
          formatter: (v) => v.name[this.$i18n.locale],
        },
        {
          key: "additional_price",
          label: "ADDITIONAL",
        },

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
      total: 0,
      perPage: vm.$route.query.limit || 5,
      totalItems: 1,
    });
    const query = computed(() => ({
      page: pagination.value.current,
      limit: pagination.value.perPage,
    }));
    async function getItems() {
      isLoading.value = true;
      const res = await testApi.tariffs.get(object_id, query.value);

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
    const isSaving = ref(false);
    const currencyOptions = ref([]);
    const modalData = ref({
      name: "",
      percentage: "",
      additional_price: "",
      currency_type_id: null,
      type: null,
      object_id,
    });
    const currentTariff = ref(null);
    function clearModal() {
      modalData.value = {
        name: "",
        percentage: "",
        additional_price: "",
        currency_type_id: null,
        type: null,
        object_id,
      };
    }
    function openCreateModal() {
      clearModal();
      vm.$refs["object-modal"].openModal();
    }
    function openEditModal(item) {
      currentTariff.value = item.id;
      modalData.value = {
        name: item.name,
        percentage: item.percentage,
        additional_price: item.additional_price,
        currency_type_id: item.currency_type_id.id,
        type: item.type,
        object_id,
      };
      vm.$refs["object-modal"].openModal();
    }
    async function closeModal() {
      clearModal();
      vm.$refs["object-modal"].closeModal();
    }
    async function saveItem() {
      const validation = await vm.$refs["validation-observer"].validate();
      if (!validation) return;
      try {
        isSaving.value = true;
        if (currentTariff.value)
          await testApi.tariffs.update(
            object_id,
            currentTariff.value,
            modalData.value
          );
        else await testApi.tariffs.create(object_id, modalData.value);
        vm.toasted(`Тариф сохранен!`, "success");
        closeModal();
        getItems();
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
      isSaving.value = false;
    }

    async function deleteItem(item) {
      const res = await this.$swal({
        text: this.$t(`Удалить тариф ${item.name}?`),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("Да"),
      });
      if (!res.isConfirmed) return;
      try {
        await testApi.tariffs.delete(object_id, item.id);
        this.toasted(`Тариф удален!`, "success");
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

      testApi.blocks.getCurrencyTypes().then((res) => {
        const { result } = res.data;
        currencyOptions.value = result.map((el) => ({
          name: el.name[vm.$i18n.locale],
          value: el.id,
        }));
      });
    });
    return {
      changeCurrentPage,
      pagination,
      objectName,
      isLoading,
      items,
      currencyOptions,
      modalData,
      openEditModal,
      openCreateModal,
      closeModal,
      isSaving,
      saveItem,
      deleteItem,
      currentTariff,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination.scss";

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