<template>
  <main>
    <div class="app-content">
      <div
          class="
          d-flex
          justify-content-between
          align-items-center
          flex-md-row flex-column
          pb-3
        "
      >
        <div
            class="d-flex w-100 align-items-center flex-md-row flex-column mb-0"
        >
          <h1 class="title__big my-0">{{ $t("roles.title") }}</h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <router-link :to="{name: 'roles'}">
                {{ $t("roles.title") }}
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              {{ $t("edit") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <b-tabs content-class="mt-3">
            <b-tab :title="$t('general')" active>
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.name_ru") }}
                  </td>
                  <td width="50%">
                    <input
                        class="form-control"
                        v-model="role.ru"
                        type="text"
                        :placeholder="$t('roles.permissions.placeholder_ru')"
                    />
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.name_uz") }}
                  </td>
                  <td width="50%">
                    <input
                        class="form-control"
                        v-model="role.uz"
                        type="text"
                        :placeholder="$t('roles.permissions.placeholder_uz')"
                    />
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.objects.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.objects.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.users.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.users.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.roles.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.roles.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.clients.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.clients.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.type_plan.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.type_plan.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--general-->

            <b-tab :title="$t('objects.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.objects.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.objects.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.objects.create") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.objects.create"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.objects.update") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.objects.update"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.objects.delete") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.objects.delete"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.objects.apartments") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.objects.apartments"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--objects-->

            <b-tab :title="$t('users.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.users.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.users.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.users.create") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.users.create"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.users.update") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.users.update"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.users.delete") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.users.delete"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--users-->

            <b-tab :title="$t('roles.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.roles.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.roles.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.roles.create") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.roles.create"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.roles.update") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.roles.update"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.roles.delete") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.roles.delete"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--roles-->

            <!--                    <b-tab :title="$t('clients.title')">-->
            <!--                        <table class="table table-striped">-->
            <!--                            <tbody>-->
            <!--                                <tr>-->
            <!--                                    <td width="50%">-->
            <!--                                        {{ $t('roles.permissions.clients.view') }}-->
            <!--                                    </td>-->
            <!--                                    <td width="50%">-->
            <!--                                        <b-form-checkbox switch v-model="role.permissions.clients.view" size="lg"></b-form-checkbox>-->
            <!--                                    </td>-->
            <!--                                </tr>-->

            <!--&lt;!&ndash;                                <tr>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        {{ $t('roles.permissions.clients.cancel_contract') }}&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        <b-form-checkbox switch v-model="role.permissions.clients.cancel_contract" size="lg"></b-form-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                </tr>&ndash;&gt;-->

            <!--&lt;!&ndash;                                <tr>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        {{ $t('roles.permissions.clients.delete') }}&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        <b-form-checkbox switch v-model="role.permissions.clients.delete" size="lg"></b-form-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                </tr>&ndash;&gt;-->

            <!--&lt;!&ndash;                                <tr>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        {{ $t('roles.permissions.clients.terminate') }}&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        <b-form-checkbox switch v-model="role.permissions.clients.terminate" size="lg"></b-form-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                </tr>&ndash;&gt;-->

            <!--&lt;!&ndash;                                <tr>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        {{ $t('roles.permissions.clients.cancelled') }}&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    <td width="50%">&ndash;&gt;-->
            <!--&lt;!&ndash;                                        <b-form-checkbox switch v-model="role.permissions.clients.cancelled" size="lg"></b-form-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;                                    </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                                </tr>&ndash;&gt;-->

            <!--                            </tbody>-->
            <!--                        </table>-->
            <!--                    </b-tab>&lt;!&ndash;clients&ndash;&gt;-->

            <b-tab :title="$t('type_plan.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.type_plan.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.type_plan.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.type_plan.update") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.type_plan.update"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--type Plans-->

            <b-tab :title="$t('objects.apartments')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.view") }}
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.reserve") }}
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.reserve"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.contract") }}
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.contract"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.filter") }}
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.filter"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.edit") }}
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.edit"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.apartments.root_contract") }}
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.root_contract"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    Разрешить полный доступ к бронированию
                  </td>

                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.apartments.root_reserve"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--apartments-->

            <!--                    <b-tab :title="$t('accountants.role_title')">-->

            <!--                    </b-tab>&lt;!&ndash;accountants&ndash;&gt;-->

            <b-tab :title="$t('companies.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.companies.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.update") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.companies.update"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.create") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.companies.create"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.delete") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.companies.delete"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!-- companies -->

            <b-tab :title="$t('contracts.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.all") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.all"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.friends") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.friends"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.cancelled") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.cancelled"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.paid") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.paid"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.other_price") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.other_price"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.change_date") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.date"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.contracts.monthly") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.contracts.monthly"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--contracts-->

            <b-tab :title="$t('debtors.title')">
              <table class="table table-striped">
                <tbody>
                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.view") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.debtors.view"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.debtors.first_payment") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.debtors.first_payment.accept"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.debtors.first_payment_edit") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.debtors.first_payment.edit"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.debtors.monthly_payment") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.debtors.monthly.accept"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>

                <tr>
                  <td width="50%">
                    {{ $t("roles.permissions.debtors.monthly_payment_edit") }}
                  </td>
                  <td width="50%">
                    <b-form-checkbox
                        switch
                        v-model="role.permissions.debtors.monthly.edit"
                        size="lg"
                    ></b-form-checkbox>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab
            ><!--debtors-->
          </b-tabs>
        </div>

        <div class="card-footer d-flex">
          <button class="btn btn-primary" @click="UpdateRoles">
            <i class="fas fa-save"></i> {{ $t("save") }}
          </button>

          <button class="btn btn-default" @click="$router.go(-1)">
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>

    <b-overlay :show="getLoading" no-wrap opacity="0.5">
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
import api from "@/services/api";

