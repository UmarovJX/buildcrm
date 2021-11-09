<template>
  <main>
    <div class="my-container">
      <div class="new-object px-0">
        <div class="container-fluid">
          <form ref="form" @submit.stop.prevent="sendForm">
            <div class="container-fluid px-0 mx-0">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="checkout-pasport">{{
                      $t("apartments.agree.passport_series")
                    }}</label>
                    <input
                      class="my-form__input"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.passport_series')
                      "
                      required
                      v-model="client.passport_series"
                      id="checkout-pasport"
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="issue_passport">{{
                      $t("apartments.agree.issued_by_whom")
                    }}</label>
                    <input
                      class="my-form__input"
                      type="text"
                      :placeholder="
                        $t('apartments.agree.placeholder.issued_by_whom')
                      "
                      required
                      v-model="client.issued_by_whom"
                      id="issue_passport"
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="date_of_issue">{{
                      $t("apartments.agree.date_of_issue")
                    }}</label>
                    <!--                                <b-form-datepicker v-model="client.date_of_issue" locale="ru"></b-form-datepicker>-->
                    <input
                      v-model="client.date_of_issue"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="birth_day">{{
                      $t("apartments.agree.birth_day")
                    }}</label>
                    <input
                      v-model="client.birth_day"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <hr />
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="last_name_kirill"
                      >{{ $t("apartments.agree.last_name") }} (kirill)</label
                    >
                    <input
                      id="last_name_kirill"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="client.last_name.kirill"
                      :placeholder="
                        $t('apartments.agree.placeholder.last_name')
                      "
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="first_name_kirill"
                      >{{ $t("apartments.agree.first_name") }} (kirill)</label
                    >
                    <input
                      id="first_name_kirill"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="client.first_name.kirill"
                      :placeholder="
                        $t('apartments.agree.placeholder.first_name')
                      "
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="second_name_kirill"
                      >{{ $t("apartments.agree.second_name") }} (kirill)</label
                    >
                    <input
                      id="second_namev"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="client.second_name.kirill"
                      :placeholder="
                        $t('apartments.agree.placeholder.second_name')
                      "
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <hr />
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="last_name_lotin"
                      >{{ $t("apartments.agree.last_name") }} (lotin)</label
                    >
                    <input
                      id="last_name_lotin"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="client.last_name.lotin"
                      :placeholder="
                        $t('apartments.agree.placeholder.last_name_lotin')
                      "
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="first_name_lotin"
                      >{{ $t("apartments.agree.first_name") }} (lotin)</label
                    >
                    <input
                      id="first_name_lotin"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="client.first_name.lotin"
                      :placeholder="
                        $t('apartments.agree.placeholder.first_name_lotin')
                      "
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="second_name_lotin"
                      >{{ $t("apartments.agree.second_name") }} (lotin)</label
                    >
                    <input
                      id="second_name_lotin"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="client.second_name.lotin"
                      :placeholder="
                        $t('apartments.agree.placeholder.second_name_lotin')
                      "
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <hr />
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="phone">{{
                      $t("apartments.agree.phone")
                    }}</label>
                    <input
                      class="my-form__input"
                      type="tel"
                      :placeholder="$t('apartments.agree.placeholder.phone')"
                      v-model="client.phone"
                      id="phone"
                    />
                  </div>
                </div>

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

                <div
                  class="col-md-4"
                  v-if="getMe.role.id === 1 || getPermission.contracts.friends"
                >
                  <div class="mb-3">
                    <label class="d-block" for="type_client">{{
                      $t("apartments.agree.type_client")
                    }}</label>
                    <select
                      class="form-control"
                      id="type_client"
                      v-model="type_client"
                    >
                      <option value="unknown">Незнакомый</option>
                      <option value="friends">Знакомый</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-12">
                  <hr />
                </div>

                <div
                  class="col-12 mb-2"
                  v-if="getMe.role.id === 1 || getPermission.contracts.date"
                >
                  <button
                    class="btn btn-primary mb-2"
                    @click="date_change = true"
                    type="button"
                  >
                    <i class="fa fa-calendar"></i> Изменить дата договора
                  </button>

                  <div class="row" v-if="date_change">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="d-block" for="number">{{
                          $t("apartments.agree.number")
                        }}</label>
                        <input
                          id="number"
                          class="my-form__input"
                          type="text"
                          required
                          v-model="apartment_edit.contract_number"
                          :placeholder="
                            $t('apartments.agree.placeholder.number')
                          "
                        />
                      </div>
                    </div>

                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="d-block" for="date">{{
                          $t("apartments.agree.date_contract")
                        }}</label>
                        <input
                          id="date"
                          class="my-form__input"
                          type="date"
                          required
                          v-model="apartment_edit.contract_date"
                          :placeholder="
                            $t('apartments.agree.placeholder.date_contract')
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <hr />
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="d-block" for="discounts">{{
                      $t("apartments.view.variant")
                    }}</label>
                    <select
                      class="form-control"
                      id="discounts"
                      v-model="client.discount"
                      @change="ChangeDiscount()"
                    >
                      <option :value="{id: null}">
                        {{ $t("apartments.agree.placeholder.enter_discount") }}
                      </option>

                      <option
                        v-for="(discount, index) in getApartmentDiscounts"
                        :value="discount"
                        :key="index"
                      >
                        {{ $t("apartments.view.variant") }}
                        {{ index + 1 }} - {{ discount.prepay_to }}%
                      </option>

                      <option
                        v-if="
                          getMe.role.id === 1 ||
                            getPermission.contracts.other_price
                        "
                        :value="{id: 'other', discount: 0, prepay_to: 30}"
                      >
                        {{ $t("apartments.view.other_variant") }}
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  class="col-md-12 my-2"
                  v-if="client.discount.id && client.discount.id != 'other'"
                >
                  <Discount
                    :discount="client.discount"
                    :apartment="apartment"
                  ></Discount>
                </div>

                <div class="col-md-12">
                  <hr />
                </div>

                <div class="col-md-4" v-if="client.discount.id">
                  <div class="mb-3">
                    <label class="d-block" for="first_payment_date">{{
                      $t("apartments.agree.first_payment_date")
                    }}</label>
                    <input
                      v-model="client.first_payment_date"
                      id="first_payment_date"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-md-4" v-if="!confirm && client.discount.id">
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
            </div>

            <div v-if="confirm">
              <hr />
              <label>Комментария</label>
              <textarea
                rows="3"
                cols="3"
                v-model="comment"
                class="form-control"
              ></textarea>
            </div>

            <div class="alert alert-danger mt-3" v-if="error">
              <ul>
                <li v-for="(error, index) in errors" :key="index">
                  <span v-for="msg in error" :key="msg">
                    {{ msg }}
                  </span>
                </li>
              </ul>
            </div>

            <div class="mt-4 d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-secondary mr-2"
                @click="removeBlock"
              >
                {{ $t("cancel") }}
              </button>

              <button
                type="button"
                class="btn btn-primary"
                @click="[(step = 3), (next = false), (confirm = true)]"
                v-if="next"
              >
                {{ $t("next") }} <i class="fa fa-chevron-circle-right"></i>
              </button>

              <button type="submit" class="btn btn-success" v-if="confirm">
                {{ $t("create_agree") }} <i class="fa fa-file-contract"></i>
              </button>
            </div>
          </form>

          <div class="" v-if="step === 3">
            <form ref="form" @submit.stop.prevent="sendForm">
              <div v-if="!edit.price">
                <h6 class="color-blue-darker">
                  Цена продажи:
                  {{
                    client.discount.id === "other"
                      ? apartment_edit.price
                      : apartment.price
                        | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                  }}
                  {{ $t("ye") }}
                </h6>

                <div class="container px-0 mx-0 mt-4">
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3" v-if="month > 0">
                        <label class="d-block" for="initial-fee"
                          >Первоначальный взнос:</label
                        >
                        <div class="row">
                          <div class="col-md-4 col-8">
                            <input
                              id="initial-fee"
                              class="my-form__input"
                              disabled
                              type="text"
                              :value="
                                client.discount.id === 'other' && month == 0
                                  ? getTotalOther()
                                  : getPrepay()
                                    | number('0,0.00', {
                                      thousandsSeparator: ' ',
                                      decimalSeparator: ',',
                                    })
                              "
                            />
                          </div>
                          <div
                            class="col-md-4 col-4 pl-0 d-flex align-items-center justify-content-start"
                          >
                            <div class="h6 mb-0">
                              {{ client.discount.prepay_to.toFixed(2) }}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        v-if="client.discount.id === 'other'"
                        @click="edit.price = true"
                        class="btn btn-light"
                      >
                        <i class="fa fa-edit"></i>
                        {{ $t("apartments.agree.edit_price") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div class="row">
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="d-block" for="initial-fee"
                        >Цена продажи:</label
                      >
                      <div class="row">
                        <div class="col-md-4 col-8">
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
                        <div class="col-md-4 col-8">
                          <input
                            id="initial-fee"
                            class="my-form__input"
                            type="number"
                            step="0.01"
                            v-model="apartment_edit.prepay_price"
                          />
                        </div>
                        <div
                          class="col-md-4 col-4 pl-0 d-flex align-items-center justify-content-start"
                        >
                          <div class="h6 mb-0">
                            {{ client.discount.prepay_to.toFixed(2) }}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="edit.price = false"
                      class="btn btn-primary"
                    >
                      <i class="fa fa-save"></i> {{ $t("save") }}
                    </button>
                  </div>
                </div>
                <div class="container px-0 mx-0 "></div>
              </div>

              <table
                class="table table-hover mx-0 mt-2 p-0 my-table-another-variant"
                v-if="month > 0"
              >
                <tbody class="m-0 p-0">
                  <!--                            <tr>-->
                  <!--                                <td class="px-0 py-2">Скидка - {{ client.discount.discount }}%</td>-->
                  <!--                                <td class="px-0 py-2 text-right">{{ getDiscount() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>-->
                  <!--                            </tr>-->

                  <!--                            <tr>-->
                  <!--                                <td class="px-0 py-2">Итого со скидкой</td>-->
                  <!--                                <td class="px-0 py-2 text-right">{{ getTotal() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>-->
                  <!--                            </tr>-->

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

              <div
                class="col-md-12"
                v-if="
                  client.discount.prepay_to != 100 ||
                    client.discount.prepay_to < 100
                "
              >
                <div class="row">
                  <div class="mb-3">
                    <label class="d-block" for="month">Месяцев</label>
                    <input
                      id="month"
                      class="my-form__input"
                      type="number"
                      min="0"
                      required
                      v-model="month"
                    />
                  </div>
                </div>
              </div>

              <span
                v-if="
                  month > 0 &&
                    (client.discount.prepay_to != 100 ||
                      client.discount.prepay_to < 100)
                "
              >
                {{ month }} месяцев по
                {{
                  getMonth()
                    | number("0,0.00", {
                      thousandsSeparator: " ",
                      decimalSeparator: ",",
                    })
                }}
                {{ $t("ye") }}
              </span>

              <table
                class="table"
                v-if="
                  client.discount.prepay_to != 100 ||
                    client.discount.prepay_to < 100
                "
              >
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
                      {{
                        client.discount.id === "other" && month == 0
                          ? getTotalOther()
                          : getPrepay()
                            | number("0,0.00", {
                              thousandsSeparator: " ",
                              decimalSeparator: ",",
                            })
                      }}
                      {{ $t("ye") }}

                      <button
                        class="btn btn-success btn-sm float-right"
                        type="button"
                        @click="addInitialPayment"
                      >
                        <i class="fa fa-plus-circle"></i>
                      </button>
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
                        class="col-md-4 float-left"
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

                      <button
                        class="btn btn-success btn-sm float-right"
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
                        class="btn btn-sm btn-primary float-right mr-1"
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
                          class="btn btn-sm btn-success float-right mr-1"
                        >
                          <i class="fa fa-save"></i>
                        </button>
                      </div>

                      <button
                        v-if="
                          (index != 0 && getMe.role.id === 1 && !month.edit) ||
                            (index != 0 &&
                              getPermission.contracts.monthly &&
                              !month.edit)
                        "
                        type="button"
                        @click="deleteInitialPayment(index)"
                        class="btn btn-sm btn-danger float-right mr-1"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>

                  <tr v-for="(month, index) in credit_months" :key="index">
                    <td>
                      {{ month.month | moment("DD.MM.YYYY") }}
                    </td>

                    <td>
                      Ежемесячно
                    </td>

                    <td>
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

                      <div class="col-md-4 float-left" v-if="month.edit">
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
                        class="btn btn-sm btn-primary float-right"
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
                          class="btn btn-sm btn-success float-right"
                        >
                          <i class="fa fa-save"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="col-md-12">
                <label>Комментария</label>
                <textarea
                  rows="3"
                  cols="3"
                  v-model="comment"
                  class="form-control"
                ></textarea>
              </div>

              <div class="alert alert-danger mt-3" v-if="error">
                <ul>
                  <li v-for="(error, index) in errors" :key="index">
                    <span v-for="msg in error" :key="msg">
                      {{ msg }}
                    </span>
                  </li>
                </ul>
              </div>
              <div
                class="mt-4 d-flex justify-content-md-end justify-content-center"
              >
                <button
                  type="button"
                  class="btn btn-default mr-2"
                  @click="removeBlock"
                >
                  {{ $t("cancel") }}
                </button>

                <button
                  type="button"
                  class="btn btn-secondary mr-1"
                  @click="[(step = 2), (next = true), (confirm = false)]"
                >
                  <i class="fa fa-chevron-circle-left"></i> {{ $t("back") }}
                </button>

                <button type="submit" class="btn btn-success" v-if="confirm">
                  {{ $t("create_agree") }}
                  <i class="fa fa-file-contract"></i>
                </button>
              </div>
            </form>

            <!--                <button type="submit" class="btn btn-success" v-if="confirm">-->
            <!--                    {{ $t('create_agree') }} <i class="fa fa-file-contract"></i>-->
            <!--                </button>-->
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import Discount from "./Components/Discount";
import moment from "moment";

export default {
  name: "Agree",

  data() {
    return {
      step: 1,
      search_label: "",
      client: {
        id: null,
        first_name: {
          lotin: "",
          kirill: "",
        },
        last_name: {
          lotin: "",
          kirill: "",
        },
        second_name: {
          lotin: "",
          kirill: "",
        },
        passport_series: "",
        issued_by_whom: "",
        birth_day: null,
        language: "uz",
        phone: "",
        other_phone: null,
        date_of_issue: null,
        discount: {id: null},
        edit: false,
        payment_date: null,
        first_payment_date: null,
      },

      type_client: "unknown",

      apartment_edit: {
        price: 0,
        prepay_price: 0,
        percente: 0,
        contract_number: null,
        contract_date: null,
      },

      comment: "",

      month: "6",
      date_change: false,

      confirm: false,
      next: false,

      edit: {
        price: false,
        monthly: false,

        monthly_edited: false,
      },

      error: false,
      errors: [],

      credit_months: [],
      initial_payments: [],

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  components: {
    Discount,
  },

  computed: {
    ...mapGetters([
      "getReserveClient",
      "getPermission",
      "getMe",
      "getApartment",
    ]),

    getApartmentDiscounts() {
      if (this.apartment.object.credit_month != 0) {
        return this.apartment.discounts;
      }

      return [];
    },
    apartment() {
      return this.getApartment;
    },
  },

  watch: {
    month: function(newVal) {
      this.CreditMonths(newVal);
    },

    step: function() {
      this.CreditMonths(this.month);
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
    this.fetchApartment(this);
    //console.log(this.getMe.role.id === 1 && false === false || this.getPermission.contracts.monthly && false === false);

    if (this.apartment.order.id) {
      this.reserveClientFull();
    }

    this.month = this.apartment.object.credit_month;
  },

  methods: {
    ...mapActions(["fetchApartment"]),

    getDiscountEdited() {
      let price = this.apartment_edit.price;
      let prepay_price = this.apartment_edit.prepay_price;

      let percente = (prepay_price * 100) / price;

      this.client.discount.prepay_to = percente;
    },

    deleteInitialPayment(index) {
      if (this.initial_payments.length === 2) {
        this.initial_payments.splice(index, 1);
        this.initial_payments.splice(0, 1);
      } else {
        this.initial_payments.splice(index, 1);
      }
    },

    addInitialPayment() {
      let today = this.client.first_payment_date
        ? new Date(this.client.first_payment_date)
        : new Date();

      if (this.initial_payments.length === 0) {
        let month = parseInt(this.month);
        let amount =
          this.client.discount.id === "other" && month === 0
            ? this.getTotalOther()
            : this.getPrepay();

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
    },

    async Search() {
      try {
        const {data} = await this.axios.get(
          process.env.VUE_APP_URL +
            "/orders/client/search?field=" +
            this.search_label,
          this.header
        );
        this.step = 2;

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
        //console.log(4);
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

    async reserveClientFull() {
      try {
        const {data} = await this.axios.get(
          process.env.VUE_APP_URL +
            "/orders/" +
            this.apartment.order.id +
            "/confirm/client",
          this.header
        );
        this.step = 2;
        this.client = {
          id: data.id,
          first_name: data.first_name,
          birth_day: data.birth_day,
          last_name: data.last_name,
          second_name: data.second_name,
          passport_series: data.passport_series,
          issued_by_whom: data.issued_by_whom,
          language: data.language,
          phone: data.phone,
          other_phone: data.other_phone,
          date_of_issue: data.date_of_issue,
          discount: {id: null},
        };
      } catch (error) {
        //console.log(4);
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

    async sendForm() {
      if (this.client.discount.id === null) return;

      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_agree"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_agree"),
      }).then((result) => {
        if (result.value) {
          const formData = new FormData();

          if (this.apartment.order.id)
            formData.append("order_id", this.apartment.order.id);

          formData.append("type", "simple");
          formData.append("id", this.client.id);

          formData.append("first_name[lotin]", this.client.first_name.lotin);
          formData.append("first_name[kirill]", this.client.first_name.kirill);

          formData.append("last_name[lotin]", this.client.last_name.lotin);
          formData.append("last_name[kirill]", this.client.last_name.kirill);

          formData.append("second_name[lotin]", this.client.second_name.lotin);
          formData.append(
            "second_name[kirill]",
            this.client.second_name.kirill
          );

          formData.append("passport_series", this.client.passport_series);
          formData.append("issued_by_whom", this.client.issued_by_whom);
          formData.append("language", this.client.language);
          formData.append("phone", this.client.phone);
          formData.append("other_phone", this.client.other_phone);
          formData.append("date_of_issue", this.client.date_of_issue);
          formData.append("discount_id", this.client.discount.id);
          formData.append("birth_day", this.client.birth_day);

          formData.append("type_client", this.type_client);

          formData.append("monthly_edited", this.edit.monthly_edited ? 1 : 0);

          if (
            this.getMe.role.id === 1 ||
            this.getPermission.contracts.monthly
          ) {
            for (
              let monthly = 0;
              monthly < this.credit_months.length;
              monthly++
            ) {
              formData.append(
                "monthly[" + monthly + "][edited]",
                this.credit_months[monthly].edited ? 1 : 0
              );
              formData.append(
                "monthly[" + monthly + "][amount]",
                this.credit_months[monthly].amount
              );
              formData.append(
                "monthly[" + monthly + "][date]",
                this.credit_months[monthly].month
              );
            }
          }

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

          formData.append("comment", this.comment);

          if (this.client.discount.id === "other") {
            formData.append("apartment_price", this.apartment_edit.price);
            formData.append(
              "apartment_prepay_price",
              this.apartment_edit.prepay_price
            );
          }

          formData.append("first_payment_date", this.client.first_payment_date);

          if (this.client.payment_date)
            formData.append("payment_date", this.client.payment_date);

          if (this.date_change) {
            formData.append("date_change", 1);
            formData.append(
              "contract_number",
              this.apartment_edit.contract_number
            );
            formData.append("contract_date", this.apartment_edit.contract_date);
          }

          if (this.step === 3 && this.client.discount.prepay_to != 100) {
            formData.append("months", this.month);
          }

          this.axios
            .post(
              process.env.VUE_APP_URL + "/orders/" + this.apartment.id,
              formData,
              this.header
            )
            .then((response) => {
              this.toasted(response.data.message, "success");

              this.$bvModal.hide("modal-agree");

              this.$emit("successAgree", response.data);
            })
            .catch((error) => {
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
                  this.errors = error.response.data;
                } else {
                  this.toasted(error.response.data.message, "error");
                }
              }
            });
          // this.$nextTick(() => {
          //     this.$bvModal.hide('modal-upload-logo')
          // });

          // this.$emit('UploadLogo');
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
          // this.$bvModal.hide("modal-agree");

          // this.$emit("CloseAgree");

          this.$router.push({
            name: "apartments-view",
            params: {id: this.$route.params.id},
          });
        }
      });
    },

    ChangeDiscount() {
      if (this.client.discount.id === "other") {
        this.client.discount = {
          id: "other",
          prepay_to: 30,
          discount: 0,
        };

        this.apartment_edit.price = this.apartment.price;
        this.apartment_edit.prepay_price = this.getPrepay();
      }

      this.CreditMonths(this.month);

      if (this.client.discount.id === null) {
        this.next = false;
        this.confirm = false;
        return;
      }

      if (this.client.discount.prepay_to === 100) {
        this.next = false;
        this.confirm = true;
        return;
      }

      this.confirm = false;
      this.next = true;
      return;
    },

    getPrepay() {
      if (this.prepay_to === 100) return 0;

      let total_discount = this.getDiscount();

      let total;

      if (this.client.discount.id === "other")
        total = this.apartment_edit.price / total_discount;
      else total = this.apartment.price / total_discount;

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

      //console.log(this.client.discount.prepay_to * total / 100);
      return (this.client.discount.prepay_to * total) / 100;
    },

    getTotalOther() {
      //  console.log(parseFloat(this.apartment_edit.price))
      return parseFloat(this.apartment_edit.price);
    },

    getDiscount() {
      if (this.prepay_to === 100) return 0;

      return 1 - this.client.discount.discount / 100;
      // return this.discount.discount * this.apartment.price / 100;
    },

    getMonth() {
      return (this.getTotal() - this.getPrepay()) / this.month;
    },

    getDebt() {
      // let price = this.getTotal() - this.getPrepay();
      //console.log(price);
      // console.log(this.getTotal());
      // console.log(this.getPrepay());

      return this.getTotal() - this.getPrepay();
    },

    getTotal() {
      let total_discount = this.getDiscount();

      //console.log(total_discount);

      // let total = price * area;

      let total = 0;

      if (this.client.discount.id === "other")
        total = this.apartment_edit.price / total_discount;
      else total = this.apartment.price / total_discount;

      return total;
    },

    CreditMonths(newVal) {
      let today = this.client.payment_date
        ? new Date(this.client.payment_date)
        : new Date();

      this.credit_months = [];

      for (var i = 0; i < newVal; i++) {
        this.credit_months.push({
          month: today.setMonth(today.getMonth() + 1),
          amount: this.getMonth(),
          edit: false,
          edited: false,
        });
      }
    },

    editMonthlyPayment(index) {
      if (this.credit_months[index].edit) {
        this.credit_months[index].edit = false;

        if (parseFloat(this.credit_months[index].amount) != this.getMonth()) {
          this.edit.monthly_edited = true;
          this.credit_months[index].edited = true;
          this.setNewPriceMonthly();
        }

        return;
      }

      this.credit_months[index].edit = true;

      return;
    },

    editInitialPayment(index) {
      if (this.initial_payments[index].edit) {
        this.initial_payments[index].edit = false;

        if (
          parseFloat(this.initial_payments[index].amount) != this.getMonth()
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
          this.credit_months[m].amount = monthly_amount;
        }
      }
    },
  },
};
</script>

<style scoped>
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #a4a4a4;
  opacity: 0.8; /* Firefox */
}
</style>
