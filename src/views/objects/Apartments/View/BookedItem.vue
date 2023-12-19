<script>
import { XIcon } from '@/components/ui-components/material-icons'
import { XButton } from '@/components/ui-components/button'

export default {
  name: 'BookedItem',
  components: {
    XIcon,
    XButton,
  },
  props: {
    footer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    downloadContract() {
      // download
    },
    cancelBooked() {
      // cancel
    },
    concludeContract() {
      // concludeContract
    },
  },
}
</script>

<template>
  <div class="b-item">
    <h4
      class="b-item__header"
      :class="{ active: false }"
    >
      <template v-if="false">
        Текущее бронирование
      </template>
      <template v-else>
        Следующее бронирование в очереди
      </template>
    </h4>
    <div class="b-item__body">
      <div class="b-item__info">
        <h5>Клиент:</h5>
        <p>Эшматов Тошмат Гишматович</p>
      </div>
      <div class="b-item__info">
        <h5>Менежер продаж:</h5>
        <p>Темурбек Якубов</p>
      </div>
      <div class="b-item__info">
        <h5>Дата:</h5>
        <p>12:00, 13 июль</p>
      </div>
      <div class="b-item__info">
        <h5>Срок действия:</h5>
        <p>12:00, 23 июль</p>
      </div>
    </div>
    <div class="b-item__footer">
      <div class="b-noAccess">
        <x-icon
          name="info"
          size="24"
          color="var(--gray-400)"
        />
        <p>
          Отменить бронь или продолжить оформление может только менежер, который
          забранировал или главный менежер.
        </p>
      </div>
      <div class="b-access__cancel">
        <x-button
          variant="secondary"
          text="Отменить бронь"
          :fixed="true"
          @click="cancelBooked"
        />
      </div>
      <div
        v-if="footer"
        class="b-access__all"
      >
        <x-button
          variant="secondary"
          left-icon="download"
          color-icon="var(--violet-600)"
          text="Скачать договор"
          :fixed="true"
          @click="downloadContract"
        />
        <div class="b-access__all-footer">
          <x-button
            variant="secondary"
            text="Отменить бронь"
            :fixed="true"
            @click="cancelBooked"
          />
          <x-button
            text="Оформить"
            :fixed="true"
            @click="concludeContract"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.b-item {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 2px solid var(--gray-200);
  border-radius: 2rem;

  &__header {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 18px;
    line-height: 22px;
    color: var(--gray-400);
    margin-bottom: 0;

    &.active {
      color: var(--violet-600) !important;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h5,
    p {
      font-family: Inter, sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 0;
    }

    h5 {
      color: var(--gray-400);
    }

    p {
      color: var(--gray-600);
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
}

.b-noAccess {
  display: flex;
  align-items: center;
  column-gap: 12px;
  padding: 1rem;
  background-color: var(--gray-50);
  border-radius: 2rem;

  p {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-600);
    margin-bottom: 0;
  }
}

.b-access__all {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;

  &-footer {
    display: flex;
    column-gap: 1rem;
  }
}
</style>
