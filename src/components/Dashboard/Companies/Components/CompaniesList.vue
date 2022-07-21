<template>
  <div class="mt-2">
    <b-table
        class="table__list font-inter"
        @sort-changed="sortingChanged"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border"
        sticky-header
        borderless
        responsive
        :items="companies"
        :fields="fields"
        @row-clicked="openDetails"
        show-empty
        :sort-by.sync="filter.sortBy"
        :sort-desc.sync="filter.sortDesc"
        sort-icon-left
        :empty-text="$t('no_data')"
    >
      <template class="header_label" #head(name)="data">
        <span class="label font-craftworksans">{{ data.label }}</span>
      </template>

      <template #cell(name)="data">
        {{ data.item.name }}
      </template>

      <template #cell(director)="data">
        {{ getDirector(data.item.first_name, data.item.second_name) }}
      </template>

      <template #cell(accounts_number)="data">
        {{ data.item.payment_accounts_count }}
      </template>

      <!--   ACTION   -->
      <template #cell(actions)="data">
        <div class="float-right">
          <div
              class="dropdown my-dropdown dropleft"
          >
            <BaseButton
                class="bg-gradient-violet button rounded-circle]"
                text=''
                @click="editSelectedCompany(data.item)"
            >
              <template #right-icon>
                <BaseEditIcon fill="#7C3AED"/>
              </template>
            </BaseButton>
          </div>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import BaseEditIcon from "@/components/icons/BaseEditIcon"
import BaseButton from "@/components/Reusable/BaseButton";
import {sortObjectValues} from "@/util/reusable";

export default {
  name: "CompaniesList",
  components: {
    BaseButton,
    BaseEditIcon
  },
  props: {
    companies: {
      type: Array,
      required: true
    }
  },
  emits: ['edit-selected-company', 'delete-company', 'sort-companies'],
  data() {
    return {
      filter: {
        sortBy: "",
        sortDesc: false,
      },
      paymentCheckbox: true,
      primaryPaymentAccount: 0,
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
    }),
    fields() {
      return [
        {
          key: "id",
          label: this.$t("companies.number"),
        },
        {
          key: "name",
          label: this.$t("companies.name"),
          sortable: true
        },
        {
          key: "director",
          label: this.$t("companies.director"),
        },
        {
          key: "phone",
          label: this.$t("companies.phone"),
          formatter: (value) => "+" + value,
        },
        {
          key: "accounts_number",
          label: this.$t("companies.accounts_number"),
        },
        {
          key: "actions",
          label: this.$t("companies.actions"),
        },
      ]
    },
  },
  methods: {
    sortingChanged(query) {
      const sortQuery = sortObjectValues(query)
      this.$emit('sort-companies', sortQuery)
    },
    getDirector(firstName, secondName) {
      console.log('data:', firstName)
      return `${firstName} ${secondName}`
    },
    openDetails({id}) {
      this.$router.push({name: 'company-details', params: {companyId: id}})
    },
    editSelectedCompany(item) {
      if (item) {
        console.log("item", item)
        this.$emit('edit-selected-company', item)
      } else {
        console.log("sorry")
      }
    },
    deleteCompany(id) {
      this.$emit('delete-company', id)
    },
    makePrimaryPayment(detail) {
      console.log(detail.is_primary)
    },
    updatedCompany({message}) {
      this.$emit("updated-company", {message})
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}


::v-deep .table__list {
  min-height: 250px;
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.125rem 1rem;
      vertical-align: middle;

      //&.b-table-sort-icon-left {
      //display: flex;
      //align-items: center;
      //}
    }

    td {
      cursor: pointer;
      vertical-align: middle;
    }
  }


  .table.b-table[aria-busy=true] {
    opacity: 1 !important;
  }
}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 2) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../../assets/icons/icon-arrow-up.svg") !important;
}

.payment__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 400px));
}

.label {
  color: #7C3AED;
  margin-right: 3px;
  font-weight: 500;
}

.button {
  height: auto;
  width: auto;
  padding: 10px;

  ::v-deep span {
    margin-left: 0 !important;
  }
}

.edit {
  padding: 10px 13px;
  border: none;
  border-radius: 50%;
  background: #7C3AED;
}
</style>
