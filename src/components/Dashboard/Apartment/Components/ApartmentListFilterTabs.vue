<template>
  <div>
    <div class="filter__content">
      <div
          v-for="{name,status} in filterList"
          :key="status"
          @click="getFilteredContent(status)"
          class="filter__content-item"
          :class="[status === currentStatus ? 'filter__content-item-active' : '']"
      >
        <p>{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApartmentListFilterTabs",
  emits: ['get-new-content'],
  created() {
    const {query} = this.$route
    const hasQueryAndStatus = Object.keys(query).length > 0 && query.status
    if (hasQueryAndStatus) {
      this.currentStatus = query.status
    }
  },
  data() {
    return {
      currentStatus: 'all',
      filterList: [
        {
          name: 'Все',
          status: 'all'
        },
        {
          name: 'Доступный',
          status: 'available'
        },
        {
          name: 'Забронирован',
          status: 'booked'
        },
        {
          name: 'Оформлен',
          status: 'sold'
        },
        {
          name: 'Недоступен',
          status: 'unavailable'
        },
        // {
        //   name: 'На Оплате',
        //   status: 'paid'
        // },
        // {
        //   name: 'Закрыт',
        //   status: 'closed'
        // }
      ]
    }
  },
  methods: {
    getFilteredContent(status) {
      this.currentStatus = status
      this.$emit('get-new-content', status)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 16px;
  margin-bottom: 8px;
  color: var(--dark);
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: 0;
    width: 100%;
    height: 6px;
    background: #cccccc;
    //border-top-left-radius: 3px;
    //border-top-right-radius: 3px;
  }

  &-item {
    position: relative;
    transition: all 0.1s ease-in;
    display: flex;
    align-items: center;
    padding: 4px;
    cursor: pointer;

    p {
      margin: 0;
    }

    &-active {
      border-bottom: 6px solid #5851d8;
      border-top-left-radius: 100px;
    }
  }
}
</style>