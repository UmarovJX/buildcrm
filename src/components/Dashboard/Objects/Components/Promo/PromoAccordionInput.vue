<template>
  <div class="d-flex flex-column flex-xl-row justify-content-lg-between mb-4">
    <!--    FIRST SECTION      -->
    <div class="plan__group col-12 col-xl-4 p-0 mb-4 mb-xl-0">
      <label for="select-price-group">
        {{ $t('promo.select_price') }}
      </label>
      <b-input-group
          class="input__group"
          id="select-price-group"
      >
        <template #prepend>
          <div class="multiselect__parent multiselect__parent__border">
            <div class="select_wrapper">
              <multiselect
                  v-model="form.priceBy"
                  :options="options"
                  :searchable="false"
                  :show-labels="false"
              ></multiselect>
            </div>
          </div>
        </template>

        <input
            v-model="form.priceByValue"
            class="plan__group-input"
            v-mask="'### ### ### ### ### ### ###'"
        />
      </b-input-group>
    </div>

    <!--    SECOND SECTION      -->
    <div class="plan__group col-12 p-0 col-xl-7">
      <label for="select-type-promo">
        {{ $t('promo.select_type') }}
      </label>
      <div
          class="row select__type__promo m-0"
          id="select-type-promo"
      >
        <div class="col-4 multiselect__parent multiselect__parent__border">
          <multiselect
              v-model="form.promoType"
              :options="options"
              :searchable="false"
              :show-labels="false"
              :placeholder="$t('promo.select_by_floor')"
          ></multiselect>
        </div>
        <div class="col-8 multiselect__parent">
          <multiselect
              id="selection-block"
              v-model="form.promoBlocks"
              tag-placeholder="Add this as new tag"
              :placeholder="$t('promo.select_block')"
              label="index"
              track-by="index"
              :options="plan.promoBlocks"
              :multiple="true"
              :searchable="false"
          ></multiselect>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PriceAndTypeSelectionContent",
  props: {
    plan: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      form: {
        priceBy: 'Sum',
        priceByValue: 0,
        promoType: "Qavatlar bo'yicha",
        promoBlocks: []
      },
      options: ['Vue.js', 'Rails', 'Sinatra', 'Laravel', 'Phoenix'],
    }
  }
}
</script>

<style lang="scss" scoped>
.plan__group {
  width: auto;

  .input__group {
    border: 1px solid rgb(206, 212, 218);
    border-radius: 0.25rem;
    margin: 0;
    padding: 0;
  }


  &-input {
    max-width: 16rem;
    border: none;
    padding-left: 0.5rem;
  }
}

.select__type__promo {
  border: 1px solid rgb(206, 212, 218);
  border-radius: 0.25rem;
}

.select_wrapper {
  padding: 0.1rem;
  border-right: 1px solid rgb(206, 212, 218);
}
</style>