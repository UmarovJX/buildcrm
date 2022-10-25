<template>
    <div class="output-information d-flex justify-content-between align-items-center">
        <!--  PROPERTY CONTENT  -->
        <div class="d-flex align-items-center info-row">
            <slot name="left-icon"/>
            <slot name="property"/>
            <span
                v-if="!hasPropertySlot"
                class="d-block property"
            >
        {{ localProperty }}
      </span>
        </div>
        <!--  END OF PROPERTY CONTENT  -->

        <!--  VALUE CONTENT  -->
        <div class="d-flex align-items-center ">
            <slot name="value"/>
            <span
                v-if="!hasValueSlot"
                class="d-flex value align-items-center info-row"
            >
      <span>{{ value }}</span>
      <span v-if="price"> {{ $t('ye') }}</span>
      <slot class="info-row-icon" name="right-icon"/>
    </span>
        </div>
        <!--  END OF VALUE CONTENT  -->
    </div>
</template>

<script>
export default {
    name: "OutputInformation",
    props: {
        property: {
            type: [String, Number],
            required: true
        },
        value: {
            type: [String, Number],
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
    border: 3px solid var(--gray-200);
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

    .info-row {
        gap: 16px;

        &-icon {
            background: #EDE9FE;
            border-radius: 50%;
            padding: 0 5px 3px;
        }

        &-icon:nth-child(2) {
            background: #7C3AED;
            padding: 2px 5px 5px;
        }
    }

    .info-row:first-child {
        gap: 12px;
    }
}
</style>