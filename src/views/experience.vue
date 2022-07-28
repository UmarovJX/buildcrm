<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
    <div>
      <label class="typo__label">Single select</label>
      <multiselect
          @input="inputMultiSelect"
          @remove="removeSelectOption"
          v-model="showByValue"
          :options="showByOptions"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          placeholder="Pick a value"
          track-by="value"
          label="text"
      >
      </multiselect>
    </div>
  </div>
</template>

<script>
// import BaseDownIcon from "@/components/icons/BaseDownIcon";

export default {
  name: "experience.vue",
  components: {
    // BaseDownIcon
  },
  data() {
    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    return {
      showByOptions,
      showByValue: {
        value: showByOptions[0].value,
        text: 'Показать по: ' + showByOptions[0].text
      }
    }
  },
  methods: {
    inputMultiSelect(option) {
      // console.log(this.showByOptions)
      if(option){
        this.showByValue = {
          value: option.value,
          text: 'Показать по:  ' + option.text ?? this.showByOptions[0].text
        }
      }
    },
    removeSelectOption(removedOption, id) {
      console.log(removedOption, id)
    }
  }
}
</script>

<style lang="scss" scoped>
.show__by {
  width: 100%;
  display: flex;
  justify-content: center;

  &__content {
    display: flex;
    align-items: center;
    border-radius: 2rem;
    background-color: var(--gray-100);
    padding: .75rem 1.5rem;
    width: auto;
    position: relative;

    .custom-select {
      width: auto;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 600;
      color: var(--gray-600);
    }

    .description {
      color: var(--gray-400);
    }

    .arrow__down {
      position: absolute;
      right: 1.75rem;
    }
  }
}
</style>