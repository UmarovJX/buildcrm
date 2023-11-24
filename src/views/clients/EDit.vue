<script>
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import AppHeader from "@/components/Header/AppHeader";

import { v3ServiceApi } from "@/services/v3/v3.service";

import ChClientDetails from "@/views/clients/components/ClientDetails";

export default {
  name: "ClientView",
  components: {
    ChClientDetails,

    BaseArrowLeftIcon,
    BaseLoading,
    AppHeader,
  },
  data() {
    return {
      showLoading: false,
      showSecondaryLoading: false,
      client: null,
    };
  },
  created() {
    this.fetchData();
  },

  watch: {},
  computed: {
    clientName() {
      if (!this.client) return "";
      const locale = this.$i18n.locale;
      let lang = "lotin";
      if (locale === "ru") {
        lang = "kirill";
      }
      if (this.client.subject === "physical") {
        const { first_name, last_name, middle_name } = this.client.attributes;
        return `${first_name[lang]} ${last_name[lang]} ${middle_name[lang]} `;
      } else {
        return (
          this.client.attributes.company.name[locale] +
          " " +
          this.client.attributes.name
        );
      }
    },
  },

  methods: {
    async fetchData() {
      this.showLoading = true;
      const { uuid } = this.$route.params;
      await v3ServiceApi.clients
        .findOne({ uuid })
        .then((response) => {
          this.client = response.data.result;
          setTimeout(() => {
            this.$refs["client-details-observer"].fillFormInUpdateMode(
              {
                client: this.client,
              },
              100
            );
          });
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
  },
};
</script>
<template>
  <div>
    <AppHeader>
      <template #header-breadcrumb>
        <div class="d-flex align-items-center">
          <div class="go__back" @click="$router.go(-1)">
            <BaseArrowLeftIcon :width="32" :height="32"></BaseArrowLeftIcon>
          </div>
          <div class="breadcrumb__content card-title mb-0">
            {{ clientName }}
          </div>
        </div>
      </template>
      <template #header-status> </template>
      <template #header-actions> </template>
    </AppHeader>

    <base-loading v-if="showLoading" />
    <ch-client-details ref="client-details-observer" v-else />
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/scss/utils/pagination";

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

.cards {
  display: flex;
  gap: 2%;

  .currency__chart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    //width: 306px;
    //height: 160px;
    max-width: 32%;
    flex-grow: 1;
    border-radius: 32px;
    margin-top: 32px;
    margin-bottom: 2rem;
    background-color: var(--gray-50);
    border: 2px solid var(--gray-200);
    padding: 1.5rem;
  }
}
.card-title {
  font-family: CraftworkSans, serif;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 14px;
  color: var(--violet-600);
  display: block;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}
.price {
  font-size: 1.25rem;
}
.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 9rem;
  border-radius: 2rem;
  padding: 0.5rem 0.5rem;

  &.sold {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.waiting {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  &.contract {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &.booked {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.closed,
  &.cancelled {
    background-color: var(--red-100);
    color: var(--red-600);
  }
}
</style>
