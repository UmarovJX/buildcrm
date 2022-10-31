<template>
    <div>
        <b-overlay :show="loading" class="overlay__alert" rounded="sm">
            <b-alert
                dismissible
                :variant="responseAlert.variant"
                class="success__alert"
                :show="responseAlert.dismissCountDown"
                @dismissed="dismissedAlert"
                @dismiss-count-down="countDownChanged"
            >
                <p>{{ responseAlert.message }}</p>
                <b-progress
                    :variant="responseAlert.variant"
                    :max="responseAlert.dismissSecs"
                    :value="responseAlert.dismissCountDown"
                    height="4px"
                ></b-progress>
            </b-alert>
            <div :aria-hidden="hiddenArea">
                <ValidationObserver ref="validation-observer" v-slot="{ handleSubmit }">
                    <form
                        class="form__password"
                        @submit.prevent="handleSubmit(submitNewPassword)"
                    >
                        <ValidationProvider
                            v-for="({type,name,rules,extraClass,id,label,placeholder,bind,validationError},index) in providerSchema"
                            :key="name+id"
                            :name="name"
                            :rules="rules"
                            :class="extraClass"
                            v-slot="{ errors }"
                            class="mt-3"
                        >
                            <label :for="id">{{ label }}</label>
                            <b-input-group>
                                <template #append>
                                    <b-input-group-text v-if="bind === 'newPassword'" @click="copyToClipboard"
                                                        class="toggle__password__view">
                    <span>
                      <img style="width: 24px; height: 24px" src="@/assets/icons/clipboard.svg"
                           alt="no-preview-aye.svg">
                    </span>
                                    </b-input-group-text>

                                    <b-input-group-text v-if="bind === 'newPassword'" @click="regeneratePassword"
                                                        class="toggle__password__view">
                    <span>
                      <img style="width: 24px; height: 24px" src="@/assets/icons/refresh.svg"
                           alt="no-preview-aye.svg">
                    </span>
                                    </b-input-group-text>

                                    <b-input-group-text @click="toggleInputType(index)" class="toggle__password__view">
                    <span v-if="type === 'password'">
                      <img src="@/assets/icons/no-preview-aye.svg" alt="no-preview-aye.svg">
                    </span>
                                        <span v-else>
                      <img src="@/assets/icons/preview-aye.svg" alt="preview-aye.svg">
                    </span>
                                    </b-input-group-text>
                                </template>
                                <b-form-input
                                    v-model="form[bind]"
                                    :type="type"
                                    :id="id"
                                    :placeholder="placeholder"
                                >
                                </b-form-input>
                            </b-input-group>
                            <span class="error__provider" v-if="errors[0]">{{ $t('user.validation_password') }}</span>
                            <span class="error__provider" v-if="validationError.show">
                <template v-if="checkedPasswordError && !(typeof validationError.message === 'string')">
                  <span v-for="(message,index) in validationError.message" :key="index">{{ message }}<br/></span>
                </template>
                <template v-else>
                  {{ validationError.message }}
                </template>
                </span>
                            <div v-if="form['newPassword'] && bind === 'newPassword'" class="po-password-strength-bar"
                                 :class="score"></div>
                        </ValidationProvider>
                        <div class="buttons">
                            <b-button :disabled="loading" type="submit" variant="btn-primary" class="submit__button">
                                {{ $t('refresh_password') }}
                            </b-button>
                        </div>
                    </form>
                </ValidationObserver>
            </div>
            <template #overlay>
                <div class="text-center">
                    <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
                    <p id="cancel-label">Пожалуйста подождите...</p>
                </div>
            </template>
        </b-overlay>
    </div>
</template>

<script>
import api from "@/services/api";
import DummyPassword from '@/util/password-generate';
import scorePassword from "@/util/score-password";

const dummy = new DummyPassword();

