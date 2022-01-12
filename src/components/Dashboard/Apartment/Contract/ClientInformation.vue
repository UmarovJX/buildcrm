<template>
  <div class="new-object p-0">
    <div v-b-toggle.collapse-info block class="d-flex p-3">
      <span>Информация клиента</span>
      <strong
          v-if="isVisibleInfo"
          aria-hidden="true"
          class="ml-auto"
      >
        <i class="fal fa-chevron-up"></i>
      </strong>
      <strong v-else aria-hidden="true" class="ml-auto">
        <i class="fal fa-chevron-down"></i>
      </strong>
    </div>
    <b-collapse
        id="collapse-info"
        v-model="isVisibleInfo"
        class="px-3 pb-3"
    >
      <table class="table mx-0 mt-2 p-0 my-table-another-variant">
        <tbody class="m-0 p-0">
        <tr>
          <td class="px-0 py-2">Номер паспорта</td>
          <td class="px-0 py-2 text-right">
            {{ client.passport_series }}
          </td>
        </tr>
        <tr>
          <td class="px-0 py-2">Место выдачи паспорта</td>
          <td class="px-0 py-2 text-right">
            {{ client.issued_by_whom }}
          </td>
        </tr>
        <tr>
          <td class="px-0 py-2">Дата выпуска пасспорта</td>
          <td class="px-0 py-2 text-right">
            {{ client.date_of_issue }}
          </td>
        </tr>
        <tr>
          <td class="px-0 py-2">Дата рождения</td>
          <td class="px-0 py-2 text-right">
            {{ client.birth_day }}
          </td>
        </tr>
        <tr>
          <td class="px-0 py-2">ФИО</td>
          <td
              class="px-0 py-2 text-right"
              :title="
                              `${client.last_name.kirill} ${client.first_name.kirill} ${client.second_name.kirill}`
                            "
          >
            {{ client.last_name.lotin }}
            {{ client.first_name.lotin }}
            {{ client.second_name.lotin }}
          </td>
        </tr>
        <tr>
          <td class="px-0 py-2">Телефон номер</td>
          <td class="px-0 py-2 text-right">
            {{ client.phone }}
          </td>
        </tr>
        <tr>
          <td class="px-0 py-2">Дополнительный номер</td>
          <td class="px-0 py-2 text-right">
            {{ client.other_phone }}
          </td>
        </tr>
        </tbody>
      </table>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: "ClientInformation",
  props: {
    client: {}
  },

  data() {
    return {
      isVisibleInfo: false
    }
  }
}
</script>

<style scoped>

</style>