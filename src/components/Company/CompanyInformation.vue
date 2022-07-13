<template>
  <div>
    <div v-if="company && Object.keys(company)" class="info-container">
      <span v-for="([key,value], index) in Object.entries(company)" class="item-block" :key="index">

        <span class="item" v-if="labels[key]">
              <span class="title">
                {{ labels[key] }}
              </span>
              <span class="title-val">
                <p v-if="typeof value === 'object'">
                  {{ checkLocales(value.name) }}
                </p>
                <p v-else>
                  {{ value }}
                </p>
              </span>
        </span>

      </span>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "CompanyInformation",
  components: {},
  emits: ['trigger-input', 'search-by-filter', 'replace-router'],
  props: {
    companyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      company: {},
      labels: {
        type: this.$t("companies.type") + ":",
        inn: this.$t("companies.inn") + ":",
        director: this.$t("companies.director") + ":",
        address: this.$t("companies.address") + ":",
        phone: this.$t("companies.phone") + ":",
        oked: this.$t("companies.oked") + ":",
        code: this.$t("companies.code") + ":",
        extra_phone: this.$t("companies.other_phone") + ":",
        name: this.$t("companies.name") + ":",
      },
    }
  },
  created() {
    api.companies.getCompany(this.companyId)
        .then((response) => {
          console.log("res", response.data)
          this.company = response.data
        })
        .catch((error) => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.loading = false
        })
  },
  methods: {
    checkLocales(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },
  }
}
</script>
<style lang="scss" scoped>
.info-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 150px;
}

.item-block {
  display: flex;
  align-items: center;
  max-width: 300px;
}

.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  color: #4B5563;
  .title {
    display: flex;
    min-width: max-content;
    color: #9CA3AF;
  }
  .title-val{
    p{
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

  }
}
</style>