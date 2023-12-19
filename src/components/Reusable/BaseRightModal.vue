<script>
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseButton from '@/components/Reusable/BaseButton'

export default {
  name: 'BaseRightModal',
  components: {
    BaseButton,
    BaseArrowLeftIcon,
  },
  props: {
    title: {
      type: String,
      default: 'contracts.filter_title',
    },
  },
  emits: ['show', 'reset-fields', 'start-filtering'],
  computed: {
    hasModalTitleSlot() {
      return !!this.$slots['modal-title']
    },
    hasFooterModal() {
      return !!this.$slots['modal-footer']
    },
  },
  methods: {
    show() {
      this.$refs['base-modal'].show()
    },
    hide() {
      this.$refs['base-modal'].hide()
    },
    clearFilter() {
      this.$emit('reset-fields')
      this.$refs['base-modal'].hide()
    },
    searchByFilterField() {
      this.$emit('start-filtering')
      this.hide()
    },
    filterModalOpened() {
      this.$emit('show')
    },
    hideFilterModal() {
      this.hide()
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="base-modal"
      ref="base-modal"
      title="Using Component Methods"
      modal-class="filter__modal"
      hide-header
      hide-footer
      @show="filterModalOpened"
      @hidden="hideFilterModal"
    >
      <div class="modal__content">
        <!--   Go Back     -->
        <span class="d-flex align-items-center">
          <span
            class="go__back"
            @click="hideFilterModal"
          >
            <base-arrow-left-icon
              :width="32"
              :height="32"
            />
          </span>
          <!--    Title      -->
          <slot name="modal-title" />
          <span
            v-if="!hasModalTitleSlot"
            class="title"
          >
            {{ $t(title) }}
          </span>
        </span>

        <div class="modal__content-main">
          <!--    MAIN CONTENT     -->
          <slot />

          <!--  Modal Footer    -->
          <slot name="modal-footer" />
          <div
            v-if="!hasFooterModal"
            class="modal__footer"
          >
            <base-button
              :fixed="true"
              design="transparent"
              :text="$t('contracts.reset_filter')"
              @click="clearFilter"
            />
            <base-button
              design="violet-gradient"
              :fixed="true"
              :text="$t('contracts.apply_filter')"
              @click="searchByFilterField"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .filter__modal {
  overflow-y: hidden;
  background: rgba(156, 163, 175, 0.32);
  backdrop-filter: blur(16px);

  .modal-dialog {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    overflow-y: hidden;
    margin: 0;
    border-radius: 3.5rem 0 0 3.5rem;
    min-width: 40rem;

    .modal-content {
      height: 100%;
      overflow-y: auto;
    }
  }

  .modal__content {
    padding: 3rem;
    font-family: CraftworkSans, serif;
    font-weight: 900;
    height: 100%;
    //overflow-y: auto;
    position: relative;

    &-main {
      position: relative;
      height: 96%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .title {
      font-size: 1.75rem;
      line-height: 1.75rem;
      display: block;
      margin-left: 1.5rem;
      color: var(--gray-600);
      padding: 0.5rem 0;
    }

    .filter__inputs {
      margin-top: 2rem;

      .input__date.mx-datepicker.mx-datepicker-range {
        width: 60% !important;
      }

      &-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 20rem;
        min-height: 4rem;
        background-color: var(--gray-100);
        border-radius: 2rem;
        padding: 1rem 1.25rem;
        margin-top: 1.5rem;
        width: 100%;
        border: none;
        color: var(--gray-600);
        position: relative;

        ::placeholder {
          color: var(--gray-600);
          opacity: 1;
        }

        .placeholder {
          color: var(--gray-600);
          //padding-left: 1rem;
        }

        .input__date {
          margin-left: 0.5rem;
          background-color: transparent;
          border: none;
        }

        .inline {
          background-color: transparent;
          border: none;
          color: var(--gray-600);
          padding: 0;

          .disabled__option {
            color: var(--gray-100) !important;
          }
        }
      }
    }
  }
}

.modal__footer {
  display: flex;
  width: 100%;
  column-gap: 1rem;
}

.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-200);
  }
}
</style>
