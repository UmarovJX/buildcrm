<template>
  <div>
    <div v-if="company && Object.keys(company)" class="info-container">
      <span v-for="([key,value], index) in Object.entries(company)" class="item-block" :key="index">

        <span class="item" v-if="labels[key]">
              <span class="title">
                {{ $t(labels[key]) }}
              </span>
              <span class="title-val">
                <span v-if="typeof value === 'object'">
                  {{ checkLocales(value.name) }}
                </span>
                <span v-else>
                  {{ value }}
                </span>
              </span>
        </span>

      </span>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import {phonePrettier} from "@/util/reusable";

export default {
  name: "CompanyInformation",
  emits: ['trigger-input', 'search-by-filter', 'replace-router'],
  props: {
    companyId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      company: {},
      labels: {
        type: "companies.type",
        inn: "companies.inn",
        director: "companies.director",
        address: "companies.address",
        phone: "companies.phone",
        oked: "companies.oked",
        code: "companies.code",
        extra_phone: "companies.other_phone",
        name: "companies.name",
      },
    }
  },
  created() {
    api.companies.getCompany(this.companyId)
        .then((response) => {
          this.company = response.data
          this.company.phone = phonePrettier(this.company.phone)
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
  margin-bottom: 1em;
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

  .title-val {
    p {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

  }
}
</style>