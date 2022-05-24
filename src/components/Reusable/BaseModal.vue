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
    <span>
      <slot name="header"/>
    </span>
    <span class="main">
      <slot name="main"/>
    </span>
    <span>
      <slot name="footer"/>
    </span>
  </b-modal>
</template>

<script>
export default {
  name: "BaseModal",
  emits: ['show', 'hide'],
  props: {
    design: {
      type: String,
      default: () => ('')
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    modalClass() {
      return `base__modal ${this.design}`
    }
  },
  methods: {
    openModal() {
      this.$refs["base-modal"].show()
    },
    closeModal() {
      this.$refs['base-modal'].hide()
    },
    showModal() {
      this.$emit('show')
    },
    hideModal() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="sass" scoped>
::v-deep .small-modal
  .modal-dialog
    .modal-content
      width: 40rem !important
      height: 30rem !important


::v-deep .base__modal
  overflow-y: hidden
  background: rgba(156, 163, 175, 0.32)
  backdrop-filter: blur(8px)
  font-family: CraftworkSans, serif

  .modal-dialog
    display: flex
    align-items: center
    justify-content: center
    overflow-y: hidden
    margin: 0 auto
    height: 100%
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
          border-radius: 2rem
          background-color: var(--gray-100)
          //padding: 1rem 1.25rem
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

::v-deep .large-modal
  .modal-dialog
    .modal-content
      max-width: 70rem !important

@media screen and (max-width: 1200px)
  ::v-deep .large-modal
    .modal-dialog
      .modal-content
        max-width: 90vw !important


@media screen and (min-width: 500px)
  ::v-deep .modal-dialog
    max-width: 100%

</style>