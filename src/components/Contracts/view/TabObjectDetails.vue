<template>
    <div class="custom__container">
        <div v-for="item in apartment" :key="item.id" class="row">
            <div class="object__details_layout col-5">
                <div class="object__details_layout_img">
                    <img v-if="imageUrl(item)" :src="imageUrl(item)" alt="apartment image">
                    <img v-else :src="require('@/assets/img/no-image.jpg')" alt="apartment image">
                </div>
                <button @click="openMapModal">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M3.4395 1.66675H16.5592C17.539 1.66675 18.3327 2.48429 18.3327 3.49363V4.76988C18.3327 5.25952 18.1413 5.72972 17.8016 6.07265L12.3807 11.5559C12.2872 11.6514 12.1602 11.7044 12.029 11.7035L7.49013 11.6894C7.35199 11.6894 7.22071 11.6302 7.12633 11.5268L2.14478 6.0479C1.83676 5.70939 1.66602 5.26217 1.66602 4.79816V3.49451C1.66602 2.48518 2.45967 1.66675 3.4395 1.66675ZM7.73277 13.1869L11.7782 13.1992C12.0305 13.2001 12.2347 13.4114 12.2347 13.6703V15.9462C12.2347 16.206 12.0871 16.4411 11.8572 16.5498L8.18493 18.2742C8.09913 18.314 8.00819 18.3334 7.91724 18.3334C7.79626 18.3334 7.67528 18.2981 7.56975 18.2282C7.38528 18.1063 7.27374 17.8959 7.27374 17.6705V13.6579C7.27374 13.3972 7.47966 13.186 7.73277 13.1869Z"
                              fill="#7C3AED"/>
                    </svg>
                    {{ $t('view_map') }}
                </button>
            </div>

            <div class="object__details_info col-6" v-if="haveApartment(item)">
                <div class="breadcrumb__head">
          <span class="name">
            {{ item.building.name }}
          </span>
                    <span class="slash"> / </span>
                    <span class="name">
            {{ item.block.name }}
          </span>
                </div>
                <span class="breadcrumb__location">{{ item.object.name }}</span>

                <div class="object__details_info_cards">
                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>
                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.sort.block') }}</span>
                            <span>{{ item.block.name }}</span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>

                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.entrance') }}</span>
                            <span>{{ item.apartment.entrance }}</span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>

                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.level') }}</span>
                            <span>{{ item.apartment.floor }}</span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>
                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.number_level') }}</span>
                            <span>{{ item.apartment.floors }}</span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>
                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.flat') }}</span>
                            <span>
                {{ item.apartment.number }}
              </span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>
                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.number_flat') }}</span>
                            <span>
                {{ item.apartment.rooms }}
              </span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>
                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.area') }}</span>
                            <span class="d-flex">
                  <span v-if="havePlan(item)" class="mr-2 font-normal">
                    {{ parseFloat(item.apartment.plan.area).toFixed(1) }}</span>
                  <span class="lowercase">м2</span>
              </span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>
                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.balcony') }}</span>
                            <span v-if="havePlan(item) && item.apartment.plan.balcony" class="d-flex font-normal">
                    <span class="mr-2">{{ parseFloat(item.apartment.plan.balcony_area).toFixed(1) }}</span>
                    <span class="lowercase">м2</span>
              </span>
                            <span v-else>Нет</span>
                        </div>
                    </div>

                    <div class="object__details_info_card d-flex align-items-center">
                        <div class="object__details_info_card_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#EDE9FE"/>
                                <path
                                    d="M10.3345 17.123V15.334C10.3345 14.8806 10.7031 14.5123 11.1597 14.5095H12.8363C13.295 14.5095 13.6668 14.8786 13.6668 15.334V17.1178C13.6668 17.511 13.9863 17.8305 14.3824 17.8334H15.5262C16.0604 17.8348 16.5733 17.625 16.9515 17.2505C17.3297 16.8759 17.5423 16.3674 17.5423 15.837V10.7552C17.5423 10.3267 17.351 9.92033 17.02 9.64546L13.1341 6.56007C12.4548 6.0204 11.4846 6.03784 10.8255 6.60156L7.02307 9.64546C6.67642 9.91223 6.46922 10.3198 6.45898 10.7552V15.8318C6.45898 16.9372 7.36162 17.8334 8.47509 17.8334H9.59282C9.7835 17.8348 9.96685 17.7605 10.1022 17.6272C10.2375 17.4938 10.3136 17.3123 10.3136 17.123H10.3345Z"
                                    fill="#7C3AED"/>
                            </svg>

                        </div>
                        <div class="object__details_info_card_text">
                            <span>{{ $t('object.complete') }}</span>
                            <span>
                {{ buildingDate(item.object.build_date) }}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--  LOCATION APARTMENT ON THE MAP  -->
        <base-modal ref="map-modal">
            <template #header>
                <!--   GO BACK     -->
                <span class="d-flex align-items-center">
            <span class="go__back" @click="closeMapModal">
              <base-arrow-left-icon :width="32" :height="32"></base-arrow-left-icon>
            </span>
                    <!--    TITLE      -->
            <span class="title">{{ $t('object_map') }}</span>
        </span>
            </template>

            <template #main>
                <div class="yandex__content">
                    <yandex-map :coords="coordinates" zoom="18" ymap-class="yandex__content-map">
                        <yandexMarker
                            :coords="coordinates"
                            marker-id="123123"
                            marker-type="placemark"
                        />
                    </yandex-map>
                </div>
            </template>

        </base-modal>
    </div>
