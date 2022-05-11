<template>
  <main class="app-content">

    <object-sort
        :filter-fields="filterFields"
        :app-loading="finishLoading"
        @clear-status="clearStatus"
        @current-tab="changeTab"
    />

    <b-form-checkbox-group
        id="checkbox-sort"
        class="status-sort"
        v-model="statusFilter"
        name="sort"
    >
      <b-form-checkbox
          v-for="status in statusList"
          :key="status.label"
          :value="status.value"
          :class="status.class"
      >
        {{ status.label }}
      </b-form-checkbox>
    </b-form-checkbox-group>

    <component
        :loading="getLoading"
        :plans="plans"
        :plan-load="planLoading"
        :is="currentTab"
        :apartments="apartments"
        @show-express-sidebar="apartmentExpressReview"
        @show-plan-sidebar="planExpressReview"
    />


    <!-- APARTMENT QUICK VIEW   -->
    <apartment-express-view
        :visible="expressView.toggle"
        :apartment="expressView.item"
        :apartmentUuid="expressView.item.uuid"
        @update-content="updateContent"
        @hide-apartment-sidebar-view="hideApartmentSidebarView"
    />

    <plan-express-view
        :visible="planView.toggle"
        :plan="planView.item"
        @hide-plan-sidebar-view="hidePlanSidebarView"
    />

  </main>
</template>

<script>
import api from "@/services/api";
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/View/Tabs/ObjectBlock";
import ApartmentExpressView from "@/components/Objects/View/elements/ApartmentExpressView";
import PlanExpressView from "@/components/Objects/View/elements/PlanExpressView";
import ChessSquareCard from "@/components/Objects/View/Tabs/ChessSquareCard";
import ObjectTable from "@/components/Objects/ObjectTable";
import ObjectPlan from "@/components/Objects/View/Tabs/ObjectPlan";
// import ClickOutside from "vue-click-outside";
import {isPrimitiveValue} from "@/util/reusable";

