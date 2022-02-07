<template>
  <div class="mt-2">
    <b-table
        sticky-header
        borderless
        responsive
        :items="companies"
        :fields="fields"
        show-empty
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        sort-icon-left
        class="custom-table"
        :empty-text="$t('no_data')"
    >
      <template #cell(name)="data">
        {{ getName(data.item.type.name) }} «{{ data.item.name }}»
      </template>


      <!--   ACTION   -->
      <template #cell(actions)="data">
        <div class="float-right">
          <div
              class="dropdown my-dropdown dropleft"
          >
            <button
                type="button"
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
              <i class="far fa-ellipsis-h"></i>
            </button>

            <div class="dropdown-menu">
              <b-button
                  class="dropdown-item dropdown-item--inside"
                  v-b-toggle="data.item.type.created_at"
                  @click="data.toggleDetails"
              >
                <i class="fas fa-info-circle"></i>
                {{ $t("more_info") }}
              </b-button>

              <b-button
                  v-if="permission.roles.update"
                  @click="editSelectedCompany(data.item)"
                  class="dropdown-item dropdown-item--inside"
              >
                <i class="fas fa-edit"></i>
                {{ $t("edit") }}
              </b-button>

              <b-button
                  v-if="permission.users.delete"
                  class="dropdown-item  dropdown-item--inside"
                  @click="deleteCompany(data.item.id)"
              >
                <i class="fas fa-trash"></i>
                {{ $t('delete') }}
              </b-button>
            </div>
          </div>
        </div>
      </template>

      <!--  ROW DETAILS    -->
      <template #row-details="data">
        <div class="payment__content">
            <PaymentBoxContent
                v-for="detail in data.item.details"
                :key="detail.created_at"
                :detail="detail"
            />
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import PaymentBoxContent from "@/components/Dashboard/Companies/Components/PaymentBoxContent";
export default {
  name: "CompaniesList",
  components:{
    PaymentBoxContent
  },
  props: {
    companies: {
      type: Array,
      required: true
    }
  },
  emits: ['edit-selected-company', 'delete-company'],
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      paymentCheckbox: true,
      primaryPaymentAccount: 0,
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "name",
          label: this.$t("companies.name"),
        },
        {
          key: "payment_accounts_count",
          label: this.$t("companies.payment_account"),
        },
        {
          key: "phone",
          label: this.$t("companies.phone"),
          formatter: (value) => "+" + value,
        },
        {
          key: "actions",
          label: "",
        },
      ],
      detailsField: [
        {
          key: "bank_name",
          label: this.$t("companies.bank_name"),
        },
        {
          key: "payment_account",
          label: this.$t("companies.payment_account"),
        },
        {
          key: "inn",
          label: this.$t("companies.inn"),
        },
        {
          key: "mfo",
          label: this.$t("companies.mfo"),
        },
        {
          key: "is_primary",
          label: "",
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission'
    })
  },
  methods: {
    getName(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },
    editSelectedCompany(item) {
      this.$emit('edit-selected-company', item)
    },
    deleteCompany() {
      // this.$emit('delete-company',id)
    },
    makePrimaryPayment(detail) {
      console.log(detail.is_primary)
    }
  }
}
</script>

<style lang="scss" scoped>
.payment__content {
  //background-color: var(--primary);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 400px));
}
</style>