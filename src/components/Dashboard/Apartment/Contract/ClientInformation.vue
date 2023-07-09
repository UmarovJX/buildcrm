<script>
export default {
  name: "ClientInformation",
  props: {
    client: {},
  },

  data() {
    return {
      isVisibleInfo: false,
    };
  },
};
</script>

<template>
  <div class="new-object p-0">
    <div v-b-toggle.collapse-info block class="d-flex p-3">
      <span>{{ $t("client_info") }}</span>
      <strong v-if="isVisibleInfo" aria-hidden="true" class="ml-auto">
        <i class="fal fa-chevron-up"></i>
      </strong>
      <strong v-else aria-hidden="true" class="ml-auto">
        <i class="fal fa-chevron-down"></i>
      </strong>
    </div>
    <b-collapse id="collapse-info" v-model="isVisibleInfo" class="px-3 pb-3">
      <table class="table mx-0 mt-2 p-0 my-table-another-variant">
        <tbody class="m-0 p-0">
          <tr>
            <td class="px-0 py-2">
              {{ $t("apartments.agree.passport_series") }}
            </td>
            <td class="px-0 py-2 text-right">
              {{ status.passport_series }}
            </td>
          </tr>
          <tr>
            <td class="px-0 py-2">
              {{ $t("apartments.agree.issued_by_whom") }}
            </td>
            <td class="px-0 py-2 text-right">
              {{ status.issued_by_whom }}
            </td>
          </tr>
          <tr>
            <td class="px-0 py-2">
              {{ $t("apartments.agree.date_of_issue") }}
            </td>
            <td class="px-0 py-2 text-right">
              {{ status.date_of_issue }}
            </td>
          </tr>
          <tr>
            <td class="px-0 py-2">{{ $t("apartments.agree.birth_day") }}</td>
            <td class="px-0 py-2 text-right">
              {{ status.birth_day }}
            </td>
          </tr>
          <tr>
            <td class="px-0 py-2">{{ $t("apartments.agree.fio") }}</td>
            <td
              class="px-0 py-2 text-right"
              :title="`${client.last_name.kirill} ${client.first_name.kirill} ${client.second_name.kirill}`"
            >
              {{ status.last_name.lotin }}
              {{ status.first_name.lotin }}
              {{ status.second_name.lotin }}
            </td>
          </tr>
          <tr>
            <td class="px-0 py-2">{{ $t("apartments.agree.phone") }}</td>
            <td class="px-0 py-2 text-right">
              {{ status.phone }}
            </td>
          </tr>
          <tr>
            <td class="px-0 py-2">{{ $t("apartments.agree.other_phone") }}</td>
            <td class="px-0 py-2 text-right">
              {{ status.other_phone }}
            </td>
          </tr>
        </tbody>
      </table>
    </b-collapse>
  </div>
</template>

<style scoped></style>
