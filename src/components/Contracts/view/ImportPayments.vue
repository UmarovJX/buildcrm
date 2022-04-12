<template>
  <main class="main__class">
    <!--  HEADER NAVIGATION  -->
    <div v-if="haveConstructorOrder" class="navigation__content">
      <span class="go__back" @click="backNavigation">
        <base-arrow-left-icon :width="32" :height="32"></base-arrow-left-icon>
      </span>
      <span class="breadcrumb__content">
        <span>
          Список договоров
          <base-arrow-right-icon :width="18" :height="18"/>
          <span>{{ contract.contract }}</span>
          <base-arrow-right-icon :width="18" :height="18"/>
          <span>Импорт оплат</span>
        </span>
        <span class="head">
          Импорт <span class="contract__number"> “{{ file.name }}”</span>
        </span>
      </span>
    </div>

    <div class="navigation__links">
      <div class="links">
        <span class="link">
          <span class="violet__design">1</span>
          <span class="color-violet-600">Поля файла</span>
        </span>
        <span class="icon mr-2 ml-2">
          <base-arrow-right-icon fill="#9CA3AF"/>
        </span>
        <span class="link">
          <span class="gray__design">2</span>
          <span class="gray__400">Список загрузки</span>
        </span>
      </div>
      <div class="buttons">
        <base-button @click="importExcelSheet" class="next__button" text="Продолжить">
          <template #right-icon>
            <base-arrow-right-icon :width="24" :height="24" fill="#ffffff"/>
          </template>
        </base-button>
      </div>
    </div>

    <!--  MAIN NAVIGATION  -->
    <div class="main__content">
      <div class="header">
        <span class="row">Свойство</span>
        <span class="row">Поле в файле</span>
      </div>
      <div class="main__section">
        <ValidationObserver ref="form-validation" class="main__row">
          <ValidationProvider rules="required" name="date" class="cell">
            <span class="cell__item">Дата</span>
            <span class="cell__item">
              <base-select
                  :class="{'warning__border': errors.date}"
                  @change="setFormProperty('date',$event)"
                  placeholder="Выберите поле"
                  :options="options"
              />
            </span>
          </ValidationProvider>

          <ValidationProvider rules="required" name="type" class="cell">
            <span class="cell__item">Тип</span>
            <span class="cell__item">
              <base-select
                  :class="{'warning__border': errors.type}"
                  @change="setFormProperty('type',$event)"
                  placeholder="Выберите поле"
                  :options="options"
              />
            </span>
          </ValidationProvider>

          <ValidationProvider rules="required" name="amount" class="cell">
            <span class="cell__item">Сумма</span>
            <span class="cell__item">
              <base-select
                  :class="{'warning__border': errors.amount}"
                  @change="setFormProperty('amount',$event)"
                  placeholder="Выберите поле"
                  :options="options"
              />
            </span>
          </ValidationProvider>

          <ValidationProvider rules="required" name="method" class="cell">
            <span class="cell__item">Способ</span>
            <span class="cell__item">
              <base-select
                  :class="{'warning__border': errors.method}"
                  @change="setFormProperty('method',$event)"
                  placeholder="Выберите поле"
                  :options="options"
              />
            </span>
          </ValidationProvider>

          <ValidationProvider rules="required" name="comment" class="cell">
            <span class="cell__item">Комментарий</span>
            <span class="cell__item">
              <base-select
                  :class="{'warning__border': errors.comment}"
                  @change="setFormProperty('comment',$event)"
                  placeholder="Выберите поле"
                  :options="options"
              />
            </span>
          </ValidationProvider>
        </ValidationObserver>
      </div>
    </div>
  </main>
</template>

<script>
import {mapGetters} from "vuex";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseSelect from "@/components/Reusable/BaseSelect";

