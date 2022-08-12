<template>
  <main class="main__class">
    <!--  Header Navigation  -->
    <div v-if="hasConstructorOrder" class="navigation__content justify-content-between">
      <div class="d-flex align-items-center">
        <span class="go__back" @click="backNavigation">
          <base-arrow-left :width="32" :height="32"></base-arrow-left>
        </span>
        <span class="breadcrumb__content">
          <span>
            {{ $t('payments.payment_list') }}
            <base-arrow-right :width="18" :height="18"/>
            <span>{{ order.contract }}</span>
          </span>
          <span class="head">
            {{ $t('payments.contract') }} <span class="contract__number">{{ order.contract }}</span>
          </span>
        </span>


        <span
            class="apartment__status d-flex justify-content-center align-items-center"
            :class="`status-${order.status}`"
        >
              {{ $t(`apartments.status.${order.status}`) }}
            </span>


      </div>
      <div v-if="hasAction">
        <b-dropdown right>
          <template #button-content>
            {{ $t('contracts.view.actions') }}
          </template>
          <b-dropdown-item v-if="downloadPermission" href="#" @click="downloadContact">
            <span class="mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8H8ZM13 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H11V7C11 7.79565 11.3161 8.55871 11.8787 9.12132C12.4413 9.68393 13.2044 10 14 10H17V12C17 12.2652 17.1054 12.5196 17.2929 12.7071C17.4804 12.8946 17.7348 13 18 13C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12V9C19 9 19 9 19 8.94C18.9896 8.84813 18.9695 8.75763 18.94 8.67V8.58C18.8919 8.47718 18.8278 8.38267 18.75 8.3L12.75 2.3C12.6673 2.22222 12.5728 2.15808 12.47 2.11C12.4369 2.10421 12.4031 2.10421 12.37 2.11C12.2728 2.058 12.1683 2.02092 12.06 2H6C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H13C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21C14 20.7348 13.8946 20.4804 13.7071 20.2929C13.5196 20.1054 13.2652 20 13 20ZM13 5.41L15.59 8H14C13.7348 8 13.4804 7.89464 13.2929 7.70711C13.1054 7.51957 13 7.26522 13 7V5.41ZM14 12H8C7.73478 12 7.48043 12.1054 7.29289 12.2929C7.10536 12.4804 7 12.7348 7 13C7 13.2652 7.10536 13.5196 7.29289 13.7071C7.48043 13.8946 7.73478 14 8 14H14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12ZM20.71 18.29C20.617 18.1963 20.5064 18.1219 20.3846 18.0711C20.2627 18.0203 20.132 17.9942 20 17.9942C19.868 17.9942 19.7373 18.0203 19.6154 18.0711C19.4936 18.1219 19.383 18.1963 19.29 18.29L19 18.59V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V18.59L16.71 18.29C16.5217 18.1017 16.2663 17.9959 16 17.9959C15.7337 17.9959 15.4783 18.1017 15.29 18.29C15.1017 18.4783 14.9959 18.7337 14.9959 19C14.9959 19.2663 15.1017 19.5217 15.29 19.71L17.29 21.71C17.3851 21.801 17.4972 21.8724 17.62 21.92C17.7397 21.9729 17.8691 22.0002 18 22.0002C18.1309 22.0002 18.2603 21.9729 18.38 21.92C18.5028 21.8724 18.6149 21.801 18.71 21.71L20.71 19.71C20.8037 19.617 20.8781 19.5064 20.9289 19.3846C20.9797 19.2627 21.0058 19.132 21.0058 19C21.0058 18.868 20.9797 18.7373 20.9289 18.6154C20.8781 18.4936 20.8037 18.383 20.71 18.29ZM12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16H8C7.73478 16 7.48043 16.1054 7.29289 16.2929C7.10536 16.4804 7 16.7348 7 17C7 17.2652 7.10536 17.5196 7.29289 17.7071C7.48043 17.8946 7.73478 18 8 18H12Z"
                      fill="black"/>
                </svg>
            </span>
            {{ $t('contracts.view.download_contract') }}
          </b-dropdown-item>
          <b-dropdown-item
              v-if="editPermission"
              :to="{name:'edit-apartment', params:{id:$route.params.id}}"
          >
            <span class="mr-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8H8ZM13 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H11V7C11 7.79565 11.3161 8.55871 11.8787 9.12132C12.4413 9.68393 13.2044 10 14 10H17V12C17 12.2652 17.1054 12.5196 17.2929 12.7071C17.4804 12.8946 17.7348 13 18 13C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12V9C19 9 19 9 19 8.94C18.9896 8.84813 18.9695 8.75763 18.94 8.67V8.58C18.8919 8.47718 18.8278 8.38267 18.75 8.3L12.75 2.3C12.6673 2.22222 12.5728 2.15808 12.47 2.11C12.4369 2.10421 12.4031 2.10421 12.37 2.11C12.2728 2.058 12.1683 2.02092 12.06 2H6C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H13C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21C14 20.7348 13.8946 20.4804 13.7071 20.2929C13.5196 20.1054 13.2652 20 13 20ZM13 5.41L15.59 8H14C13.7348 8 13.4804 7.89464 13.2929 7.70711C13.1054 7.51957 13 7.26522 13 7V5.41ZM14 12H8C7.73478 12 7.48043 12.1054 7.29289 12.2929C7.10536 12.4804 7 12.7348 7 13C7 13.2652 7.10536 13.5196 7.29289 13.7071C7.48043 13.8946 7.73478 14 8 14H14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12ZM20.71 18.29C20.617 18.1963 20.5064 18.1219 20.3846 18.0711C20.2627 18.0203 20.132 17.9942 20 17.9942C19.868 17.9942 19.7373 18.0203 19.6154 18.0711C19.4936 18.1219 19.383 18.1963 19.29 18.29L19 18.59V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V18.59L16.71 18.29C16.5217 18.1017 16.2663 17.9959 16 17.9959C15.7337 17.9959 15.4783 18.1017 15.29 18.29C15.1017 18.4783 14.9959 18.7337 14.9959 19C14.9959 19.2663 15.1017 19.5217 15.29 19.71L17.29 21.71C17.3851 21.801 17.4972 21.8724 17.62 21.92C17.7397 21.9729 17.8691 22.0002 18 22.0002C18.1309 22.0002 18.2603 21.9729 18.38 21.92C18.5028 21.8724 18.6149 21.801 18.71 21.71L20.71 19.71C20.8037 19.617 20.8781 19.5064 20.9289 19.3846C20.9797 19.2627 21.0058 19.132 21.0058 19C21.0058 18.868 20.9797 18.7373 20.9289 18.6154C20.8781 18.4936 20.8037 18.383 20.71 18.29ZM12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16H8C7.73478 16 7.48043 16.1054 7.29289 16.2929C7.10536 16.4804 7 16.7348 7 17C7 17.2652 7.10536 17.5196 7.29289 17.7071C7.48043 17.8946 7.73478 18 8 18H12Z"
                      fill="black"/>
                </svg>
            </span>
            {{ $t('contracts.view.update_contract') }}
          </b-dropdown-item>
          <b-dropdown-item v-if="deletePermission" href="#" @click="openPaymentDeletionModal">
            <span class="mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V11C11 10.7348 10.8946 10.4804 10.7071 10.2929C10.5196 10.1054 10.2652 10 10 10C9.73478 10 9.48043 10.1054 9.29289 10.2929C9.10536 10.4804 9 10.7348 9 11V17C9 17.2652 9.10536 17.5196 9.29289 17.7071C9.48043 17.8946 9.73478 18 10 18ZM20 6H16V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H11C10.2044 2 9.44129 2.31607 8.87868 2.87868C8.31607 3.44129 8 4.20435 8 5V6H4C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H5V19C5 19.7956 5.31607 20.5587 5.87868 21.1213C6.44129 21.6839 7.20435 22 8 22H16C16.7956 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7956 19 19V8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7C21 6.73478 20.8946 6.48043 20.7071 6.29289C20.5196 6.10536 20.2652 6 20 6ZM10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V6H10V5ZM17 19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H8C7.73478 20 7.48043 19.8946 7.29289 19.7071C7.10536 19.5196 7 19.2652 7 19V8H17V19ZM14 18C14.2652 18 14.5196 17.8946 14.7071 17.7071C14.8946 17.5196 15 17.2652 15 17V11C15 10.7348 14.8946 10.4804 14.7071 10.2929C14.5196 10.1054 14.2652 10 14 10C13.7348 10 13.4804 10.1054 13.2929 10.2929C13.1054 10.4804 13 10.7348 13 11V17C13 17.2652 13.1054 17.5196 13.2929 17.7071C13.4804 17.8946 13.7348 18 14 18Z"
                    fill="black"/>
              </svg>
            </span>
            {{ $t('contracts.view.cancel_contract') }}
          </b-dropdown-item>
          <b-dropdown-item
              v-if="reContractPermission"
              @click="openReContractModal"
          >
            <span class="mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9C10 8.73478 9.89464 8.48043 9.70711 8.29289C9.51957 8.10536 9.26522 8 9 8H8ZM13 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H11V7C11 7.79565 11.3161 8.55871 11.8787 9.12132C12.4413 9.68393 13.2044 10 14 10H17V12C17 12.2652 17.1054 12.5196 17.2929 12.7071C17.4804 12.8946 17.7348 13 18 13C18.2652 13 18.5196 12.8946 18.7071 12.7071C18.8946 12.5196 19 12.2652 19 12V9C19 9 19 9 19 8.94C18.9896 8.84813 18.9695 8.75763 18.94 8.67V8.58C18.8919 8.47718 18.8278 8.38267 18.75 8.3L12.75 2.3C12.6673 2.22222 12.5728 2.15808 12.47 2.11C12.4369 2.10421 12.4031 2.10421 12.37 2.11C12.2728 2.058 12.1683 2.02092 12.06 2H6C5.20435 2 4.44129 2.31607 3.87868 2.87868C3.31607 3.44129 3 4.20435 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H13C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21C14 20.7348 13.8946 20.4804 13.7071 20.2929C13.5196 20.1054 13.2652 20 13 20ZM13 5.41L15.59 8H14C13.7348 8 13.4804 7.89464 13.2929 7.70711C13.1054 7.51957 13 7.26522 13 7V5.41ZM14 12H8C7.73478 12 7.48043 12.1054 7.29289 12.2929C7.10536 12.4804 7 12.7348 7 13C7 13.2652 7.10536 13.5196 7.29289 13.7071C7.48043 13.8946 7.73478 14 8 14H14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12ZM20.71 18.29C20.617 18.1963 20.5064 18.1219 20.3846 18.0711C20.2627 18.0203 20.132 17.9942 20 17.9942C19.868 17.9942 19.7373 18.0203 19.6154 18.0711C19.4936 18.1219 19.383 18.1963 19.29 18.29L19 18.59V16C19 15.7348 18.8946 15.4804 18.7071 15.2929C18.5196 15.1054 18.2652 15 18 15C17.7348 15 17.4804 15.1054 17.2929 15.2929C17.1054 15.4804 17 15.7348 17 16V18.59L16.71 18.29C16.5217 18.1017 16.2663 17.9959 16 17.9959C15.7337 17.9959 15.4783 18.1017 15.29 18.29C15.1017 18.4783 14.9959 18.7337 14.9959 19C14.9959 19.2663 15.1017 19.5217 15.29 19.71L17.29 21.71C17.3851 21.801 17.4972 21.8724 17.62 21.92C17.7397 21.9729 17.8691 22.0002 18 22.0002C18.1309 22.0002 18.2603 21.9729 18.38 21.92C18.5028 21.8724 18.6149 21.801 18.71 21.71L20.71 19.71C20.8037 19.617 20.8781 19.5064 20.9289 19.3846C20.9797 19.2627 21.0058 19.132 21.0058 19C21.0058 18.868 20.9797 18.7373 20.9289 18.6154C20.8781 18.4936 20.8037 18.383 20.71 18.29ZM12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16H8C7.73478 16 7.48043 16.1054 7.29289 16.2929C7.10536 16.4804 7 16.7348 7 17C7 17.2652 7.10536 17.5196 7.29289 17.7071C7.48043 17.8946 7.73478 18 8 18H12Z"
                      fill="black"/>
                </svg>
            </span>
            {{ $t('re_contract') }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <!--  Tabs  -->
    <base-filter-tabs-content
        :filter-tab-list="filterTabList"
        @get-new-content="changeTabOrder"
    />
    <component
        :is="activeTab"
        :order="order"
        :has-constructor-order="hasConstructorOrder"
        v-show="!showLoading"
        @start-loading="startLoading"
        @finish-loading="finishLoading"
        @refresh-details="refreshDetails"
    >
    </component>

    <base-loading v-if="showLoading"/>
    <!-- WARNING BEFORE DELETE CONTRACT -->
    <base-modal ref="payment-deletion-warning">
      <template #header>
          <span class="warning__before__delete-head">
            <span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4"
                      d="M51.3346 27.9996C51.3346 40.8889 40.8883 51.3329 28.0013 51.3329C15.1143 51.3329 4.66797 40.8889 4.66797 27.9996C4.66797 15.1149 15.1143 4.66626 28.0013 4.66626C40.8883 4.66626 51.3346 15.1149 51.3346 27.9996"
                      fill="#EF4444"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M30.3081 29.5574C30.3081 30.7612 29.2661 31.7427 27.988 31.7427C26.71 31.7427 25.668 30.7612 25.668 29.5574V18.5185C25.668 17.3148 26.71 16.3333 27.988 16.3333C29.2661 16.3333 30.3081 17.3148 30.3081 18.5185V29.5574ZM25.6811 37.4814C25.6811 36.2776 26.7178 35.2961 27.9879 35.2961C29.2951 35.2961 30.3345 36.2776 30.3345 37.4814C30.3345 38.6852 29.2951 39.6667 28.0144 39.6667C26.7284 39.6667 25.6811 38.6852 25.6811 37.4814Z"
                      fill="#EF4444"/>
              </svg>
            </span>
            <span class="title">{{ $t('contracts.warning') }}</span>
          </span>
      </template>

      <template #main>
        <span class="warning__before__delete-main mb-2">
          {{ $t('contracts.warn_before_delete_contract') }}
        </span>
        <validation-observer ref="comment">
          <ValidationProvider
              :name="`${ $t('contracts.comment') }`"
              rules="required|min:3"
              v-slot="{errors}"
              class="mb-3"
          >
            <b-form-group
                class="delete-comment__title"
                :label="$t('contracts.comment_delete_contract')"
                label-for="comment"
                desclass="mb-0"
            >
              <b-form-textarea
                  class="delete-comment"
                  ref="comment-area"
                  v-model="deleteComment"
              />
            </b-form-group>
            <span class="error__provider" v-if="errors[0]">
            {{ errors[0] }}
          </span>
          </ValidationProvider>
        </validation-observer>
      </template>

      <template #footer>
        <div class="d-flex justify-content-between align-items-center warning__before__delete-footer">
          <base-button
              @click="closePaymentDeletionModal"
              :text="`${ $t('no_cancel') }`"
          >
          </base-button>
          <base-button
              @click="deleteContact"
              :text="`${ $t('yes_delete') }`"
              class="add__button"
          >
          </base-button>
        </div>
      </template>
    </base-modal>


    <!--RE - CONTRACT-->
    <base-modal design="reContract-modal auto-height" ref="re-contract">
      <template #header>
           <span class="d-flex align-items-center justify-content-between">
              <span class="title">{{ $t('re_contract') }}</span>

            <span class="go__back" @click="closeReContractModal">
              <BaseCLose/>
            </span>
        </span>
      </template>

      <template #main>
        <div class="reContract-modal__warning">
          <BaseWarningIcon style="min-width: 40px" fill="#F97316" :width="40" :height="40"/>
          <p>
            {{ $t('contracts.view.regenerate_warning') }}
          </p>
        </div>
        <div class="reContract-modal__select">
          <label>{{ $t('contracts.view.regenerate_select_reason') }}</label>
          <!--          <base-select v-model="reason_type"-->
          <!--                       textField="value"-->
          <!--                       :options="options"-->
          <!--                       @change="setFormProperty('reason_type',$event)"-->
          <!--                       :placeholder="$t('reason_recontract')"-->
          <!--                       :label="true"/>
          -->
          <b-dropdown left>
            <template v-if="reason_type" #button-content>
              <div class="input-block">
                <span class="input-label">{{ $t('reason_recontract') }}</span>
                <p class="input-text">
                  {{ checkLocales(reason_type.name) }}
                </p>
              </div>
            </template>
            <template v-else #button-content>
              <p class="default-label">
                {{ $t('reason_recontract') }}
              </p>
            </template>
            <b-dropdown-text href="#">

              <b-form-checkbox v-model="reason_type" v-for="option in types" :key="option.id" :value="option">
                {{ checkLocales(option.name) }}
              </b-form-checkbox>
            </b-dropdown-text>
          </b-dropdown>
        </div>

      </template>

      <template #footer>
        <div class="d-flex justify-content-between align-items-center warning__before__delete-footer">
          <base-button
              @click="nextReContract"
              :text="`${ $t('next') }`"
              class="violet-gradient"
          >
          </base-button>
        </div>
      </template>
    </base-modal>
  </main>
</template>
<script>
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import TabPaymentSchedule from "@/components/Contracts/view/TabPaymentSchedule";
import TabObjectDetails from "@/components/Contracts/view/TabObjectDetails";
import TabClientDetails from "@/components/Contracts/view/TabClientDetails";
import TabContractDetails from "@/components/Contracts/view/TabContractDetails";
// import ActivityLog from "@/components/Contracts/view/ActivityLog";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import TabReContractDetails from "@/components/Contracts/view/TabReContractDetails";
import {mapGetters} from "vuex";
import BaseCLose from "@/components/icons/BaseClose";
import BaseWarningIcon from "@/components/icons/BaseWarningIcon";
import BaseSelect from "@/components/Reusable/BaseSelect";
import ContractsPermission from "@/permission/contract";

export default {
  name: "ContractView",
  components: {
    BaseWarningIcon,
    BaseCLose,
    BaseFilterTabsContent,
    BaseDeleteIcon,
    BaseArrowRight,
    BaseArrowLeft,
    TabPaymentSchedule,
    TabObjectDetails,
    TabClientDetails,
    TabContractDetails,
    TabReContractDetails,
    // ActivityLog,
    BaseModal,
    BaseLoading,
    BaseButton,
    BaseSelect
  },
  data() {
    return {
      order: {},
      showLoading: false,
      activeTab: 'TabPaymentSchedule',
      tabs: ['TabPaymentSchedule', 'TabObjectDetails', 'TabClientDetails', 'TabContractDetails', 'TabReContractDetails'],
      deleteComment: null,
      errors: [],
      types: [],
      reason_type: '',
      reContractViewPermission: ContractsPermission.getContractsReissueViewPermission(),
      downloadPermission: ContractsPermission.getContractsDownloadPermission(),
      deletePermission: ContractsPermission.getContractsCancelPermission(),
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission',
      me: 'getMe'
    }),
    role() {
      return this.me.role
    },
    isStatusContract() {
      return this.order.status === 'contract'
    },
    hasAction() {
      return this.reContractPermission || this.editPermission || this.deletePermission || this.downloadPermission
    },
    // reContractViewPermission(){
    //   return ContractsPermission.getContractsReissueViewPermission()
    // },
    reContractPermission() {
      return ContractsPermission.getContractsReissueCreatePermission() && this.order.reissue && this.order.reissue.re_order
    },
    editPermission() {
      return ContractsPermission.getContractsEditPermission() && (this.order.status === 'sold' || this.order.status === 'contract')
    },
    filterTabList() {
      const list = [
        {
          name: this.$t('payment_schedule'),
        },
        {
          name: this.$t('object_details'),
        },
        {
          name: this.$t('client_details'),
        },
        {
          name: this.$t('contract_details'),
        },
        // {
        //   name: this.$t('contract_log'),
        // },
        {
          name: this.$t('recontract_details'),
        },

      ]

      const {status, reissue} = this.order
      if (status === 'booked') {
        return list.slice(1).map((ls, index) => ({...ls, status: index}))
      }
      if (!(this.reContractViewPermission && reissue?.view)) {
        return list.slice(0, -1).map((ls, index) => ({...ls, status: index}))
      }
      return list.map((ls, index) => ({...ls, status: index}))
    },
    hasConstructorOrder() {
      return Object.keys(this.order).length > 0
    },
  },
  async created() {
    await this.fetchContractData()
  },
  methods: {
    checkLocales(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },
    nextReContract() {
      this.$router.push({
        name: 're-contract',
        params: {
          id: this.$route.params.id,
          type: this.reason_type.id
        },
      })
    },
    setFormProperty(property, value) {
      this.form[property] = value
      this.errors[property] = false
    },
    openReContractModal() {
      this.$refs['re-contract'].openModal()
      this.getType()
    },
    getType() {
      const id = this.$route.params.id
      api.contractV2.reOrderDetails(id).then(res => {
        this.types = res.data.types
      }).catch(err =>
          console.log(err)
      )
    },
    closeReContractModal() {
      this.$refs['re-contract'].closeModal()
    },
    async downloadContact() {
      const {id} = this.$route.params
      await api.contract.downloadContract(id)
          .then(({data, headers}) => {
            const filename = headers.hasOwnProperty('x-filename') ? headers['x-filename'] : 'contract'
            const fileURL = window.URL.createObjectURL(new Blob([data]))
            const fileLink = document.createElement('a')
            fileLink.href = fileURL
            fileLink.setAttribute('download', filename)
            document.body.appendChild(fileLink)
            fileLink.click()
          })
          .catch(() => {
            return '#'
          })

    },
    openPaymentDeletionModal() {
      this.$refs['payment-deletion-warning'].openModal()
    },
    closePaymentDeletionModal() {
      // deleteComment
      this.$refs['payment-deletion-warning'].closeModal()
    },
    async deleteContact() {
      if (this.$refs['comment'].flags.valid) {
        const {id} = this.$route.params
        const body = {
          comment: this.deleteComment
        }
        this.showLoading = true
        this.closePaymentDeletionModal()
        await api.contractV2.deleteContract(id, body)
            .then(() => {
              this.$router.push({
                name: 'contracts'
              })
              this.$swal({
                title: this.$t('successfully'),
                icon: "success",
                button: this.$t('yes')
              })
            })
            .catch((error) => {
              this.toastedWithErrorCode(error)
            })
            .finally(() => {
              this.deleteComment = null
              this.showLoading = false
            })
      } else {
        this.$refs['comment-area'].focus()
      }

    },
    async fetchContractData() {
      this.showLoading = true
      const {id} = this.$route.params
      await api.contractV2.fetchContractView(id)
          .then((response) => {
            this.order = response.data
            this.tabsConfiguration()
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    tabsConfiguration() {
      const {status, reissue} = this.order
      if (status === 'booked') {
        this.activeTab = 'TabObjectDetails'
        this.tabs = this.tabs.filter(tab => tab !== 'TabPaymentSchedule')
      }
      if (!(reissue?.view && this.reContractViewPermission)) {
        // console.log(this.tabs, 'this.tabs old ');
        this.tabs = this.tabs.filter(tab => tab !== 'TabReContractDetails')
        // console.log(this.tabs, 'this.tabs last ');

      }
    },
    startLoading() {
      this.showLoading = true
    },
    finishLoading() {
      this.showLoading = false
    },
    backNavigation() {
      this.$router.go(-1)
    },
    changeTabOrder(status) {
      this.activeTab = this.tabs[status]
    },
    refreshDetails() {
      this.fetchContractData()
    }
  }
}
</script>

<style lang="scss" scoped>
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

.navigation__content {
  display: flex;
  align-items: center;
  margin-bottom: 52px;

  .go__back {
    width: 56px;
    height: 56px;
    border-radius: 100%;
    background-color: var(--gray-100);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9CA3AF;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4B5563;

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

::v-deep {
  .b-dropdown {
    width: 100%;
  }

  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
    font-family: Inter, serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-weight: 600 !important;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-600) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-200) !important;
    margin: 0 !important;
  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../../assets/icons/icon-down.svg");
    transition: all .2s ease-in-out;
  }

  .show .dropdown-toggle::after {
    transform: rotate(-180deg);
  }


  .dropdown-menu {
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: .5rem;


    .dropdown-item {
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 12px 17px;
      min-width: 256px;

      &:hover {
        background-color: var(--gray-200);
      }
    }
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
    gap: 2rem;

    button {
      flex-grow: 1;
    }
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

::v-deep {
  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
    font-family: Inter, sans-serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-style: normal;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-400) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-100) !important;
    margin: 0 !important;
    //width: 100%;

    &:hover {
      -webkit-box-shadow: 0 8px 25px -8px var(--gray-400) !important;
      box-shadow: 0 8px 25px -8px var(--gray-400) !important;
    }

    .input-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .input-label {
      font-weight: 900;
      font-size: 8px;
      line-height: 10px;
      margin: 0 2px 0 0;
      //margin-bottom: 2px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--gray-400);
    }

    .input-text {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: var(--gray-600);
      margin: 0;
      max-width: 300px;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    .default-label {
      line-height: 22px;
      font-size: 1rem;
      color: var(--gray-400);
      margin: 0;
    }

  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../../assets/icons/icon-down.svg");
    transition: all .2s ease-in-out;
  }

  .show .dropdown-toggle::after {
    transform: rotate(-180deg);
  }

  .dropdown-menu {
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: .5rem;

    .dropdown-item {
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 12px 17px;
      min-width: 256px;

      &:hover {
        background-color: var(--gray-200);
      }
    }

  }


  .b-dropdown-text {
    min-width: 16rem;
    padding: .5rem !important;

    .form-group {
      margin-bottom: 0;
    }
  }

  .custom-control-label {
    display: flex;
    align-items: center;
    padding-left: 2rem;
    width: 100%;
    height: 100%;

    &:before, &:after {
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
  }

  .custom-control-input:focus ~ .custom-control-label::before {
    -webkit-box-shadow: 0 0 0 0.2rem rgba(196, 181, 253, 5%);
    box-shadow: 0 0 0 0.2rem rgba(196, 181, 253, 5%);
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: var(--violet-600);
    background-color: var(--violet-600);
  }

  .custom-checkbox {
    width: 100%;
    display: flex;
    align-items: center;
    padding: .15rem .15rem .15rem 1rem;
    height: 50px;
    font-weight: 600;
    border-radius: 1rem;
    color: var(--gray-600);
    font-size: 1rem;

    &:hover {
      background-color: var(--gray-200);
    }
  }

}


.apartment__status {
  font-family: Inter, sans-serif;
  background-color: var(--gray-100);
  border-radius: 2rem;
  font-size: 16px;
  min-width: max-content;
  padding: 1rem 3rem;
  margin: 0 2rem;
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