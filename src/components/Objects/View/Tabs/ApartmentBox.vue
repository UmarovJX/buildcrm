<template>
  <div @click="() => this.clicked=!this.clicked" :class="[clicked?'bg-clicked':'apartment-box']">
    <div :class="statusList[apartment.status] ? `${statusList[apartment.status].class} p-12` : 'p-12'">
      <div class="d-flex justify-content-between align-items-center apartment-box-header">
          <p>
            Кв. №{{ apartment.number }}
          </p>
          <img v-if="apartment.is_promo" src="../../../../assets/icons/bonuses.svg" alt="">
        </div>
        <p v-if="statusList[apartment.status]" class="apartment-box-content">{{ $t(statusList[apartment.status].text) }}</p>
        <p v-else class="apartment-box-content">{{ apartment.cost }}</p>
        <div class="d-flex apartment-box-footer">
          <p>{{ apartment.surface }} M<sup>2</sup></p>
          <p>{{ apartment.cost_m2 }} сум/M<sup>2</sup></p>
        </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "ApartmentBox",
  props: {
    apartment: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      statusList:{
        booked: {
          text: 'apartments.status.booked',
          class: 'apartment-box-booked'
        },
        sold: {
          text: 'apartments.status.sold',
          class: 'apartment-box-sold'
        },
        decorated: {
          text: 'apartments.status.decorated',
          class: 'apartment-box-decorated'
        },
        not_available: {
          text: 'apartments.status.not_available',
          class: 'apartment-box-not-available'
        }
      },
      clicked: false
    }
  },
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.p-12 {
  padding: 12px;
}
.apartment-box {
  width: 264px;
  background: #0D9488;
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
    background: #DC2626;
    color: white;
  }
  &-sold:hover {
    background: #F9FAFB;
    .apartment-box-content {
      color: #DC2626!important;
    }
    .apartment-box-footer {
      color: #9CA3AF!important;
    }
  }
  &-decorated {
    background: #0284C7;
  }
  &-decorated:hover {
    background: #F9FAFB;
    .apartment-box-content {
      color: #0284C7!important;
    }
    .apartment-box-footer {
      color: #9CA3AF!important;
    }
  }
  &-booked {
    background: #CA8A04;
  }
  &-booked:hover {
    background: #F9FAFB;
    .apartment-box-content {
      color: #CA8A04!important;
    }
  }
  &-not-available {
    background: #F9FAFB;
    color: #6B7280;
    .apartment-box-content,
    .apartment-box-footer{
      color: #9CA3AF;
    }
  }
  &-not-available:hover {
    color: #6B7280!important;
    .apartment-box-content,
    .apartment-box-footer{
      color: #9CA3AF!important;
    }
  }
}
.apartment-box:hover {
  background: #F9FAFB;
  .apartment-box-header {
    color: #6B7280;
  }
  .apartment-box-content {
    color: #0D9488;
  }
  .apartment-box-footer {
    color: #4B5563;
  }
}

.bg-clicked {
  width: 264px;
  background: #F3F4F6!important;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
  color: #6B7280;
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
    color: #0D9488
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
    color: #6B7280 !important;
    .apartment-box-content {
      color: #DC2626 !important;
    }
    .apartment-box-footer {
      color: #9CA3AF !important;
    }
  }
  .apartment-box-decorated {
    background: transparent;
    .apartment-box-content {
      color: #0284C7!important;
    }
    .apartment-box-footer {
      color: #9CA3AF!important;
    }
  }
  .apartment-box-booked{
    background: transparent;
    .apartment-box-content {
      color: #CA8A04!important;
    }
  }
  .apartment-box-not-available {
    background: #F9FAFB;
    color: #6B7280;
    .apartment-box-content,
    .apartment-box-footer{
      color: #9CA3AF;
    }
  }
  &-not-available:hover {
    color: #6B7280!important;
    .apartment-box-content,
    .apartment-box-footer{
      color: #9CA3AF!important;
    }
  }
}

</style>