export default {
  name: "Objects",
  components: {
    ChessSquareCard,
    ObjectTable,
    ObjectSort,
    ObjectBlock,
    ObjectPlan,
    ApartmentExpressView,
    PlanExpressView,
  },
  // directives: {
  //   ClickOutside
  // },
  data() {
    return {
      expressView: {
        toggle: false,
        item: {}
      },
      planView: {
        toggle: false,
        item: {}
      },
      getLoading: false,
      finishLoading: false,
      planLoading: false,
      apartments: [],
      plans: [],
      currentTab: 'ObjectBlock',
      statusList: [
        {
          label: this.$t('object.status.available'),
          class: 'teal',
          value: 'available'
        },
        {
          label: this.$t('object.status.booked'),
          class: 'yellow',
          value: 'booked'
        },
        {
          label: this.$t('object.status.contract'),
          class: 'blue',
          value: 'contract'
        },
        {
          label: this.$t('object.status.sold'),
          class: 'gray',
          value: 'sold'
        },
        {
          label: this.$t('object.status.disable'),
          class: 'disabled',
          value: 'unavailable'
        },
      ],
      statusFilter: [],
      filter: [],
      filterFields: {}
    }
  },

  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
    hasQuery() {
      return Object.keys(this.$route.query).length > 0
    },
    accessToFilter() {
      const tabsActiveToFilter = ['ObjectBlock', 'ChessSquareCard']
      return tabsActiveToFilter.includes(this.currentTab)
    }
  },

  watch: {
    statusFilter(status) {
      if (status.length) {
        const isNotEqual = !this.compareArray(this.query.status, this.statusFilter)
        if (isNotEqual) {
          const arraySatisfaction = Array.isArray(status) && status.length > 0
          if (arraySatisfaction) {
            this.$router.push({
              query: {
                ...this.query,
                status: status
              }
            })
          }
        }
      } else {
        const routeQuery = this.query
        delete routeQuery.status
        this.$router.push({
          query: routeQuery
        })
      }
    },
    '$route.query': {
      async handler(query) {
        await this.compareStatus(query)
        if (this.accessToFilter) {
          await this.filterItems(query)
        }
      }
    }
  },

  async mounted() {
    await this.getObjectPlans()
      .finally(() => {
        this.planLoading = true
      })
  },

  created() {
    this.getLoading = true
    this.fetchFilterFields()
    this.getApartments()
        .finally(() => {
          this.finishLoading = true
        })
    // await Promise.allSettled([
    //
    // ]).finally(() => {
    //   this.finishLoading = true
    // })
  },


  methods: {
    async fetchFilterFields() {
      const {objectId} = this.$route.params
      await api.objectsV2.fetchObjectFields(objectId)
          .then((response) => {
            this.filterFields = response.data
          }).catch((err) => {
            this.toastedWithErrorCode(err)
          })
    },
    changeTab(name) {
      this.currentTab = name.name
    },
    clearStatus() {
      this.statusFilter = []
    },
    // hideModal() {
    //   console.log('ishladi');
    //
    //   if (this.expressView.toggle) {
    //     console.log('ifni ichi');
    //     this.expressView.toggle = false
    //     this.expressView.item = {}
    //   }
    // },
    // hideExpressModal() {
    //   this.expressView.toggle = false
    //   this.expressView.item = {}
    //   // const accessToClose = openedApartment.uuid === this.expressView.item.uuid
    //   // if (accessToClose) {
    //   //   this.expressView.toggle = false
    //   //   this.expressView.item = {}
    //   // }
    // },
    compareArray(arrayOne, arrayTwo) {
      if (Array.isArray(arrayOne) && Array.isArray(arrayTwo)) {
        const arr1 = arrayOne.slice().sort()
        const arr2 = arrayTwo.slice().sort()
        const equalLength = arr1.length === arr2.length
        const isEqualByValue = arr1.every((value, index) => value === arr2[index])
        return equalLength && isEqualByValue
      }
      return false
    },
    compareStatus(routeQuery) {
      const isNotEqual = routeQuery.status && !this.compareArray(routeQuery.status, this.statusFilter)
      if (isNotEqual) {
        const isPrimitive = isPrimitiveValue(routeQuery.status)
        if (isPrimitive) {
          this.statusFilter = [routeQuery.status]
        } else {
          this.statusFilter = routeQuery.status
        }
      }

      if (routeQuery.status === undefined) {
        this.statusFilter = []
      }
    },
    filterItems(filter) {
      this.apartments = this.apartments.map(mainConstructor => {
        let filterBlocks
        const hasBlocks = filter.hasOwnProperty('blocks')
        if (hasBlocks) {
          filterBlocks = mainConstructor.blocks.map(block => {
            const isActiveBlock = filter.blocks.includes(block.id)
            if (isActiveBlock) {
              return {
                ...block,
                blockActive: true
              }
            }

            return {
              ...block,
              blockActive: false
            }
          })
        } else {
          filterBlocks = mainConstructor.blocks.map(block => {
            return {
              ...block,
              blockActive: true
            }
          })
        }

        filterBlocks = filterBlocks.map(filterBlock => {
          let filterFloors = filterBlock.floors
          const hasFloorsQuery = filter.hasOwnProperty('floors')
          if (hasFloorsQuery) {
            filterFloors = filterFloors.map(floor => {
              const isActiveFloor = filter.floors.includes(floor.name)
              if (isActiveFloor) {
                return {
                  ...floor,
                  floorActive: true
                }
              }

              return {
                ...floor,
                floorActive: false
              }
            })
          } else {
            filterFloors = filterFloors.map(floor => {
              return {
                ...floor,
                floorActive: true
              }
            })
          }

          const notRelatedToApartment = Object.keys(filter).length === 2 && hasFloorsQuery && hasBlocks
          if (!notRelatedToApartment) {
            filterFloors = filterFloors.map((filterFloor) => {
              let floorApartments = filterFloor.apartments
              floorApartments = floorApartments.map(floorApartment => {
                let apartment = floorApartment
                const {price_m2, number, price, plan, rooms, order, is_sold} = apartment
                const filterResult = []
                const filterQueryLength = Object.keys(filter).length > 0
                if (filterQueryLength) {
                  for (let [key, value] of Object.entries(filter)) {
                    if (key === 'price_m2') {
                      const isSatisfy = value === price_m2
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'price_from') {
                      const isSatisfy = value <= price
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'price_to') {
                      const isSatisfy = value >= price
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'area_from') {
                      const isSatisfy = value <= plan.area
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'area_to') {
                      const isSatisfy = value >= plan.area
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'area') {
                      const isSatisfy = value.includes(plan.area)
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'rooms') {
                      const isSatisfy = value.includes(rooms)
                      filterResult.push(isSatisfy)
                      continue
                    }

                    if (key === 'status') {
                      if (value === 'unavailable') {
                        if (is_sold === false) {
                          filterResult.push(true)
                        } else {
                          filterResult.push(false)
                        }
                      } else {
                        const isStatusPrimitive = isPrimitiveValue(value)
                        let values = value
                        if (isStatusPrimitive) {
                          values = [value]
                        }
                        const isSatisfy = values.includes(order.status)
                        filterResult.push(isSatisfy)
                      }
                      continue
                    }

                    if (key === 'numbers') {
                      const isSatisfy = value.includes(number)
                      filterResult.push(isSatisfy)
                    }
                  }

                  let satisfyFilter = true

                  if (filterResult.length) {
                    satisfyFilter = filterResult.reduce((prev, next) => prev && next)
                  }

                  if (satisfyFilter) {
                    return {
                      ...apartment,
                      apartmentActive: true
                    }
                  } else {
                    return {
                      ...apartment,
                      apartmentActive: false
                    }
                  }
                } else {
                  return {
                    ...apartment,
                    apartmentActive: true
                  }
                }
              })

              return {
                name: filterFloor.name,
                apartments: floorApartments,
                floorActive: filterFloor.floorActive
              }
            })
          }

          const {id, name, blockActive} = filterBlock

          return {
            id,
            name,
            blockActive,
            floors: filterFloors,
          }
        })

        return {
          ...mainConstructor,
          blocks: filterBlocks
        }
      })
    },
    async getApartments() {

      const id = this.$route.params.objectId
      await api.objectsV2.getApartments(id).then(async (res) => {
        this.apartments = res.data.data
        if (this.hasQuery) {
          await this.compareStatus(this.query)
          await this.filterItems(this.query)
        }
      }).catch(err => {
        this.toastedWithErrorCode(err)
      }).finally(() => {
        this.getLoading = false
      })
    },
    async getObjectPlans() {

      await api.objectsV2.getObjectPlans(18)
          .then((response) => {
            this.plans = response.data
          }).catch((err) => {
            this.toastedWithErrorCode(err)
          })
          .finally(() => {
            this.planLoading = false
          })
    },
    apartmentExpressReview(item) {
      // const itemNotOpen = item.uuid !== this.expressView.item.uuid
      // if (itemNotOpen) {
      this.expressView.item = item
      this.expressView.toggle = true
      // }
    },
    planExpressReview(item) {
      this.planView.item = item
      this.planView.toggle = true
    },
    hideApartmentSidebarView() {
      this.expressView.toggle = false
    },
    hidePlanSidebarView() {
      this.planView.toggle = false
    },
    updateContent() {
      this.getApartments()
    }
  }
}
</script>

<style lang="scss" scoped>

.object-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

::v-deep .status-sort {
  display: flex;
  column-gap: 30px;
  margin-bottom: 21px;


  .teal {
    color: var(--teal-500);

    .custom-control-label {
      &::before {
        border: 1px solid var(--teal-500);
        background-color: var(--teal-500);
      }
    }
  }

  .yellow {
    color: var(--yellow-500);

    .custom-control-label {
      &::before {
        border: 1px solid var(--yellow-500);
        background-color: var(--yellow-500);
      }
    }
  }

  .blue {
    color: var(--light-blue-500);

    .custom-control-label {
      &::before {
        border: 1px solid var(--light-blue-500);
        background-color: var(--light-blue-500);
      }
    }
  }

  .gray {
    color: var(--gray-600);

    .custom-control-label {
      &::before {
        border: 1px solid var(--gray-600);
        background-color: var(--gray-600);
      }
    }
  }

  .disabled {
    color: var(--gray-400);

    .custom-control-label {
      &::before {
        border: 1px solid var(--gray-400);
        background-color: var(--gray-400);
      }
    }
  }
}


</style>