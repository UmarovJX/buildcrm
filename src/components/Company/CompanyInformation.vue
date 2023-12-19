<script>
import api from '@/services/api'
import { phonePrettier } from '@/util/reusable'

export default {
  name: 'CompanyInformation',
  emits: ['trigger-input', 'search-by-filter', 'replace-router'],
  props: {
    companyId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      company: {},
      labels: {
        type: 'companies.type',
        inn: 'companies.inn',
        director: 'companies.director',
        address: 'companies.address',
        phone: 'companies.phone',
        oked: 'companies.oked',
        code: 'companies.code',
        extra_phone: 'companies.other_phone',
        name: 'companies.name',
      },
    }
  },
  created() {
    api.companies
      .getCompany(this.companyId)
      .then(response => {
        this.company = response.data
        this.company.phone = phonePrettier(this.company.phone)
        this.company.director = this.getDirector(
          this.company.first_name,
          this.company.second_name,
        )
      })
      .catch(error => {
        this.toastedWithErrorCode(error)
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    checkLocales(name) {
      if (localStorage.locale) return name[localStorage.locale]
      return name.ru
    },
    getDirector(firstName, secondName) {
      return `${firstName} ${secondName}`
    },
  },
}
</script>

<template>
  <div>
    <div
      v-if="company && Object.keys(company)"
      class="info-container"
    >
      <span
        v-for="([key, value], index) in Object.entries(company)"
        :key="index"
        :class="labels[key] ? 'item-block' : 'item-block display-none'"
      >
        <span
          v-if="labels[key]"
          class="item"
        >
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
        <span
          v-else
          class="display-none"
        />
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.info-container {
  margin-top: 30px;
  gap: 24px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 150px;
  margin-bottom: 1em;
}

.item-block {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100%;
}

.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;
  color: #4b5563;
  font-family: "Inter", serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;

  .title {
    display: flex;
    min-width: max-content;
    color: #9ca3af;
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
.display-none {
  display: none;
}
</style>