export default {
  name: "ImportPayments",
  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseSelect,
    BaseButton
  },
  data() {
    return {
      showLoading: false,
      options: [],
      form: {
        date: null,
        type: null,
        amount: null,
        method: null,
        comment: null
      },
      errors: {
        date: null,
        type: null,
        amount: null,
        method: null,
        comment: null
      }
    }
  },
  computed: {
    ...mapGetters({
      excelSheets: 'getExcelSheets'
    }),
    haveConstructorOrder() {
      return Object.keys(this.excelSheets.contract).length > 0
    },
    contract() {
      if (this.haveConstructorOrder)
        return this.excelSheets.contract
      return {}
    },
    file() {
      return this.excelSheets.file
    },
    fields() {
      return [
        {
          key: "file_field",
          label: "Свойство",
        },
        {
          key: "upload_list",
          label: "Поле в файле",
        }
      ]
    },
    items() {
      return [
        {
          file_field: 'Дата',
          upload_list: ''
        },
        {
          file_field: 'Тип',
          upload_list: ''
        },
        {
          file_field: 'Сумма',
          upload_list: ''
        },
        {
          file_field: 'Способ',
          upload_list: ''
        },
        {
          file_field: 'Комментарий',
          upload_list: ''
        }
      ]
    }
  },
  mounted() {
    this.setupOptions()
  },
  methods: {
    setupOptions() {
      const {rows} = this.excelSheets
      this.options = rows[0]
      this.trackOptions = rows[0]
    },
    backNavigation() {
      this.$router.go(-1)
    },
    setFormProperty(property, value) {
      this.form[property] = value
      this.errors[property] = false
    },
    async importExcelSheet() {
      const validation = await this.$refs['form-validation'].validate()
      if (validation) {
        console.log(this.$refs)
      } else {
        const {errors} = this.$refs['form-validation']
        for (let [key,] of Object.entries(this.errors)) {
          this.errors[key] = errors.hasOwnProperty(key)
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
*
  font-family: Inter, serif
  font-style: normal
  line-height: 22px
  color: var(--gray-600)
  font-weight: 600

.color-violet-600
  color: var(--violet-600)

.violet__design
  background-color: var(--violet-100)
  color: var(--violet-600)

.gray__design
  background-color: var(--gray-100)
  color: var(--gray-600)

.gray__400
  color: var(--gray-400)

.main__class
  background-color: white
  padding: 3rem
  min-height: 100vh
  color: var(--gray-600)

.navigation__content
  display: flex
  align-items: center
  margin-bottom: 52px

  .go__back
    width: 56px
    height: 56px
    border-radius: 100%
    background-color: var(--gray-100)
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer


  .breadcrumb__content
    display: inline-flex
    flex-direction: column
    margin-left: 1rem
    font-weight: 600
    font-size: 14px
    color: #9CA3AF


  .head
    font-size: 24px
    line-height: 28px
    color: #4B5563

    .contract__number
      color: var(--violet-600)

.navigation__links
  padding: 1rem 3rem
  border-top: 6px solid var(--gray-100)
  border-bottom: 6px solid var(--gray-100)
  width: 100%
  display: flex
  justify-content: space-between
  align-items: center

  .links
    display: flex
    align-items: center

    .link
      display: flex
      align-items: center

      span:first-child
        border-radius: 50%
        width: 2rem
        height: 2rem
        display: flex
        justify-content: center
        align-items: center
        margin-right: 0.5rem

.next__button
  background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)
  color: #FFFFFF

.main__content
  padding: 2rem 3rem

::v-deep .table__list
  max-height: none

  table
    color: var(--gray-600)

    thead tr th
      font-family: CraftworkSans, serif
      font-weight: 600
      line-height: 14px
      letter-spacing: 1px
      color: var(--gray-400) !important
      padding: 1.25rem 1rem

    td
      vertical-align: middle

  .table.b-table[aria-busy="true"]
    opacity: 1 !important

::v-deep .row__head__bottom-border
  border-bottom: 2px solid var(--gray-200) !important

::v-deep .row__body__bottom-border:not(:last-child)
  border-bottom: 2px solid var(--gray-200) !important

.header
  display: flex
  width: 100%
  justify-content: space-between
  border-bottom: 2px solid var(--gray-200)
  padding-left: 1rem
  font-size: 1rem

  .row
    color: var(--gray-400)
    font-family: CraftworkSans, serif
    display: flex
    align-items: center
    justify-content: flex-start
    width: 100%
    height: 3.5rem
    letter-spacing: 1px
    text-transform: uppercase
    padding-left: 1rem

.main__section
  .main__row
    color: var(--gray-600)
    font-size: 1.2rem
    font-family: Inter, serif
    display: flex
    align-items: center
    flex-direction: column
    justify-content: space-between
    width: 100%
    padding-left: 1rem

    .cell
      width: 100%
      display: flex
      justify-content: space-between
      align-items: center
      padding-top: 1rem
      padding-bottom: 1rem

      &__item
        display: flex
        justify-content: flex-start
        width: 100%
        padding: 1.25rem 0 1.25rem 0

.warning__border
  border: 2px solid var(--red-500)
</style>