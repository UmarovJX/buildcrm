<script>
export default {
  name: "ClientInformation",
  props: {
    client: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<template>
  <div class="info">
    <div class="info-list">
      <div class="info-item">
        <span class="label">
          {{ $t("apartments.agree.passport_series") }}
        </span>
        <p class="value">
          {{ status.passport_series }}
        </p>
      </div>
      <div class="info-item">
        <span class="label">
          {{ $t("apartments.agree.issued_by_whom") }}
        </span>
        <p class="value">
          {{ status.issued_by_whom }}
        </p>
      </div>
      <div class="info-item">
        <span class="label">
          {{ $t("apartments.agree.date_of_issue") }}
        </span>
        <p class="value">
          {{ status.date_of_issue }}
        </p>
      </div>
      <div class="info-item">
        <span class="label">
          {{ $t("apartments.agree.birth_day") }}
        </span>
        <p class="value">
          {{ status.birth_day }}
        </p>
      </div>
      <div class="info-item">
        <span class="label">
          {{ $t("apartments.agree.fio") }}
        </span>
        <p class="value">
          {{ status.last_name.lotin }}
          {{ status.first_name.lotin }}
          {{ status.second_name.lotin }}
        </p>
      </div>
      <div class="info-item">
        <span class="label">
          {{ $t("apartments.agree.phone") }}
        </span>
        <p class="value">
          {{ status.phone }}
        </p>
      </div>
      <div v-if="client.other_phone.length > 5" class="info-item">
        <span class="label">
          {{ $t("apartments.agree.other_phone") }}
        </span>
        <p class="value">
          {{ status.other_phone }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  margin-bottom: 2rem;

  &-list {
    display: flex;
    flex-wrap: wrap;
    row-gap: 1.5rem;
    column-gap: 2rem;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    flex: calc(50% - 2rem);
    max-width: calc(50% - 1rem);

    .label {
      color: var(--gray-400);
      margin-right: 1rem;
    }

    .value {
      margin: 0;
      color: var(--gray-600);
    }
  }
}
</style>
