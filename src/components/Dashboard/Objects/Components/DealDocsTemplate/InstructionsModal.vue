<template>
  <b-modal
      ref="instructions-content"
      id="instructions-content"
      :title="$t('instruction')"
      size="lg"
  >
    <div>
      <b-table>

      </b-table>
    </div>
  </b-modal>
</template>

<script>

export default {
  name: "InstructionsModal",
  data() {
    const items = [
        ['${contract_number}','номер договора','01APL22, 02MEG22'],

    ]
    return {
      items
    }
  },
  computed: {
    newName() {
      return this.$t('new_name')
    },
    meaning() {
      return this.$t('meaning')
    },
    example() {
      return this.$t('example_by_2')
    },
    fields() {
      return [this.newName(), this.meaning(), this.example()]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>