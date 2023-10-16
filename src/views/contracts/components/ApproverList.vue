<script>
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";

export default {
  name: "ApproverList",
  props: {
    approvers: {
      type: Array,
      required: true,
    },
  },

  components: {
    XCircularBackground,
    XIcon,
  },
};
</script>

<template>
  <div class="approver_list ml-1">
    <div class="list_item" v-for="appr in approvers" :key="appr.id">
      <x-circular-background
        :class="appr.type === 'approved' ? 'bg-green' : 'bg-red-500'"
      >
        <x-icon
          :name="appr.type === 'approved' ? 'check' : 'X'"
          class="color-white"
          size="20"
        />
      </x-circular-background>
      <div class="detail">
        {{ appr.created_by.first_name }} {{ appr.created_by.last_name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.approver_list {
  display: flex;
}
.list_item {
  aspect-ratio: 1/1;
  position: relative;
  z-index: unset;
}
.list_item:not(:first-child) {
  margin-left: -15px;
}

.list_item:hover {
  z-index: 100;
}

.detail {
  border-radius: 10%;
  width: fit-content;
  position: absolute;
  top: 100%;
  display: none;
  background-color: var(--blue-100);
  padding: 0.3rem 2rem;
}
.list_item:hover .detail {
  display: block;
}
</style>
