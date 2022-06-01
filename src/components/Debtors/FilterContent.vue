<template>
  <div>
    <div class="d-flex align-items-center flex-wrap">
      <base-search-input class="base-search-input mr-2 mb-4" :placeholder="`${ $t('contract_number_or_full_name') }`"/>
      <base-filter-button class="mr-2 base-filter-button mb-4" @click="openFilterContent"/>
      <bootstrap-select
          class="mb-4 client-type"
          :options="listOptions"
          @select="(newValue) => filter.client_type = newValue"
      />
    </div>
    <!--  FILTER MODAL  -->
    <base-right-modal ref="filter-modal">
      <div class="filter-modal-content">
        <base-date-picker
            icon-fill="#7C3AED"
            :placeholder="`${ $t('date') }`"
            @input="filter.date = $event"
            class="mb-4"
        />
        <input-price-from-to
            @input="filter.price = $event"
            class="mb-4"
        />
        <bootstrap-select
            :options="listOptions"
            @select="(newValue) => filter.client_type = newValue"
        />
      </div>
    </base-right-modal>
    <!--  DEBTOR VIEW MODAL  -->
    <base-right-modal
        ref="debtor-view"
    >
      <template #modal-title>
        <span class="pl-3 modal-title">
          {{ $t('payments.contract') }}
          <span class="color-violet-600">56APL29C</span>
        </span>
      </template>

      <div class="contract-details">
        <p class="contract-details-title">{{ $t('contract_details') }}</p>
        <!--  CLIENT INFORMATION      -->
        <output-information
            :property="`${ $t('client') }`"
            value="Ботир Эркинов"
            class="mt-4 mb-4"
        />
        <!--    PHONE NUMBER    -->
        <output-information
            :property="`${ $t('phone') }`"
            value="+998 99 777 66 55"
            class="mt-4 mb-4"
        />
        <!--   CLIENT TYPE     -->
        <output-information
            :property="`${ $t('client_type') }`"
            value="Знакомый"
            class="mt-4 mb-4"
        />
        <!--   CONTRACT PRICE     -->
        <output-information
            :price="true"
            :property="`${ $t('contract_price') }`"
            value="900 000 000"
            class="mt-4 mb-4"
        />
        <!--   INITIAL PRICE     -->
        <output-information
            :price="true"
            :property="`${ $t('payments.initial_fee') }`"
            value="700 000 000"
            class="mt-4 mb-4"
        />
        <!--   INSTALLMENT PRICE    -->
        <output-information
            :price="true"
            :property="`${ $t('payments.installment') } ( 12 ${ $t('month') })`"
            value="200 000 000"
            class="mt-4 mb-4"
        />
      </div>

      <!--    DEBT DETAILS    -->
      <div class="contract-details">
        <!--    TITLE    -->
        <p class="contract-details-title">{{ $t('debt_details') }}</p>
        <!--   DEBT PRICE    -->
        <output-information
            :price="true"
            :property="`${ $t('debt') }`"
            value="200 000 000"
            class="mt-4 mb-4"
        />
        <!--   DEBT DATE    -->
        <output-information
            :price="true"
            :property="`${ $t('date') }`"
            value="05.05.2021"
            class="mt-4 mb-4"
        />
      </div>

      <template #modal-footer>
        <router-link class="d-flex align-items-center justify-content-center go-to-contract" :to="{ name:'home' }">
          {{ $t('go_to_contract') }}
        </router-link>
      </template>
    </base-right-modal>
  </div>
</template>

<script>
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseFilterButton from "@/components/Elements/BaseFilterButton";
import BaseRightModal from "@/components/Reusable/BaseRightModal";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import InputPriceFromTo from "@/components/Elements/Inputs/InputPriceFromTo";
import BootstrapSelect from "@/components/Elements/Selects/BootstrapSelect";
import OutputInformation from "@/components/Elements/outputs/OutputInformation";

export default {
  name: "FilterContent",
  components: {
    BaseSearchInput,
    BaseFilterButton,
    BaseRightModal,
    BaseDatePicker,
    InputPriceFromTo,
    BootstrapSelect,
    OutputInformation
  },
  data() {
    return {
      listOptions: [
        {
          text: this.$t('contracts.client_type'),
          value: null
        },
        {
          text: 'Komron',
          value: 1,
        },
        {
          text: 'Jahongir',
          value: 2
        }
      ],
      filter: {
        date: null,
        price: {
          from: null,
          to: null
        },
        client_type: null
      }
    }
  },
  methods: {
    openFilterContent() {
      this.$refs['filter-modal'].show()
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  max-width: 16rem;
}

.base-search-input {
  width: 60%;
  max-width: 85rem;
  min-width: 32rem;
}

.filter-modal-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.client-type {
  max-width: 15rem;
  width: auto;
}

.modal-title {
  font-size: 1.5rem;
  color: var(--gray-600);
  font-family: CraftworkSans, serif;
}

.contract-details {
  margin-top: 3.5rem;

  &-title {
    font-size: 1.5rem;
    color: var(--gray-400);
    font-family: CraftworkSans, serif;
  }
}

.go-to-contract {
  width: 100%;
  border-radius: 2rem;
  background-color: var(--gray-100);
  color: var(--gray-600);
  padding: 1rem 0;
}
</style>