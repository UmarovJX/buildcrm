<template>
  <base-circle-wrapper @click="$emit('click',$event)">
    <base-notifications-icon fill="#4B5563"/>
  </base-circle-wrapper>
</template>

<script>
import BaseNotificationsIcon from "@/components/icons/BaseNotificationsIcon";
import BaseCircleWrapper from "@/components/Reusable/BaseCircleWrapper";

export default {
  name: "AppNotificationIcon",
  components: {
    BaseCircleWrapper,
    BaseNotificationsIcon
  },
  emits: ['click']
}
</script>