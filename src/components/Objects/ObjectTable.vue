<template>
  <div class="apartment-list-filter">

    <div>
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
          :items="tableItems"
          :fields="fields"
          :busy="showLoading"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :empty-text="$t('no_data')"
          @sort-changed="sortingChanged"
          :selectable="selectable"
          @row-selected="onRowSelected"
      >

        <template #table-busy>
          <base-loading/>
        </template>

        <template #empty="scope" class="text-center">
            <span class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </span>
        </template>

        <template #cell(number)="data" class="p-0">
          <div class="position-relative">
            <div class="table-multi-select">
              <!--              <b-form-checkbox-->
              <!--                  title="Выберите"-->
              <!--                  v-if="data.item.is_sold && selected.view && data.item.order.status === 'available'"-->
              <!--                  :id="'checkbox-' + data.item.id"-->
              <!--                  v-model="selected.values"-->
              <!--                  :name="'checkbox-' + data.item.id"-->
              <!--                  :value="data.item.id"-->
              <!--              ></b-form-checkbox>-->
              <span>{{ data.item.number }}</span>
            </div>
          </div>
        </template>

        <template #cell(area)="data">
          <span v-if="data.item.plan"> {{ data.item.plan.area }} м² </span>
        </template>

        <template #cell(balcony)="data">
            <span v-if="data.item.plan.balcony">
              {{ data.item.plan.balcony_area }} м²
            </span>

          <span v-else>
              {{ $t("no") }}
            </span>
        </template>

        <template #cell(price)="data">
          {{
            data.item.price
                | number("0,0.00", {
              thousandsSeparator: " ",
              decimalSeparator: ",",
            })
          }}
          {{ $t("ye") }}
        </template>

        <template #cell(status)="data">
                    <span v-if="!data.item.is_sold" class="disable">
                      {{ $t('not_for_sale') }}
                    </span>
          <span v-else :class="getStatus(data.item.order.status).class">
              {{ getStatus(data.item.order.status).statusText }}
          </span>
        </template>

      </b-table>

      <div v-if="!showLoading && pagination.total" class="pagination__vue">

        <!--   Pagination   -->
        <vue-paginate
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
            <base-arrow-right-icon/>
          </span>
          </template>

          <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon/>
          </span>
          </template>
        </vue-paginate>

        <!--  Show By Select    -->
        <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="limitChanged"
              v-model="showByValue"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
import api from "@/services/api"
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import {sortObjectValues} from "@/util/reusable";
import BaseLoading from "@/components/Reusable/BaseLoading";

export default {
  name: 'ObjectTable',
  components: {
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseDownIcon,
    BaseLoading

  },

  data() {
    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    let {limit: showByValue} = this.$route.query

    if (!showByValue) {
      showByValue = 20
    }

    return {
      showByValue,
      showByOptions,
      pagination: {},
      tableItems: [],
      selectable: true,
      page: 1,
      fields: [
        {
          key: "number",
          label: this.$t('apartments.list.number'),
          sortable: true,
        },
        // {
        //   key: "building.name",
        //   label: "ЗДАНИЯ",
        //   sortable: true,
        // },
        // {
        //   key: "block.name",
        //   label: "КОРПУС",
        // },
        // {
        //   key: "is_promo",
        //   label: this.$t('promo.in_promo'),
        //   sortable: true,
        // },
        {
          key: "rooms",
          label: this.$t('apartments.list.rooms'),
          sortable: true,
        },
        {
          key: "floor",
          label: this.$t('apartments.list.floor'),
          sortable: true,
        },
        {
          key: "entrance",
          label: this.$t('apartments.list.entrance'),
          sortable: true,
        },
        {
          key: "area",
          label: this.$t('apartments.list.area'),
          sortable: true,
        },
        {
          key: "balcony",
          label: this.$t('apartments.list.balcony'),
          sortable: true,
        },
        {
          key: "price",
          label: this.$t('apartments.list.price'),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t('apartments.list.status'),
        },
        {
          key: "actions",
          label: "",
        },
      ],
      sortBy: "",
      sortDesc: false,
      currentPage: 1,
      showLoading: false,
    }
  },

  async created() {
    this.filter = {
      ...this.$route.query,
    }
    this.currentPage = Number(this.filter.page);

    await this.fetchContractList()
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
    countOfItems() {
      return this.tableItems.length
    },
  },

  watch: {
    '$route.query': {
      handler: function () {
        this.fetchContractList()
      },
      deep: true
    },
  },

  methods: {
    limitChanged() {
      this.changeFetchLimit()
    },
    async fetchContractList() {
      this.showLoading = true
      console.log('nimader')
      const query = sortObjectValues(this.query)
      if (query.hasOwnProperty('object_id') && typeof query.object_id === 'string') {
        query.object_id = [query.object_id]
      }
      await api.objects.fetchObjectApartments(18, query)
          .then((response) => {
            this.tableItems = response.data.items
            this.pagination = response.data.pagination
            this.showByValue = response.data.pagination.perPage
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    changeFetchLimit() {
      const query = {
        ...this.query, page: 1
      }
      const limit = this.showByValue
      this.replaceRouter({...query, limit})
    },
    replaceRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.replace({query: sortQuery})
    },
    pushRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.push({query: sortQuery})
    },

    changeCurrentPage(page) {
      const currentPage = this.query.page
      if (page === currentPage) return
      this.replaceRouter({...this.query, page})
    },

    onRowSelected(items) {
      console.log(items);
      /// on select visit children

      // this.$router.push({
      //   name: "chess",
      //   params: {id: items[0].id},
      // });
    },

    sortingChanged(val) {
      this.showLoading = true
      this.filter.filtered = true;
      this.filter.sort_by = val.sortBy;
      this.filter.order_by = val.sortDesc ? "desc" : "asc";

      this.$router.push({
        name: "chess-table",
        params: {objectId: 18},
        query: this.filter,
      }).then(() => {
        const element = document.getElementById("my-table");
        element.scrollIntoView();
      });

    },

    moment: function () {
      return this.$moment();
    },

    getStatus(value) {
      switch (value) {
        case 'available': {
          return {statusText: 'Свободно', class: 'teal'}
        }
        case 'contract':
        case 'waiting':
        case 'sold':
        case 'closed': {
          return {statusText: 'Продано', class: 'gray'}
        }
        case 'booked': {
          return {statusText: 'Забронировано', class: 'yellow'}
        }
        case 'hold': {
          return {statusText: 'Оформлено', class: 'blue'}
        }
        default:
          return {statusText: 'Свободно', class: 'teal'}
      }
    },

  },

};
</script>

<style scoped lang="scss">

@import "@/assets/scss/utils/pagination";

.search__content {
  margin-top: 0;
}

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
    }

    td {
      vertical-align: middle;
    }
  }


  .table.b-table[aria-busy=true] {
    opacity: 1 !important;
  }


  .yellow, .teal, .gray, .blue, .disable {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px;
    border-radius: 24px;
  }

  .yellow {
    color: var(--yellow-600);
    background-color: var(--yellow-100);
  }

  .teal {
    color: var(--teal-600);
    background-color: var(--teal-100);
  }

  .blue {
    color: var(--light-blue-600);
    background-color: var(--light-blue-100);
  }

  .gray {
    color: var(--gray-600);
    background-color: var(--gray-100);
  }

  .disable {
    color: var(--gray-300);
    background-color: var(--gray-100);
  }

}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 5) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
  background-position: right calc(2rem / 6) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
  background-position: right calc(2rem / 6) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}


</style>
