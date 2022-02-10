<template>
  <div>
    <b-table
        sticky-header
        borderless
        responsive
        :items="promos"
        :fields="fields"
        show-empty
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        sort-icon-left
        class="custom-table"
        :empty-text="$t('no_data')"
    >

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

            <div class="dropdown-menu" v-if="hasPermission">

              <b-button
                  v-if="permission.objects.update"
                  class="dropdown-item dropdown-item--inside"
              >
                <i class="fas fa-check"></i>
                {{ $t("activate") }}
              </b-button>


              <b-button
                  v-if="permission.objects.update"
                  @click="editPromoItem(data.item)"
                  class="dropdown-item dropdown-item--inside"
              >
                <i class="fas fa-edit"></i>
                {{ $t("edit") }}
              </b-button>

              <b-button
                  v-if="permission.objects.update"
                  class="dropdown-item  dropdown-item--inside"
                  @click="deactivatePromo(data.item)"
              >
                <i class="fas fa-times"></i>
                {{ $t("deactivate") }}
              </b-button>

              <b-button
                  v-if="permission.objects.delete"
                  class="dropdown-item  dropdown-item--inside"
                  @click="deletePromoItem(data.item)"
              >
                <i class="fas fa-trash"></i>
                {{ $t("delete") }}
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
  name: 'PromoListContent',
  props: {
    promos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      sortBy: "id",
      sortDesc: false
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission'
    }),
    hasPermission() {
      return Object.keys(this.permission).length > 0
    },
    fields() {
      return [
        {
          key: "id",
          label: "#",
        },
        {
          key: "name",
          label: this.$t("promo.name"),
        },
        {
          key: "blocks",
          label: this.$t("promo.blocks"),
        },
        {
          key: "floors",
          label: this.$t("promo.floors"),
        },
        {
          key: "actions",
          label: "",
        }
      ]
    }
  },
  methods: {
    editPromoItem() {

    },
    deactivatePromo() {

    },
    deletePromoItem() {

    }
  }
}
</script>
