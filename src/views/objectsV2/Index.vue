<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("Объекты") }}
      </template>
      <template #header-actions>
        <hide-price-button />
        <base-button
          v-if="permission.hasAdminRole()"
          :text="archivedButtonText"
          @click="setArchive"
        >
          <template #left-icon>
            <x-icon
              :name="archivedButtonIcon"
              :size="20"
              class="violet-600"
              color="var(--violet-600)"
            />
          </template>
        </base-button>
      </template>
    </app-header>
    <div class="object-row row">
      <div class="col-3 px-3" v-for="item in items" :key="item.id">
        <div class="object-card">
          <div class="data">
            <div class="group">
              <div class="title-row">
                <router-link
                  :to="{
                    name: 'objects2-view',
                    params: {
                      objectid: item.id,
                    },
                  }"
                  class="title"
                  >{{ item.name }}</router-link
                >
                <div class="icon" @click="editObject(item)">
                  <x-icon
                    name="edit"
                    :size="20"
                    class="violet-600 cursor-pointer"
                    color="var(--violet-600)"
                  />
                </div>
              </div>
              <div class="status">STATUS</div>
              <div class="address">{{ item.address }}</div>
            </div>
            <div class="line"></div>
            <div class="info">
              <div>{{ item.apartments_count }} квартир</div>
              <div
                v-if="!item.is_hide_m2_price && showPrice"
                class="highlight"
                v-html="
                  $t('price_from', {
                    msg: `${formatPrice(item.apartment_price)}`,
                  })
                "
              ></div>
            </div>
            <div class="info">
              <div>{{ item.floors_count }} этажей</div>
              <div
                v-if="!item.is_hide_m2_price && showPrice"
                v-html="
                  $t('price_from_m2', {
                    msg: `${formatPrice(item.apartment_price_m2)}`,
                  })
                "
              ></div>
            </div>
          </div>
          <div class="image">
            <img v-if="item.image" v-lazy="item.image" alt="" />
            <img v-else v-lazy="require('@/assets/img/not-found.png')" alt="" />
          </div>
        </div>
      </div>
      <div class="col-3 px-3">
        <div v-if="createPermission && !archived" class="object-card">
          <div class="card-empty cursor-pointer" @click="openCreateModal">
            <img :src="require('@/assets/icons/icon-plus.svg')" alt="" />
            <p class="title">{{ $t("object_create") }}</p>
          </div>
        </div>
      </div>
    </div>

    <base-modal ref="object-modal" design="large-modal">
      <template #header>
        <div class="d-flex align-items-center">
          <div class="modal-title">
            {{ currentObject ? "Редактировать" : "Создать" }} обьект
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
          <!-- Адрес -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.address"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Адрес"
            />
          </ValidationProvider>
          <!-- Юридический Адрес -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.legal_address"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Юридический Адрес"
            />
          </ValidationProvider>
          <!-- Компания -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-select
              v-model="modalData.company_id"
              :class="{ warning__border: errors[0] }"
              class="mt-2"
              value-field="value"
              text-field="name"
              :options="companies"
              :placeholder="'Компания'"
            />
          </ValidationProvider>
          <!-- Широта -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.location.latitude"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Широта"
            />
          </ValidationProvider>
          <!-- Долгота -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.location.longitude"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="Долгота"
            />
          </ValidationProvider>
          <!-- Parking Completion Date -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <base-date-picker
              v-model="modalData.parking_completion_date"
              :range="false"
              class="data-picker mt-2"
              :class="{ warning__border: errors[0] }"
              format="DD.MM.YYYY"
              :placeholder="'Parking Completion Date'"
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
              v-model="modalData.build_date"
              :range="false"
              class="data-picker mt-2"
              :class="{ warning__border: errors[0] }"
              format="DD.MM.YYYY"
              :placeholder="'Дата окончания строительства'"
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
              :placeholder="'installment_month'"
              icon-fill="var(--violet-600)"
            />
          </ValidationProvider>

          <!-- Дата окончания рассрочки
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <base-date-picker
              v-model="modalData.payment_completion_date"
              :range="false"
              class="data-picker mt-2"
              :class="{ warning__border: errors[0] }"
              format="DD.MM.YYYY"
              :placeholder="'Дата окончания рассрочки'"
              icon-fill="var(--violet-600)"
            />
          </ValidationProvider> -->
          <!-- slug -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.slug"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="slug"
            />
          </ValidationProvider>
          <!-- slug_parking -->
          <ValidationProvider
            rules="required"
            v-slot="{ errors }"
            class="w-100"
          >
            <x-form-input
              :class="{ warning__border: errors[0] }"
              v-model="modalData.slug_parking"
              :label="true"
              class="w-100 mt-2"
              type="text"
              placeholder="slug_parking"
            />
          </ValidationProvider>
          <base-checkbox
            class="ml-3 checkbox mt-2"
            v-model="modalData.is_map"
            label="is_map"
          >
          </base-checkbox>
          <base-checkbox
            class="ml-3 checkbox mt-1"
            v-model="modalData.is_parking"
            label="is_parking"
          >
          </base-checkbox>
          <base-checkbox
            class="ml-3 checkbox mt-1"
            v-model="modalData.is_hide_m2_price"
            label="is_hide_m2_price"
          >
          </base-checkbox>
          <base-checkbox
            class="ml-3 checkbox mt-1"
            v-model="modalData.is_published"
            label="is_published"
          >
          </base-checkbox>
        </ValidationObserver>
        <b-overlay :show="getLoading" no-wrap opacity="0.5">
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
      </template>
      <template #footer>
        <div class="d-flex jusify-content-center w-100 mt-3">
          <base-button text="Отменить" class="mr-3" fixed @click="closeModal">
          </base-button>
          <base-button
            text="Добавить"
            design="violet"
            fixed
            @click="saveForm"
          ></base-button>
        </div>
      </template>
    </base-modal>

    <b-overlay :show="getLoading" no-wrap opacity="0.5">
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
import BaseButton from "@/components/Reusable/BaseButton.vue";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseModal from "@/components/Reusable/BaseModal2";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox2";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";

