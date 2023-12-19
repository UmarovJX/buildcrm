<script>
import BaseEditIcon from '@/components/icons/BaseEditIcon'

export default {
  name: 'ObjectCardVue',
  components: {
    BaseEditIcon,
  },
}
</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="card-top">
          <div class="card-top__content">
            <h5 class="card-title">
              Pandora
            </h5>
            <div class="card-button">
              Объект сдан
            </div>
            <div class="card-subtitle">
              Юнусобод тумани, мавзе 4, Ахмад Дониш Кучаси, 61 А уй
            </div>
          </div>
          <div class="card-link">
            <base-edit-icon fill="#7C3AED" />
          </div>
        </div>
        <div class="card-content">
          <div class="card-block">
            <p class="card-block__title">
              80 квартиры
            </p>
            <p class="card-block__subtitle price">
              от 330,000,000 сум
            </p>
          </div>
          <div class="card-block">
            <p class="card-block__title">
              16 этажей
            </p>
            <p class="card-block__subtitle">
              от 3,500,000 сум/м2
            </p>
          </div>
        </div>
      </div>
      <div class="card-img">
        <img
          src="../../assets/img/xonsaroy.jpg"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 1rem;
  max-width: 412px;
  border: none;

  &-body {
    border-radius: 1rem 1rem 0 0;
    padding: 28px;
    background-color: var(--gray-100);
  }

  &-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 2px solid var(--gray-200);
    padding-bottom: 15px;
    margin-bottom: 15px;

    &__content {
    }
  }

  &-title {
    color: var(--violet-600);
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 12px;
  }

  &-subtitle {
    margin: 0;
  }

  &-button {
    width: max-content;
    border-radius: 1rem;
    background-color: var(--white);
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-400);
    margin-bottom: 12px;
    padding: 5px 10px;
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;

    p {
      margin-bottom: 0;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: var(--gray-500);
    }

    .price {
      font-size: 18px;
      line-height: 24px;
      color: var(--violet-600);
    }

    &__title {
    }
  }

  &-img {
    height: 206px;

    img {
      border-radius: 0 0 1rem 1rem;
      max-height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
