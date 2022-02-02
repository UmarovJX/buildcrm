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

      <b-collapse :id="data.item.type.created_at">
        <b-card>I am collapsible content!</b-card>
      </b-collapse>

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
                  v-if="permission.roles.update"
                  @click="editCompany(data.item)"
                  class="dropdown-item dropdown-item--inside"
                  v-b-modal.modal-update
              >
                <i class="fas fa-edit"></i>
                {{ $t("edit") }}
              </b-button>
              <b-button
                  class="dropdown-item dropdown-item--inside"
                  v-b-toggle="data.item.type.created_at"
              >
                <i class="fas fa-info-circle"></i>
                {{ $t("more_info") }}
              </b-button>
            </div>
          </div>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "CompaniesList",
  props: {
    companies: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
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
          key: "payment_account",
          label: this.$t("companies.payment_account"),
        },
        {
          key: "phone",
          label: this.$t("companies.phone"),
          formatter: (value) => "+" + value,
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
          key: "actions",
          label: "",
        },
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
    }
  }
}
</script>
