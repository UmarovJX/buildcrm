<template>
  <main>
    <div class="app-content">
      <base-bread-crumb
          :bread-crumbs="breadCrumbs"
          :active-content="activeContent"
          class="mb-4"
      >
      </base-bread-crumb>
      <div class="card">
        <div class="card-content">
          <!--          <router-link-->
          <!--              :to="{name:'contracts-view-clone'}"-->
          <!--          >-->
          <!--            clone view-->
          <!--          </router-link>-->
          <div class="card-header">
            <h5 class="card-title">
              {{ $t("apartments.list.contract") }} #: {{ order.contract }}
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                {{order.company && order.company.type && order.company.type.name ? order.company.type.name.kr : "" }}
                "{{ order.company ? order.company.name : "" }}"<br/>
                {{ order.company.first_name }} {{ order.company.last_name }}
                {{ order.company.second_name }} <br/>
                р/с: {{ order.company.payment_account }} <br/>
                ИНН: {{ order.company.inn }}, МФО: {{ order.company.mfo }}
                <br/>
              </div>

              <div class="col-md-6 text-right">
                {{ order.client.first_name.kirill }}
                {{ order.client.last_name.kirill }}
                {{ order.client.second_name.kirill }}<br/>
                {{ order.client.passport_series }}<br/>
                {{ order.client.issued_by_whom }}<br/>
                {{ order.client.date_of_issue | moment("DD.MM.YYYY") }}
                берилган<br/>
                {{ order.client.birth_day | moment("DD.MM.YYYY") }}
                тугилган<br/>
                +{{ order.client.phone }}<br/>
                +{{ order.client.other_phone }}<br/>

                <div
                    class="mb-3 ml-auto col-md-5 d-flex justify-content-end flex-column"
                >
                  <label class="d-block" for="type_client">
                    {{ $t("apartments.agree.type_client") }}</label>
                  <select
                      class="form-control"
                      id="type_client"
                      :disabled="!edit.type_client"
                      v-model="order.friends"
                  >
                    <option value="unknown">{{ $t("contracts.view.unfamiliar") }}</option>
                    <option value="friends">{{ $t("contracts.view.familiar") }}</option>
                  </select>

                  <button
                      v-if="
                      !edit.type_client &&
                        ((getMe.role && getMe.role.id === 1) ||
                          (getPermission.contracts &&
                            getPermission.contracts.friends))
                    "
                      @click="edit.type_client = true"
                      class="btn btn-primary mt-3 mr-0"
                  >
                    <i class="fa fa-edit"></i> {{ $t("contracts.view.edit_type") }}
                  </button>

                  <button
                      v-if="
                      edit.type_client &&
                        ((getMe.role && getMe.role.id === 1) ||
                          (getPermission.contracts &&
                            getPermission.contracts.friends))
                    "
                      @click="ChangeTypeClient"
                      class="btn btn-success mt-3"
                  >
                    <i class="fa fa-save"></i> {{ $t("contracts.view.save_btn") }}
                  </button>
                </div>
              </div>

              <div class="col-md-12 mt-3">
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead class="table-dark">
                    <tr>
                      <th scope="col" width="50">
                        {{ $t("apartments.list.number") }}
                      </th>
                      <th scope="col">{{ $t("apartments.list.object") }}</th>
                      <th scope="col">
                        {{ $t("apartments.list.building") }}
                      </th>
                      <th scope="col">{{ $t("apartments.list.block") }}</th>
                      <th scope="col" class="text-center">
                        {{ $t("apartments.list.rooms") }}
                      </th>
                      <th scope="col" class="text-center">
                        {{ $t("apartments.list.floor") }}
                      </th>
                      <th scope="col" class="text-center">
                        {{ $t("apartments.list.entrance") }}
                      </th>
                      <th scope="col" class="text-center">
                        {{ $t("apartments.list.area") }}
                      </th>
                      <th scope="col" class="text-center">
                        {{ $t("apartments.list.balcony") }}
                      </th>
                      <th scope="col">{{ $t("apartments.list.price") }}</th>
                      <th scope="col">
                        {{ $t("apartments.list.price_sold") }}
                      </th>
                      <th scope="col"></th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr
                        v-for="(apartment, index) in order.apartments"
                        :key="index"
                    >
                      <td scope="row">
                        {{ apartment.number }}
                      </td>
                      <td>
                        {{ apartment.object.name }}
                      </td>

                      <td>
                        {{ apartment.building.name }}
                      </td>

                      <td>
                        {{ apartment.block.name }}
                      </td>

                      <td class="text-center">
                        {{ apartment.rooms }}
                      </td>

                      <td class="text-center">
                        {{ apartment.floor }}
                      </td>

                      <td class="text-center">
                        {{ apartment.entrance }}
                      </td>

                      <td class="text-center">
                        {{ apartment.plan.area }} м²
                      </td>

                      <td class="text-center">
                          <span v-if="apartment.plan.balcony">
                            {{ apartment.plan.balcony_area }} м²
                          </span>
                        <span v-else>
                            {{ $t("no") }}
                          </span>
                      </td>

                      <td>
                        {{
                          apartment.price
                              | number("0,0.00", {
                            thousandsSeparator: " ",
                            decimalSeparator: ",",
                          })
                        }}
                        {{ $t("ye") }}
                      </td>

                      <td>
                        {{
                          apartment.price_sold
                              | number("0,0.00", {
                            thousandsSeparator: " ",
                            decimalSeparator: ",",
                          })
                        }}
                        {{ $t("ye") }}
                      </td>

                      <td>
                        <router-link
                            :to="{
                              name: 'apartment-view',
                              params: {id: apartment.id},
                            }"
                            :class="'btn btn-primary btn-sm ml-1'"
                        >
                          <i class="far fa-eye"></i>
                        </router-link>
                      </td>
                    </tr>
                    </tbody>
                  </table>

                  <table
                      class="table table-striped"
                      v-if="
                      order.status === 'contract' || order.status === 'sold'
                    "
                  >
                    <thead class="table-dark">
                    <tr>
                      <th colspan="2">
                        {{ $t('contracts.view.tariff') }}
                      </th>
                    </tr>
                    </thead>

                    <tbody>
                    <!--                                    <tr>-->
                    <!--                                        <td width="240">-->
                    <!--                                            Цена продажи-->
                    <!--                                        </td>-->
                    <!--                                        <td>-->
                    <!--                                            {{ order.apartment.price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}-->
                    <!--                                        </td>-->
                    <!--                                    </tr>-->

                    <tr>
                      <td width="240">
                        {{ $t('contracts.view.dollar_rate') }}
                      </td>
                      <td>
                        {{
                          order.currency.usd
                              | number("0,0.00", {
                            thousandsSeparator: " ",
                            decimalSeparator: ",",
                          })
                        }}
                        {{ $t("ye") }}
                      </td>
                    </tr>

                    <!--                                    <tr>-->
                    <!--                                        <td width="240">-->
                    <!--                                            Скидка-->
                    <!--                                        </td>-->
                    <!--                                        <td>-->
                    <!--                                            {{ order.discount.discount }} %-->
                    <!--                                        </td>-->
                    <!--                                    </tr>-->

                    <tr>
                      <td width="240">
                        {{ $t('contracts.view.initial_fee') }}
                      </td>
                      <td>
                        {{
                          order.initial_payment
                              | number("0,0.00", {
                            thousandsSeparator: " ",
                            decimalSeparator: ",",
                          })
                        }}
                        {{ $t("ye") }}
                      </td>
                    </tr>

                    <tr>
                      <td width="240">
                        {{ $t('contracts.view.apartment_price') }}
                      </td>
                      <td>
                        {{
                          order.transaction_price
                              | number("0,0.00", {
                            thousandsSeparator: " ",
                            decimalSeparator: ",",
                          })
                        }}
                        {{ $t("ye") }}
                      </td>
                    </tr>

                    <tr>
                      <td width="240">
                        {{ $t('contracts.view.remainder') }}
                      </td>
                      <td>
                        {{
                          (order.transaction_price - order.initial_payment)
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

                <!--                            <button class="btn-primary btn mb-3 float-right">-->
                <!--                                <i class="fa fa-plus-circle"></i> Добавить платеж-->
                <!--                            </button>-->

                <div class="d-flex justify-content-end">
                  <b-button
                      :class="payment.view ? null : 'collapsed'"
                      :aria-expanded="payment.view ? 'true' : 'false'"
                      aria-controls="collapse-4"
                      @click="payment.view = !payment.view"
                      variant="primary"
                      class="mb-3"
                  >
                    <i class="fa fa-plus-circle"></i> {{ $t('contracts.view.add_payment') }}
                  </b-button>
                </div>

                <b-collapse
                    id="collapse-4"
                    v-model="payment.view"
                    class="mb-3 w-100 float-left"
                >
                  <div class="card">
                    <form @submit.prevent="CreatePayment">
                      <div class="card-body">
                        <div class="mb-3">
                          <label for="date" class="form-label"
                          >{{ $t('contracts.view.schedule') }}</label
                          >
                          <input
                              type="date"
                              class="form-control"
                              v-model="payment.data.date"
                              id="date"
                              placeholder=""
                              required
                          />
                        </div>

                        <div class="mb-3">
                          <label for="amount" class="form-label">{{ $t('contracts.view.sum') }}</label>
                          <input
                              type="number"
                              class="form-control"
                              v-model="payment.data.amount"
                              min="1"
                              id="amount"
                              required
                              placeholder=""
                          />
                        </div>
                      </div>

                      <div class="card-footer d-flex">
                        <button type="submit" class="btn btn-success">
                          <i class="fa fa-save"></i> {{ $t('contracts.view.save_btn') }}
                        </button>

                        <button
                            type="button"
                            class="btn ml-1"
                            @click="payment.view = !payment.view"
                        >
                          {{ $t('contracts.view.cancel_btn') }}
                        </button>
                      </div>
                    </form>
                  </div>
                </b-collapse>

                <table
                    class="table table-striped"
                    v-if="order.status === 'contract' || order.status === 'sold'"
                >
                  <thead class="table-dark">
                  <tr>
                    <th width="50">
                      {{ $t('contracts.view.schedule') }}
                    </th>

                    <th class="text-center">
                      {{ $t('contracts.view.type') }}
                    </th>

                    <th class="text-center">
                      {{ $t('apartments.list.status') }}
                    </th>

                    <th>
                      {{ $t('contracts.view.comment') }}
                    </th>

                    <th>
                      {{ $t('contracts.view.payment_type') }}
                    </th>

                    <th>
                      {{ $t('contracts.view.payment_date') }}
                    </th>

                    <th>
                      {{ $t('contracts.view.payment_sum') }}
                    </th>

                    <th class="text-center">
                      {{ $t('contracts.view.sum') }}
                    </th>
                  </tr>
                  </thead>

                  <tbody>
                  <tr v-for="(month, index) in order.payments" :key="index">
                    <td>
                      {{ month.date_payment | moment("DD.MM.YYYY") }}
                    </td>

                    <td class="text-center">
                      {{ month.type | getType }}
                    </td>

                    <td class="text-center">
                      {{ getStatusPayment(month) }}
                    </td>

                    <td>
                      {{ month.comment }}
                    </td>

                    <td>
                      {{ month.type_payments | getPaymentType }}
                    </td>

                    <td>
                      {{ month.date_paid | moment("DD.MM.YYYY") }}
                    </td>

                    <td>
                        <span v-if="month.amount_paid">
                          {{
                            month.amount_paid
                                | number("0,0.00", {
                              thousandsSeparator: " ",
                              decimalSeparator: ",",
                            })
                          }}
                          {{ $t("ye") }}
                        </span>
                    </td>

                    <td class="text-center">
                      {{
                        month.amount
                            | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                      }}
                      {{ $t("ye") }}

                      <button
                          class="btn badge-danger btn-sm float-right"
                          @click="paymentMonthly(index)"
                          v-if="
                            month.type === 'initial_payment' &&
                              ((getMe.role && getMe.role.id === 1) ||
                                getPermission.debtors.first_payment.accept) &&
                              month.status === 'waiting'
                          "
                      >
                        <i class="far fa-wallet"></i>
                      </button>

                      <button
                          class="btn btn-primary btn-sm float-right"
                          @click="editMonthly(index)"
                          v-if="
                            month.type === 'initial_payment' &&
                              ((getMe.role && getMe.role.id === 1) ||
                                getPermission.debtors.first_payment.edit) &&
                              month.status === 'paid'
                          "
                      >
                        <i class="far fa-edit"></i>
                      </button>

                      <button
                          class="btn badge-danger btn-sm float-right ml-2"
                          @click="paymentMonthly(index)"
                          v-if="
                            (month.type === 'monthly' ||
                              month.type === 'manual' ||
                              month.type === 'debt') &&
                              ((getMe.role && getMe.role.id === 1) ||
                                getPermission.debtors.monthly.accept) &&
                              month.status === 'waiting'
                          "
                      >
                        <i class="far fa-wallet"></i>
                      </button>

                      <button
                          class="btn btn-primary btn-sm float-right"
                          @click="editMonthly(index)"
                          v-if="
                            (month.type === 'monthly' ||
                              month.type === 'manual' ||
                              month.type === 'debt') &&
                              ((getMe.role && getMe.role.id === 1) ||
                                getPermission.debtors.monthly.edit) &&
                              month.status === 'paid'
                          "
                      >
                        <i class="far fa-edit"></i>
                      </button>

                      <button
                          class="btn btn-sm float-right"
                          @click="deleteMonthly(index)"
                          v-if="
                            month.type === 'manual' &&
                              ((getMe.role && getMe.role.id === 1) ||
                                getPermission.debtors.monthly.edit) &&
                              month.status === 'waiting'
                          "
                      >
                        <i class="far fa-trash"></i>
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td></td>

                    <td class="text-center"></td>

                    <td class="text-center">
                      {{ $t('contracts.view.paid') }}:
                      {{
                        order.paid_total
                            | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                      }}
                      {{ $t("ye") }}
                    </td>

                    <td class="text-center">
                      {{ $t('apartments.view.total') }}:
                      {{
                        order.transaction_price
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

                <div class="col-md-12">
                  <h3>
                    {{ $t('contracts.view.comments') }}
                  </h3>
                  <div
                      class="alert alert-info"
                      v-if="order.comments.length === 0"
                  >
                    <i class="fa fa-info-circle"></i> {{ $t('contracts.view.no_comment') }}
                  </div>
                  <ul class="timeline" v-if="order.comments.length > 0">
                    <li
                        class="timeline-inverted"
                        v-for="(comment, index) in order.comments"
                        :key="index"
                    >
                      <div
                          class="timeline-badge"
                          :class="[
                          comment.type === 'bought' ? 'success' : 'primary',
                          comment.type === 'cancelled_contract'
                            ? 'danger'
                            : 'primary',
                        ]"
                      >
                        <i
                            class="fa fa-comment"
                            v-if="comment.type === 'comment'"
                        ></i>
                        <i
                            class="fa fa-shopping-cart"
                            v-if="comment.type === 'bought'"
                        ></i>
                        <i
                            class="fa fa-archive"
                            v-if="comment.type === 'cancelled_contract'"
                        ></i>
                      </div>
                      <div class="timeline-panel">
                        <div
                            class="timeline-body"
                            v-html="comment.comment"
                        ></div>

                        <small
                        >Пользователь: {{ comment.user.first_name }}
                          {{ comment.user.last_name }} | Дата:
                          {{
                            comment.created_at | moment("HH:mm, DD.MM.YYYY")
                          }}</small
                        >
                      </div>
                    </li>
                  </ul>

                  <button
                      type="button"
                      class="btn btn-light"
                      @click="comment_store = true"
                      data-toggle="collapse"
                      href="#collapseComment"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseComment"
                  >
                    <i class="fa fa-plus-square"></i> {{ $t('contracts.view.add_comment') }}
                  </button>

                  <div
                      class="collapse mt-2"
                      id="collapseComment"
                      v-if="comment_store"
                  >
                    <form @submit.stop.prevent="saveComment">
                      <label>{{ $t('contracts.view.comment') }}</label>
                      <textarea
                          name="comment"
                          v-model="comment"
                          id=""
                          class="form-control"
                          cols="3"
                          rows="3"
                      ></textarea>

                      <button
                          class="btn btn-warning mt-2 waves-effect waves-light"
                          type="submit"
                      >
                        <i class="fa fa-save"></i> {{ $t('contracts.view.save_btn') }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer justify-content-center">
            <a
                :href="order.contract_path"
                class="btn btn-success "
                v-if="order.status === 'contract' || order.status === 'sold'"
            >
              <i class="fa fa-download"></i> {{ $t('contracts.view.download_contract') }}
            </a>

            <button
                type="button"
                @click="cancelOrder"
                class="btn btn-danger float-right"
                v-if="order.status === 'contract'"
            >
              <i class="fa fa-minus-circle"></i> {{ $t('contracts.view.cancel_contract') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 9999">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </main>
</template>

<script>
// import Discount from './Discount'
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import {mapGetters} from "vuex";
import api from "@/services/api";

export default {
  name: 'ContractsView',

  components: {
    BaseBreadCrumb
  },

  props: {
    apartment: {},
  },

  data: () => ({
    step: 1,
    add_payment: true,
    getLoading: false,
    payment: {
      view: false,
      data: {
        date: null,
        amount: null,
      },
    },

    order: {
      id: null,
      contract: null,
      friends: "unknown",
      contract_path: null,
      initial_payment: null,
      payment_status: null,
      status: "contract",
      transaction_price: null,
      contract_date: null,
      payments: [],

      discount: {
        discount: 0,
      },

      apartments: [
        {
          id: 0,
          price: 0,
          number: null,
          entrance: 0,
          floor: 0,
          plan: {
            area: 0,
            balcony: false,
            balcony_area: 0,
          },
          object: {
            name: null,
          },

          building: {
            name: null,
          },

          block: {
            name: null,
          },
        },
      ],

      currency: {
        usd: 0,
      },

      company: {
        name: null,
        payment_account: null,
        inn: null,
        mfo: null,
        bank_name: {
          ru: null,
        },
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
        type: {
          kr: null,
        },
      },

      client: {
        id: null,
        first_name: "",
        last_name: "",
        second_name: "",
        passport_series: "",
        issued_by_whom: "",
        birth_day: null,
        language: "uz",
        phone: "",
        other_phone: null,
        date_of_issue: null,
        discount: {id: null},
        edit: false,
      },

      comments: [],
    },

    error: false,
    errors: [],

    edit: {
      type_client: false,
    },

    comment_store: false,
    comment: "",

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  mounted() {
    this.fetchOrder();

  },

  computed: {
    ...mapGetters(["getMe", "getPermission"]),
    breadCrumbs() {
      return [
        {
          routeName: 'contracts',
          textContent: this.$t('contracts.title')
        },
      ]
    },
    activeContent() {
      return this.$t('view')
    },
  },

  methods: {
    async saveComment() {
      this.getLoading = true;
      try {
        const {data, status} = await api.orders.ordersComment(this.$route.params.id, this.comment)
        if (status === 201) {
          this.comment = "";
          this.order.comments.push(data);
          this.comment_store = false;
        }
        this.getLoading = false;
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);
      }
    },

    async CreatePayment() {
      this.getLoading = true;
      try {
        const body = {
          date: this.payment.data.date,
          amount: this.payment.data.amount,
        }

        await api.debtors.createPayment(this.$route.params.id, body)

        this.payment.data = {
          date: null,
          amount: null,
        };

        this.payment.view = false;
        this.fetchOrder();
        this.getLoading = false;
        this.$swal(this.$t("sweetAlert.payment_success_added"), "", "success");
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);
      }
    },

    async fetchOrder() {
      this.getLoading = true;
      try {
        const {data} = await api.orders.fetchOrder(this.$route.params.id)
        this.step = 1;

        this.order = data;
        this.getLoading = false;
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);
      }
    },

    async ChangeTypeClient() {
      this.getLoading = true;
      try {
        const body = {
          friends: this.order.friends
        }
        const {data} = await api.orders.changeClientType(this.$route.params.id, body)
        this.edit.type_client = false;
        this.getLoading = false;
        this.toasted(data.message, "success");
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);
      }
    },

    async deleteMonthly(index) {
      let id = this.order.payments[index].id;

      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.debtors.payment_delete"),
        // title: this.$t('sweetAlert.debtors.payment_delete'),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value || result.value == "") {
          this.getLoading = true;
          api.debtors.deleteMonthlyDebt(id)
              .then(() => {
                this.fetchOrder();
                this.getLoading = false;
                this.$swal(this.$t("sweetAlert.payment_success"), "", "success");
              })
              .catch((error) => {
                this.getLoading = false;
                this.toastedWithErrorCode(error);

                if (error.response.status === 422) {
                  if (
                      error.response.data.date_payment &&
                      error.response.data.date_payment.length > 0
                  )
                    this.toasted(error.response.data.date_payment[0], "error");
                  if (
                      error.response.data.pay_amount &&
                      error.response.data.pay_amount.length > 0
                  )
                    this.toasted(error.response.data.pay_amount[0], "error");
                }
              });
        }
      });
    },

    async editMonthly(index) {
      let id = this.order.payments[index].id;

      const {value: formValues} = await this.$swal({
        title: this.$t("sweetAlert.payment_edit"),
        icon: "question",
        showCancelButton: true,
        html:
            '<input id="deb-payment" type="number" placeholder="10000" value="' +
            this.order.payments[index].amount_paid +
            '" max="' +
            this.order.payments[index].amount +
            '" step="100" class="form-control">' +
            '<label for="date-payment" class="float-left mt-3">Дата оплаты</label>' +
            '<input id="date-payment" type="date" placeholder="Дата оплаты" value="' +
            this.order.payments[index].date_paid +
            '" required class="form-control mt-2">' +
            '<label for="type_payment" class="float-left mt-3">Тип оплаты</label>' +
            '<select id="type_payment" class="form-control" ruqired><option value="' +
            this.order.payments[index].type_payments +
            '">' +
            this.order.payments[index].type_payments +
            '</option><option value="cash">Наличный</option><option value="transfer">Перечисления</option><option value="payme">Payme</option><option value="click">Click</option><option value="other">Другое</option></select>',
        confirmButtonText: this.$t("sweetAlert.debtors.next"),
        preConfirm: () => {
          return {
            date_payment: document.getElementById("date-payment").value,
            pay_amount: document.getElementById("deb-payment").value,
            type_payment: document.getElementById("type_payment").value,
          };
        },
      });

      if (formValues) {
        this.$swal({
          title: this.$t("sweetAlert.title"),
          text: this.$t("sweetAlert.debtors.are_you_sure"),
          icon: "warning",
          showCancelButton: true,
          input: "textarea",
          inputLabel: "Message",
          inputPlaceholder: this.$t("sweetAlert.debtors.placeholder"),
          inputAttributes: {
            "aria-label": this.$t("sweetAlert.debtors.placeholder"),
          },
          confirmButtonText: this.$t("sweetAlert.debtors.yes"),
        }).then((result) => {
          if (result.value || result.value == "") {
            this.getLoading = true;
            const body = {
              date_paid: formValues.date_payment,
              amount_paid: formValues.pay_amount,
              type_payment: formValues.type_payment,
              comment: result.value,
            }
            api.debtors.updateMonthlyDebt(id, body)
                .then(() => {
                  this.fetchOrder();
                  this.getLoading = false;
                  this.$swal(
                      this.$t("sweetAlert.payment_success"),
                      "",
                      "success"
                  );
                })
                .catch((error) => {
                  this.getLoading = false;
                  this.toastedWithErrorCode(error);

                  if (error.response.status === 422) {
                    if (
                        error.response.data.date_payment &&
                        error.response.data.date_payment.length > 0
                    )
                      this.toasted(error.response.data.date_payment[0], "error");
                    if (
                        error.response.data.pay_amount &&
                        error.response.data.pay_amount.length > 0
                    )
                      this.toasted(error.response.data.pay_amount[0], "error");
                  }
                });
          }
        });
      }
    },

    async paymentMonthly(index) {
      let id = this.order.payments[index].id;

      const {value: formValues} = await this.$swal({
        title: this.$t("sweetAlert.debtors.payment_info"),
        icon: "question",
        buttons: {
          cancel: this.$t('contracts.view.cancel_btn'),
        },
        showCancelButton: true,
        html:
            '<input id="deb-payment" type="number" placeholder="10000" value="' +
            this.order.payments[index].amount +
            '" max="' +
            this.order.payments[index].amount +
            '" step="100" class="form-control">' +
            `<label for="date-payment" class="float-left mt-3">${this.$t('contracts.view.payment_date')}</label>` +
            '<input id="date-payment" type="date" placeholder="Дата оплаты" value="" required class="form-control mt-2">' +
            `<label for="type_payment" class="float-left mt-3">${this.$t('contracts.view.payment_date')}</label>` +
            `<select id="type_payment" class="form-control"><option value="cash">${this.$t('contracts.view.payment_by_cash')}</option><option value="transfer">${this.$t('contracts.view.payment_transaction')}</option><option value="payme">Payme</option><option value="click">Click</option><option value="other">${this.$t('contracts.view.payment_other')}</option></select>`,
        confirmButtonText: this.$t("sweetAlert.debtors.next"),
        preConfirm: () => {
          return {
            date_payment: document.getElementById("date-payment").value,
            pay_amount: document.getElementById("deb-payment").value,
            type_payment: document.getElementById("type_payment").value,
          };
        },
      });

      let type = this.order.payments[index].type;
      let pay_amount = parseFloat(formValues.pay_amount);
      let amount = this.order.payments[index].amount;

      if (
          (type === "monthly" || type === "debt" || type === "initial_payment") &&
          pay_amount < amount
      ) {
        if (formValues) {
          const {value: initialValue} = await this.$swal({
            title: this.$t("sweetAlert.title"),
            text: this.$t("sweetAlert.debtors.are_you_sure"),
            icon: "warning",
            showCancelButton: true,
            html:
                '<label for="date-payment" class="float-left mt-3">Дата следующей оплаты</label>' +
                '<input id="date-payment" type="date" placeholder="Дата оплаты" value="" required class="form-control mt-2">' +
                '<label for="comment" class="float-left mt-3">Комментария</label>' +
                '<textarea id="comment" class="form-control" rows="3"></textarea>',

            confirmButtonText: this.$t("sweetAlert.debtors.yes"),

            preConfirm: () => {
              return {
                next_payment_date: document.getElementById("date-payment")
                    .value,
                comment: document.getElementById("comment").value,
              };
            },
          });

          this.getLoading = true;
          const body = {
            date_paid: formValues.date_payment,
            amount_paid: formValues.pay_amount,
            type_payment: formValues.type_payment,
            comment: initialValue.comment,
            next_payment_date: initialValue.next_payment_date,
          }
          api.debtors.createMonthlyPayment(id, body)
              .then(() => {
                this.fetchOrder();
                this.getLoading = false;
                this.$swal(this.$t("sweetAlert.payment_success"), "", "success");
              })
              .catch((error) => {
                this.getLoading = false;
                this.toastedWithErrorCode(error);

                if (error.response.status === 422) {
                  if (
                      error.response.data.date_payment &&
                      error.response.data.date_payment.length > 0
                  )
                    this.toasted(error.response.data.date_payment[0], "error");
                  if (
                      error.response.data.pay_amount &&
                      error.response.data.pay_amount.length > 0
                  )
                    this.toasted(error.response.data.pay_amount[0], "error");
                }
              });
        }

        return;
      }

      if (formValues) {
        this.$swal({
          title: this.$t("sweetAlert.title"),
          text: this.$t("sweetAlert.debtors.are_you_sure"),
          icon: "warning",
          showCancelButton: true,
          input: "textarea",
          inputLabel: "Message",
          inputPlaceholder: this.$t("sweetAlert.debtors.placeholder"),
          inputAttributes: {
            "aria-label": this.$t("sweetAlert.debtors.placeholder"),
          },
          confirmButtonText: this.$t("sweetAlert.debtors.yes"),
        }).then((result) => {
          if (result.value || result.value == "") {
            this.getLoading = true
            const body = {
              date_paid: formValues.date_payment,
              amount_paid: formValues.pay_amount,
              type_payment: formValues.type_payment,
              comment: result.value
            }
            api.debtors.createMonthlyPayment(id, body)
                .then(() => {
                  this.fetchOrder();
                  this.getLoading = false

                  this.$swal(
                      this.$t("sweetAlert.payment_success"),
                      "",
                      "success"
                  );
                })
                .catch((error) => {
                  this.getLoading = false
                  this.toastedWithErrorCode(error);

                  if (error.response.status === 422) {
                    if (
                        error.response.data.date_payment &&
                        error.response.data.date_payment.length > 0
                    )
                      this.toasted(error.response.data.date_payment[0], "error");
                    if (
                        error.response.data.pay_amount &&
                        error.response.data.pay_amount.length > 0
                    )
                      this.toasted(error.response.data.pay_amount[0], "error");
                  }
                });
          }
        });
      }
    },

    cancelOrder() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_contract"),
        icon: "warning",
        showCancelButton: true,
        input: "textarea",
        inputLabel: "Message",
        inputPlaceholder: "Напишите причину расторгнуть договор",
        inputAttributes: {
          "aria-label": "Напишите причину расторгнуть договор",
        },
        confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
      }).then((result) => {
        if (result.value) {
          this.getLoading = true;
          const body = {
            comment: result.value
          }
          api.contract.cancelContract(this.order.id, body)
              .then(() => {
                this.$router.back(-1);
                this.getLoading = false;
                this.$swal(
                    this.$t("sweetAlert.canceled_contract"),
                    "",
                    "success"
                );
              })
              .catch((error) => {
                this.getLoading = false;
                this.toastedWithErrorCode(error);
              });
        } else {
          this.toasted("Напишите причину расторгнуть договор", "error");
        }
      });
    },

    removeBlock() {
      this.$bvModal.hide("modal-contract-info");
    },

    getPrepay() {
      let total_discount = this.getDiscount();

      let total = this.apartment.price - total_discount;

      return (this.client.discount.prepay_to * total) / 100;
    },

    getDiscount() {
      return (this.client.discount.discount * this.apartment.price) / 100;
    },

    getMonth() {
      return (this.getTotal() - this.getPrepay()) / this.month;
    },

    getDebt() {
      return this.getTotal() - this.getPrepay();
    },

    getStatusPayment(payment) {
      switch (payment.status) {
        case "waiting":
          return "Ожидает оплату";
        case "paid":
          return "Оплачено";
        default:
          return "Отказано";
      }
    },

    getTotal() {
      let total_discount = this.getDiscount();

      // let total = price * area;
      let total = this.apartment.price - total_discount;

      return total;
    },

    funcGetPaymentType(type) {
      let msg;

      switch (type) {
        case "payme":
          msg = "Payme";
          break;
        case "click":
          msg = "Click";
          break;
        case "transfer":
          msg = "Перечисления";
          break;
        case "other":
          msg = "Другое";
          break;
        case "cash":
          msg = "Наличные";
          break;
        default:
          msg = "";
          break;
      }

      return msg;
    },
  },

  filters: {
    getType(type) {
      let msg;

      switch (type) {
        case "debt":
        case "monthly":
          msg = "Ежемесячно";
          break;
        case "manual":
          msg = "Ручной создано";
          break;
        default:
          msg = "Первоначальный взнос";
          break;
      }

      return msg;
    },

    getPaymentType(type) {
      let msg;

      switch (type) {
        case "payme":
          msg = "Payme";
          break;
        case "click":
          msg = "Click";
          break;
        case "transfer":
          msg = "Перечисления";
          break;
        case "other":
          msg = "Другое";
          break;
        case "cash":
          msg = "Наличные";
          break;
        default:
          msg = "";
          break;
      }

      return msg;
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

.timeline {
  list-style: none;
  padding: 20px 0 20px;
  position: relative;
}

.timeline:before {
  top: 0;
  bottom: 0;
  position: absolute;
  content: " ";
  width: 3px;
  background-color: #eeeeee;
  left: 0%;
  margin-left: -1.5px;
}

.timeline > li {
  margin-bottom: 20px;
  position: relative;
}

.timeline > li:before,
.timeline > li:after {
  content: " ";
  display: table;
}

.timeline > li:after {
  clear: both;
}

.timeline > li:before,
.timeline > li:after {
  content: " ";
  display: table;
}

.timeline > li:after {
  clear: both;
}

.timeline > li > .timeline-panel {
  width: 46%;
  float: left;
  border: 1px solid #d4d4d4;
  border-radius: 2px;
  padding: 20px;
  position: relative;
  -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
}

.timeline > li > .timeline-panel:before {
  position: absolute;
  top: 26px;
  right: -15px;
  display: inline-block;
  border-top: 15px solid transparent;
  border-left: 15px solid #ccc;
  border-right: 0 solid #ccc;
  border-bottom: 15px solid transparent;
  content: " ";
}

.timeline > li > .timeline-panel:after {
  position: absolute;
  top: 27px;
  right: -14px;
  display: inline-block;
  border-top: 14px solid transparent;
  border-left: 14px solid #fff;
  border-right: 0 solid #fff;
  border-bottom: 14px solid transparent;
  content: " ";
}

.timeline > li > .timeline-badge {
  color: #fff;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 1.4em;
  text-align: center;
  position: absolute;
  top: 16px;
  left: 0;
  margin-left: -25px;
  background-color: #999999;
  z-index: 100;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.timeline > li.timeline-inverted > .timeline-panel {
  float: left;
  left: 45px;
}

.timeline > li.timeline-inverted > .timeline-panel:before {
  border-left-width: 0;
  border-right-width: 15px;
  left: -15px;
  right: auto;
}

.timeline > li.timeline-inverted > .timeline-panel:after {
  border-left-width: 0;
  border-right-width: 14px;
  left: -14px;
  right: auto;
}

.timeline-badge.primary {
  background-color: #2e6da4 !important;
}

.timeline-badge.success {
  background-color: #3f903f !important;
}

.timeline-badge.warning {
  background-color: #f0ad4e !important;
}

.timeline-badge.danger {
  background-color: #d9534f !important;
}

.timeline-badge.info {
  background-color: #5bc0de !important;
}

.timeline-title {
  margin-top: 0;
  color: inherit;
}

.timeline-body > p,
.timeline-body > ul {
  margin-bottom: 0;
}

.timeline-body > p + p {
  margin-top: 5px;
}

@media (max-width: 767px) {
  ul.timeline:before {
    left: 40px;
  }

  ul.timeline > li > .timeline-panel {
    width: calc(100% - 90px);
    width: -moz-calc(100% - 90px);
    width: -webkit-calc(100% - 90px);
  }

  ul.timeline > li > .timeline-badge {
    left: 15px;
    margin-left: 0;
    top: 16px;
  }

  ul.timeline > li > .timeline-panel {
    float: right;
  }

  ul.timeline > li > .timeline-panel:before {
    border-left-width: 0;
    border-right-width: 15px;
    left: -15px;
    right: auto;
  }

  ul.timeline > li > .timeline-panel:after {
    border-left-width: 0;
    border-right-width: 14px;
    left: -14px;
    right: auto;
  }
}

small {
  color: #969696;
}
</style>
