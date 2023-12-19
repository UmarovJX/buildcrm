<script>
export default {
  name: 'ApartmentBox',
  props: {
    apartment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statusList: {
        booked: {
          text: 'apartments.status.booked',
          class: 'apartment-box-booked',
        },
        sold: {
          text: 'apartments.status.sold',
          class: 'apartment-box-sold',
        },
        decorated: {
          text: 'apartments.status.decorated',
          class: 'apartment-box-decorated',
        },
        not_available: {
          text: 'apartments.status.not_available',
          class: 'apartment-box-not-available',
        },
      },
      clicked: false,
    }
  },
}
</script>

<template>
  <div
    :class="[clicked ? 'bg-clicked' : 'apartment-box']"
    @click="() => (this.clicked = !this.clicked)"
  >
    <div
      :class="
        statusList[apartment.status]
          ? `${statusList[apartment.status].class} p-12`
          : 'p-12'
      "
    >
      <div
        class="d-flex justify-content-between align-items-center apartment-box-header"
      >
        <p>Кв. №{{ apartment.number }}</p>
        <img
          v-if="apartment.is_promo"
          src="../../../../assets/icons/bonuses.svg"
          alt=""
        >
      </div>
      <p
        v-if="statusList[apartment.status]"
        class="apartment-box-content"
      >
        {{ $t(statusList[apartment.status].text) }}
      </p>
      <p
        v-else
        class="apartment-box-content"
      >
        {{ apartment.cost }}
      </p>
      <div class="d-flex apartment-box-footer">
        <p>{{ apartment.surface }} M<sup>2</sup></p>
        <p>{{ apartment.cost_m2 }} сум/M<sup>2</sup></p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
p {
  margin: 0;
}
.p-12 {
  padding: 12px;
}
.apartment-box {
  width: 264px;
  background: #0d9488;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
  color: white;
  font-family: "Inter", serif;
  &-header {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }
  &-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
  }
  &-footer {
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    width: 100%;
  }
  &-sold {
    background: #dc2626;
    color: white;
  }
  &-sold:hover {
    background: #f9fafb;
    .apartment-box-content {
      color: #dc2626 !important;
    }
    .apartment-box-footer {
      color: #9ca3af !important;
    }
  }
  &-decorated {
    background: #0284c7;
  }
  &-decorated:hover {
    background: #f9fafb;
    .apartment-box-content {
      color: #0284c7 !important;
    }
    .apartment-box-footer {
      color: #9ca3af !important;
    }
  }
  &-booked {
    background: #ca8a04;
  }
  &-booked:hover {
    background: #f9fafb;
    .apartment-box-content {
      color: #ca8a04 !important;
    }
  }
  &-not-available {
    background: #f9fafb;
    color: #6b7280;
    .apartment-box-content,
    .apartment-box-footer {
      color: #9ca3af;
    }
  }
  &-not-available:hover {
    color: #6b7280 !important;
    .apartment-box-content,
    .apartment-box-footer {
      color: #9ca3af !important;
    }
  }
}
.apartment-box:hover {
  background: #f9fafb;
  .apartment-box-header {
    color: #6b7280;
  }
  .apartment-box-content {
    color: #0d9488;
  }
  .apartment-box-footer {
    color: #4b5563;
  }
}

.bg-clicked {
  width: 264px;
  background: #f3f4f6 !important;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
  color: #6b7280;
  font-family: "Inter", serif;
  .apartment-box-header {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }
  .apartment-box-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: #0d9488;
  }
  .apartment-box-footer {
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    width: 100%;
  }
  .apartment-box-sold {
    background: transparent;
    color: #6b7280 !important;
    .apartment-box-content {
      color: #dc2626 !important;
    }
    .apartment-box-footer {
      color: #9ca3af !important;
    }
  }
  .apartment-box-decorated {
    background: transparent;
    .apartment-box-content {
      color: #0284c7 !important;
    }
    .apartment-box-footer {
      color: #9ca3af !important;
    }
  }
  .apartment-box-booked {
    background: transparent;
    .apartment-box-content {
      color: #ca8a04 !important;
    }
  }
  .apartment-box-not-available {
    background: #f9fafb;
    color: #6b7280;
    .apartment-box-content,
    .apartment-box-footer {
      color: #9ca3af;
    }
  }
  &-not-available:hover {
    color: #6b7280 !important;
    .apartment-box-content,
    .apartment-box-footer {
      color: #9ca3af !important;
    }
  }
}
</style>