export default {
    name: "TabChangePassword",
    data() {
        return {
            loading: false,
            responseAlert: {
                variant: 'success',
                dismissSecs: 10,
                dismissCountDown: 0,
                message: 'Ваш пароль был обновлен'
            },
            options: {
                length: 16,
                lower: true,
                upper: true,
                digits: true,
                symbols: true,
            },
            errorNumber: 'Пароль должен содержать хотя бы одну цифру',
            errorUppercase: 'Пароль должен содержать заглавных буквы',
            errorLowercase: 'Пароль должен содержать маленькие буквы',
            errorSpecialChar: 'Пароль должен содержать хотя бы один символ',
            checkedPasswordError: [],
            form: {
                oldPassword: '',
                newPassword: '',
                repeatedPassword: ''
            },
            providerSchema: [
                {
                    type: 'password',
                    name: 'Прежний пароль',
                    rules: 'required|min:8',
                    extraClass: 'validation__provider',
                    label: 'Прежний пароль',
                    bind: 'oldPassword',
                    placeholder: 'Прежний пароль',
                    id: 'oldPassword',
                    validationError: {
                        show: false,
                        message: this.$t('user.validation_last_password')
                    }
                },
                {
                    type: 'password',
                    name: 'Новый пароль',
                    rules: 'required|min:8',
                    extraClass: 'validation__provider',
                    label: 'Новый пароль',
                    bind: 'newPassword',
                    placeholder: 'Новый пароль',
                    id: 'newPassword',
                    validationError: {
                        show: false,
                        message: ''
                    }
                },
                {
                    type: 'password',
                    name: 'Повторите новый пароль',
                    rules: 'required|min:8',
                    extraClass: 'validation__provider',
                    label: 'Повторите новый пароль',
                    bind: 'repeatedPassword',
                    placeholder: 'Повторите новый пароль',
                    id: 'repeatedPassword',
                    validationError: {
                        show: false,
                        message: this.$t('user.validation_confirm_password')
                    }
                }
            ],
        }
    },
    watch: {
        'form.oldPassword'() {
            this.toggleConfirmationError({show: false, id: 'oldPassword'})
        },
        'form.newPassword'(newPassword) {
            if (newPassword === this.form.repeatedPassword)
                this.toggleConfirmationError({show: false, id: 'repeatedPassword'})
            if (this.checkPassword(newPassword)) {
                this.toggleConfirmationError({show: true, id: 'newPassword'})
            } else {
                this.toggleConfirmationError({show: false, id: 'newPassword'})
            }
        },
        'form.repeatedPassword'(confirmPassword) {
            if (confirmPassword === this.form.newPassword)
                this.toggleConfirmationError({show: false, id: 'repeatedPassword'})
            else if (confirmPassword.length >= this.form.newPassword.length)
                this.toggleConfirmationError({show: true, id: 'repeatedPassword'})
            else
                this.toggleConfirmationError({show: false, id: 'repeatedPassword'})
        },

    },
    computed: {
        hiddenArea() {
            return this.loading ? 'true' : null
        },
        score() {
            switch (scorePassword(this.form.newPassword)) {
                case 0:
                    return 'risky'
                case 1:
                    return 'guessable'
                case 2:
                    return 'weak'
                case 3:
                    return 'safe'
                case 4:
                    return 'secure'
                default:
                    return ''
            }
        }
    },
    methods: {
        checkArray(value) {
            return value.isArray
        },
        checkPassword(password) {
            const specialCharRegex = /[^A-Za-z0-9]/g
            const lowercaseRegex = /(.*[a-z].*)/g
            const uppercaseRegex = /(.*[A-Z].*)/g
            const numberRegex = /(.*[0-9].*)/g

            const hasSpecialChar = specialCharRegex.test(password)
            const hasLowerCase = lowercaseRegex.test(password)
            const hasUpperCase = uppercaseRegex.test(password)
            const hasNumber = numberRegex.test(password)
            this.checkedPasswordError = []
            if (!hasSpecialChar)
                this.checkedPasswordError.push(this.errorSpecialChar)
            if (!hasLowerCase)
                this.checkedPasswordError.push(this.errorLowercase)
            if (!hasUpperCase)
                this.checkedPasswordError.push(this.errorUppercase)
            if (!hasNumber)
                this.checkedPasswordError.push(this.errorNumber)
            if (this.checkedPasswordError.length) {
                this.providerSchema[1].validationError.message = this.checkedPasswordError
            }
            return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar
        },
        regeneratePassword() {
            const characters = [];
            for (let option in this.options) {
                if (this.options[option] === true) characters.push(dummy[option.toUpperCase()]);
            }
            this.form.newPassword = dummy.create(this.options.length, characters.join(''));
        },
        copyToClipboard() {
            clientInformation.clipboard.writeText(this.form.newPassword)
        },
        submitNewPassword() {
            const {newPassword, repeatedPassword} = this.form
            if (newPassword === repeatedPassword)
                if (this.checkPassword(newPassword))
                    this.updateUserPassword()
                else
                    this.toggleConfirmationError({show: true, id: 'newPassword'})
            else
                this.toggleConfirmationError({show: true, id: 'repeatedPassword'})
        },
        updateUserPassword() {
            this.loading = true
            const {oldPassword, newPassword, repeatedPassword} = this.form
            const data = {
                old_password: oldPassword,
                password: newPassword,
                password_confirmation: repeatedPassword
            }
            api.userV2.updateUserPassword(data)
                .then(() => {
                    this.responseAlert.variant = 'success'
                    this.responseAlert.message = 'Ваш пароль был обновлен'
                    this.$refs['validation-observer'].reset()
                    this.makeFormDefault()
                    this.showResponseAlert()
                })
                .catch((error) => {
                    const {status, data} = error.response

                    if (status === 403 && data.hasOwnProperty('message')) {
                        this.responseAlert.variant = 'danger'
                        this.responseAlert.message = data.message
                        this.showResponseAlert()
                        this.toggleConfirmationError({show: true, id: 'oldPassword'})
                    }

                    if (status === 422) {
                        const values = Object.values(data)
                        this.responseAlert.variant = 'danger'
                        this.responseAlert.message = values[0][0]
                        this.showResponseAlert()
                    }
                })
                .finally(() => {
                    this.loading = false
                })
        },
        toggleConfirmationError({show, id}) {
            /* FIND REPEATED PASSWORD SCHEMA INDEX */
            const findIndex = this.providerSchema.findIndex(provider => provider.id === id)
            const validationError = this.providerSchema[findIndex].validationError
            validationError.show = show

        },
        toggleInputType(index) {
            const currentType = this.providerSchema[index].type
            if (currentType === 'password') {
                this.providerSchema[index].type = 'text'
            } else {
                this.providerSchema[index].type = 'password'
            }
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
        display: block;
        margin-top: 8px;
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

.toggle__password__view {
    cursor: pointer;
    height: 38px;
}

.po-password-strength-bar {
    border-radius: 2px;
    transition: all 0.2s linear;
    height: 5px;
    margin-top: 8px;
}

.po-password-strength-bar.risky {
    background-color: #f95e68;
    width: 10%;
}

.po-password-strength-bar.guessable {
    background-color: #fb964d;
    width: 32.5%;
}

.po-password-strength-bar.weak {
    background-color: #fdd244;
    width: 55%;
}

.po-password-strength-bar.safe {
    background-color: #b0dc53;
    width: 77.5%;
}

.po-password-strength-bar.secure {
    background-color: #35cc62;
    width: 100%;
}


</style>