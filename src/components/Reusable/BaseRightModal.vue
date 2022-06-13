<template>
  <div>
    <b-modal
        ref="base-modal"
        title="Using Component Methods"
        modal-class="filter__modal"
        id="base-modal"
        @show="filterModalOpened"
        @hidden="hideFilterModal"
        hide-header
        hide-footer
    >
      <div class="modal__content">
        <!--   Go Back     -->
        <span class="d-flex align-items-center">
          <span class="go__back" @click="hideFilterModal">
            <base-arrow-left-icon :width="32" :height="32"></base-arrow-left-icon>
          </span>
          <!--    Title      -->
          <slot name="modal-title"/>
          <span v-if="!hasModalTitleSlot" class="title">
            {{ $t(title) }}
          </span>
        </span>

        <div class="modal__content-main">
          <!--    MAIN CONTENT     -->
          <slot/>

          <!--  Modal Footer    -->
          <slot name="modal-footer"/>
          <div v-if="!hasFooterModal" class="modal__footer">
            <button @click="clearFilter" class="clear__button">{{ $t('contracts.reset_filter') }}</button>
            <button @click="searchByFilterField" class="search__button">{{ $t('contracts.apply_filter') }}</button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";

export default {
  name: "BaseRightModal",
  components: {
    BaseArrowLeftIcon
  },
  props: {
    title: {
      type: String,
      default: 'contracts.filter_title'
    }
  },
  emits: ['show', 'reset-fields', 'start-filtering'],
  computed: {
    hasModalTitleSlot() {
      return !!this.$slots['modal-title']
    },
    hasFooterModal() {
      return !!this.$slots['modal-footer']
    }
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .filter__modal {
  overflow-y: hidden;
  background: rgba(156, 163, 175, 0.32);
  backdrop-filter: blur(16px);

  .modal-dialog {
    position: absolute;
    right: 0;
    top: 0;
    height: 100vh;
    overflow-y: hidden;
    margin: 0;
    border-radius: 3.5rem 0 0 3.5rem;
    min-width: 40rem;


    .modal-content {
      height: 100%;
      overflow-y: hidden;
    }
  }

  .modal__content {
    padding: 3rem;
    font-family: CraftworkSans, serif;
    font-weight: 900;
    height: 100%;
    overflow-y: auto;
    position: relative;

    &-main {
      position: relative;
      height: 100%;
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
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;

  .clear__button {
    border: none;
    outline: none;
    color: var(--gray-600);
    padding: 1rem 4rem;
    font-size: 1.2rem;
    border-radius: 2rem;
    background-color: var(--gray-100);
  }

  .search__button {
    border: none;
    outline: none;
    color: #FFFFFF;
    font-size: 1.2rem;
    padding: 1rem 4rem;
    border-radius: 2rem;
    background-color: var(--violet-600);
  }
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
}
</style>