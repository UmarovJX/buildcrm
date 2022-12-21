<template>
  <div>
    <h3>{{ $t('client_types') }}</h3>

    <b-table
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border"
        ref="apartment-list-table"
        id="my-table"
        class="table__list"
        sticky-header
        borderless
        show-empty
        responsive
        sort-icon-left
        :items="clientTypes.items"
        :fields="clientTypes.fields"
        :busy="clientTypes.loading"
        :empty-text="$t('no_data')"
    >

      <template #table-busy>
        <base-loading/>
      </template>

      <template #empty="scope" class="text-center">
        <span class="d-flex justify-content-center align-items-center">
          {{ scope['emptyText'] }}
        </span>
      </template>

      <template #cell(icon)="{ item }">
        {{ item.icon }}
      </template>

      <template #cell(is_vip)="{ item }">
        <div>
          <span class="border-radius-2 background-violet-100 violet-600">V.I.P</span>
        </div>
      </template>

      <template #cell(actions)="data">
        <div class="float-right">
          actions
        </div>
      </template>

    </b-table>
  </div>
</template>

<script>
import BaseCheckbox from "@/components/Reusable/BaseCheckbox.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import api from "@/services/api";
export default {
  name:'SettingsClientTypes',
  components:{
    BaseCheckbox,
    BaseLoading
  },
  data() {
    return {
      clientTypes:{
        items:[],
        fields:[
          {
            key:"icon",
            label:""
          },
          {
            key: "name",
            label: this.$t('title'),
            formatter:(name) => name[this.$i18n.locale]
          },
          {
            key: "is_vip",
            label: 'V.I.P',
          },
          {
            key: "actions",
            label: this.$t('actions'),
            class:"float-right"
          },
        ],
        loading:false
      },
    }
  },
  created() {
    this.fetchClientTypes()
  },
  methods:{
    async fetchClientTypes(){
      try {
        const {data:items} = await api.settingsV2.getClientTypes()
        this.clientTypes.items = items
      } catch (e){
        this.toastedWithErrorCode(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
  background-size: 20px;
  background-position: right calc(2rem / 6) center !important;
  background-image: url('../../../assets/icons/icon-arrow-down.svg') !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
  background-size: 20px;
  background-position: right calc(2rem / 6) center !important;
  background-image: url('../../../assets/icons/icon-arrow-down.svg') !important;
}
</style>