</template>

<script>
import api from "@/services/api";
import {yandexMap, ymapMarker} from "vue-yandex-maps";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";

export default {
    name: "TabObjectDetails",
    components: {
        BaseModal,
        yandexMap,
        yandexMarker: ymapMarker,
        BaseArrowLeftIcon
    },
    props: {
        order: {
            type: Object,
            required: true
        }
    },
    emits: ['start-loading', 'finish-loading'],
    data() {
        return {
            apartment: []
        }
    },
    computed: {
        coordinates() {
            const {latitude, longitude} = this.order?.object?.location
            return [latitude, longitude]
        },
    },
    created() {
        this.fetchObjectDetails()
    },
    methods: {
        haveApartment(item) {
            return Object.keys(item).length
        },
        havePlan(item) {
            return this.haveApartment && item.apartment?.plan
        },
        imageUrl(item) {
            // console.log(item, 'item');
            const {apartment} = item
            // console.log(apartment, 'apartment');
            if (!(this.havePlan && apartment.plan)) {
                return ''
            }

            return apartment.plan?.image
        },
        datePrettier: (rawDate) => {
            const date = new Date(rawDate)
            const year = date.getFullYear()
            const baseMonth = date.getMonth() + 1
            const month = baseMonth < 10 ? `0${baseMonth}` : baseMonth
            return `${month}/${year}`
        },
        buildingDate(time) {
            const date = new Date(time)
            const year = date.getFullYear()
            let month = date.getMonth()
            if (month < 3) {
                month = '1'
            } else if (month >= 3 && month < 6) {
                month = '2'
            } else if (month >= 6 && month < 9) {
                month = '3'
            } else {
                month = '4'
            }
            return ` ${month} - ${this.$t('quarter')} ${year} ${this.$t('of_the_year')}`
        },
        async fetchObjectDetails() {
            this.startLoading()
            const {id} = this.$route.params
            await api.contractV2.getContractApartments(id)
                .then(response => {
                    // console.log(response.data, 'response.data');
                    this.apartment = response.data
                })
                .catch((error) => {
                    this.toastedWithErrorCode(error)
                })
                .finally(() => {
                    this.finishLoading()
                })
        },
        startLoading() {
            this.$emit('start-loading')
        },
        finishLoading() {
            this.$emit('finish-loading')
        },
        closeMapModal() {
            this.$refs['map-modal'].closeModal()
        },
        openMapModal() {
            this.$refs['map-modal'].openModal()
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    font-family: CraftworkSans, serif;
    font-style: normal;
    line-height: 22px;
    color: var(--gray-600);
    font-weight: 600;
}

.custom__container {
    display: flex;
    flex-direction: column;
    row-gap: 3rem;
    margin: 2rem 0;
}

.object__details_layout {
    max-width: 40rem;
    //max-height: 320px;
    width: 100%;
    height: auto;
    margin-right: 3rem;

    &_img {
        width: 100%;
        height: 84%;
        min-height: 20rem;
        overflow: hidden;
        margin-bottom: 1.5rem;

        & img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border: 2px solid var(--gray-200);
            border-radius: 2rem;
        }
    }

    button {
        width: 100%;
        height: 56px;
        border-radius: 32px !important;
        border: none !important;
        font-size: 16px;
        font-weight: 600;
        background: #F3F4F6 !important;
        color: #4B5563 !important;

        svg {
            margin-right: 18px;
        }
    }
}

.object__details_info {
    &_cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
    }

    &_card {
        display: flex;
        align-items: center;
        width: 48%;
        height: 56px;
        padding: 0 16px;
        margin-bottom: 1.5rem;
        border: 2px solid #E5E7EB;
        border-radius: 32px;
        letter-spacing: 1px;

        &:nth-last-child(1) {
            width: 100%;
        }

        &_text {
            width: 100%;
            padding-left: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-transform: uppercase;

            & > span {
                display: block;
                text-transform: uppercase;
            }

            & > span:first-child {
                font-size: 0.75rem;
            }
        }
    }

    .breadcrumb__head {
        font-size: 24px;
        line-height: 28px;
        color: var(--gray-600);
        text-transform: uppercase;

        .slash {
            color: var(--gray-400)
        }
    }

    .breadcrumb__location {
        font-size: 14px;
        line-height: 20px;
        color: var(--gray-400);
    }
}

.lowercase {
    text-transform: lowercase;
}

.font-normal {
    font-size: 1rem;
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
}

::v-deep .yandex__content {
    width: 45rem;
    height: 25rem;

    &-map {
        z-index: 100;
        border-radius: 2rem;
        border: 2px solid var(--gray-200);
        height: 25rem;
        width: 45rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
}

@media screen and (max-width: 1100px) {
    .object__details_info {
        &_cards {
            flex-direction: column;
        }

        &_card {
            width: 100%;
        }
    }
}
</style>