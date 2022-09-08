<template>
    <div class="base__multiselect">
        <multiselect
            v-model="value"
            :options="options"
            :track-by="trackBy"
            :label="label"
            :multiple="multiple"
            :taggable="taggable"
            :searchable="searchable"
            :placeholder="placeholder"
            class="inline__multiselect"
        />
    </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
    name: "BaseMultiselect",
    components: {
        Multiselect
    },
    props: {
        options: {
            type: Array,
            required: true,
        },
        trackBy: {
            type: String,
            default: 'id'
        },
        label: {
            type: String,
            default: 'name'
        },
        multiple: {
            type: Boolean,
            default: true
        },
        taggable: {
            type: Boolean,
            default: true
        },
        searchable: {
            type: Boolean,
            default: true
        },
        defaultValues: {
            type: Array,
            default: () => ([])
        },
        placeholder: {
            type: String,
            default: 'Select option'
        }
    },
    emits: ['input'],
    data() {
        return {
            value: []
        }
    },
    created() {
        this.initializeValue()
    },
    watch: {
        value() {
            this.inputEventTrigger()
        },
        defaultValues(lastValue) {
            if (!Array.isArray(lastValue)) {
                this.value = []
            }
        }
    },
    methods: {
        initializeValue() {
            const {trackBy} = this
            const isInitialized = Array.isArray(this.defaultValues)
            if (isInitialized) {
                this.value = this.defaultValues.map((defaultValue) => {
                    return this.options.find(option => option[trackBy] === defaultValue)
                })
            }
        },
        inputEventTrigger() {
            this.$emit('input', this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.inline__multiselect:hover {
    ::v-deep {
        .multiselect__tags {
            background: var(--gray-200);
        }

        .multiselect__input {
            background: var(--gray-200);
        }
    }

}

::v-deep {
    .multiselect {
        width: 100%;
        //width: 186px;
    }

    .multiselect__select {
        top: 20%;
        right: 18px;
        //transform: translateY(-50%);
        background: url("../../assets/icons/icon-down.svg") center no-repeat;

        &:before {
            content: '';
            border: none;
            background: url("../../assets/icons/icon-down.svg");
        }
    }

    .multiselect__tags {
        padding: 18px 30px 18px 16px;
        border-radius: 26px;
        border: none;
        background: var(--gray-100);
    }

    .multiselect__placeholder {
        padding: 0;
        margin: 0;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: var(--gray-600);
    }

    .multiselect__tags-wrap {
        display: flex;
        flex-wrap: wrap;

    }

    .multiselect__tag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: 32px;
        border-radius: 16px;
        background: var(--white);
        padding: 4px 8px;
        margin-right: 8px;
        margin-bottom: 8px;
    }

    .multiselect__input {
        background: var(--gray-100);
    }

    .multiselect__tag-icon {
        background: url("../../assets/icons/tag-close.svg");
        position: relative;
        width: 20px;
        height: 20px;
        margin-left: 8px;

        &:after {
            content: '';
        }
    }
}


</style>