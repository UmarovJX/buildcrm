<template>
  <div>
    <create-branch-bread-crumb/>
    <branch-form-content
        :submit-button-text="submitButtonText"
        :response-alert="responseAlert"
        :loading="loading"
        @submit-form="submitNewBranch"
        @make-default-count-down="dismissedAlert"
        @change-count-down="countDownChanged"
    />
  </div>
</template>

<script>
import api from "@/services/api";
import {mapGetters} from "vuex";
import CreateBranchBreadCrumb from "@/components/Branches/CreateBranchBreadCrumb";
import BranchFormContent from "@/components/Branches/BranchFormContent";

export default {
  name: "CreateBranchPage",
  components: {
    CreateBranchBreadCrumb,
    BranchFormContent
  },
  data() {
    return {
      loading: false,
      responseAlert: {
        variant: 'success',
        dismissSecs: 10,
        dismissCountDown: 0,
        message: 'Ваш пароль был обновлен'
      }
    }
  },
  computed: {
    submitButtonText() {
      return this.$t('add')
    },
    hiddenArea() {
      return this.loading ? 'true' : null
    },
    ...mapGetters({
      me: 'getMe'
    })
  },
  methods: {
    async submitNewBranch(data) {
      this.loading = true
      await api.branches.addNewBranch(data)
          .then(() => {
            this.$router.push({name: 'branches'})
          })
          .catch((error) => {
            if (error?.response?.status) {
              const {status, data} = error.response
              if (status === 403) {
                this.responseAlert.variant = 'danger'
                this.responseAlert.message = data.message
                this.showResponseAlert()
                return
              }

              if (status === 422) {
                const values = Object.values(data)
                this.responseAlert.variant = 'danger'
                this.responseAlert.message = values[0][0]
                this.showResponseAlert()
              }
            } else {
              this.toastedWithErrorCode(error)
            }

          })
          .finally(() => {
            this.loading = false
          })
    },
    dismissedAlert() {
      this.responseAlert.dismissCountDown = 0
    },
    makeFormDefault() {
      for (const [key,] of Object.entries(this.form)) {
        this.form[key] = ''
      }
    },
    countDownChanged(dismissCountDown) {
      this.responseAlert.dismissCountDown = dismissCountDown
    },
    showResponseAlert() {
      this.responseAlert.dismissCountDown = this.responseAlert.dismissSecs
    }
  }
}
</script>

<style lang="scss" scoped>
.create__branch {
  max-width: 720px;
  margin-top: 1rem;
}

.overlay__alert {
  max-width: 640px;
}

.success__alert {
  max-width: 640px;
}

.form__password {
  max-width: 640px;

  .validation__provider {
    display: block;
    margin-top: 1rem;
  }

  .error__provider {
    color: red;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .submit__button {
      background-color: #007bff !important;
      margin-right: 0;
    }
  }
}

.input__text__icon {
  cursor: pointer;
  height: 38px;
}

.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'kms';
}
</style>