<template>
  <div class="output-information d-flex justify-content-between align-items-center">
    <!--  PROPERTY CONTENT  -->
    <slot name="property"/>
    <span
        v-if="!hasPropertySlot"
        class="d-block property"
    >
      {{ localProperty }}
    </span>
    <!--  END OF PROPERTY CONTENT  -->

    <!--  VALUE CONTENT  -->
    <slot name="value"/>
    <span
        v-if="!hasValueSlot"
        class="d-block value"
    >
      <span>{{ value }}</span>
      <span v-if="price"> {{ $t('ye') }}</span>
    </span>
    <!--  END OF VALUE CONTENT  -->
  </div>
</template>

<script>
export default {
  name: "OutputInformation",
  props: {
    property: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    translate: {
      type: Boolean,
      default: false
    },
    price: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localProperty: null
    }
  },
  computed: {
    hasPropertySlot() {
      return !!this.$slots.property
    },
    hasValueSlot() {
      return !!this.$slots.value
    }
  },
  created() {
    this.establishProperty()
  },
  methods: {
    establishProperty() {
      if (this.translate) {
        this.localProperty = this.$t(this.property)
      } else {
        this.localProperty = this.property
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.output-information {
  border: 2px solid var(--gray-200);
  border-radius: 2rem;
  background-color: white;
  padding: 1rem 1.75rem;
  font-family: CraftworkSans, serif;

  .property {
    color: var(--gray-400);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 22px;
  }

  .value {
    font-size: 18px;
    color: var(--gray-600) !important;
    line-height: 22px;
  }
}
</style>