<script>
import { XButton } from "@/components/ui-components/button";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import SettingsCreateCountry from "@/views/Settings/components/SettingsCreateCountry.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import api from "@/services/api";

export default {
  name: "SettingsCountries",
  components: {
    XButton,
    XIcon,
    BaseLoading,
    XCircularBackground,
    SettingsCreateCountry,
  },
  data() {
    return {
      engagementType: "create",
      showCreateCountryModal: false,
      editStorage: {},
      countries: {
        items: [],
        busy: false,
      },
    };
  },
  computed: {
    countryFields() {
      return [
        {
          key: "name",
          label: this.$t("country"),
          formatter: (name) => name[this.$i18n.locale],
        },
        {
          key: "code",
          label: this.$t("country_code"),
        },
        {
          key: "actions",
          label: this.$t("actions"),
          class: "float-right",
        },
      ];
    },
  },
  created() {
    this.getCountries();
  },
  methods: {
    setEngagementType(eType) {
      if (["create", "edit"].includes(eType)) {
        this.engagementType = eType;
      }
    },
    editCountries(item) {
      this.setEngagementType("edit");
      this.editStorage = item;
      this.openCreatingModal();
    },
    async deleteCountries(ctyId) {
      try {
        this.startAppLoading();
        await api.settingsV2.removeCountryFromDb(ctyId);
        await this.getCountries();
      } catch (e) {
        this.toastedWithErrorCode();
      } finally {
        this.finishAppLoading();
      }
    },
    startAppLoading() {
      this.countries.busy = true;
    },
    finishAppLoading() {
      this.countries.busy = false;
    },
    async getCountries() {
      try {
        this.startAppLoading();
        const { data } = await api.settingsV2.fetchCountries();
        this.countries.items = data;
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        this.finishAppLoading();
      }
    },
    openCreatingModal() {
      this.showCreateCountryModal = true;
    },
    closeCreatingModal() {
      this.showCreateCountryModal = false;
    },
    newCountryCreated() {
      this.setEngagementType("create");
      this.closeCreatingModal();
      this.getCountries();
    },
  },
};
</script>

<template>
  <div class="settings-countries">
    <!-- TODO:SETTINGS COUNTRIES   -->
    <div class="d-flex justify-content-between">
      <h3 class="x-font-size-1p5 font-craftworksans color-gray-400">
        {{ $t("priority_countries") }}
      </h3>
      <x-button
        variant="secondary"
        text="add_country"
        :bilingual="true"
        @click="openCreatingModal"
      >
        <template #left-icon>
          <x-icon name="add" class="violet-600" />
        </template>
      </x-button>
    </div>

    <b-table
      id="my-table"
      ref="apartment-list-table"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      class="table__list"
      sticky-header
      borderless
      show-empty
      responsive
      sort-icon-left
      :items="countries.items"
      :fields="countryFields"
      :busy="countries.busy"
      :empty-text="$t('no_data')"
    >
      <template #table-busy>
        <base-loading />
      </template>

      <template #empty="scope" class="text-center">
        <span class="d-flex justify-content-center align-items-center">
          {{ scope["emptyText"] }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <x-circular-background
            @click="editCountries(item)"
            class="bg-violet-600"
          >
            <x-icon name="edit" class="color-white" />
          </x-circular-background>

          <x-circular-background
            @click="deleteCountries(item.id)"
            class="bg-red-600"
          >
            <x-icon name="delete" class="color-white" />
          </x-circular-background>
        </div>
      </template>
    </b-table>

    <settings-create-country
      v-if="showCreateCountryModal"
      :engagement-type="engagementType"
      :countries="countries.items"
      :edit-item="editStorage"
      @close-creating-country="closeCreatingModal"
      @added-new-country="newCountryCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";

::v-deep .table.b-table > thead > tr > [aria-sort="ascending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="ascending"] {
  background-size: 20px;
  background-position: right calc(2rem / 6) center !important;
  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-size: 20px;
  background-position: right calc(2rem / 6) center !important;
  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

.settings-countries {
  padding-top: 2rem;
}
</style>
