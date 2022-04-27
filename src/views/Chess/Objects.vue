<template>
  <main class="app-content">

    <ObjectSort @current-tab="changeTab"/>

    <b-form-checkbox-group
        id="checkbox-sort"
        class="status-sort"
        v-model="filter"
        name="sort"
    >
      <b-form-checkbox
          v-for="object in sort"
          :key="object.label"
          :value="object.label"
          :class="object.class"
      >
        {{ object.label }}
      </b-form-checkbox>
    </b-form-checkbox-group>

    <component v-if="apartments" :is="currentTab" :apartments="apartments"
               @show-express-sidebar="apartmentExpressReview"/>

    <!-- APARTMENT QUICK VIEW   -->
    <apartment-express-view
        :visible="expressView.toggle"
        @hide-apartment-sidebar-view="hideApartmentSidebarView"
    />

    <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 2222">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>

  </main>
</template>

<script>

// import ObjectCard from "@/components/Objects/ObjectCard";
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/View/Tabs/ObjectBlock";
import ApartmentExpressView from "@/components/Objects/View/elements/ApartmentExpressView";
import api from "@/services/api";
import ChessSquareCard from "@/components/Objects/View/Tabs/ChessSquareCard";
import ObjectTable from "@/components/Objects/ObjectTable";
import ObjectPlan from "@/components/Objects/View/Tabs/ObjectPlan";

export default {
  name: "Objects",
  components: {
    ChessSquareCard,
    ObjectTable,
    // ObjectCard,
    ObjectSort,
    ObjectBlock,
    ObjectPlan,
    ApartmentExpressView
  },
  data() {
    return {
      expressView: {
        toggle: false,
        item: {}
      },
      getLoading: false,
      apartments: [],
      currentTab: 'ObjectTable',
      sort: [
        {
          label: 'Свободно',
          class: 'teal',
        },
        {
          label: 'Заброниравано',
          class: 'yellow',
        },
        {
          label: 'Оформлено',
          class: 'blue',
        },
        {
          label: 'Продано',
          class: 'gray',
        },
        {
          label: 'Недоступно',
          class: 'disabled',
        },
      ],
      filter: [],
    }
  },
  async mounted() {
    await this.getApartments()
  },
  methods: {
    changeTab(name) {
      this.currentTab = name.name
    },
    async getApartments() {
      this.getLoading = true

      const id = this.$route.params.objectId
      await api.objectsV2.getApartments(id).then((res) => {
        this.apartments = res.data.data
      }).catch(err => {
        this.toastedWithErrorCode(err)
      }).finally(() => {
        this.getLoading = false
      })
    },
    apartmentExpressReview(item) {
      this.expressView.item = item
      this.expressView.toggle = true
    },
    hideApartmentSidebarView() {
      this.expressView.item = {}
      this.expressView.toggle = false
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