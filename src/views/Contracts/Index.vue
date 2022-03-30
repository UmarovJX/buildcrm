<template>
  <main class="main__content">
    <!--  Tabs  -->
    <base-filter-tabs-content
        :filter-tab-list="filterTabList"
        @get-new-content="fetchContentByStatus"
    />
    <!--  Search Content  -->
    <search-bar-content/>
  </main>
</template>

<script>
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import SearchBarContent from "@/components/Contracts/SearchBarContent";
// import api from "@/services/api";

export default {
  name: "Contracts",
  components: {
    BaseFilterTabsContent,
    SearchBarContent
  },
  data() {
    const filterTabList = [
      {
        name: this.$t('tab_status.all'),
        status: 0,
        counts: 900
      },
      {
        name: this.$t('tab_status.booked'),
        status: 1,
        counts: 50
      },
      {
        name: this.$t('tab_status.sold'),
        status: 2,
        counts: 60
      },
      {
        name: this.$t('tab_status.on_payment'),
        status: 3,
        counts: 700
      },
      {
        name: this.$t('tab_status.closed'),
        status: 4,
        counts: 90
      }
    ]

    return {
      filterTabList
    }
  },
  methods: {
    fetchContentByStatus() {

    }
  }
}
</script>

<style lang="scss" scoped>
.main__content {
  background-color: #ffffff;
}
</style>