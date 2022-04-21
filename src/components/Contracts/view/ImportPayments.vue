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
        <span class="link" @click="navigateThroughTab(0)">
          <span :class="[position === 0 ? 'violet__design':'gray__design']">1</span>
          <span :class="[position === 0 ? 'color-violet-600':'gray__400']">Поля файла</span>
        </span>
        <span class="icon mr-2 ml-2">
          <base-arrow-right-icon fill="#9CA3AF"/>
        </span>
        <span class="link" @click="navigateThroughTab(1)">
          <span :class="[position === 1 ? 'violet__design':'gray__design']">2</span>
          <span :class="[position === 1 ? 'color-violet-600':'gray__400']">Список загрузки</span>
        </span>
      </div>
      <div class="buttons">
        <b-overlay
            v-if="positionOnUpload"
            :show="buttonLoading"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
        >
          <base-button @click="importExcelSheet" class="next__button" text="Продолжить">
            <template #right-icon>
              <base-arrow-right-icon :width="24" :height="24" fill="#ffffff"/>
            </template>
          </base-button>
        </b-overlay>
        <div v-else class="d-flex align-items-center justify-content-center">
          <b-overlay
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
          >
            <base-button @click="importExcelSheet" class="reload__button mr-3" text="Перезагрузить файл"/>
          </b-overlay>
          <b-overlay
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
          >
            <base-button @click="importExcelSheet" class="next__button" text="Добавить оплаты">
              <template #right-icon>
                <base-arrow-right-icon :width="24" :height="24" fill="#ffffff"/>
              </template>
            </base-button>
          </b-overlay>
        </div>
      </div>
    </div>

    <!--  MAIN NAVIGATION  -->
    <div v-show="positionOnUpload" class="main__content">
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

          <ValidationProvider rules="required" name="payment_type" class="cell">
            <span class="cell__item">Способ</span>
            <span class="cell__item">
              <base-select
                  :class="{'warning__border': errors.payment_type}"
                  @change="setFormProperty('payment_type',$event)"
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

    <div v-show="position" class="upload__list">
      <base-filter-tabs-content
          :filter-tab-list="filterTabList"
          @get-new-content="changeTabOfUploadList"
      />

      <b-table
          v-if="tabCurrentStatus === 'success'"
          :items="successItems"
          :fields="successFields"
          class="table__list"
          :empty-text="$t('no_data')"
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border"
          show-empty
          sticky-header
          borderless
          responsive
      >
        <!--   CONTENT WHEN EMPTY SCOPE       -->
        <template #empty="scope" class="text-center">
          <div class="d-flex justify-content-center align-items-center empty__scope">
            {{ $t('no_data') }}
          </div>
        </template>
      </b-table>

      <b-table
          v-else
          :items="failedItems"
          :fields="failedFields"
          class="table__list"
          :empty-text="$t('no_data')"
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border"
          show-empty
          sticky-header
          borderless
          responsive
      >
        <!--   CONTENT WHEN EMPTY SCOPE       -->
        <template #empty="scope" class="text-center">
          <div class="d-flex justify-content-center align-items-center empty__scope">
            {{ $t('no_data') }}
          </div>
        </template>
      </b-table>
    </div>
  </main>
</template>

<script>
import {mapGetters} from "vuex";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import api from "@/services/api";
import {formatToPrice, getDateProperty} from "@/util/reusable";

