<script>
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import { mapActions, mapGetters } from "vuex";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseWarningIcon from "@/components/icons/BaseWarningIcon";
import ContractsPermission from "@/permission/contract";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";
import AppHeader from "@/components/Header/AppHeader";
import XFormSelect from "@/components/ui-components/form-select/FormSelect.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XSquareBackground } from "@/components/ui-components/square-background";
import { XModalCenter } from "@/components/ui-components/modal-center";
import { XFormInput } from "@/components/ui-components/form-input";
import Permission from "@/permission";

export default {
  name: "ContractView",
  components: {
    XFormInput,
    XModalCenter,
    XSquareBackground,
    XFormSelect,
    AppDropdown,
    BaseWarningIcon,
    BaseCloseIcon,
    BaseArrowRight,
    BaseArrowLeft,
    BaseModal,
    BaseLoading,
    BaseButton,
    AppHeader,
    XIcon,
  },
  data() {
    return {
      order: {},
      showLoading: false,
      activeTab: 0,
      showArchiveWarningModal: false,
      archive: {
        showWarnModal: false,
        sending: false,
        comment: "",
      },
      tabs: [
        {
          id: 0,
          title: this.$t("payment_schedule"),
          route: "contracts-view",
        },
        {
          id: 1,
          title: this.$t("object_details"),
          route: "contract-object-details",
        },
        {
          id: 2,
          title: this.$t("client_details"),
          route: "contract-client-details",
        },
        {
          id: 3,
          title: this.$t("contract_details"),
          route: "contract-details",
        },
        // {
        //     id: 5,
        //     title: this.$t('contract_log'),
        //     route: 'contract-logs'
        // },
        {
          id: 4,
          title: this.$t("recontract_details"),
          route: "reissue-details",
        },
      ],
      deleteComment: null,
      archiveComment: null,
      errors: [],
      types: [],
      reason_type: null,
      reContractViewPermission:
        ContractsPermission.getContractsReissueViewPermission(),
      downloadPermission: ContractsPermission.getContractsDownloadPermission(),
      deletePermission: ContractsPermission.getContractsCancelPermission(),
      hasAdminRole: Permission.hasAdminRole(),
    };
  },
  computed: {
    ...mapGetters({
      permission: "getPermission",
      me: "getMe",
    }),
    tabIndex: {
      get() {
        const { name } = this.$route;
        const index = this.tabs.findIndex((item) => item.route === name);
        if (index !== -1) {
          return index;
        } else {
          return 0;
        }
      },
      set(value) {
        return value;
      },
    },
    role() {
      return this.me.role;
    },
    isStatusContract() {
      return this.order.status === "contract";
    },
    hasAction() {
      return (
        this.reContractPermission ||
        this.editPermission ||
        this.deletePermission ||
        this.downloadPermission
      );
    },
    // reContractViewPermission(){
    //   return ContractsPermission.getContractsReissueViewPermission()
    // },
    reContractPermission() {
      return (
        ContractsPermission.getContractsReissueCreatePermission() &&
        this.order.reissue &&
        this.order.reissue.re_order
      );
    },
    editPermission() {
      return (
        ContractsPermission.getContractsEditPermission() &&
        (this.order.status === "sold" || this.order.status === "contract") &&
        this.order.updating.can
      );
    },
    hasConstructorOrder() {
      return Object.keys(this.order).length > 0;
    },
  },
  async created() {
    await this.fetchContractData();
  },
  mounted() {
    this.$refs.archiveWarningModal.openModal();
  },
  watch: {
    $route: {
      deep: true,
      handler(value) {
        const findItem = this.tabs.findIndex(
          (item) => item.route === "contracts-view"
        );
        if (findItem === -1 && value.name === "contracts-view") {
          return this.$router.push({ name: "contracts" });
        }
      },
    },
  },
  methods: {
    ...mapActions("notify", ["openNotify"]),
    closeArchiveWarnModal() {
      this.archive.showWarnModal = false;
      this.archive.comment = null;
    },
    async restoreContract() {
      try {
        this.showLoading = true;
        await api.contractV2.recover({ contractId: this.order.id });
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        await this.fetchContractData();
      }
    },
    async archiveContract() {
      try {
        this.archive.sending = true;
        await api.contractV2.archive().putArchive({
          contractId: this.order.id,
          body: {
            comment: this.archive.comment,
          },
        });
        this.archive.showWarnModal = false;
        this.archive.sending = false;
        this.archive.comment = "";
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        await this.fetchContractData();
      }
    },
    async unarchiveContract() {
      try {
        this.showLoading = true;
        // await api.contractV2.recover({ contractId: this.order.id });
        await api.contractV2
          .archive()
          .putArchive({ contractId: this.order.id });
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        await this.fetchContractData();
      }
    },
    tabChange(currentTabs) {
      const index = this.tabs.filter((item) => item.id === currentTabs);
      this.$router.replace({ name: index[0].route });
    },
    checkLocales(name) {
      if (localStorage.locale) return name[localStorage.locale];
      else return name["ru"];
    },
    nextReContract() {
      this.$router.push({
        name: "re-contract",
        params: {
          id: this.$route.params.id,
          type: this.reason_type.id,
        },
      });
    },
    setFormProperty(property, value) {
      this.form[property] = value;
      this.errors[property] = false;
    },
    openReContractModal() {
      this.$refs["re-contract"].openModal();
      this.getType();
    },
    getType() {
      const id = this.$route.params.id;
      api.contractV2
        .reOrderDetails(id)
        .then((res) => {
          this.types = res.data.types.map((item) => {
            return {
              value: item.id,
              text: item.name[localStorage.locale],
            };
          });
        })
        .catch((err) => console.log(err));
    },
    closeReContractModal() {
      this.$refs["re-contract"].closeModal();
    },
    async downloadContact() {
      const { id } = this.$route.params;
      await api.contract
        .downloadContract(id)
        .then(({ data, headers }) => {
          const filename = headers.hasOwnProperty("x-filename")
            ? headers["x-filename"]
            : "contract";
          const fileURL = window.URL.createObjectURL(new Blob([data]));
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", filename);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(() => {
          return "#";
        });
    },
    openPaymentDeletionModal() {
      this.$refs["payment-deletion-warning"].openModal();
    },
    closePaymentDeletionModal() {
      // deleteComment
      this.$refs["payment-deletion-warning"].closeModal();
    },
    async deleteContract() {
      const isValid = await this.$refs.userComment.validate();
      if (isValid) {
        const { id } = this.$route.params;
        const body = {
          comment: this.deleteComment,
        };
        this.showLoading = true;
        this.closePaymentDeletionModal();
        await api.contractV2
          .deleteContract(id, body)
          .then(() => {
            this.$router.push({
              name: "contracts",
            });
            this.$swal({
              title: this.$t("successfully"),
              icon: "success",
              button: this.$t("yes"),
            });
          })
          .catch((error) => {
            this.toastedWithErrorCode(error);
          })
          .finally(() => {
            this.deleteComment = null;
            this.showLoading = false;
          });
      } else {
        this.$refs["comment-area"].focus();
      }
    },
    async fetchContractData() {
      this.showLoading = true;
      const { id } = this.$route.params;
      await api.contractV2
        .fetchContractView(id)
        .then((response) => {
          this.order = response.data;
          this.tabsConfiguration();
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    tabsConfiguration() {
      const { status, reissue } = this.order;
      if (status === "booked") {
        this.tabs = this.tabs.filter((tab) => {
          return tab.id !== 0 && tab.id !== 4;
        });
        this.activeTab = this.tabs[0];
        this.tabChange(this.activeTab.id);
      }
      if (!(reissue?.view && this.reContractViewPermission)) {
        this.tabs = this.tabs.filter((tab) => tab.id !== 4);
      }
    },
    startLoading() {
      this.showLoading = true;
    },
    finishLoading() {
      this.showLoading = false;
    },
    backNavigation() {
      this.$router.back();
    },
    refreshDetails() {
      this.fetchContractData();
    },
    openEditPage() {
      const name =
        this.order.type === "parking"
          ? "parking-checkout-update"
          : "checkout-v2-update";
      this.$router.push({
        name,
        params: {
          id: this.$route.params.id,
          object: this.order.object.id,
        },
      });
    },
  },
};
</script>
<template>
  <div>
    <AppHeader>
      <template #header-breadcrumb>
        <div
          v-if="hasConstructorOrder"
          class="navigation__content justify-content-between"
        >
          <div class="d-flex align-items-center">
            <div class="go__back" @click="backNavigation">
              <BaseArrowLeft :width="32" :height="32"></BaseArrowLeft>
            </div>
            <div class="breadcrumb__content">
              <div>
                {{ $t("payments.payment_list") }}
                <BaseArrowRight :width="18" :height="18" />
                <span>{{ order.contract }}</span>
              </div>
              <span class="head">
                {{ $t("payments.contract") }}
                <span class="contract__number">{{ order.contract }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
      <template #header-status>
        <div
          v-if="hasConstructorOrder"
          class="apartment__status d-flex justify-content-center align-items-center"
          :class="`status-${order.status}`"
        >
          {{ $t(`apartments.status.${order.status}`) }}
        </div>

        <!--   ? Warning icon when contract is archived     -->
        <x-square-background
          v-if="order.archived"
          padding="1"
          class="bg-yellow-100"
          style="border-radius: 2rem"
        >
          <x-icon name="archive" class="color-yellow-600"></x-icon>
          <span class="ml-1">{{ $t("in_the_archive") }}</span>
        </x-square-background>
        <x-square-background
          v-if="order.type === 'parking'"
          padding="0.4"
          class="mr-2 bg-violet-600"
        >
          <x-icon size="40" name="local_parking" class="color-yellow-400"></x-icon>
        </x-square-background>
      </template>
      <template #header-actions>
        <div v-if="hasAction">
          <AppDropdown :position-right="true">
            <template #header>
              {{ $t("contracts.view.actions") }}
            </template>
            <template #list>
              <b-dropdown-item
                v-if="downloadPermission"
                href="#"
                @click="downloadContact"
              >
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8H8ZM13 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H11V7C11 7.79565 11.3161 8.55871 11.8787 9.12132C12.4413 9.68393 13.2044 10 14 10H17V12C17 12.2652 17.1054 12.5196 17.2929 12.7071C17.4804 12.8946 17.7348 13 18 13C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12V9C19 9 19 9 19 8.94C18.9896 8.84813 18.9695 8.75763 18.94 8.67V8.58C18.8919 8.47718 18.8278 8.38267 18.75 8.3L12.75 2.3C12.6673 2.22222 12.5728 2.15808 12.47 2.11C12.4369 2.10421 12.4031 2.10421 12.37 2.11C12.2728 2.058 12.1683 2.02092 12.06 2H6C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H13C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21C14 20.7348 13.8946 20.4804 13.7071 20.2929C13.5196 20.1054 13.2652 20 13 20ZM13 5.41L15.59 8H14C13.7348 8 13.4804 7.89464 13.2929 7.70711C13.1054 7.51957 13 7.26522 13 7V5.41ZM14 12H8C7.73478 12 7.48043 12.1054 7.29289 12.2929C7.10536 12.4804 7 12.7348 7 13C7 13.2652 7.10536 13.5196 7.29289 13.7071C7.48043 13.8946 7.73478 14 8 14H14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12ZM20.71 18.29C20.617 18.1963 20.5064 18.1219 20.3846 18.0711C20.2627 18.0203 20.132 17.9942 20 17.9942C19.868 17.9942 19.7373 18.0203 19.6154 18.0711C19.4936 18.1219 19.383 18.1963 19.29 18.29L19 18.59V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V18.59L16.71 18.29C16.5217 18.1017 16.2663 17.9959 16 17.9959C15.7337 17.9959 15.4783 18.1017 15.29 18.29C15.1017 18.4783 14.9959 18.7337 14.9959 19C14.9959 19.2663 15.1017 19.5217 15.29 19.71L17.29 21.71C17.3851 21.801 17.4972 21.8724 17.62 21.92C17.7397 21.9729 17.8691 22.0002 18 22.0002C18.1309 22.0002 18.2603 21.9729 18.38 21.92C18.5028 21.8724 18.6149 21.801 18.71 21.71L20.71 19.71C20.8037 19.617 20.8781 19.5064 20.9289 19.3846C20.9797 19.2627 21.0058 19.132 21.0058 19C21.0058 18.868 20.9797 18.7373 20.9289 18.6154C20.8781 18.4936 20.8037 18.383 20.71 18.29ZM12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16H8C7.73478 16 7.48043 16.1054 7.29289 16.2929C7.10536 16.4804 7 16.7348 7 17C7 17.2652 7.10536 17.5196 7.29289 17.7071C7.48043 17.8946 7.73478 18 8 18H12Z"
                      fill="black"
                    />
                  </svg>
                </div>
                {{ $t("contracts.view.download_contract") }}
              </b-dropdown-item>
              <b-dropdown-item v-if="editPermission" @click="openEditPage">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8H8ZM13 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H11V7C11 7.79565 11.3161 8.55871 11.8787 9.12132C12.4413 9.68393 13.2044 10 14 10H17V12C17 12.2652 17.1054 12.5196 17.2929 12.7071C17.4804 12.8946 17.7348 13 18 13C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12V9C19 9 19 9 19 8.94C18.9896 8.84813 18.9695 8.75763 18.94 8.67V8.58C18.8919 8.47718 18.8278 8.38267 18.75 8.3L12.75 2.3C12.6673 2.22222 12.5728 2.15808 12.47 2.11C12.4369 2.10421 12.4031 2.10421 12.37 2.11C12.2728 2.058 12.1683 2.02092 12.06 2H6C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H13C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21C14 20.7348 13.8946 20.4804 13.7071 20.2929C13.5196 20.1054 13.2652 20 13 20ZM13 5.41L15.59 8H14C13.7348 8 13.4804 7.89464 13.2929 7.70711C13.1054 7.51957 13 7.26522 13 7V5.41ZM14 12H8C7.73478 12 7.48043 12.1054 7.29289 12.2929C7.10536 12.4804 7 12.7348 7 13C7 13.2652 7.10536 13.5196 7.29289 13.7071C7.48043 13.8946 7.73478 14 8 14H14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12ZM20.71 18.29C20.617 18.1963 20.5064 18.1219 20.3846 18.0711C20.2627 18.0203 20.132 17.9942 20 17.9942C19.868 17.9942 19.7373 18.0203 19.6154 18.0711C19.4936 18.1219 19.383 18.1963 19.29 18.29L19 18.59V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V18.59L16.71 18.29C16.5217 18.1017 16.2663 17.9959 16 17.9959C15.7337 17.9959 15.4783 18.1017 15.29 18.29C15.1017 18.4783 14.9959 18.7337 14.9959 19C14.9959 19.2663 15.1017 19.5217 15.29 19.71L17.29 21.71C17.3851 21.801 17.4972 21.8724 17.62 21.92C17.7397 21.9729 17.8691 22.0002 18 22.0002C18.1309 22.0002 18.2603 21.9729 18.38 21.92C18.5028 21.8724 18.6149 21.801 18.71 21.71L20.71 19.71C20.8037 19.617 20.8781 19.5064 20.9289 19.3846C20.9797 19.2627 21.0058 19.132 21.0058 19C21.0058 18.868 20.9797 18.7373 20.9289 18.6154C20.8781 18.4936 20.8037 18.383 20.71 18.29ZM12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16H8C7.73478 16 7.48043 16.1054 7.29289 16.2929C7.10536 16.4804 7 16.7348 7 17C7 17.2652 7.10536 17.5196 7.29289 17.7071C7.48043 17.8946 7.73478 18 8 18H12Z"
                      fill="black"
                    />
                  </svg>
                </div>
                {{ $t("contracts.view.update_contract") }}
              </b-dropdown-item>

              <template v-if="deletePermission">
                <!--!      RESTORE CONTRACT FROM TRASH        -->
                <b-dropdown-item
                  @click="restoreContract"
                  v-if="order.status === 'cancelled'"
                  class="ml-1"
                >
                  <x-icon name="restore_page"></x-icon>
                  {{ $t("restore_contract") }}
                </b-dropdown-item>

                <b-dropdown-item
                  v-else
                  href="#"
                  @click="openPaymentDeletionModal"
                >
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V11C11 10.7348 10.8946 10.4804 10.7071 10.2929C10.5196 10.1054 10.2652 10 10 10C9.73478 10 9.48043 10.1054 9.29289 10.2929C9.10536 10.4804 9 10.7348 9 11V17C9 17.2652 9.10536 17.5196 9.29289 17.7071C9.48043 17.8946 9.73478 18 10 18ZM20 6H16V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H11C10.2044 2 9.44129 2.31607 8.87868 2.87868C8.31607 3.44129 8 4.20435 8 5V6H4C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H5V19C5 19.7956 5.31607 20.5587 5.87868 21.1213C6.44129 21.6839 7.20435 22 8 22H16C16.7956 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7956 19 19V8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7C21 6.73478 20.8946 6.48043 20.7071 6.29289C20.5196 6.10536 20.2652 6 20 6ZM10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V6H10V5ZM17 19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H8C7.73478 20 7.48043 19.8946 7.29289 19.7071C7.10536 19.5196 7 19.2652 7 19V8H17V19ZM14 18C14.2652 18 14.5196 17.8946 14.7071 17.7071C14.8946 17.5196 15 17.2652 15 17V11C15 10.7348 14.8946 10.4804 14.7071 10.2929C14.5196 10.1054 14.2652 10 14 10C13.7348 10 13.4804 10.1054 13.2929 10.2929C13.1054 10.4804 13 10.7348 13 11V17C13 17.2652 13.1054 17.5196 13.2929 17.7071C13.4804 17.8946 13.7348 18 14 18Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  {{ $t("contracts.view.cancel_contract") }}
                </b-dropdown-item>
              </template>

              <b-dropdown-item
                v-if="reContractPermission"
                @click="openReContractModal"
              >
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8H8ZM13 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H11V7C11 7.79565 11.3161 8.55871 11.8787 9.12132C12.4413 9.68393 13.2044 10 14 10H17V12C17 12.2652 17.1054 12.5196 17.2929 12.7071C17.4804 12.8946 17.7348 13 18 13C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12V9C19 9 19 9 19 8.94C18.9896 8.84813 18.9695 8.75763 18.94 8.67V8.58C18.8919 8.47718 18.8278 8.38267 18.75 8.3L12.75 2.3C12.6673 2.22222 12.5728 2.15808 12.47 2.11C12.4369 2.10421 12.4031 2.10421 12.37 2.11C12.2728 2.058 12.1683 2.02092 12.06 2H6C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H13C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21C14 20.7348 13.8946 20.4804 13.7071 20.2929C13.5196 20.1054 13.2652 20 13 20ZM13 5.41L15.59 8H14C13.7348 8 13.4804 7.89464 13.2929 7.70711C13.1054 7.51957 13 7.26522 13 7V5.41ZM14 12H8C7.73478 12 7.48043 12.1054 7.29289 12.2929C7.10536 12.4804 7 12.7348 7 13C7 13.2652 7.10536 13.5196 7.29289 13.7071C7.48043 13.8946 7.73478 14 8 14H14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12ZM20.71 18.29C20.617 18.1963 20.5064 18.1219 20.3846 18.0711C20.2627 18.0203 20.132 17.9942 20 17.9942C19.868 17.9942 19.7373 18.0203 19.6154 18.0711C19.4936 18.1219 19.383 18.1963 19.29 18.29L19 18.59V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V18.59L16.71 18.29C16.5217 18.1017 16.2663 17.9959 16 17.9959C15.7337 17.9959 15.4783 18.1017 15.29 18.29C15.1017 18.4783 14.9959 18.7337 14.9959 19C14.9959 19.2663 15.1017 19.5217 15.29 19.71L17.29 21.71C17.3851 21.801 17.4972 21.8724 17.62 21.92C17.7397 21.9729 17.8691 22.0002 18 22.0002C18.1309 22.0002 18.2603 21.9729 18.38 21.92C18.5028 21.8724 18.6149 21.801 18.71 21.71L20.71 19.71C20.8037 19.617 20.8781 19.5064 20.9289 19.3846C20.9797 19.2627 21.0058 19.132 21.0058 19C21.0058 18.868 20.9797 18.7373 20.9289 18.6154C20.8781 18.4936 20.8037 18.383 20.71 18.29ZM12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16H8C7.73478 16 7.48043 16.1054 7.29289 16.2929C7.10536 16.4804 7 16.7348 7 17C7 17.2652 7.10536 17.5196 7.29289 17.7071C7.48043 17.8946 7.73478 18 8 18H12Z"
                      fill="black"
                    />
                  </svg>
                </div>
                {{ $t("re_contract") }}
              </b-dropdown-item>

              <template v-if="hasAdminRole && order.status !== 'cancelled'">
                <!--?   UNARCHIVE   -->
                <b-dropdown-item
                  @click="unarchiveContract"
                  v-if="order.archived"
                  class="ml-1"
                >
                  <x-icon name="unarchive"></x-icon>
                  {{ $t("remove_from_archive") }}
                </b-dropdown-item>

                <!--?   ARCHIVE   -->
                <b-dropdown-item
                  v-else
                  @click="archive.showWarnModal = true"
                  class="ml-1"
                >
                  <x-icon name="archive"></x-icon>
                  {{ $t("move_to_archive") }}
                </b-dropdown-item>
              </template>
            </template>
          </AppDropdown>
        </div>
      </template>
    </AppHeader>

    <!--  Header Navigation  -->
    <!--        <div v-if="hasConstructorOrder" class="navigation__content justify-content-between">-->
    <!--            <div class="d-flex align-items-center">-->
    <!--                <span class="go__back" @click="backNavigation">-->
    <!--                  <BaseArrowLeft :width="32" :height="32"></BaseArrowLeft>-->
    <!--                </span>-->
    <!--                <span class="breadcrumb__content">-->
    <!--                <span>-->
    <!--                  {{ $t('payments.payment_list') }}-->
    <!--                  <BaseArrowRight :width="18" :height="18"/>-->
    <!--                  <span>{{ order.contract }}</span>-->
    <!--                </span>-->
    <!--                <span class="head">-->
    <!--                  {{ $t('payments.contract') }} <span class="contract__number">{{ order.contract }}</span>-->
    <!--                </span>-->
    <!--              </span>-->

    <!--            </div>-->

    <!--        </div>-->

    <!--  Tabs  -->
    <!--        <base-filter-tabs-content-->
    <!--            :filter-tab-list="filterTabList"-->
    <!--            @get-new-content="changeTabOrder"-->
    <!--        />-->

    <template v-show="!showLoading">
      <b-tabs v-model="tabIndex" card class="custom-tab">
        <div class="bottom__line"></div>
        <b-tab
          v-for="tab in tabs"
          :key="tab.route"
          @click="tabChange(tab.id)"
          :title="tab.title"
        >
          <!--   PRICE CONTENT     -->
        </b-tab>
      </b-tabs>

      <router-view
        v-show="!showLoading"
        :order="order"
        :has-constructor-order="hasConstructorOrder"
        @start-loading="startLoading"
        @finish-loading="finishLoading"
        @refresh-details="refreshDetails"
      />
    </template>

    <!--        <component-->
    <!--            :is="activeTab"-->
    <!--            :order="order"-->
    <!--            :has-constructor-order="hasConstructorOrder"-->
    <!--            v-show="!showLoading"-->
    <!--            @start-loading="startFetching"-->
    <!--            @finish-loading="finishFetching"-->
    <!--            @refresh-details="refreshDetails"-->
    <!--        >-->
    <!--        </component>-->

    <base-loading v-if="showLoading" />

    <!-- ! WARNING BEFORE ARCHIVE CONTRACT -->
    <x-modal-center
      v-if="archive.showWarnModal"
      :bilingual="true"
      cancel-button-text="cancel"
      apply-button-class="w-100"
      cancel-button-class="w-100"
      apply-button-text="create_agree"
      footer-class="d-flex justify-content-between x-gap-1"
      :apply-button-loading="archive.sending"
      @close="closeArchiveWarnModal"
      @cancel="closeArchiveWarnModal"
      @apply="archiveContract"
    >
      <template #header>
        <h3 class="x-font-size-36px font-craftworksans color-gray-600">
          {{ $t("contract_archive_title") }}
        </h3>
      </template>

      <template #body>
        <div class="ch-comment-body mb-5 mt-5">
          <x-form-input
            class="w-100"
            :label="true"
            v-model="archive.comment"
            :placeholder="`${$t('commentary')}`"
          />
        </div>
      </template>
    </x-modal-center>

    <base-modal ref="payment-deletion-warning">
      <template #header>
        <span class="warning__before__delete-head">
          <span class="go__back" @click="backNavigation">
            <BaseArrowLeft :width="32" :height="32"></BaseArrowLeft>
          </span>
          <span class="title">{{ $t("contracts.warning") }}</span>
        </span>
      </template>

      <template #main>
        <span class="warning__before__delete-main mb-2">
          {{ $t("contracts.warn_before_delete_contract") }}
        </span>
        <validation-observer ref="userComment">
          <ValidationProvider
            :name="`${$t('contracts.comment')}`"
            rules="required|min:3"
            v-slot="{ errors }"
            class="mb-3"
          >
            <b-form-group
              class="delete-comment__title"
              :label="$t('contracts.comment_delete_contract')"
              label-for="userComment"
              desclass="mb-0"
            >
              <b-form-textarea class="delete-comment" v-model="deleteComment" />
            </b-form-group>
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </validation-observer>
      </template>

      <template #footer>
        <div class="warning__before__delete-footer">
          <base-button
            :fixed="true"
            @click="closePaymentDeletionModal"
            :text="`${$t('no_cancel')}`"
          >
          </base-button>
          <base-button
            :fixed="true"
            @click="deleteContract"
            :text="`${$t('yes_delete')}`"
            design="violet-gradient"
          >
          </base-button>
        </div>
      </template>
    </base-modal>

    <!--RE - CONTRACT-->
    <base-modal design="reContract-modal auto-height" ref="re-contract">
      <template #header>
        <span class="d-flex align-items-center justify-content-between">
          <span class="title">{{ $t("re_contract") }}</span>

          <span class="go__back" @click="closeReContractModal">
            <BaseCloseIcon />
          </span>
        </span>
      </template>

      <template #main>
        <div class="reContract-modal__warning">
          <BaseWarningIcon
            style="min-width: 40px"
            fill="#F97316"
            :width="40"
            :height="40"
          />
          <p>
            {{ $t("contracts.view.regenerate_warning") }}
          </p>
        </div>
        <div class="reContract-modal__select">
          <label>{{ $t("contracts.view.regenerate_select_reason") }}</label>

          <x-form-select
            v-model="reason_type"
            :options="types"
            :placeholder="$t('reason_recontract')"
            :multilingual="true"
            class="w-100"
          />
        </div>
      </template>

      <template #footer>
        <div class="warning__before__delete-footer">
          <base-button
            :fixed="true"
            @click="nextReContract"
            :text="`${$t('next')}`"
            design="violet-gradient"
          >
          </base-button>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../assets/scss/utils/tab.sass";

* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

.main__class {
  background-color: white;
  padding: 3rem;
  min-height: 100vh;
  color: var(--gray-600);
}

.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-200);
  }
}

.navigation__content {
  display: flex;
  align-items: center;
  //margin-bottom: 52px;

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9ca3af;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4b5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}

.delete-comment {
  width: 100%;
  height: 100px;

  &__title {
    font-weight: 600;
    font-size: 18px;
    color: var(--gray-600);
    margin-top: 1.5rem;
  }
}

.warning__before__delete {
  &-head {
    display: flex;
    align-items: center;

    .title {
      font-size: 2.25rem;
      line-height: 42px;
      margin-left: 1rem;
    }
  }

  &-main {
    display: block;
    max-width: 60%;
    font-family: Inter, sans-serif;
    color: var(--gray-600);
    //margin-left: 0.5rem;
  }

  &-footer {
    display: flex;
    gap: 2rem;
  }
}

.reContract-modal {
  & .modal-dialog .modal-content .title {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 36px;
    line-height: 42px;
  }

  &__warning {
    display: flex;
    align-items: center;
    padding: 24px;
    column-gap: 12px;
    background: var(--orange-50);
    border-radius: 32px;

    p {
      margin-bottom: 0;
      color: var(--orange-600);
    }
  }

  &__select {
    margin-top: 2rem;
  }
}

.apartment__status {
  font-family: Inter, sans-serif;
  background-color: var(--gray-100);
  border-radius: 2rem;
  font-size: 16px;
  min-width: max-content;
  padding: 1rem 3rem;
  margin: 0 1rem 0 2rem;
}

.status {
  &-waiting {
    background-color: var(--yellow-100) !important;
    color: var(--yellow-600) !important;
  }

  &-contract {
    background-color: var(--blue-100) !important;
    color: var(--blue-600) !important;
  }

  &-booked {
    background-color: var(--yellow-100) !important;
    color: var(--yellow-600) !important;
  }

  &-cancelled {
    background-color: var(--pink-100) !important;
    color: var(--pink-600) !important;
  }

  &-available {
    background-color: var(--teal-100) !important;
    color: var(--teal-600) !important;
  }

  &-sold {
    background-color: var(--gray-100) !important;
    color: var(--gray-600) !important;
  }

  &-unavailable {
    background-color: var(--gray-500) !important;
    color: var(--white) !important;
  }
}
</style>
