<template>
  <main>
    <div class="app-content">
      <div class="countdown-timer" draggable="true">
        <flip-countdown
          :deadline="expiry_at"
          :showDays="false"
          :showHours="false"
          @timeElapsed="timeElapsedHandler"
        ></flip-countdown>
      </div>
      <!-- Step 1 -->
      <div class="new-object p-3" v-if="step === 1">
        <validation-observer ref="observer" v-slot="{handleSubmit}">
          <form ref="form" @submit.prevent="handleSubmit(postStore)">
            <div class="row">
              <!-- Изменить дата договора -->
              <div
                class="col-12 mb-2"
                v-if="
                  (getMe.role && getMe.role.id === 1) ||
                    (getPermission.contracts && getPermission.contracts.date)
                "
              >
                <div class="row">
                  <div class="col-md-4">
                    <div class="row">
                      <div class="col-10 pr-0">
                        <validation-provider
                          :name="`'${$t('apartments.agree.number')}'`"
                          :rules="{required: true}"
                          v-slot="validationContext"
                          class="mb-3"
                        >
                          <b-form-group
                            :label="$t('apartments.agree.number')"
                            label-for="number"
                          >
                            <b-form-input
                              id="number"
                              name="number"
                              type="text"
                              :placeholder="
                                $t('apartments.agree.placeholder.number')
                              "
                              v-model="apartment_edit.contract_number"
                              :state="getValidationState(validationContext)"
                              aria-describedby="number-feedback"
                              :disabled="!edited.toggle ? true : false"
                            ></b-form-input>

                            <b-form-invalid-feedback id="number-feedback">{{
                              validationContext.errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </div>
                      <div class="col-2 p-0 mt-2">
                        <b-button
                          type="button"
                          v-if="!edited.toggle"
                          @click="[(edited.toggle = true)]"
                          variant="primary"
                          size="sm"
                          class="mt-4 ml-auto w-100"
                          style="height: 38px"
                        >
                          <i class="fal fa-edit"></i>
                        </b-button>
                        <b-button
                          type="button"
                          v-else
                          @click="
                            [
                              (edited.toggle = false),
                              (edited.contract_number = true),
                            ]
                          "
                          variant="success"
                          size="sm"
                          class="mt-4 ml-auto w-100"
                          style="height: 38px"
                        >
                          <i class="fal fa-save"></i>
                        </b-button>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <validation-provider
                      :name="`'${$t('apartments.agree.date_contract')}'`"
                      :rules="{required: true}"
                      v-slot="validationContext"
                      class="mb-3"
                    >
                      <b-form-group
                        :label="$t('apartments.agree.date_contract')"
                        label-for="date"
                      >
                        <b-form-input
                          id="date"
                          name="date"
                          type="date"
                          :placeholder="
                            $t('apartments.agree.placeholder.date_contract')
                          "
                          v-model="apartment_edit.contract_date"
                          :state="getValidationState(validationContext)"
                          aria-describedby="date-feedback"
                        ></b-form-input>

                        <b-form-invalid-feedback id="date-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>

                <hr />
              </div>

              <!-- apartments.agree.passport_series -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.passport_series')}'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.passport_series')"
                    label-for="checkout-pasport"
                  >
                    <b-form-input
                      id="checkout-pasport"
                      name="checkout-pasport"
                      type="text"
                      @change="getClientData"
                      :placeholder="
                        $t('apartments.agree.placeholder.passport_series')
                      "
                      v-model="client.passport_series"
                      :state="getValidationState(validationContext)"
                      aria-describedby="checkout-pasport-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="checkout-pasport-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- apartments.agree.issued_by_whom -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.issued_by_whom')}'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.issued_by_whom')"
                    label-for="issue_passport"
                  >
                    <b-form-input
                      id="issue_passport"
                      name="issue_passport"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.issued_by_whom')
                      "
                      v-model="client.issued_by_whom"
                      :state="getValidationState(validationContext)"
                      aria-describedby="issue_passport-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="issue_passport-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- apartments.agree.date_of_issue -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.date_of_issue')}'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.date_of_issue')"
                    label-for="date_of_issue"
                  >
                    <b-form-input
                      id="date_of_issue"
                      name="date_of_issue"
                      type="date"
                      :placeholder="$t('apartments.agree.date_of_issue')"
                      v-model="client.date_of_issue"
                      :state="getValidationState(validationContext)"
                      aria-describedby="date_of_issue-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="date_of_issue-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- client.birth_day -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.birth_day')}'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.birth_day')"
                    label-for="birth_day"
                  >
                    <b-form-input
                      id="birth_day"
                      name="birth_day"
                      type="date"
                      :placeholder="$t('apartments.agree.birth_day')"
                      v-model="client.birth_day"
                      :state="getValidationState(validationContext)"
                      aria-describedby="birth_day-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="birth_day-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <div class="col-md-12">
                <hr />
              </div>

              <!-- last_name_kirill -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.last_name')} (kirill)'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="`${$t('apartments.agree.last_name')} (kirill)`"
                    label-for="last_name_kirill"
                  >
                    <b-form-input
                      id="last_name_kirill"
                      name="last_name_kirill"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.last_name')
                      "
                      v-model="client.last_name.kirill"
                      @input="
                        isCyrillic_last_name_kirill(client.last_name.kirill)
                      "
                      @change="textToLatin_last_name_kirill"
                      :state="getValidationState(validationContext)"
                      aria-describedby="last_name_kirill-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="last_name_kirill-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- first_name_kirill -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.first_name')} (kirill)'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="`${$t('apartments.agree.first_name')} (kirill)`"
                    label-for="first_name_kirill"
                  >
                    <b-form-input
                      id="first_name_kirill"
                      name="first_name_kirill"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.first_name')
                      "
                      v-model="client.first_name.kirill"
                      @input="
                        isCyrillic_first_name_kirill(client.first_name.kirill)
                      "
                      @change="textToLatin_first_name_kirill"
                      :state="getValidationState(validationContext)"
                      aria-describedby="first_name_kirill-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="first_name_kirill-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- second_name_kirill -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.second_name')} (kirill)'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="`${$t('apartments.agree.second_name')} (kirill)`"
                    label-for="second_name_kirill"
                  >
                    <b-form-input
                      id="second_name_kirill"
                      name="second_name_kirill"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.second_name')
                      "
                      v-model="client.second_name.kirill"
                      @input="
                        isCyrillic_second_name_kirill(client.second_name.kirill)
                      "
                      @change="textToLatin_second_name_kirill"
                      :state="getValidationState(validationContext)"
                      aria-describedby="second_name_kirill-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="second_name_kirill-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <div class="col-md-12">
                <hr />
              </div>

              <!-- last_name_lotin -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.last_name')} (lotin)'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="`${$t('apartments.agree.last_name')} (lotin)`"
                    label-for="last_name_lotin"
                  >
                    <b-form-input
                      id="last_name_lotin"
                      name="last_name_lotin"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.last_name_lotin')
                      "
                      v-model="client.last_name.lotin"
                      @input="isLatin_last_name_lotin(client.last_name.lotin)"
                      @change="textToCyrillic_last_name_lotin"
                      :state="getValidationState(validationContext)"
                      aria-describedby="last_name_lotin-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="last_name_lotin-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- first_name_lotin -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.first_name')} (lotin)'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="`${$t('apartments.agree.first_name')} (lotin)`"
                    label-for="first_name_lotin"
                  >
                    <b-form-input
                      id="first_name_lotin"
                      name="first_name_lotin"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.first_name_lotin')
                      "
                      v-model="client.first_name.lotin"
                      @input="isLatin_first_name_lotin(client.first_name.lotin)"
                      @change="textToCyrillic_first_name_lotin"
                      :state="getValidationState(validationContext)"
                      aria-describedby="first_name_lotin-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="first_name_lotin-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- second_name_lotin -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.second_name')} (lotin)'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="`${$t('apartments.agree.second_name')} (lotin)`"
                    label-for="second_name_lotin"
                  >
                    <b-form-input
                      id="second_name_lotin"
                      name="second_name_lotin"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.second_name_lotin')
                      "
                      v-model="client.second_name.lotin"
                      @input="
                        isLatin_second_name_lotin(client.second_name.lotin)
                      "
                      @change="textToCyrillic_second_name_lotin"
                      :state="getValidationState(validationContext)"
                      aria-describedby="second_name_lotin-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="second_name_lotin-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <div class="col-md-12">
                <hr />
              </div>

              <!-- client.phone -->
              <div class="col-md-4">
                <validation-provider
                  :name="`'${$t('apartments.agree.phone')}'`"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.phone')"
                    label-for="phone"
                  >
                    <b-form-input
                      id="phone"
                      name="phone"
                      type="tel"
                      :placeholder="$t('apartments.agree.placeholder.phone')"
                      v-model="client.phone"
                      :state="getValidationState(validationContext)"
                      aria-describedby="phone-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="phone-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- client.other_phone -->
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="d-block" for="other_phone">{{
                    $t("apartments.agree.other_phone")
                  }}</label>
                  <input
                    class="my-form__input"
                    type="tel"
                    :placeholder="
                      $t('apartments.agree.placeholder.other_phone')
                    "
                    v-model="client.other_phone"
                    id="other_phone"
                  />
                </div>
              </div>

              <!-- apartments.agree.language -->
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="d-block" for="language">{{
                    $t("apartments.agree.language")
                  }}</label>
                  <select
                    class="form-control"
                    id="language"
                    v-model="client.language"
                  >
                    <option value="uz">Узбекский</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
              </div>

              <!-- apartments.agree.type_client -->
              <div
                class="col-md-4"
                v-if="
                  (getMe.role && getMe.role.id === 1) ||
                    (getPermission &&
                      getPermission.contracts &&
                      getPermission.contracts.friends)
                "
              >
                <div class="mb-3">
                  <label class="d-block" for="type_client">{{
                    $t("apartments.agree.type_client")
                  }}</label>
                  <select
                    class="form-control"
                    id="type_client"
                    v-model="client.type_client"
                  >
                    <option selected value="unknown">Незнакомый</option>
                    <option value="friends">Знакомый</option>
                  </select>
                </div>
              </div>

              <div class="col-md-12">
                <hr />
              </div>

              <!-- apartments.agree.first_payment_date -->
              <div class="col-md-4">
                <validation-provider
                  :name="$t('apartments.agree.first_payment_date')"
                  :rules="{required: true}"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.first_payment_date')"
                    label-for="first_payment_date"
                  >
                    <b-form-input
                      id="first_payment_date"
                      name="first_payment_date"
                      type="date"
                      v-model="client.first_payment_date"
                      :state="getValidationState(validationContext)"
                      aria-describedby="first_payment_date-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="first_payment_date-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- apartments.agree.payment_date -->
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="d-block" for="payment_date">{{
                    $t("apartments.agree.payment_date")
                  }}</label>
                  <input
                    v-model="client.payment_date"
                    id="payment_date"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>
            </div>

            <!-- removeBlock -->
            <div
              class="mt-4 d-flex justify-content-end flex-md-row flex-column"
            >
              <button
                type="button"
                class="btn btn-default mx-md-2"
                @click="cancelForm"
              >
                {{ $t("cancel") }}
              </button>
              <button v-if="!loading" type="submit" class="btn btn-success">
                Продолжить
                <i class="fa fa-file-contract"></i>
              </button>
              <button
                v-if="loading && confirm"
                type="button"
                class="btn btn-success"
              >
                Продолжить
                <i class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </form>
        </validation-observer>
      </div>

      <!-- Step 2 -->
      <div class="container-fluid px-0 mx-0" v-if="step === 2">
        <form ref="form" @submit.stop.prevent="sendForm">
          <div class="row">
            <!-- Таблица ежемесячных платежей -->
            <div class="col-xl-8">
              <div
                class="
                  d-flex
                  justify-content-between
                  align-items-center
                  sticky-top
                  bg-custom-white
                  px-3
                  py-2
                  rounded
                  shadow-sm
                "
                v-if="
                  (client.discount && client.discount.prepay != 100) ||
                    client.discount.prepay < 100
                "
              >
                <h6 class="mb-0">Таблица ежемесячных платежей:</h6>
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mr-2 w-25">
                    <input
                      id="month"
                      class="my-form__input w-100"
                      type="number"
                      min="0"
                      required
                      v-model="month"
                      @change="changeMonth"
                    />
                  </div>
                  <span
                    v-if="
                      month > 0 &&
                        client.discount &&
                        (client.discount.prepay != 100 ||
                          client.discount.prepay < 100)
                    "
                  >
                    {{ month }} месяцев по <br />
                    {{
                      getMonths()
                        | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                    }}
                    {{ $t("ye") }}
                  </span>
                </div>
              </div>
              <div class="table-responsive custom-table mt-0">
                <table class="table">
                  <thead>
                    <tr>
                      <th>
                        Месяцы
                      </th>

                      <th>
                        Тип
                      </th>

                      <th>
                        Сумма
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-if="
                        initial_payments.length === 0 ||
                          initial_payments.length === 1
                      "
                    >
                      <td>
                        {{
                          this.client.first_payment_date
                            ? this.client.first_payment_date
                            : new Date() | moment("DD.MM.YYYY")
                        }}
                      </td>

                      <td>
                        Первоначальный взнос
                      </td>

                      <td>
                        <div
                          class="
                            d-flex
                            justify-content-between
                            align-items-center
                          "
                        >
                          <span class="table-sm-width">
                            {{
                              client.discount &&
                              client.discount.id === "other" &&
                              month == 0
                                ? getTotalOther()
                                : getPrepay()
                                  | number("0,0.00", {
                                    thousandsSeparator: " ",
                                    decimalSeparator: ",",
                                  })
                            }}
                            {{ $t("ye") }}
                          </span>

                          <button
                            class="btn btn-success btn-sm mr-0 mt-0"
                            type="button"
                            @click="addInitialPayment"
                          >
                            <i class="fa fa-plus-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr
                      v-else
                      v-for="(initialPayment, index) in initial_payments"
                      :key="'initial' + index"
                    >
                      <td>
                        <span v-if="!initialPayment.edit">
                          {{ initialPayment.month | moment("DD.MM.YYYY") }}
                        </span>

                        <div
                          class="col-md-12 float-left"
                          v-if="initialPayment.edit && index != 0"
                        >
                          <div class="row">
                            <input
                              type="date"
                              class="form-control"
                              v-model="initialPayment.month"
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        Первоначальный взнос
                      </td>

                      <td>
                        <div
                          class="
                            d-flex
                            justify-content-between
                            align-items-center
                          "
                        >
                          <span v-if="!initialPayment.edit">
                            {{
                              initialPayment.amount
                                | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                            }}
                            {{ $t("ye") }}
                          </span>

                          <div
                            class="col-md-6 float-left"
                            v-if="initialPayment.edit"
                          >
                            <div class="row">
                              <input
                                type="text"
                                class="form-control"
                                v-model="initialPayment.amount"
                              />
                            </div>
                          </div>

                          <div
                            class="
                              d-flex
                              justify-content-between
                              align-items-center
                            "
                          >
                            <button
                              class="btn btn-success btn-sm mr-1 mt-0"
                              v-if="index === initial_payments.length - 1"
                              type="button"
                              @click="addInitialPayment"
                            >
                              <i class="fa fa-plus-circle"></i>
                            </button>

                            <button
                              v-if="
                                (getMe.role.id === 1 && !initialPayment.edit) ||
                                  (getPermission.contracts.monthly &&
                                    !initialPayment.edit)
                              "
                              type="button"
                              @click="editInitialPayment(index)"
                              class="btn btn-sm btn-primary mt-0 mr-1"
                            >
                              <i class="fa fa-edit"></i>
                            </button>

                            <div v-if="initialPayment.edit">
                              <button
                                v-if="
                                  getMe.role.id === 1 ||
                                    getPermission.contracts.monthly
                                "
                                type="button"
                                @click="editInitialPayment(index)"
                                class="btn btn-sm btn-success mt-0 mr-1"
                              >
                                <i class="fa fa-save"></i>
                              </button>
                            </div>

                            <button
                              v-if="
                                (index != 0 &&
                                  getMe.role.id === 1 &&
                                  !month.edit) ||
                                  (index != 0 &&
                                    getPermission.contracts.monthly &&
                                    !month.edit)
                              "
                              type="button"
                              @click="deleteInitialPayment(index)"
                              class="btn btn-sm btn-danger mt-0 mr-0"
                            >
                              <i class="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody
                    v-if="
                      client.discount &&
                        (client.discount.prepay != 100 ||
                          client.discount.prepay < 100)
                    "
                  >
                    <tr v-for="(month, index) in credit_months" :key="index">
                      <td>
                        {{ month.month | moment("DD.MM.YYYY") }}
                      </td>

                      <td>
                        Ежемесячно
                      </td>

                      <td>
                        <div
                          class="
                            d-flex d-flex
                            justify-content-between
                            align-items-center
                          "
                        >
                          <span v-if="!month.edit">
                            {{
                              month.amount
                                | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                            }}
                            {{ $t("ye") }}
                          </span>

                          <div class="col-md-6 float-left" v-if="month.edit">
                            <div class="row">
                              <input
                                type="text"
                                class="form-control"
                                v-model="month.amount"
                              />
                            </div>
                          </div>

                          <button
                            v-if="
                              (getMe.role.id === 1 && !month.edit) ||
                                (getPermission.contracts.monthly && !month.edit)
                            "
                            type="button"
                            @click="editMonthlyPayment(index)"
                            class="btn btn-sm btn-primary mr-0 mt-0"
                          >
                            <i class="fa fa-edit"></i>
                          </button>

                          <div v-if="month.edit">
                            <button
                              v-if="
                                getMe.role.id === 1 ||
                                  getPermission.contracts.monthly
                              "
                              type="button"
                              @click="editMonthlyPayment(index)"
                              class="btn btn-sm btn-success mr-0 mt-0"
                            >
                              <i class="fa fa-save"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- sticky sidebar -->
            <div class="col-xl-4 h-auto">
              <div class="sticky-top">
                <!-- Информация клиента -->
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

                <!-- Apartments -->
                <div class="new-object p-0">
                  <div v-b-toggle.collapse-apartments block class="d-flex p-3">
                    <span>Список квартир:</span>
                    <strong
                      v-if="isVisibleApartments"
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
                    id="collapse-apartments"
                    v-model="isVisibleApartments"
                    class="px-3 pb-3"
                  >
                    <QuickViewApartments
                      v-for="(apartment, index) in getThisApartments"
                      :key="apartment.id"
                      :apartment="apartment"
                      :index="index"
                      @changedApartmentPrice="changedApartmentPrice"
                    />
                  </b-collapse>
                </div>

                <!-- Calc -->
                <div class="new-object p-3">
                  <div class="object-calculator">
                    <!-- Select percente -->
                    <b-form-group
                      class="mb-1"
                      label-cols="12"
                      content-cols="12"
                      :label="$t('apartments.agree.placeholder.enter_discount')"
                      label-for="discounts"
                    >
                      <b-form-select
                        id="discounts"
                        v-model="client.discount"
                        @input="changeDiscount"
                      >
                        <b-form-select-option
                          v-for="(discount, index) in getApartmentDiscounts"
                          :value="discount"
                          :key="'discount-' + index"
                        >
                          {{ $t("apartments.view.variant") }}
                          {{ index + 1 }} - {{ discount.prepay }}%
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>

                    <!-- Цена продажы за м2 -->
                    <b-form-group
                      class="mb-1"
                      label-cols="12"
                      content-cols="12"
                      label="Цена продажы за м2:"
                      label-for="price"
                    >
                      <vue-numeric
                        id="price"
                        v-model="calc.price_for_m2"
                        :currency="$t('ye')"
                        :precision="2"
                        class="form-control"
                        currency-symbol-position="suffix"
                        separator="space"
                        disabled
                      ></vue-numeric>
                    </b-form-group>

                    <!-- Скидка when apartment count = 1 -->
                    <b-form-group
                      v-if="allApartments && allApartments.length > 1"
                      class="mb-1"
                      label-cols="12"
                      content-cols="12"
                      label="Скидка от общей суммы:"
                      label-for="total-discound-price"
                    >
                      <vue-numeric
                        id="total-discound-price"
                        :value="calc.total_discount_price"
                        @change="changeTotalDiscountPrice($event)"
                        :currency="$t('ye')"
                        :precision="2"
                        class="form-control"
                        currency-symbol-position="suffix"
                        separator="space"
                      ></vue-numeric>
                    </b-form-group>

                    <!-- Скидка от общей суммы | Скидка за м2 -->
                    <b-tabs pills v-else class="mb-1 mt-2">
                      <!-- Скидка от общей суммы -->
                      <b-tab title="Скидка от общей суммы:" active>
                        <b-card-text>
                          <vue-numeric
                            :value="calc.total_discount_price"
                            @change="changeTotalDiscountPrice($event)"
                            :currency="$t('ye')"
                            :precision="2"
                            class="form-control mt-1"
                            currency-symbol-position="suffix"
                            separator="space"
                          ></vue-numeric>
                        </b-card-text>
                      </b-tab>
                      <!-- Скидка за м2 -->
                      <b-tab title="Скидка за м2:">
                        <b-card-text>
                          <vue-numeric
                            :value="calc.discount_price"
                            @change="changeDiscountPriceForM2($event)"
                            :currency="$t('ye')"
                            :precision="2"
                            class="form-control mt-1"
                            currency-symbol-position="suffix"
                            separator="space"
                          ></vue-numeric>
                        </b-card-text>
                      </b-tab>
                    </b-tabs>

                    <!-- Предоплата -->
                    <div>
                      Предоплата: <span> {{ calc.prepay_percente }}%</span>
                    </div>

                    <!-- Первый взнос -->
                    <b-form-group
                      class="mb-1"
                      v-if="client.discount && client.discount.amount > 0"
                      label-cols="12"
                      content-cols="12"
                      label="Первый взнос: "
                      label-for="prepay_to"
                    >
                      <vue-numeric
                        id="prepay_to"
                        v-model="calc.prepay"
                        class="form-control"
                        :currency="$t('ye')"
                        :precision="2"
                        currency-symbol-position="suffix"
                        separator="space"
                        disabled
                      ></vue-numeric>
                    </b-form-group>

                    <!-- Ежемесячный -->
                    <b-form-group
                      class="mb-1"
                      v-if="client.discount && client.discount.amount > 0"
                      label-cols="12"
                      content-cols="12"
                      label="Ежемесячный:"
                      label-for="credit_month"
                    >
                      <b-form-input
                        id="credit_month"
                        min="1"
                        type="number"
                        @change="changeDiscountMonth"
                        v-model="calc.month"
                      >
                      </b-form-input>
                      <vue-numeric
                        id="credit_price_for_month"
                        v-model="monthly_price"
                        class="form-control mt-2"
                        :currency="$t('ye')"
                        :precision="2"
                        currency-symbol-position="suffix"
                        separator="space"
                        disabled
                        read-only-class="true"
                      ></vue-numeric>
                      <span style="position: absolute; right: 40px; top: 6px"
                        >месяцев</span
                      >
                    </b-form-group>

                    <!-- Остаток -->
                    <b-form-group
                      v-if="client.discount && client.discount.amount > 0"
                      class="mb-1"
                      label-cols="12"
                      content-cols="12"
                      label="Остаток: "
                      label-for="debt"
                    >
                      <vue-numeric
                        id="debt"
                        v-model="calc.debt"
                        :currency="$t('ye')"
                        :precision="2"
                        class="form-control"
                        currency-symbol-position="suffix"
                        separator="space"
                        disabled
                      ></vue-numeric>
                    </b-form-group>

                    <!-- Итого -->
                    <b-form-group
                      class="mb-1"
                      label-cols="12"
                      content-cols="12"
                      label="Итого: "
                      label-for="total"
                    >
                      <vue-numeric
                        id="total"
                        v-model="calc.total"
                        :currency="$t('ye')"
                        :precision="2"
                        class="form-control"
                        currency-symbol-position="suffix"
                        separator="space"
                        disabled
                      ></vue-numeric>
                    </b-form-group>
                  </div>
                </div>

                <!-- Payment -->
                <div class="new-object p-3 d-none">
                  <!--  Цена продажи: -->
                  <div v-if="!edit.price">
                    <h6 class="color-blue-darker mb-0">
                      Цена продажи:
                      {{
                        client.discount && client.discount.id === "other"
                          ? apartment_edit.price
                          : allApartments.price
                            | number("0,0.00", {
                              thousandsSeparator: " ",
                              decimalSeparator: ",",
                            })
                      }}
                      {{ $t("ye") }}
                    </h6>

                    <!-- Первоначальный взнос -->
                    <div class="container px-0 mx-0 mt-4">
                      <div class="row">
                        <div class="col-12">
                          <div class="mb-3" v-if="month > 0">
                            <label
                              class="d-block h6 font-weight-normal"
                              for="initial-fee"
                              >Первоначальный взнос:</label
                            >
                            <div class="row">
                              <div class="col-md-8">
                                <input
                                  id="initial-fee"
                                  class="my-form__input"
                                  disabled
                                  type="text"
                                  :value="
                                    client.discount &&
                                    client.discount.id === 'other' &&
                                    month == 0
                                      ? getTotalOther()
                                      : getPrepay()
                                        | number('0,0.00', {
                                          thousandsSeparator: ' ',
                                          decimalSeparator: ',',
                                        })
                                  "
                                />
                              </div>
                              <div class="col-md-4 pl-md-0 mt-md-0 mt-2">
                                <input
                                  class="my-form__input"
                                  disabled
                                  type="text"
                                  :value="
                                    client &&
                                    client.discount &&
                                    client.discount.prepay
                                      ? client.discount.prepay.toFixed(2) + ' %'
                                      : ''
                                  "
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            v-if="
                              client.discount && client.discount.id === 'other'
                            "
                            @click="edit.price = true"
                            class="btn btn-light mx-auto mb-3"
                          >
                            <i class="fa fa-edit"></i>
                            {{ $t("apartments.agree.edit_price") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Цена продажи -->
                  <div class="row" v-else>
                    <div class="col-12">
                      <div class="mb-3">
                        <label class="d-block" for="initial-fee"
                          >Цена продажи:</label
                        >
                        <div class="row">
                          <div class="col-12">
                            <input
                              id="initial-price"
                              class="my-form__input"
                              step="0.01"
                              type="number"
                              v-model="apartment_edit.price"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="mb-3" v-if="month > 0">
                        <label class="d-block" for="initial-fee"
                          >Первоначальный взнос:</label
                        >
                        <div class="row">
                          <div class="col-md-10">
                            <input
                              id="initial-fee"
                              class="my-form__input"
                              type="number"
                              step="0.01"
                              v-model="apartment_edit.prepay_price"
                            />
                          </div>
                          <div
                            class="
                              col-md-2
                              pl-0
                              d-flex
                              align-items-center
                              justify-content-start
                            "
                          >
                            <div class="h6 mb-0">
                              {{
                                client &&
                                client.discount &&
                                client.discount.prepay
                                  ? client.discount.prepay.toFixed(2)
                                  : ""
                              }}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        @click="edit.price = false"
                        class="btn btn-primary mx-auto mb-3"
                      >
                        <i class="fa fa-save"></i> {{ $t("save") }}
                      </button>
                    </div>
                  </div>

                  <!-- Сумма рассрочки -->
                  <table
                    class="table mx-0 p-0 my-0 my-table-another-variant"
                    v-if="month > 0"
                  >
                    <tbody class="m-0 p-0">
                      <tr>
                        <td class="px-0 py-2">Сумма рассрочки</td>
                        <td class="px-0 py-2 text-right">
                          {{
                            getDebt()
                              | number("0,0.00", {
                                thousandsSeparator: " ",
                                decimalSeparator: ",",
                              })
                          }}
                          {{ $t("ye") }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="new-object p-3">
                  <!-- Комментария -->
                  <div class="d-none">
                    <label>Комментария</label>
                    <textarea
                      rows="3"
                      cols="3"
                      v-model="comment"
                      class="form-control"
                    ></textarea>
                  </div>

                  <!-- error msg -->
                  <div class="alert alert-danger mt-3" v-if="error">
                    <ul>
                      <li v-for="(error, index) in errors" :key="index">
                        <span v-for="msg in error" :key="msg">
                          {{ msg }}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <!-- Btns -->
                  <div class="sidebar-btns">
                    <button
                      type="button"
                      class="btn btn-secondary mr-0"
                      @click="[(step = 1), (next = true), (confirm = false)]"
                    >
                      <i class="fa fa-chevron-circle-left"></i>
                      {{ $t("back") }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-default mx-md-2"
                      @click="removeBlock"
                    >
                      {{ $t("cancel") }}
                    </button>

                    <button
                      type="submit"
                      class="btn btn-success mr-0"
                      v-if="!loading && confirm"
                    >
                      {{ $t("create_agree") }}
                      <i class="fa fa-file-contract"></i>
                    </button>
                    <button
                      v-if="loading && confirm"
                      type="button"
                      class="btn btn-success mr-0"
                    >
                      {{ $t("create_agree") }}
                      <i class="fas fa-spinner fa-spin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- success-agree modal -->
    <SuccessAgree
      v-if="
        apartmentInfoItem.status != 'sold' ||
          apartmentInfoItem.status != 'contract'
      "
      :contract="contract"
      :apartments="allApartments.length"
    />
  </main>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import moment from "moment";
import SuccessAgree from "./Components/SuccessAgree";
import QuickViewApartments from "./Components/QuickViewApartments";
import VueNumeric from "vue-numeric";
import FlipCountdown from "vue2-flip-countdown";
export default {
  name: "ConfirmApartment",

  data() {
    return {
      step: 1,
      search_label: "",
      client: {
        first_name: {
          lotin: "Test",
          kirill: "Test",
        },
        last_name: {
          lotin: "Test",
          kirill: "tEst",
        },
        second_name: {
          lotin: "test",
          kirill: "test",
        },
        passport_series: "ab1234567",
        issued_by_whom: "1sdvsdv",
        date_of_issue: "2020-01-01",
        language: "uz",
        type_client: "unknown",
        birth_day: "1994-01-01",
        phone: "998913333111",
        other_phone: null,
        first_payment_date: "2022-01-01",
        payment_date: "2022-01-01",
        discount: {
          prepay: null,
        },
        calc_month: null,
      },

      apartment_edit: {
        price: 0,
        prepay_price: 0,
        percente: 0,
        contract_number: null,
        contract_date: "2023-01-01",
      },

      comment: "",

      date_change: false,

      confirm: false,
      next: false,

      edit: {
        price: false,
        monthly: false,

        monthly_edited: false,
        apartment_table_edit: false,
      },

      edited: {
        contract_number: false,
        toggle: false,
        monthly: false,
        apartmentsPrice: false,
      },

      error: false,
      errors: {},
      geteErrors: [],

      credit_months: [],
      initial_payments: [],

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
      contract: {
        id: null,
        contract: null,
        contract_path: null,
      },
      loading: false,
      isVisibleInfo: false,
      isVisibleApartments: true,
      calc: {
        discount_price: "0",
        total_discount_price: "0",
      },
      month: 6,
      monthly_price: 0,
      clientData: {},
      allApartments: [],
      getThisApartmentForTable: [],
      getThisApartments: [],
      getApartmentDiscounts: [],
      expiry_at: null,
      expiry_at2: "2021-12-24 15:00:00",
    };
  },

  components: {
    SuccessAgree,
    VueNumeric,
    QuickViewApartments,
    FlipCountdown,
  },

  created() {
    this.backToView();

    const expired = this.$moment(this.getApartmentOrder.expiry_at)
      .utcOffset("+0500")
      .format("YYYY-MM-DD H:mm:ss");
    this.expiry_at = expired;
  },

  computed: {
    ...mapGetters([
      "getReserveClient",
      "getPermission",
      "getMe",
      "getApartmentOrder",
    ]),

    apartmentInfoItem() {
      let val = this.getApartmentOrder;
      if (val) {
        return {
          contract_number: val.contract_number,
          created_by: val.created_by,
          expiry_at: this.$moment(val.expiry_at)
            .utcOffset("+0500")
            .format("YYYY-MM-DD h:mm:ss"),
          status: val.status,
          uuid: val.uuid,
        };
      }
      return {};
    },
  },

  watch: {
    month: function(newVal) {
      this.CreditMonths(newVal);
    },

    step: function(val) {
      if (val) {
        this.CreditMonths(this.month);
      }
    },

    "apartment_edit.price": function() {
      this.getDiscountEdited();
      this.CreditMonths(this.month);
    },

    "apartment_edit.prepay_price": function() {
      this.getDiscountEdited();
      this.CreditMonths(this.month);
    },
  },

  mounted() {
    this.fetchApartmentOrder(this).then(() => {
      this.apartment_edit.contract_number = this.deepCloneFromApartments(
        this.apartmentInfoItem.contract_number
      );
      this.getAllData();

      const current = this.$moment(new Date())
        .utcOffset("+0500")
        .format("YYYY-MM-DD H:mm:ss");
      const expired = this.$moment(this.getApartmentOrder.expiry_at)
        .utcOffset("+0500")
        .format("YYYY-MM-DD H:mm:ss");
      this.expiry_at = expired;
      const time = new Date(current) - new Date(expired);
      if (time > 0) {
        this.timeElapsedHandler();
      }
    });
  },

  methods: {
    ...mapActions(["fetchApartmentOrder"]),

    // Timer
    timeElapsedHandler() {
      console.log("Time is up!");
      this.expiredConfirm();
    },
    async expiredConfirm() {
      try {
        await this.axios
          .delete(
            process.env.VUE_APP_URL +
              `/orders/${this.getApartmentOrder.uuid}/hold/`,
            this.header
          )
          .then((res) => {
            if (res.data) {
              this.$router.push({
                name: "apartments",
              });
            }
          })
          .catch();
      } catch (error) {
        this.$router.push({
          name: "apartments",
        });
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
    successAgree(value) {
      this.contract = value;
      this.$bvModal.show("modal-success-agree");
    },
    CloseAgree() {
      this.confirm = false;
    },
    backToView() {
      if (this.apartmentInfoItem.status == "contract") {
        this.$router.push({
          name: "apartment-view",
          params: {id: this.$route.params.id},
        });
      }
    },
    async Search() {
      try {
        const {data} = await this.axios.get(
          process.env.VUE_APP_URL +
            "/clients/search?field=" +
            this.search_label,
          this.header
        );
        this.step = 1;

        this.client = {
          id: data.id,
          first_name: data.first_name ?? {
            lotin: null,
            kirill: null,
          },
          last_name: data.last_name ?? {
            lotin: null,
            kirill: null,
          },
          second_name: data.second_name ?? {
            lotin: null,
            kirill: null,
          },
          passport_series: data.passport_series,
          issued_by_whom: data.issued_by_whom,
          language: data.language,
          birth_day: data.birth_day,
          phone: data.phone,
          other_phone: data.other_phone,
          date_of_issue: data.date_of_issue,
          discount: {id: null},
        };
      } catch (error) {
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
    getValidationState({dirty, validated, valid = null}) {
      return dirty || validated ? valid : null;
    },
    onSubmit() {
      this.step = 2;
      this.confirm = true;
      this.next = false;
      this.getAllData();
    },
    async postStore() {
      this.loading = true;
      await this.axios
        .post(process.env.VUE_APP_URL + "/clients", this.client, this.header)
        .then((response) => {
          this.loading = false;
          if (response) {
            this.clientData = response.data;
            this.onSubmit();
          }
        })
        .catch((error) => {
          this.loading = false;
          if (!error.response) {
            this.toasted("Error: Network Error", "error");
          } else {
            if (error.response.status === 403) {
              this.toasted(error.response.data.message, "error");
            } else if (error.response.status === 401) {
              this.toasted(error.response.data, "error");
            } else if (error.response.status === 500) {
              this.toasted(error.response.data.message, "error");
            } else if (error.response.status === 422) {
              this.error = true;
              this.geteErrors = error.response.data;
            } else {
              this.toasted(error.response.data.message, "error");
            }
          }
        });
    },
    async sendForm() {
      if (this.client.discount && this.client.discount.id === null) return;
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_agree"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_agree"),
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          const formData = new FormData();
          formData.append("discount_id", this.client.discount.id);

          if (this.edited.contract_number)
            formData.append("type_client", this.type_client);

          // formData.append("monthly_edited", this.edit.monthly_edited ? 1 : 0);
          formData.append("client_id", this.clientData?.id);

          if (
            this.getMe.role.id === 1 ||
            this.getPermission.contracts.monthly
          ) {
            if (this.edit.monthly_edited) {
              for (
                let monthly = 0;
                monthly < this.credit_months.length;
                monthly++
              ) {
                let date = moment(this.credit_months[monthly].month).format(
                  "YYYY-MM-DD"
                );
                formData.append(
                  "monthly[" + monthly + "][edited]",
                  this.credit_months[monthly].edited ? 1 : 0
                );
                formData.append(
                  "monthly[" + monthly + "][amount]",
                  this.credit_months[monthly].amount
                );
                formData.append("monthly[" + monthly + "][date]", date);
              }
            }
          }
          if (this.edit.initial_edited) {
            for (
              let initial_payment = 0;
              initial_payment < this.initial_payments.length;
              initial_payment++
            ) {
              formData.append(
                "initial_payments[" + initial_payment + "][edited]",
                this.initial_payments[initial_payment].edited ? 1 : 0
              );
              formData.append(
                "initial_payments[" + initial_payment + "][amount]",
                this.initial_payments[initial_payment].amount
              );
              formData.append(
                "initial_payments[" + initial_payment + "][date]",
                this.initial_payments[initial_payment].month
              );
            }
          }
          if (this.edit.apartmentsPrice) {
            if (
              this.client.discount.type === "percent" &&
              this.client.discount.prepay === 100
            ) {
              for (let index = 0; index < this.allApartments.length; index++) {
                formData.append(
                  "apartments[" + index + "][id]",
                  this.allApartments[index].id
                );
                formData.append(
                  "apartments[" + index + "][price]",
                  this.allApartments[index].price
                );
              }
            } else {
              for (
                let index = 0;
                index < this.getThisApartmentForTable.length;
                index++
              ) {
                formData.append(
                  "apartments[" + index + "][id]",
                  this.getThisApartmentForTable[index].id
                );
                formData.append(
                  "apartments[" + index + "][price]",
                  this.getThisApartmentForTable[index].price
                );
              }
            }
          }

          formData.append("comment", this.comment);
          formData.append("months", this.month);

          formData.append("first_payment_date", this.client.first_payment_date);

          if (this.client.payment_date)
            formData.append("payment_date", this.client.payment_date);

          formData.append("date_change", 1);
          formData.append("contract_date", this.apartment_edit.contract_date);
          if (this.step === 1 && this.client.discount.prepay != 100) {
            formData.append("months", this.month);
          }
          if (
            this.edited.contract_number &&
            this.apartment_edit.contract_number !==
              this.apartmentInfoItem.contract_number
          ) {
            formData.append(
              "contract_number",
              this.apartment_edit.contract_number
            );
          }

          this.axios
            .post(
              process.env.VUE_APP_URL +
                "/orders/" +
                this.getApartmentOrder?.uuid,
              formData,
              this.header
            )
            .then((response) => {
              this.loading = false;
              this.toasted(response.data.message, "success");
              this.$bvModal.hide("modal-agree");
              this.contract = response.data;
              this.$bvModal.show("modal-success-agree");
            })
            .catch((error) => {
              this.loading = false;
              if (!error.response) {
                this.toasted("Error: Network Error", "error");
              } else {
                if (error.response.status === 403) {
                  this.toasted(error.response.data.message, "error");
                } else if (error.response.status === 401) {
                  this.toasted(error.response.data, "error");
                } else if (error.response.status === 500) {
                  this.toasted(error.response.data.message, "error");
                } else if (error.response.status === 422) {
                  this.error = true;
                  this.geteErrors = error.response.data;
                } else {
                  this.toasted(error.response.data.message, "error");
                }
              }
            });
        }
      });
    },
    removeBlock() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_agree"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_close"),
      }).then((result) => {
        if (result.value) {
          this.expiredConfirm();
        }
      });
    },
    cancelForm() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_agree"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_close"),
      }).then((result) => {
        if (result.value) {
          this.expiredConfirm();
        }
      });
    },
    async getClientData() {
      this.search_label = this.client.passport_series;
      if (this.search_label.length == 9) {
        try {
          const {data} = await this.axios.get(
            process.env.VUE_APP_URL +
              "/clients/search?field=" +
              this.search_label,
            this.header
          );
          this.client = {
            id: data.id,
            first_name: data.first_name ?? {
              lotin: null,
              kirill: null,
            },
            last_name: data.last_name ?? {
              lotin: null,
              kirill: null,
            },
            second_name: data.second_name ?? {
              lotin: null,
              kirill: null,
            },
            passport_series: data.passport_series,
            issued_by_whom: data.issued_by_whom,
            language: data.language,
            birth_day: data.birth_day,
            phone: data.phone,
            other_phone: data.other_phone,
            date_of_issue: data.date_of_issue,
            discount: {id: null},
          };
        } catch (error) {
          this.toastedWithErrorCode(error);
        }
      } else {
        this.toasted("Введите номер и серию паспорта правильно", "error");
      }
    },

    // Calc
    getAllData() {
      this.allApartments = this.deepCloneFromApartments(
        this.getApartmentOrder.apartments
      );
      let arr = this.deepCloneFromApartments(
        this.getApartmentOrder.apartments
      )[0].discounts;
      arr = arr.sort((a, b) => a.prepay - b.prepay);
      this.getApartmentDiscounts = arr;
      this.client.discount = arr[0];
      this.initialCalc();
    },
    initialCalc() {
      /* eslint-disable no-debugger */
      // debugger;
      if (this.client.discount.type === "percent") {
        if (this.client.discount.prepay === 100) {
          let price = 0;
          let area = 0;
          for (let index = 0; index < this.allApartments.length; index++) {
            price += this.allApartments[index]?.price;
            area += this.allApartments[index]?.plan.area;
          }
          this.calc.price_for_m2 = price / area;
        } else {
          this.calc.price_for_m2 =
            this.getTotalForPercente() / this.planAreas();
        }
      } else {
        this.calc.price_for_m2 = this.getPrice() / this.planAreas();
      }
      this.calc.prepay_percente = this.client?.discount?.prepay;
      this.calc.prepay = this.getPrepay();
      this.calc.month = this.allApartments[0]?.object?.credit_month;
      this.month = this.calc?.month;

      this.calc.monthly_price = this.getMonths();
      this.monthly_price = this.calc?.monthly_price;
      this.calc.debt = this.getDebt();
      this.calc.total = this.getTotal();

      this.CreditMonths(this.month);
      this.getThisApartments = this.getThisApartmentForTable;
    },
    deepCloneFromApartments(obj) {
      let temp;
      if (obj === null || typeof obj !== "object") return obj;
      if (obj instanceof Date) temp = new obj.constructor();
      else temp = obj.constructor();

      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          temp[key] = this.deepCloneFromApartments(obj[key]);
        }
      }
      return temp;
    },

    getPrepay() {
      if (this.client.discount.prepay === 100) return this.getTotal();
      let total_discount = this.getDiscount();

      let total;

      switch (this.client.discount.type) {
        case "fixed":
          if (parseFloat(this.calc.discount_price)) {
            total =
              (parseFloat(this.client.discount.amount) -
                parseFloat(this.calc.discount_price)) *
              this.planAreas();
          } else {
            total = this.getPrice();
          }
          break;
        default:
          total = this.getTotalForPercente() / total_discount;
          break;
      }

      if (this.initial_payments.length > 1) {
        total = 0;

        for (let i = 0; this.initial_payments.length > i; i++) {
          total += parseFloat(this.initial_payments[i].amount);
        }

        return total;
      }

      if (this.apartment_edit.prepay_price) {
        return parseFloat(this.apartment_edit.prepay_price);
      }

      return (this.client.discount.prepay * total) / 100;
    },
    getDiscount() {
      /* eslint-disable no-debugger */
      // debugger;
      if (this.client.discount.prepay === 100) return 1;

      return 1 - this.client.discount.amount / 100;
    },
    getTotal() {
      /* eslint-disable no-debugger */
      // debugger;
      let total_discount = this.getDiscount();
      let total = 0;

      switch (this.client.discount.type) {
        case "fixed":
          if (parseFloat(this.calc.discount_price)) {
            total =
              (this.client.discount.amount -
                parseFloat(this.calc.discount_price)) *
              this.planAreas();
          } else {
            total = this.getPrice();
          }
          break;
        default:
          total = this.getPrice() / total_discount;
          // if (this.allApartments.length > 1) {
          //   if (parseFloat(this.calc.discount_price)) {
          //     total -= parseFloat(this.calc.discount_price) * this.planAreas();
          //   }
          // }
          break;
      }

      return total;
    },
    getPrice() {
      var price = [];
      switch (this.client.discount.type) {
        case "fixed":
          for (let i = 0; this.allApartments.length > i; i++) {
            const amountApartment = this.allApartments[i].discounts.find(
              (val) => val.prepay == this.client.discount.prepay
            ).amount;
            const totalAmount = parseFloat(
              amountApartment * this.allApartments[i].plan.area
            );
            price.push(parseFloat(totalAmount));
            this.getThisApartmentForTable[i] = {
              number: this.allApartments[i].number,
              id: this.allApartments[i].id,
              price: totalAmount,
              rooms: this.allApartments[i].rooms,
              floor: this.allApartments[i].floor,
              plan: {
                area: this.allApartments[i].plan.area,
                balcony_area: this.allApartments[i].plan.balcony_area,
              },
              // if (!this.edit.apartment_table_edit) {
              //   };
            };
          }
          break;
        default:
          if (this.client.discount.prepay === 100) {
            console.log(this.allApartments);
            for (let index = 0; index < this.allApartments.length; index++) {
              this.getThisApartmentForTable[index] = {
                number: this.allApartments[index].number,
                id: this.allApartments[index].id,
                price: this.allApartments[index].price,
                rooms: this.allApartments[index].rooms,
                floor: this.allApartments[index].floor,
                plan: {
                  area: this.allApartments[index].plan.area,
                  balcony_area: this.allApartments[index].plan.balcony_area,
                },
              };
              price.push(parseFloat(this.getThisApartmentForTable[index].price));
            }
          } else {
            for (let i = 0; this.allApartments.length > i; i++) {
              price.push(parseFloat(this.allApartments[i].price));
            }
          }
          break;
      }
      return price.reduce((a, b) => a + b, 0);
    },
    planAreas() {
      var planAreas = 0;
      for (let i = 0; this.allApartments.length > i; i++) {
        planAreas += this.allApartments[i].plan.area;
      }
      return planAreas;
    },
    getMonths() {
      return (this.getTotal() - this.getPrepay()) / this.calc.month;
    },
    getDebt() {
      return this.getTotal() - this.getPrepay();
    },
    getTotalMultiple() {
      let total_discount = this.getDiscount();
      let price = this.getPrice();
      let total = 0;

      if (this.client.discount.id === "other")
        total = this.apartment_edit.price / total_discount;
      else {
        switch (this.client.discount.type) {
          case "fixed":
            total = price;
            break;
          default:
            total = price / total_discount;
            break;
        }
      }

      return total;
    },
    getTotalForPercente() {
      let total_discount = this.getDiscount();
      let total = 0;
      let price = 0;
      switch (this.client.discount.type) {
        case "fixed":
          if (parseFloat(this.calc.discount_price)) {
            total =
              (parseFloat(this.client.discount.amount) -
                parseFloat(this.calc.discount_price)) *
              this.planAreas();
          } else {
            total = this.getPrice();
          }
          break;
        default:
          for (let index = 0; index < this.allApartments.length; index++) {
            price += this.allApartments[index]?.price_m2;
          }
          total = price / (total_discount * this.allApartments.length);
          break;
      }

      return total;
    },

    // Calc Events
    changeDiscount() {
      this.allApartments = this.deepCloneFromApartments(
        this.getApartmentOrder.apartments
      );
      this.edit.apartment_table_edit = false;
      this.calc.prepay_percente = this.client.discount?.prepay;
      this.calc.discount_price = 0;
      this.calc.total_discount_price = 0;
      if (this.client.discount?.prepay === 100) {
        this.calc.price_for_m2 = this.getTotal() / this.planAreas();
      }
      this.initialCalc();
      this.getThisApartments = this.getThisApartmentForTable;
    },
    changedApartmentPrice(price, id, edited) {
      this.edit.apartmentsPrice = true;
      this.edit.apartment_table_edit = edited;
      for (let index = 0; index < this.allApartments.length; index++) {
        if (id === this.allApartments[index].id) {
          for (let y = 0; y < this.allApartments[index].discounts.length; y++) {
            if (
              this.allApartments[index].discounts[y].prepay ==
              this.client.discount.prepay
            ) {
              this.calc.discount_price =
                Math.abs(
                  this.allApartments[index].discounts[y].amount *
                    parseFloat(this.allApartments[index].plan.area) -
                    price
                ) / parseFloat(this.allApartments[index].plan.area);
              this.calc.total_discount_price = Math.abs(
                this.allApartments[index].discounts[y].amount *
                  parseFloat(this.allApartments[index].plan.area) -
                  price
              );

              this.allApartments[index].discounts[y].amount =
                price / parseFloat(this.allApartments[index].plan.area);
            }
          }
        }
      }

      this.initialCalc();
    },
    changeDiscountPriceForM2(event) {
      this.calc.discount_price = parseFloat(event.target.value);
      if (parseInt(this.calc.discount_price) > 0) {
        this.edit.apartmentsPrice = true;
        this.allApartments = this.deepCloneFromApartments(
          this.getApartmentOrder.apartments
        );
        if (this.allApartments.length > 1) {
          for (let y = 0; y < this.allApartments[0].discounts.length; y++) {
            if (
              this.allApartments[0].discounts[y].prepay ==
              this.client.discount.prepay
            ) {
              this.allApartments[0].discounts[
                y
              ].amount -= this.calc.discount_price;
            }
          }
        } else {
          this.allApartments[0].price -= this.calc.discount_price * this.planAreas()
          this.allApartments[0].price_m2 -= this.calc.discount_price
        }
        this.calc.total_discount_price =
          this.calc.discount_price *
          parseFloat(this.allApartments[0].plan.area);
        this.initialCalc();
      } else {
        this.edit.apartmentsPrice = false;
        this.calc.discount_price = 0;
        this.calc.total_discount_price = 0;
        this.allApartments = this.deepCloneFromApartments(
          this.getApartmentOrder.apartments
        );
        this.initialCalc();
      }
    },
    changeTotalDiscountPrice(event) {
      this.calc.total_discount_price = parseFloat(event.target.value);
      if (parseFloat(this.calc.total_discount_price) > 0) {
        this.edit.apartmentsPrice = true;
        this.allApartments = this.deepCloneFromApartments(
          this.getApartmentOrder.apartments
        );

        if (this.allApartments.length > 1) {
          const average =
            this.calc.total_discount_price / this.allApartments.length;
  
          for (let index = 0; index < this.allApartments.length; index++) {
            if (this.client.discount.prepay === 100) {
              console.log(this.allApartments[index].price, this.allApartments[index].price_m2, average);
              this.allApartments[index].price -= average
              this.allApartments[index].price_m2 -= average / this.allApartments[index].plan.area
            } else {
              for (let y = 0; y < this.allApartments[index].discounts.length; y++) {
               if (
                  this.allApartments[index].discounts[y].prepay ==
                  this.client.discount.prepay
                ) {
                  this.allApartments[index].discounts[y].amount -=
                    average / this.allApartments[index].plan.area;
                }
              }
            }
          }
        } else {
          this.allApartments[0].price -= this.calc.total_discount_price
          this.allApartments[0].price_m2 -= this.calc.total_discount_price / this.planAreas()
        }

        this.calc.discount_price =
          this.calc.total_discount_price / this.planAreas();
        this.initialCalc();
      } else {
        this.edit.apartmentsPrice = false;
        this.calc.total_discount_price = 0;
        this.calc.discount_price = 0;
        this.allApartments = this.deepCloneFromApartments(
          this.getApartmentOrder.apartments
        );
        this.initialCalc();
      }
    },
    changeDiscountMonth() {
      this.monthly_price = this.getMonths();
      this.month = this.calc.month;
    },
    changeMonth() {
      this.monthly_price = this.getMonths();
      this.calc.month = this.month;
    },

    // Table
    getTotalOther() {
      return parseFloat(this.apartment_edit.price);
    },
    DataEdited() {
      let price = this.apartment_edit.price;
      let prepay_price = this.apartment_edit.prepay_price;

      let percente = (prepay_price * 100) / price;

      this.client.discount.prepay = percente;
    },
    deleteInitialPayment(index) {
      if (this.initial_payments.length === 2) {
        this.initial_payments.splice(index, 1);
        this.initial_payments.splice(0, 1);
      } else {
        this.initial_payments.splice(index, 1);
      }
      this.initialCalc();
    },
    editInitialPayment(index) {
      this.initialCalc();

      if (this.initial_payments[index].edit) {
        this.initial_payments[index].edit = false;

        if (
          parseFloat(this.initial_payments[index].amount) != this.getMonths()
        ) {
          this.edit.initial_edited = true;
          this.initial_payments[index].edited = true;
          this.setNewPriceMonthly();
        }

        return;
      }

      this.initial_payments[index].edit = true;

      return;
    },
    addInitialPayment() {
      let today = this.client.first_payment_date
        ? new Date(this.client.first_payment_date)
        : new Date();

      if (this.initial_payments.length === 0) {
        let month = parseInt(this.month);
        let amount = month === 0 ? this.getTotalOther() : this.getPrepay();

        this.initial_payments.push({
          amount: amount,
          edit: false,
          edited: false,
          month: moment(today).format("YYYY-MM-DD"),
        });
      }

      this.initial_payments.push({
        amount: 0,
        edit: false,
        edited: false,
        month: moment(today).format("YYYY-MM-DD"), //today,
      });

      this.getPrepay();
      this.initialCalc();
    },
    SaveEditPrices() {
      this.apartment_edit.price = this.getPrice();
      this.getPrepay();
      this.initialCalc();
      // this.DataEdited();
      this.edit.price = false;
    },
    CreditMonths(newVal) {
      let today = this.client.payment_date
        ? new Date(this.client.payment_date)
        : new Date();

      this.credit_months = [];

      let month_amount = this.getMonths();

      for (let i = 0; i < newVal; i++) {
        this.credit_months.push({
          month: today.setMonth(today.getMonth() + 1),
          amount: month_amount,
          edit: false,
          edited: false,
        });
      }
    },
    editMonthlyPayment(index) {
      if (this.credit_months[index].edit) {
        this.credit_months[index].edit = false;

        if (parseFloat(this.credit_months[index].amount) != this.getMonths()) {
          this.edit.monthly_edited = true;
          this.credit_months[index].edited = true;
          this.setNewPriceMonthly();
        }

        return;
      }

      this.credit_months[index].edit = true;

      return;
    },
    setNewPriceMonthly() {
      let total = this.getPrepay();
      let months = 0;

      for (var i = 0; i < this.credit_months.length; i++) {
        if (this.credit_months[i].edited) {
          total += parseFloat(this.credit_months[i].amount);
        } else {
          months += 1;
        }
      }

      let monthly_amount = (this.getTotal() - total) / months;

      for (var m = 0; m < this.credit_months.length; m++) {
        if (!this.credit_months[m].edited) {
          // if (monthly_amount > 0)
          this.credit_months[m].amount = monthly_amount;
          // else
          //     this.credit_months.splice(m, 1)
        }
      }
    },

    // form
    isCyrillic_last_name_kirill(value) {
      this.client.last_name.kirill = this.symbolIsCyrillic(value);
    },
    isCyrillic_first_name_kirill(value) {
      this.client.first_name.kirill = this.symbolIsCyrillic(value);
    },
    isCyrillic_second_name_kirill(value) {
      this.client.second_name.kirill = this.symbolIsCyrillic(value);
    },

    isLatin_last_name_lotin(value) {
      this.client.last_name.lotin = this.symbolIsLatin(value);
    },
    isLatin_first_name_lotin(value) {
      this.client.first_name.lotin = this.symbolIsLatin(value);
    },
    isLatin_second_name_lotin(value) {
      this.client.second_name.lotin = this.symbolIsLatin(value);
    },

    textToLatin_last_name_kirill(value) {
      if (this.client.last_name.lotin.length === 0) {
        this.client.last_name.lotin = this.translateTextToLatin(value);
      }
    },
    textToLatin_first_name_kirill(value) {
      if (this.client.first_name.lotin.length === 0) {
        this.client.first_name.lotin = this.translateTextToLatin(value);
      }
    },
    textToLatin_second_name_kirill(value) {
      if (this.client.second_name.lotin.length === 0) {
        this.client.second_name.lotin = this.translateTextToLatin(value);
      }
    },

    textToCyrillic_last_name_lotin(value) {
      if (this.client.last_name.kirill.length === 0) {
        this.client.last_name.kirill = this.translateTextToCyrillic(value);
      }
    },
    textToCyrillic_first_name_lotin(value) {
      if (this.client.first_name.kirill.length === 0) {
        this.client.first_name.kirill = this.translateTextToCyrillic(value);
      }
    },
    textToCyrillic_second_name_lotin(value) {
      if (this.client.second_name.kirill.length === 0) {
        this.client.second_name.kirill = this.translateTextToCyrillic(value);
      }
    },

    symbolIsCyrillic(event) {
      return event
        .replace(/[^а-яё ҚқЎўҲҳҒғ]/i, "")
        .replace(/(\..*?)\..*/g, "$1");
    },
    symbolIsLatin(event) {
      return event.replace(/[^a-z. ']/i, "").replace(/(\..*?)\..*/g, "$1");
    },

    translateTextToLatin(value) {
      return this.symbolCyrillicToLatin(value);
    },
    translateTextToCyrillic(value) {
      value = value.replace("Sh", "Ш");
      value = value.replace("sh", "ш");

      value = value.replace("Ch", "Ч");
      value = value.replace("ch", "ч");

      value = value.replace("Q", "Қ");
      value = value.replace("q", "қ");

      value = value.replace("O'", "Ў");
      value = value.replace("o'", "ў");

      value = value.replace("G'", "Ғ");
      value = value.replace("g'", "ғ");

      value = value.replace("Yu", "Ю");
      value = value.replace("yu", "ю");

      value = value.replace("Ya", "Я");
      value = value.replace("Ya", "я");

      value = value.replace("Yo", "Ё");
      value = value.replace("yo", "ё");

      value = value.replace("Ye", "Е");
      value = value.replace("ye", "е");

      value = value.replace("Kh", "Х");
      value = value.replace("kh", "х");

      value = value.replace("H", "Ҳ");
      value = value.replace("h", "ҳ");

      return this.symbolLatinToCyrillic(value);
    },

    symbolCyrillicToLatin(word) {
      var answer = "",
        a = {};

      a["Ё"] = "YO";
      a["Й"] = "I";
      a["Ц"] = "TS";
      a["У"] = "U";
      a["К"] = "K";
      a["Е"] = "E";
      a["Н"] = "N";
      a["Г"] = "G";
      a["Ш"] = "Sh";
      a["Щ"] = "Sch";
      a["З"] = "Z";
      a["Х"] = "Kh";
      a["Ъ"] = "'";
      a["ё"] = "yo";
      a["й"] = "i";
      a["ц"] = "ts";
      a["у"] = "u";
      a["к"] = "k";
      a["е"] = "e";
      a["н"] = "n";
      a["г"] = "g";
      a["ш"] = "sh";
      a["щ"] = "sch";
      a["з"] = "z";
      a["х"] = "kh";
      a["ъ"] = "'";
      a["Ф"] = "F";
      a["Ы"] = "I";
      a["В"] = "V";
      a["А"] = "A";
      a["П"] = "P";
      a["Р"] = "R";
      a["О"] = "O";
      a["Л"] = "L";
      a["Д"] = "D";
      a["Ж"] = "J";
      a["Э"] = "E";
      a["ф"] = "f";
      a["ы"] = "i";
      a["в"] = "v";
      a["а"] = "a";
      a["п"] = "p";
      a["р"] = "r";
      a["о"] = "o";
      a["л"] = "l";
      a["д"] = "d";
      a["ж"] = "j";
      a["э"] = "e";
      a["Я"] = "Ya";
      a["Ч"] = "Ch";
      a["С"] = "S";
      a["М"] = "M";
      a["И"] = "I";
      a["Т"] = "T";
      a["Ь"] = "'";
      a["Б"] = "B";
      a["Ю"] = "Yu";
      a["я"] = "ya";
      a["ч"] = "ch";
      a["с"] = "s";
      a["м"] = "m";
      a["и"] = "i";
      a["т"] = "t";
      a["ь"] = "'";
      a["б"] = "b";
      a["ю"] = "yu";

      a["Қ"] = "Q";
      a["қ"] = "q";

      a["Ў"] = "O'";
      a["ў"] = "o'";

      a["Ҳ"] = "H";
      a["ҳ"] = "h";

      a["Ғ"] = "G'";
      a["ғ"] = "g'";

      for (let i in word) {
        if (word.hasOwnProperty(i)) {
          if (a[word[i]] === undefined) {
            answer += word[i];
          } else {
            answer += a[word[i]];
          }
        }
      }
      return answer;
    },
    symbolLatinToCyrillic(word) {
      var answer = "",
        a = {};

      a["Q"] = "Қ";
      a["q"] = "қ";

      a["O'"] = "Ў";
      a["o'"] = "ў";

      a["H"] = "Ҳ";
      a["h"] = "ҳ";

      a["G'"] = "Ғ";
      a["g'"] = "ғ";

      a["I"] = "И";
      a["U"] = "У";
      a["K"] = "К";
      a["N"] = "Н";
      a["G"] = "Г";
      a["Z"] = "З";
      a["i"] = "и";
      a["u"] = "у";
      a["k"] = "к";
      a["E"] = "Е";
      a["e"] = "е";
      a["n"] = "н";
      a["g"] = "г";
      a["z"] = "з";
      a["F"] = "Ф";
      a["V"] = "В";
      a["P"] = "П";
      a["R"] = "Р";
      a["O"] = "О";
      a["L"] = "Л";
      a["D"] = "Д";
      a["J"] = "Ж";
      a["f"] = "ф";
      a["v"] = "в";
      a["a"] = "а";
      a["A"] = "А";
      a["p"] = "п";
      a["r"] = "р";
      a["o"] = "о";
      a["l"] = "л";
      a["d"] = "д";
      a["j"] = "ж";

      a["S"] = "С";
      a["M"] = "М";
      a["I"] = "И";
      a["T"] = "Т";
      a["B"] = "Б";

      a["s"] = "с";
      a["m"] = "м";
      a["i"] = "и";
      a["t"] = "т";
      a["b"] = "б";

      for (let i in word) {
        if (word.hasOwnProperty(i)) {
          if (a[word[i]] === undefined) {
            answer += word[i];
          } else {
            answer += a[word[i]];
          }
        }
      }
      return answer;
    },
  },
};
</script>

<style scoped lang="scss">
::placeholder {
  color: #a4a4a4;
  opacity: 0.8;
}
.building__img {
  height: 150px;
}
.building__info {
  p {
    font-size: 16px;
  }
}
.table-sm-width {
  @media screen and (max-width: 576px) {
    min-width: 150px;
  }
}
.sidebar-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1366px) {
    flex-wrap: wrap;
    .btn {
      width: 100%;
    }
    flex-direction: column;
  }
}
</style>