export default {
  name: "ImportPayments",
  components: {
    BaseFilterTabsContent,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseSelect,
    BaseButton
  },
  data() {
    return {
      successItems: [],
      failedItems: [],
      buttonLoading: false,
      options: [],
      form: {
        date: null,
        type: null,
        amount: null,
        payment_type: null,
        comment: null
      },
      errors: {
        date: null,
        type: null,
        amount: null,
        payment_type: null,
        comment: null
      },
      position: 0,
      availableToUpload: []
    }
  },
  computed: {
    ...mapGetters({
      excelSheets: 'getExcelSheets'
    }),
    tabCurrentStatus() {
      return this.$route.query.status || 'success'
    },
    filterTabList() {
      return [
        {
          name: 'Успешные',
          status: 'success',
          counts: this.successItems.length
        },
        {
          name: 'Ошибка загрузки',
          status: 'failed',
          counts: this.failedItems.length
        }
      ]
    },
    failedFields() {
      return [
        {
          key: 'index',
          label: 'Строка в файле'
        },
        {
          key: 'error',
          label: 'Тип ошибки'
        }
      ]
    },
    successFields() {
      return [
        {
          key: 'date',
          label: 'Дата',
          formatter: (date) => {
            const {year, month, day} = getDateProperty(date)
            const lastYear = year.toString().slice(-2)
            return `${day}.${month}.${lastYear}`
          }
        },
        {
          key: 'amount',
          label: 'Сумма',
          formatter: (amount) => (formatToPrice(amount) + ' ' + this.$t('ye'))
        },
        {
          key: 'type',
          label: 'Тип',
          formatter: (type) => this.$t(type)
        },
        {
          key: 'payment_type',
          label: 'Способ',
          formatter: (paymentType) => {
            if (paymentType === 'cash') return this.$t('cash')
            if (!paymentType) return '-'
            return paymentType
          }
        },
        {
          key: 'comment',
          label: 'Комментарий'
        }
      ]
    },
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
    positionOnUpload() {
      return !this.position
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
    importExcelSheet() {
      const validation = this.formValidation()
      if (validation) {
        const {rows} = this.excelSheets
        const arrayOfCells = rows.slice(1)
        const payments = arrayOfCells.map(arrCell => {
          const {date, type, amount, payment_type, comment} = this.form
          return {
            date: arrCell[date],
            type: arrCell[type],
            amount: arrCell[amount],
            payment_type: arrCell[payment_type],
            comment: arrCell[comment]
          }
        })
        this.saveToDatabase(payments)
      } else {
        const {errors} = this.$refs['form-validation']
        for (let [key,] of Object.entries(this.errors)) {
          if (!this.form[key]) {
            this.errors[key] = errors.hasOwnProperty(key)
          }
        }
      }
    },
    formValidation() {
      const keys = Object.keys(this.form)
      return keys.every(key => this.form[key] !== null)
    },
    saveToDatabase(payments) {
      const {id} = this.$route.params
      this.buttonLoading = true
      const paymentsList = payments.map(payment => {
        const hasAmount = payment.hasOwnProperty('amount')
        if (hasAmount) {
          const amount = parseInt(payment.amount) * 100
          return {
            ...payment,
            amount
          }
        }
        return payment
      })

      api.contractV2.importPaymentTransaction(id, paymentsList)
          .then(() => {
            this.$router.push({
              name: 'contracts-view'
            })
            this.$swal({
              title: "Muvaffaqiyatli!",
              text: "To'lovlar ro'yxatiga muvaffaqiyatli qo'shildi",
              icon: "success"
            })
          })
          .catch((error) => {
            const {data} = error.response
            const primaryKey = Object.keys(data)[0]
            this.$bvToast.toast(data[primaryKey], {
              title: `${this.$t('error')}`,
              variant: 'danger',
              solid: true
            })
          })
          .finally(() => {
            this.buttonLoading = false
            // this.position = 1
          })
    },
    showUploadPayments(payments) {
      this.availableToUpload = this.getValidPayments(payments)
      this.navigateThroughTab(1)
    },
    getValidPayments(payments) {
      this.successItems = []
      this.failedItems = []
      return payments.filter(({date, type, amount, payment_type, comment}, index) => {
        const isDateValid = () => {
          const parseDate = Date.parse(date)
          return !isNaN(parseDate)
        }

        /*
          Дата
          Тип
          Сумма
          Способ
          Комментарий
        */
        const errors = {
          date: "'Неверные данные в поле “Дата”",
          type: 'Неверные данные в поле “TYPE”',
          amount: 'Неверные данные в поле “Сумма”',
          payment_type: 'Неверные данные в поле “Способ”'
        }

        const isValidType = type && typeof type === 'string'
        const isValidAmount = amount && typeof amount === 'number'
        const isValidPaymentType = payment_type && typeof payment_type === 'string'

        if (!isDateValid()) {
          this.passToFailedItems(index + 1, errors.date)
          return false
        }

        if (!isValidType) {
          this.passToFailedItems(index + 1, errors.type)
          return false
        }

        if (!isValidAmount) {
          this.passToFailedItems(index + 1, errors.amount)
          return false
        }

        if (!isValidPaymentType) {
          this.passToFailedItems(index + 1, errors.payment_type)
          return false
        }

        this.successItems.push({date, type, amount, payment_type, comment})
        return true
      })
    },
    passToFailedItems(index, error) {
      this.failedItems.push({
        error,
        index
      })
    },
    changeTabOfUploadList(status) {
      const {status: queryStatus} = this.$route.query
      if (queryStatus !== status) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            status
          }
        })
      }
    },
    navigateThroughTab(index) {
      if (index) {
        const validation = this.formValidation()
        if (!validation) return
      }
      this.position = index
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
      cursor: pointer

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

.reload__button
  background: var(--gray-100)
  color: var(--gray-600)

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
  //padding-left: 1rem
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
    //padding-left: 1rem

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

    .cell
      width: 100%
      display: flex
      justify-content: space-between
      align-items: center
      padding-top: 1rem
      padding-bottom: 1rem
      //padding-left: 1rem
      border-bottom: 2px solid var(--gray-200)

      &__item
        display: flex
        justify-content: flex-start
        width: 100%
        padding: 1rem 0

.warning__border
  border: 2px solid var(--red-500)

.upload__list
  padding-top: 2rem
  padding-bottom: 2rem

::v-deep .table__list
  max-height: none
  margin-top: 2rem

  table
    color: var(--gray-600)

    thead tr th
      font-family: CraftworkSans, serif
      font-weight: 600
      line-height: 14px
      letter-spacing: 1px
      color: var(--gray-400) !important
      padding: 1.25rem 1rem 1.25rem 0.75rem

    td
      vertical-align: middle

  .table.b-table[aria-busy=true]
    opacity: 1 !important

  .empty__scope
    font-size: 1.5rem
    min-height: 30rem

::v-deep .row__head__bottom-border
  border-bottom: 2px solid var(--gray-200) !important

::v-deep .row__body__bottom-border:not(:last-child)
  border-bottom: 2px solid var(--gray-200) !important


</style>