import HidePriceButton from "@/components/Reusable/HidePriceButton.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XFormInput } from "@/components/ui-components/form-input";
import { XFormSelect } from "@/components/ui-components/form-select";
import { XModalCenter } from "@/components/ui-components/modal-center";

import Permission from "@/permission";
import ObjectsPermission from "@/permission/objects";

import { testApi } from "@/services/v3/test";
import { useShowPrice } from "@/composables/useShowPrice";
import { formatToPrice } from "@/util/reusable";
import api from "@/services/api";

export default {
  components: {
    AppHeader,
    BaseButton,
    HidePriceButton,
    XIcon,
    XFormInput,
    XModalCenter,
    XFormSelect,
    BaseDatePicker,
    BaseModal,
    BaseCloseIcon,
    BaseCheckbox,
  },
  data() {
    return {
      permission: Permission,
      createPermission: ObjectsPermission.getObjectsPermission("create"),
      deletePermission: ObjectsPermission.getObjectsPermission("delete"),
      editPermission: ObjectsPermission.getObjectsPermission("edit"),
      viewPermission: ObjectsPermission.getObjectsPermission("view"),
      logoUploadPermission:
        ObjectsPermission.getObjectsPermission("upload_logo"),
      manageFacilitiesPermission:
        ObjectsPermission.getObjectsPermission("manage_facilities"),

      showModal: false,
      currentObject: null,
      modalData: {
        name: "",
        address: "",
        full_address: "",
        company_id: null,
        location: {
          longitude: "",
          latitude: "",
        },
        parking_completion_date: null,
        build_date: null,
        installment_month: null,
        slug: "",
        slug_parking: "",
        is_archived: false,
        is_parking: false,
        is_map: false,
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
    openCreateModal() {
      this.clearForm();
      this.openModal();
    },
    async editObject(item) {
      this.currentObject = item.id;
      this.getLoading = true;
      const res = await testApi.objects.view({ id: item.id });
      const o = res.data.result;
      this.modalData = {
        name: o.name,
        address: o.address,
        full_address: o.full_address,
        company_id: o.company.id,
        location: {
          longitude: o.location?.longitude ?? "",
          latitude: o.location?.latitude ?? "",
        },
        parking_completion_date: o.parking_completion_date,
        build_date: o.build_date,
        installment_month: o.installment_month,
        slug: o.slug,
        slug_parking: o.slug_parking,
        is_archived: !!o.is_archived,
        is_parking: !!o.is_parking,
        is_map: !!o.is_map,
        is_published: !!o.is_published,
      };
      this.openModal();
      this.getLoading = false;
    },
    clearForm() {
      this.currentObject = null;
      this.modalData = {
        name: "",
        address: "",
        full_address: "",
        company_id: null,
        location: {
          longitude: "",
          latitude: "",
        },
        parking_completion_date: null,
        build_date: null,
        installment_month: null,
        slug: "",
        slug_parking: "",
        is_archived: false,
        is_parking: false,
        is_map: false,
        is_published: false,
      };
    },
  },
  setup() {
    const vm = getCurrentInstance().proxy;
    const archived = ref(false);
    const getLoading = ref(false);
    const archivedButtonText = computed(() =>
      archived.value ? vm.$t("c_active") : vm.$t("c_archived")
    );
    const archivedButtonIcon = computed(() =>
      archived.value ? "unarchive" : "inventory_2"
    );
    const items = ref([]);
    async function fetchObjects() {
      getLoading.value = true;
      items.value = [];
      (archived.value
        ? testApi.objects.fetchArchived()
        : testApi.objects.fetchAll()
      ).then((res) => {
        items.value = res.data.result;
        getLoading.value = false;
      });
    }
    const companies = ref(null);
    api.companies.getCompaniesList().then(
      (res) =>
        (companies.value = res.data.map((el) => ({
          value: el.id,
          name: el.name,
        })))
    );
    onMounted(() => fetchObjects());
    async function setArchive() {
      archived.value = !archived.value;
      await fetchObjects(this);
    }

    function formatPrice(v) {
      return formatToPrice(v);
    }
    async function saveForm() {
      const validation = await vm.$refs["validation-observer"].validate();
      if (!validation) return;
      getLoading.value = true;
      let res;
      if (vm.currentObject)
        res = testApi.objects.update(vm.currentObject, vm.modalData);
      else res = testApi.objects.create(vm.modalData);

      res
        .then(() => {
          vm.closeModal();
          vm.fetchObjects();
        })
        .catch((err) => {
          vm.toastedWithErrorCode(err);
          getLoading.value = false;
        });
    }
    return {
      archived,
      getLoading,
      archivedButtonText,
      archivedButtonIcon,
      fetchObjects,
      setArchive,
      formatPrice,

      items,
      companies,
      saveForm,

      ...useShowPrice(),
    };
  },
};
</script>

<style lang="scss" scoped>
.object-card {
  border-radius: 32px;
  background-color: var(--gray-100);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  height: 100%;
  min-height: 450px;

  & .data {
    width: 100%;
    padding: 28px;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    & .group {
      flex-grow: 1;
    }
    & .title-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    & .title {
      color: var(--violet-600);
      font-size: 24px;
      line-height: 28px;
      font-family: CraftworkSans, serif;
    }
    & .status {
      background-color: #fff;
      border-radius: 16px;
      padding: 5px 10px;
      font-family: Inter;
      font-weight: 600;
      font-size: 14px;
      width: fit-content;
      margin-bottom: 12px;
      color: var(--gray-400);
    }
    & .address {
      font-size: 18px;
      font-family: Inter;
      color: var(--gray-500);
    }
    & .line {
      border-bottom: 2px solid #e5e7eb;
      margin-top: 15px;
      margin-bottom: 15px;
    }

    & .info {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 12px;
      color: var(--gray-500);
      font-size: 16px;
      & .highlight {
        font-size: 18px;
        color: var(--violet-600);
      }
    }
  }

  & .image {
    aspect-ratio: 2/1;
    & img {
      width: 100%;
      aspect-ratio: 2/1;
      box-sizing: border-box;
    }
  }
  & .card-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & .title {
      font-size: 24px;
      color: var(--violet-600);
    }
  }
}
.object-row {
  flex-wrap: wrap;
  row-gap: 24px;
  align-items: stretch;
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