export default {
  data: () => ({
    role: {},

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
    getLoading: false,
  }),

  mounted() {
    this.fetchRole();
  },

  methods: {
    UpdateRoles() {
      this.getLoading = true;
      api.roles.updateRole(this.$route.params.id, this.role)
          .then((response) => {
            this.getLoading = false;
            this.toasted(response.data.message, "success");

            this.$router.push({name: "roles"});

            this.$swal(this.$t("sweetAlert.success_update_role"), "", "success");
          })
          .catch((error) => {
            this.getLoading = false;
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
                this.error = true;
                this.errors = error.response.data.errors;
              }
            }
          });
    },

    async fetchRole() {
      const {data} = await api.roles.fetchRole(this.$route.params.id)
      this.role = data;

      if (!this.role.permissions.companies) {
        this.role.permissions.companies = {
          create: false,
          update: false,
          delete: false,
          view: false,
        };
      }

      if (!this.role.permissions.contracts) {
        this.role.permissions.contracts = {
          view: false,
          all: false,
          cancelled: false,
          paid: false,
          other_price: false,
          date: false,
          monthly: false,
          friends: false,
        };
      }

      if (!this.role.permissions.debtors?.first_payment?.edit) {
        this.role.permissions.debtors = {
          view: false,
          first_payment: {
            edit: false,
            accept: false,
          },
          monthly: {
            edit: false,
            accept: false,
          },
        };
      }

      if (!this.role.permissions.debtors) {
        this.role.permissions.debtors = {
          view: false,
          first_payment: {
            edit: false,
            accept: false,
          },
          monthly: {
            edit: false,
            accept: false,
          },
        };
      }

      //
      // } catch (error) {
      //     if (! error.response) {
      //         this.toasted('Error: Network Error', 'error');
      //     } else {
      //         if (error.response.status === 403) {
      //             this.toasted(error.response.data.message, 'error');
      //         } else if (error.response.status === 401) {
      //             this.toasted(error.response.data.message, 'error');
      //         } else if (error.response.status === 500) {
      //             this.toasted(error.response.data.message, 'error');
      //         } else {
      //             this.toasted(error.response.data.message, 'error');
      //         }
      //     }
      // }
    },
  },
};
</script>

<style scoped></style>
