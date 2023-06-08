<script>
export default {
  name: "BaseValidationBottomWarning",
};
</script>

<template>
  <b-alert variant="danger" class="py-2 mb-0" show>
    <div
      class="alert-body py-0 d-flex w-100 align-items-center justify-content-center"
    >
      <span>
        {{ $t("validation_warning_to_bottom") }}
      </span>
    </div>
  </b-alert>
</template>
