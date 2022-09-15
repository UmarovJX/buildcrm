<template>
    <div class="app-checkout">
        <ErrorNotification :value="validationError" @close-bar="validationError.visible = false"/>
        <app-header>
            <template #header-right>
                <div v-if="expiry_at" :class="flexCenter" class="checkout-timer background-violet-gradient mr-2">
                    <CountDown
                        :deadline="expiry_at"
                        :showDays="false"
                        :showHours="false"
                        @timeElapsed="timeElapsedHandler"
                    />
                </div>
            </template>
        </app-header>
        <div class="app-checkout-main">
            <b-tabs
                pills
                v-model="tabIndex"
                content-class="app-tabs-content"
                nav-class="app-tabs-content-header"
            >

                <!--  FIRST TAB    -->
                <b-tab active>
                    <template #title>
                        <div class="app-tab-title d-flex align-items-center">
                            <span :class="flexCenter" class="app-tab-title-number">1</span>
                            <p class="app-tab-title-content">Детали договора</p>
                            <span :class="flexCenter" class="app-tab-title-right-icon">
              <base-right-icon :width="18" :height="18"/>
            </span>
                        </div>
                    </template>

                    <DetailsContract
                        :apartments="apartments"
                        :order="order"
                        :client="client"
                    />

                </b-tab>
                <!--  END OF FIRST TAB    -->

                <!--   SECOND TAB   -->
                <b-tab :disabled="stepTwoDisable">
                    <template #title>
                        <div class="app-tab-title d-flex align-items-center">
                            <span :class="flexCenter" class="app-tab-title-number">2</span>
                            <p class="app-tab-title-content">Детали платежей</p>
                        </div>
                    </template>

                    <div v-if="tabIndex===1" class="app-tab-content">
                        <div>
                            <div class="app-tab__header-collapse" v-b-toggle.accordion-1>
                                <h3 class="section-title">Информация клиента</h3>
                                <img class="collapse-icon" :src="require('@/assets/icons/icon-down.svg')" alt="">
                            </div>
                            <b-collapse id="accordion-1">
                                <ClientInformation :client="client"/>
                            </b-collapse>
                            <div class="app-tab__header-collapse" v-b-toggle.accordion-2>
                                <h3 class="section-title">Список квартир</h3>
                                <img class="collapse-icon" :src="require('@/assets/icons/icon-down.svg')" alt="">
                            </div>
                            <b-collapse id="accordion-2">
                                <ApartmentItem :apartments="apartments"/>
                            </b-collapse>
                            <div class="app-tab__header">
                                <h3 class="section-title">Детали платежа</h3>
                            </div>
                            <div class="app-checkout__calculator">
                                <Calculator/>
                            </div>
                        </div>
                    </div>
                </b-tab>
                <!--   END OF SECOND TAB   -->

                <!--        TABS END -->
                <template #tabs-end>
                    <b-nav-item role="presentation" href="#">
                        <base-button @click="changeTab"
                                     class="violet-gradient"
                                     :text="$t('next')">
                            <template #right-icon>
                                <BaseArrowRightIcon fill="var(--white)"/>
                            </template>
                        </base-button>

                    </b-nav-item>
                </template>

            </b-tabs>
        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
// import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
// import BaseEditIcon from "@/components/icons/BaseEditIcon";
// import BaseCircleWrapper from "@/components/Reusable/BaseCircleWrapper";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
// import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
// import BaseInput from "@/components/Reusable/BaseInput";
// import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseButton from "@/components/Reusable/BaseButton";
// import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
// import BaseModal from "@/components/Reusable/BaseModal";
import ClientInformation from "@/views/Checkout/ClientInformation";
import ApartmentItem from "@/views/Checkout/ApartmentItem";
import Calculator from "@/components/Dashboard/Apartment/Contract/Calculator";
import {mapActions} from "vuex";
import api from "@/services/api";
import ErrorNotification from "@/components/Reusable/ErrorNotification";
// import FlipCountdown from "vue2-flip-countdown";
import CountDown from "@/components/Reusable/CountDown";
import DetailsContract from "@/views/Checkout/DetailsContract";

