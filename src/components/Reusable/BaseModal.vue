<script>
import { PROP_TYPE_ARRAY_OBJECT_STRING } from "@/constants/props";
import { makeProp as p } from "@/util/props";

export default {
  name: "BaseModal",
  emits: ["show", "hide"],
  props: {
    design: {
      type: String,
      default: () => "",
    },
    wrapperClass: p(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    wrapperStyle: p(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    modalClass() {
      return `base__modal ${this.design}`;
    },
  },
  methods: {
    openModal() {
      this.$refs["base-modal"].show();
    },
    closeModal() {
      this.$refs["base-modal"].hide();
    },
    showModal() {
      this.$emit("show");
    },
    hideModal() {
      this.$emit("hide");
    },
  },
};
</script>

<template>
  <b-modal
    ref="base-modal"
    title="Using Component Methods"
    :modal-class="modalClass"
    @show="showModal"
    @hide="hideModal"
    hide-header
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
  >
    <div :class="wrapperClass" :style="wrapperStyle">
      <div>
        <slot name="header" />
      </div>
      <div class="main">
        <slot name="main" />
      </div>
      <div>
        <slot name="footer" />
      </div>
    </div>
  </b-modal>
</template>

<style lang="sass" scoped>
::v-deep .small-modal
    .modal-dialog
        .modal-content
            width: 41rem !important
            height: 30rem !important


::v-deep .auto-height
    .modal-dialog
        //height: 100%
        .modal-content
            width: 41rem !important


::v-deep .base__modal
    overflow-y: auto !important
    background: rgba(156, 163, 175, 0.32)
    backdrop-filter: blur(8px)
    font-family: CraftworkSans, serif
    height: 100%

    .modal-body
        width: 100%

    .modal-dialog
        display: flex
        align-items: center
        justify-content: center
        overflow-y: auto !important
        margin: 50px auto
        //height: 100%
        width: 100%

        .modal-content
            display: flex
            justify-content: center
            align-items: center
            width: auto
            max-width: 90vw
            height: auto
            border-radius: 3.5rem
            padding: 2.5rem


            .main
                display: block
                margin: 3.5rem 0

                input
                    border-radius: .5rem
                    background-color: var(--gray-100)
                    padding: 1rem 1.25rem
                    border: none

                    &::placeholder
                        color: var(--gray-400)

            .title
                font-size: 1.75rem
                line-height: 1.75rem
                display: block
                //margin-left: 1rem
                color: var(--gray-600)
                padding: 0.5rem 0
                font-family: CraftworkSans, serif

::v-deep .base__modal .modal-dialog
    display: flex
    align-items: center
    justify-content: center
    overflow-y: auto
    margin: 50px auto
    width: 100%

::v-deep .large-modal
    .modal-dialog
        .modal-content
            max-width: 77rem !important


::v-deep .payment-modal
    .modal-dialog
        .modal-content
            .main
                input
                    border-radius: 2rem


@media screen and (max-width: 1200px)
    ::v-deep .large-modal
        .modal-dialog
            .modal-content
                max-width: 90vw !important


@media screen and (min-width: 500px)
    ::v-deep .modal-dialog
        max-width: 100%
</style>
