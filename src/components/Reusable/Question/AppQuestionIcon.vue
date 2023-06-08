<script>
import BaseCircleWrapper from "@/components/Reusable/BaseCircleWrapper";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";

export default {
  name: "AppQuestionIcon",
  components: {
    BaseCircleWrapper,
    BaseQuestionsIcon,
  },
  emits: ["emit"],
};
</script>

<template>
  <base-circle-wrapper @click="$emit('emit', $event)">
    <base-questions-icon fill="#4B5563" />
  </base-circle-wrapper>
</template>