export default {
    name: "Checkout",
    components: {
        ErrorNotification,
        Calculator,
        ApartmentItem,
        ClientInformation,
        AppHeader,
        // BaseInput,
        // BaseSelect,
        BaseButton,
        // BaseModal,
        // BaseEditIcon,
        BaseRightIcon,
        // BaseDatePicker,
        // OutputInformation,
        // BaseCircleWrapper,
        BaseArrowRightIcon,
        // BaseCloseIcon,
        CountDown,
        DetailsContract,
    },
    data() {
        return {
            newContractNumber: '',
            changedContractNumber: false,
            datePickerIconFill: 'var(--violet-600)',
            tabIndex: 0,
            form: {
                contract_date: '',
                passport_number: '',
                passport_issue: '',
                passport_date: '',
                birthday: '',
                last_name: {
                    lotin: '',
                    kirill: ''
                },
                first_name: {
                    lotin: '',
                    kirill: ''
                },
                second_name: {
                    lotin: '',
                    kirill: ''
                },
                phone: '',
                other_phone: '',
                language: '',
                client_type: '',
                friends: false,
            },
            options: [
                {
                    text: 'UZ',
                    value: 'uz'
                },
                {
                    text: 'RU',
                    value: 'ru'
                }
            ],
            client: {
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
                passport_series: null,
                issued_by_whom: null,
                date_of_issue: null,
                language: "uz",
                friends: false,
                birth_day: null,
                phone: null,
                other_phone: null,
                first_payment_date: null,
                payment_date: null,
            },
            clientTypeOption: [
                {text: 'Незнакомый', value: 'false'},
                {text: 'Знакомый', value: 'true'},
            ],
            apartments: [
                {
                    discount_id: "other",
                    entrance: 2,
                    floor: 3,
                    block: {
                        address: null,
                        build_date: null,
                        credit_month: null,
                        id: 1,
                        location: null,
                        name: "Блок K",
                    },
                    building: {
                        address: null,
                        build_date: null,
                        credit_month: null,
                        id: 1,
                        location: null,
                        name: "87605",
                    },
                    plan: {
                        area: 94.1,
                        balcony: false,
                        balcony_area: 0,
                        id: 6,
                    },
                    object: {
                        address: "71351 Von Hill Suite 928\nLake Napoleon, AK 91071-9471",
                        build_date: "2022-11-03",
                        credit_month: 32,
                        id: 1,
                    },
                    id: "dab7329e-e6a8-42cc-a934-666c786747ff",
                    number: "N-45",
                    price: 617510924,
                    price_calc: 617510924.4,
                    price_edited: true,
                    price_m2: 6562284,
                    price_sold: 617510924,
                    rooms: 3,
                }
            ],
            order: {},
            stepTwoDisable: true,
            validationError: {
                type: '',
                message: '',
                visible: false,
            },
            expiry_at: null,
        }
    },
    watch: {
        newContractNumber(value) {
            this.changedContractNumber = !!(value && value.length && !(value === this.order.contract_number));
        }
    },
    computed: {
        flexCenter() {
            return 'd-flex justify-content-center align-items-center'
        },
    },

    async created() {
        const apartments = ['9450d1fc-a2f3-43c6-ba11-770c5a903738']
        await api.orders.holdOrder(apartments)
            .then((response) => {
                if (response?.data) {
                    this.$route.params.id = response.data.uuid
                    this.order = response.data
                    console.log(response.data.expiry_at, 'response.data.expiry_at');
                    this.expiry_at = response.data.expiry_at
                }
            })
        this.$route.params.object = '3'

        console.log(this.expiry_at, 'this.order.expiry_at');
        this.expiry_at = this.$moment(this.expiry_at)
            .utcOffset("+0500")
            .format("YYYY-MM-DD H:mm:ss");
    },
    mounted() {
        this.getClientData()

        const current = this.$moment(new Date())
            .utcOffset("+0500")
            .format("YYYY-MM-DD H:mm:ss");

        const expired = this.$moment(this.order.expiry_at)
            .utcOffset("+0500")
            .format("YYYY-MM-DD H:mm:ss");

        // console.log(expired, 'expired');
        // console.log(expired, 'expiry_at');
        // this.expiry_at = expired;

        const time = new Date(current) - new Date(expired);
        console.log(time, 'time');
        if (time > 0) {
            this.timeElapsedHandler();
        }
    },
    methods: {
        ...mapActions(["fetchApartmentOrder"]),

        async changeTab() {
            await this.$refs['client-validation'].validate().then((res) => {
                const body = {...this.client, type_client: this.client.friends ? 'friends' : 'unknown'}
                if (res) {
                    api.clientsV2.createClient(body).then(() => {
                        this.validationError = {
                            visible: true,
                            message: 'Успешно',
                            type: "success"
                        }
                        if (this.tabIndex === 0) {
                            this.stepTwoDisable = false
                            setTimeout(() => {
                                this.tabIndex = 1
                            }, 100)
                        }
                    }).catch((err) => {
                        let error = []
                        for (const value of Object.values(err.response.data)) {
                            error = [...error, value]
                        }
                        this.validationError = {
                            visible: true,
                            message: error.join(', '),
                            type: "error"
                        }
                        this.stepTwoDisable = true
                    })
                } else {
                    this.validationError = {
                        visible: true,
                        message: 'Поля, выделенные красным цветом, не заполнены или заполнены неправильно',
                        type: "error"
                    }
                    this.stepTwoDisable = true
                }
            })
        },
        async getClientData() {
            const uuid = 'ef77be1c-cbd8-4b69-bc71-ce13456d3b61'
            await api.contractV2.getUpdateContractView(uuid).then((res) => {
                this.apartments = res.data.apartments
                this.client = res.data.client
                console.log(res.data.client, 'res.data.client');
            })
        },
        backToView() {
            if (this.order.status === "sold") {
                this.$router.push({
                    name: "contracts-view",
                    params: {id: this.$route.params.id},
                });
            }
        },
        timeElapsedHandler() {
            console.log('time is up');
            this.expiredConfirm();
        },
        async expiredConfirm() {
            try {
                this.loading = true;
                await api.orders.deactivateOrderHold(this.order.uuid)
                    .then(() => {
                        this.$router.push({
                            name: "apartments",
                        });
                    })
                    .catch();
            } catch (error) {
                this.toastedWithErrorCode(error);
            } finally {
                this.loading = false;
            }
        },
    },
}
</script>


