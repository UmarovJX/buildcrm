<template>
  <div>
    <!--  Date Inputs  -->
    <promo-date-interface/>

    <!--  Block Selection  -->
    <div class="col-6 p-0 pr-2 mb-4">
      <label for="selection-block">{{ $t('promo.select_block') }}</label>
      <multiselect
          id="selection-block"
          v-model="form.blocks"
          tag-placeholder="Add this as new tag"
          :placeholder="$t('promo.select_block')"
          label="name"
          track-by="code"
          :options="blockOptions"
          :multiple="true"
          :taggable="true"
      ></multiselect>
    </div>

    <!-- Dropdown Plan   -->
    <p v-if="hasBlocks">{{ $t('promo.select_floor_plan') }}</p>
    <promo-accordion
        v-for="block in form.blocks"
        :key="block.code"
        :block="block"
        @add-extra-content="addExtraContent(block.code)"
    />
  </div>
</template>

<script>
import PromoDateInterface from "@/components/Dashboard/Objects/Components/Promo/PromoDateInterface";
import PromoAccordion from "@/components/Dashboard/Objects/Components/Promo/PromoAccordion";

export default {
  name: 'PromoCreationContent',
  components: {
    PromoDateInterface,
    PromoAccordion
  },
  data() {
    return {
      form: {
        blocks: []
      },
      blockOptions: []
    }
  },
  async created() {
    await this.fetchBlockOptions()
  },
  computed: {
    hasBlocks() {
      return this.form.blocks.length > 0
    }
  },
  methods: {
    fetchBlockOptions() {
      this.blockOptions = [
        {
          name: 'Block A',
          code: 1,
          plans: [
            {
              priceBy: 'Sum',
              priceByValue: 600,
              promoType: "Qavatlar bo'yicha",
              promoBlocks: [
                {index: 1},
                {index: 2},
                {index: 3}
              ]
            },
            {
              priceBy: 'Sum',
              priceByValue: 600,
              promoType: "Qavatlar bo'yicha",
              promoBlocks: [
                {index: 1},
                {index: 2},
                {index: 3}
              ]
            }
          ]
        },
        {
          name: 'Block B',
          code: 2,
          plans: [
            {
              priceBy: 'Dollar ($)',
              priceByValue: 800,
              promoType: "Qavatlar bo'yicha",
              promoBlocks: [
                {index: 1},
                {index: 2},
                {index: 3}
              ]
            }
          ]
        },
        {
          name: 'Block C',
          code: 3,
          plans: [
            {
              priceBy: 'Dollar ($)',
              priceByValue: 800,
              promoType: "Qavatlar bo'yicha",
              promoBlocks: [
                {index: 1},
                {index: 2},
                {index: 3}
              ]
            }
          ]
        },
        {
          name: 'Block D',
          code: 4,
          plans: [
            {
              priceBy: 'Dollar ($)',
              priceByValue: 800,
              promoType: "Qavatlar bo'yicha",
              promoBlocks: [
                {index: 1},
                {index: 2},
                {index: 3}
              ]
            }
          ]
        }
      ]
    },
    addExtraContent(code) {
      const findIndex = this.form.blocks.findIndex(block => block.code === code)

      if (findIndex !== -1) {
        const newContent = {
          priceBy: 'Dollar ($)',
          priceByValue: 0,
          promoType: "Qavatlar bo'yicha",
          promoBlocks: []
        }

        this.form.blocks[findIndex].plans.push(newContent)
      }
    }
  }
}
</script>