<script>
import moment from 'moment'
import XDropdown from '@/components/ui-components/dropdown/XDropdown.vue'

export default {
  name: 'BaseNote',
  components: { XDropdown },
  emits: ['edit-selected-note', 'delete-note'],
  props: {
    detail: {
      type: Object,
      required: true,
    },
    actions: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  computed: {
    getDate() {
      const date = moment(this.detail.date).format('DD')
      const month = moment(this.detail.date).format('MMMM')
      let hour = moment(this.detail.date).format('HH')
      const minute = moment(this.detail.date).format('m')
      hour += `:${minute}, ${date} ${month}`
      return hour
    },
  },
  methods: {
    deleteCompany() {
      console.log('delete')
    },
    editSelectedPayment() {
      console.log('edit')
    },
  },
}
</script>

<template>
  <div class="base-note">
    <div class="base-note-header">
      <p class="m-0 base-note-text">
        {{ detail.text }}
      </p>

      <x-dropdown v-if="actions">
        <slot name="delete" />
        <slot name="edit" />
      </x-dropdown>
    </div>
    <div
      class="d-flex justify-content-between base-note-content align-items-center"
    >
      <div class="d-flex align-items-center base-note-content-author">
        <img
          :src="require(`@/assets/img/${detail.image}`)"
          class="mr-2 base-note-content-author-image"
          alt="avatar"
        >
        <span class="base-note-content-author-info d-flex">
          <p class="m-0 base-note-content-author-info-name">
            {{ detail.author }}
          </p>
          <p class="m-0 dot">·</p>
          <p class="m-0 base-note-content-author-info-role">
            {{ detail.role }}
          </p>
        </span>
      </div>
      <div class="base-note-content-date">
        <p class="m-0">
          {{ getDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-note {
  border: 2px solid #e5e7eb;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 64px 24px 24px;
  gap: 16px;
  &-action {
    cursor: pointer !important;
  }
  &-text {
    font-family: "Inter", serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: #4b5563;
  }
  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .my-dropdown .dropdown-toggle {
      box-shadow: none;
      background: transparent;
    }
    .dropdown-menu {
      cursor: pointer;
    }
  }
  &-content {
    width: 100%;
    &-date {
      width: auto;
    }
    &-author {
      &-info {
        gap: 6px;
        font-weight: 600;
        font-family: "Inter", serif;
        font-size: 14px;
        line-height: 20px;
        &-name {
          color: #7c3aed;
        }
        &-role {
          color: #4b5563;
        }
      }
      .dot {
        color: #9ca3af;
      }
    }
    &-date {
      font-family: "Inter", serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: #9ca3af;
    }
  }
}
.base-note:hover {
  background: #f9fafb;
  cursor: pointer;
}
</style>