<style lang="scss">

.app-tab {
    &-title {
        display: flex;
        justify-content: center;
        font-family: Inter, sans-serif;
        font-style: normal;
        font-weight: 600;


        &-number {
            width: 2rem;
            height: 2rem;
            font-size: 14px;
            line-height: 20px;
            border-radius: 50%;
            margin-right: .5rem;
            color: var(--gray-400);
            background-color: var(--gray-100);
        }

        &-content {
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 22px;
            margin-bottom: 0;
            color: var(--gray-400);
        }


        &-right-icon {
            display: flex;
            align-items: center;
            margin-left: 12px;
        }
    }

    &-content {
        margin-left: 3rem;
        margin-right: 3rem;
    }

    &__header-collapse {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;

        .section-title {
            margin-bottom: 0;
        }

        .collapse-icon {
            transition: all .3s linear;
        }

        &.not-collapsed {

            .collapse-icon {
                transform: rotate(-180deg);
            }
        }
    }
}

</style>


<style lang="scss" scoped>

.app-checkout {
    .checkout-timer {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        font-size: 1.5rem;
        line-height: 30px;
        color: var(--white);
        border-radius: 28px;
        height: 56px;
        min-width: 102px;

        &-inner {
            padding: 13px 16px;
        }
    }

    &__calculator {

    }
}

::v-deep .app-tabs-content {
    &-header {
        display: flex;
        align-items: center !important;
        justify-content: flex-start;
        flex-wrap: nowrap;
        margin-bottom: 2rem;
        border-top: 6px solid var(--gray-100);
        border-bottom: 6px solid var(--gray-100);
        padding: 20px 3rem;

        .nav-item {
            min-width: max-content;

            .nav-link {
                padding: 8px 6px;
            }

            .active {
                background-color: transparent;

                .app-tab-title-number {
                    background-color: var(--violet-600);
                    color: white;
                }

                p {
                    color: var(--violet-600);
                }
            }

            &:last-child {
                width: 100%;

                .nav-link {
                    display: flex;
                    justify-content: flex-end;
                }
            }

        }
    }
}

</style>