<template>
  <div>
    <div v-for="(apartment,index) in apartments" :key="apartment.id" class="d-flex" style="margin-bottom: 50px">
      <div class="vertical">
        <h5>
          Этажи
        </h5>
      </div>

<<<<<<< HEAD
      <div class="block">
        <div class="list-number">
          <div class="header" style="color: transparent">
            .
          </div>
          <div v-for="level in levelLarge(index)" :key="level" class="counter">
            {{ level }}
          </div>
=======
      <div v-for="value in objectApi.blocks" :key="value.id" class="d-flex flex-column position-relative"
           style="margin-right: 30px">

        <div class="header">
          {{ value.name }}
>>>>>>> 7371370 (XT-440 . continue process of create apartment express view.)
        </div>

        <div v-for="value in apartment.blocks" :key="value.id" class="d-flex flex-column position-relative">

          <div class="header">
            {{ value.name }}
          </div>

<<<<<<< HEAD
          <div class="item">

          <span v-for="item in value.floors" :key="item.name">
            <div v-if="item.apartments.length" class="d-flex flex-nowrap block-content">
              <div v-for="elem in item.apartments" :key="elem.id" class="block-item">
                <div class="square">
                  <div class="square-header">
                    <p>Кв. №{{ elem.id }}</p>
                    <div v-if="!elem.discounts.length" class="h-auto d-flex">
                      <img src="../../assets/icons/bonuses.svg" alt="">
                    </div>
                  </div>
                  <div class="square-body">
                    <h5 :class="status(elem.order.status).class">
                      <template v-if="status(elem.order.status).statusText">
                        {{ status(elem.order.status).statusText }}
                      </template>
                      <template v-else>
                        {{ price(elem.price) }} сум
                      </template>
                    </h5>
                  </div>
                  <div class="square-footer">
                    <p>{{ elem.plan.area }}M<sup>2</sup></p>
                    <p>{{ price(elem.price_m2) }} сум/M<sup>2</sup></p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="block-item">
              <div class="square">
              </div>
            </div>
=======
          <!--{{value[0]}}-->
          <span class="d-flex flex-nowrap block-content" v-for="item in value.floors" :key="item.name+ 'item'">
          <div
              v-for="elem in item.apartments"
              :key="elem.id +'element'"
              class="block-item"
              @click="showExpressSidebar(item)"
          >
            <div class="square">
              <div class="square-top">
                <p>Кв. №200</p>
                <img src="../../assets/icons/icon-down.svg" alt="">
              </div>
            </div>
            {{ elem.number }}
          </div>
>>>>>>> 7371370 (XT-440 . continue process of create apartment express view.)
         </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: "ObjectBlock",
<<<<<<< HEAD
  props: {
    apartments: {
      type: Array,
      required: true,
=======
  emits: ['show-express-sidebar'],
  data() {
    return {
      objectApi: {
        "id": 13,
        "name": "Корпус А",
        "blocks":
            [
              {
                "id": 26,
                "name": "Блок A",
                "floors": [
                  {
                    "name": 1,
                    "apartments": [
                      {
                        "id": 1636,
                        "number": "43",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2ec505d5-31f5-4a23-8036-b9de3abb7f72",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1637,
                        "number": "44",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3d5d07f-ebfb-47b2-8ab5-0b473c38a17a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1638,
                        "number": "45",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "f546f32b-4895-45a8-a0d3-be27ec1f9c75",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1639,
                        "number": "46",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1db367d8-b148-466b-b049-401ae0566fc7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                    ]
                  },
                  {
                    "name": 2,
                    "apartments": [
                      {
                        "id": 690,
                        "number": "1",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "7c585c24-23b1-4847-99a0-8b579b77b01d",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 691,
                        "number": "2",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "88820267-13a7-4ac5-a435-5745ef8d5844",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 692,
                        "number": "3",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "40ffc3e9-2e45-487d-8bdc-0fc0b39fbdc9",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 693,
                        "number": "4",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "857c7d2c-c865-48c7-97c0-1a2886ed5b82",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 694,
                        "number": "5",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d62baf17-74fc-4afd-9103-171bd8eb2d46",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 695,
                        "number": "6",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "b247fab4-b759-482f-9e11-88cc989ad32c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 696,
                        "number": "7",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "1af9ba73-ecd1-4a27-8a20-67a3dd3ba62f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 3,
                    "apartments": [
                      {
                        "id": 697,
                        "number": "8",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "251dd920-db02-4e2d-b153-dd120f62159e",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 698,
                        "number": "9",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "8c58857b-d266-476b-a74a-29be62320a6f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 699,
                        "number": "10",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "79f257df-9533-422d-9668-24dda7beaca4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 700,
                        "number": "11",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "96f00c97-073b-4fe3-a1ef-d7c7457b9ea4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 701,
                        "number": "12",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "16f35851-248e-4e47-94d6-929b9aa78505",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 702,
                        "number": "13",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "7648da88-8688-4ccd-955c-0fa320bf1f13",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 703,
                        "number": "14",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c8419848-9055-43e1-af57-213afc1c771b",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 4,
                    "apartments": [
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 705,
                        "number": "16",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "211b4bca-b6ce-4c4f-b98a-7b046503b85b",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 706,
                        "number": "17",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "4c3d061d-5b6e-41fa-89ae-f488afb3d0ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 707,
                        "number": "18",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "3367926a-b4c9-4a9f-9e2b-659542164473",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 708,
                        "number": "19",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "49fd39d5-8e2e-4e5d-a2ff-eb85aa8b756a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 709,
                        "number": "20",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3a80396-6158-4da3-8270-33fcfc81e522",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 710,
                        "number": "21",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d43cfceb-83c7-48d3-aec7-1a5dd71ca6b5",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 5,
                    "apartments": [
                      {
                        "id": 711,
                        "number": "22",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "261a9362-0385-428e-8df0-8be152be50f2",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 712,
                        "number": "23",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "bad3b28a-2d5b-469f-ac59-f18d4df4416f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 713,
                        "number": "24",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "9a913d71-a254-4e04-a1ce-85204cff0a80",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 714,
                        "number": "25",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "84c18ac5-eb54-4a5c-a0b2-4d929f90ba53",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 715,
                        "number": "26",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "54dfca69-1262-4645-bec9-46aa7680ecef",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 716,
                        "number": "27",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "ad4ebafa-8b2a-4f62-b0ad-8a0b0b31c425",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 717,
                        "number": "28",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "fcfffbef-49bb-4cab-adc6-b82fcc59732c",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 6,
                    "apartments": [
                      {
                        "id": 718,
                        "number": "29",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5538a9c9-26e1-44b6-9f5d-c61f7b947453",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 719,
                        "number": "30",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "0e887eb2-ae6d-4678-98c8-7f372a4100a7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 720,
                        "number": "31",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cae7c4e4-1938-4112-a66a-ead8cfe72588",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 721,
                        "number": "32",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "10fd7f59-977a-4131-a64c-8e854db3f566",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 722,
                        "number": "33",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5a055a3a-3c9b-4e98-99f4-7a0e3c0da606",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 723,
                        "number": "34",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f000bbc8-c8c0-4882-a474-833d9da9bfd7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 724,
                        "number": "35",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "aed2cbac-5783-4080-b40a-4d55410552ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 7,
                    "apartments": [
                      {
                        "id": 725,
                        "number": "36",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c5b5dc34-fe74-4ca8-925e-8e0132856fd1",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 726,
                        "number": "37",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1c301ec1-01f1-4a8d-99f6-fb51a77266d1",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 727,
                        "number": "38",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "bea29750-d148-42b4-b474-a82fb397834f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 728,
                        "number": "39",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a27ddb16-8ff7-44d6-a05b-c2663bad39a8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 729,
                        "number": "40",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2d05b66e-a405-40b5-a787-03e3c3d3a43c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 730,
                        "number": "41",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f04c6ab2-2d4a-4f21-b1de-06393ea5b072",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 731,
                        "number": "42",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cf64d4b7-7571-436f-bfc7-a068f2a8941d",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 8,
                    "apartments": [
                      {
                        "id": 1636,
                        "number": "43",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2ec505d5-31f5-4a23-8036-b9de3abb7f72",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1637,
                        "number": "44",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3d5d07f-ebfb-47b2-8ab5-0b473c38a17a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1638,
                        "number": "45",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "f546f32b-4895-45a8-a0d3-be27ec1f9c75",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1639,
                        "number": "46",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1db367d8-b148-466b-b049-401ae0566fc7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1640,
                        "number": "47",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "04ad2ad6-a5e9-4379-99b1-a209849c6ad8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1641,
                        "number": "48",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "4378a5e3-2816-4ae4-9c10-80fb515f11d0",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1642,
                        "number": "49",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "68604063-7872-4e40-b88c-55e10244f842",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 9,
                    "apartments": []
                  },
                  {
                    "name": 10,
                    "apartments": []
                  }
                ]
              },
              {
                "id": 27,
                "name": "Блок B",
                "floors": [
                  {
                    "name": 1,
                    "apartments": []
                  },
                  {
                    "name": 2,
                    "apartments": [
                      {
                        "id": 690,
                        "number": "1",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "7c585c24-23b1-4847-99a0-8b579b77b01d",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 691,
                        "number": "2",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "88820267-13a7-4ac5-a435-5745ef8d5844",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 692,
                        "number": "3",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "40ffc3e9-2e45-487d-8bdc-0fc0b39fbdc9",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 693,
                        "number": "4",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "857c7d2c-c865-48c7-97c0-1a2886ed5b82",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 694,
                        "number": "5",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d62baf17-74fc-4afd-9103-171bd8eb2d46",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 695,
                        "number": "6",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "b247fab4-b759-482f-9e11-88cc989ad32c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 696,
                        "number": "7",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "1af9ba73-ecd1-4a27-8a20-67a3dd3ba62f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 3,
                    "apartments": [
                      {
                        "id": 697,
                        "number": "8",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "251dd920-db02-4e2d-b153-dd120f62159e",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 698,
                        "number": "9",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "8c58857b-d266-476b-a74a-29be62320a6f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 699,
                        "number": "10",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "79f257df-9533-422d-9668-24dda7beaca4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 700,
                        "number": "11",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "96f00c97-073b-4fe3-a1ef-d7c7457b9ea4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 701,
                        "number": "12",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "16f35851-248e-4e47-94d6-929b9aa78505",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 702,
                        "number": "13",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "7648da88-8688-4ccd-955c-0fa320bf1f13",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 703,
                        "number": "14",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c8419848-9055-43e1-af57-213afc1c771b",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 4,
                    "apartments": [
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 705,
                        "number": "16",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "211b4bca-b6ce-4c4f-b98a-7b046503b85b",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 706,
                        "number": "17",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "4c3d061d-5b6e-41fa-89ae-f488afb3d0ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 707,
                        "number": "18",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "3367926a-b4c9-4a9f-9e2b-659542164473",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 708,
                        "number": "19",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "49fd39d5-8e2e-4e5d-a2ff-eb85aa8b756a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 709,
                        "number": "20",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3a80396-6158-4da3-8270-33fcfc81e522",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 710,
                        "number": "21",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d43cfceb-83c7-48d3-aec7-1a5dd71ca6b5",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 5,
                    "apartments": [
                      {
                        "id": 711,
                        "number": "22",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "261a9362-0385-428e-8df0-8be152be50f2",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 712,
                        "number": "23",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "bad3b28a-2d5b-469f-ac59-f18d4df4416f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 713,
                        "number": "24",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "9a913d71-a254-4e04-a1ce-85204cff0a80",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 714,
                        "number": "25",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "84c18ac5-eb54-4a5c-a0b2-4d929f90ba53",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 715,
                        "number": "26",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "54dfca69-1262-4645-bec9-46aa7680ecef",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 716,
                        "number": "27",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "ad4ebafa-8b2a-4f62-b0ad-8a0b0b31c425",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 717,
                        "number": "28",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "fcfffbef-49bb-4cab-adc6-b82fcc59732c",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 6,
                    "apartments": [
                      {
                        "id": 718,
                        "number": "29",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5538a9c9-26e1-44b6-9f5d-c61f7b947453",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 719,
                        "number": "30",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "0e887eb2-ae6d-4678-98c8-7f372a4100a7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 720,
                        "number": "31",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cae7c4e4-1938-4112-a66a-ead8cfe72588",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 721,
                        "number": "32",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "10fd7f59-977a-4131-a64c-8e854db3f566",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 722,
                        "number": "33",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5a055a3a-3c9b-4e98-99f4-7a0e3c0da606",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 723,
                        "number": "34",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f000bbc8-c8c0-4882-a474-833d9da9bfd7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 724,
                        "number": "35",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "aed2cbac-5783-4080-b40a-4d55410552ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 7,
                    "apartments": [
                      {
                        "id": 725,
                        "number": "36",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c5b5dc34-fe74-4ca8-925e-8e0132856fd1",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 726,
                        "number": "37",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1c301ec1-01f1-4a8d-99f6-fb51a77266d1",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 727,
                        "number": "38",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "bea29750-d148-42b4-b474-a82fb397834f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 728,
                        "number": "39",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a27ddb16-8ff7-44d6-a05b-c2663bad39a8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 729,
                        "number": "40",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2d05b66e-a405-40b5-a787-03e3c3d3a43c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 730,
                        "number": "41",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f04c6ab2-2d4a-4f21-b1de-06393ea5b072",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 731,
                        "number": "42",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cf64d4b7-7571-436f-bfc7-a068f2a8941d",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 8,
                    "apartments": [
                      {
                        "id": 1636,
                        "number": "43",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2ec505d5-31f5-4a23-8036-b9de3abb7f72",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1637,
                        "number": "44",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3d5d07f-ebfb-47b2-8ab5-0b473c38a17a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1638,
                        "number": "45",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "f546f32b-4895-45a8-a0d3-be27ec1f9c75",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1639,
                        "number": "46",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1db367d8-b148-466b-b049-401ae0566fc7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1640,
                        "number": "47",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "04ad2ad6-a5e9-4379-99b1-a209849c6ad8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1641,
                        "number": "48",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "4378a5e3-2816-4ae4-9c10-80fb515f11d0",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1642,
                        "number": "49",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "68604063-7872-4e40-b88c-55e10244f842",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 9,
                    "apartments": []
                  },
                  {
                    "name": 10,
                    "apartments": []
                  }
                ]
              },
              {
                "id": 28,
                "name": "Блок C",
                "floors": [
                  {
                    "name": 1,
                    "apartments": []
                  },
                  {
                    "name": 2,
                    "apartments": [
                      {
                        "id": 690,
                        "number": "1",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "7c585c24-23b1-4847-99a0-8b579b77b01d",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 691,
                        "number": "2",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "88820267-13a7-4ac5-a435-5745ef8d5844",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 692,
                        "number": "3",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "40ffc3e9-2e45-487d-8bdc-0fc0b39fbdc9",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 693,
                        "number": "4",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "857c7d2c-c865-48c7-97c0-1a2886ed5b82",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 694,
                        "number": "5",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d62baf17-74fc-4afd-9103-171bd8eb2d46",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 695,
                        "number": "6",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "b247fab4-b759-482f-9e11-88cc989ad32c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 696,
                        "number": "7",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "1af9ba73-ecd1-4a27-8a20-67a3dd3ba62f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 3,
                    "apartments": [
                      {
                        "id": 697,
                        "number": "8",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "251dd920-db02-4e2d-b153-dd120f62159e",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 698,
                        "number": "9",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "8c58857b-d266-476b-a74a-29be62320a6f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 699,
                        "number": "10",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "79f257df-9533-422d-9668-24dda7beaca4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 700,
                        "number": "11",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "96f00c97-073b-4fe3-a1ef-d7c7457b9ea4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 701,
                        "number": "12",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "16f35851-248e-4e47-94d6-929b9aa78505",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 702,
                        "number": "13",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "7648da88-8688-4ccd-955c-0fa320bf1f13",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 703,
                        "number": "14",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c8419848-9055-43e1-af57-213afc1c771b",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 4,
                    "apartments": [
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 705,
                        "number": "16",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "211b4bca-b6ce-4c4f-b98a-7b046503b85b",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 706,
                        "number": "17",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "4c3d061d-5b6e-41fa-89ae-f488afb3d0ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 707,
                        "number": "18",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "3367926a-b4c9-4a9f-9e2b-659542164473",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 708,
                        "number": "19",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "49fd39d5-8e2e-4e5d-a2ff-eb85aa8b756a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 709,
                        "number": "20",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3a80396-6158-4da3-8270-33fcfc81e522",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 710,
                        "number": "21",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d43cfceb-83c7-48d3-aec7-1a5dd71ca6b5",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 5,
                    "apartments": [
                      {
                        "id": 711,
                        "number": "22",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "261a9362-0385-428e-8df0-8be152be50f2",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 712,
                        "number": "23",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "bad3b28a-2d5b-469f-ac59-f18d4df4416f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 713,
                        "number": "24",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "9a913d71-a254-4e04-a1ce-85204cff0a80",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 714,
                        "number": "25",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "84c18ac5-eb54-4a5c-a0b2-4d929f90ba53",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 715,
                        "number": "26",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "54dfca69-1262-4645-bec9-46aa7680ecef",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 716,
                        "number": "27",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "ad4ebafa-8b2a-4f62-b0ad-8a0b0b31c425",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 717,
                        "number": "28",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "fcfffbef-49bb-4cab-adc6-b82fcc59732c",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 6,
                    "apartments": [
                      {
                        "id": 718,
                        "number": "29",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5538a9c9-26e1-44b6-9f5d-c61f7b947453",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 719,
                        "number": "30",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "0e887eb2-ae6d-4678-98c8-7f372a4100a7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 720,
                        "number": "31",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cae7c4e4-1938-4112-a66a-ead8cfe72588",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 721,
                        "number": "32",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "10fd7f59-977a-4131-a64c-8e854db3f566",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 722,
                        "number": "33",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5a055a3a-3c9b-4e98-99f4-7a0e3c0da606",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 723,
                        "number": "34",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f000bbc8-c8c0-4882-a474-833d9da9bfd7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 724,
                        "number": "35",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "aed2cbac-5783-4080-b40a-4d55410552ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 7,
                    "apartments": [
                      {
                        "id": 725,
                        "number": "36",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c5b5dc34-fe74-4ca8-925e-8e0132856fd1",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 726,
                        "number": "37",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1c301ec1-01f1-4a8d-99f6-fb51a77266d1",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 727,
                        "number": "38",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "bea29750-d148-42b4-b474-a82fb397834f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 728,
                        "number": "39",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a27ddb16-8ff7-44d6-a05b-c2663bad39a8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 729,
                        "number": "40",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2d05b66e-a405-40b5-a787-03e3c3d3a43c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 730,
                        "number": "41",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f04c6ab2-2d4a-4f21-b1de-06393ea5b072",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 731,
                        "number": "42",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cf64d4b7-7571-436f-bfc7-a068f2a8941d",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 8,
                    "apartments": [
                      {
                        "id": 1636,
                        "number": "43",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2ec505d5-31f5-4a23-8036-b9de3abb7f72",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1637,
                        "number": "44",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3d5d07f-ebfb-47b2-8ab5-0b473c38a17a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1638,
                        "number": "45",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "f546f32b-4895-45a8-a0d3-be27ec1f9c75",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1639,
                        "number": "46",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1db367d8-b148-466b-b049-401ae0566fc7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1640,
                        "number": "47",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "04ad2ad6-a5e9-4379-99b1-a209849c6ad8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1641,
                        "number": "48",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "4378a5e3-2816-4ae4-9c10-80fb515f11d0",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1642,
                        "number": "49",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "68604063-7872-4e40-b88c-55e10244f842",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 9,
                    "apartments": []
                  },
                  {
                    "name": 10,
                    "apartments": []
                  },
                  {
                    "name": 11,
                    "apartments": [
                      {
                        "id": 725,
                        "number": "36",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c5b5dc34-fe74-4ca8-925e-8e0132856fd1",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 726,
                        "number": "37",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1c301ec1-01f1-4a8d-99f6-fb51a77266d1",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 727,
                        "number": "38",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "bea29750-d148-42b4-b474-a82fb397834f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 728,
                        "number": "39",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a27ddb16-8ff7-44d6-a05b-c2663bad39a8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 729,
                        "number": "40",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2d05b66e-a405-40b5-a787-03e3c3d3a43c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 730,
                        "number": "41",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f04c6ab2-2d4a-4f21-b1de-06393ea5b072",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 731,
                        "number": "42",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cf64d4b7-7571-436f-bfc7-a068f2a8941d",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 12,
                    "apartments": [
                      {
                        "id": 1636,
                        "number": "43",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2ec505d5-31f5-4a23-8036-b9de3abb7f72",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1637,
                        "number": "44",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3d5d07f-ebfb-47b2-8ab5-0b473c38a17a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1638,
                        "number": "45",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "f546f32b-4895-45a8-a0d3-be27ec1f9c75",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1639,
                        "number": "46",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1db367d8-b148-466b-b049-401ae0566fc7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1640,
                        "number": "47",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "04ad2ad6-a5e9-4379-99b1-a209849c6ad8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1641,
                        "number": "48",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "4378a5e3-2816-4ae4-9c10-80fb515f11d0",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1642,
                        "number": "49",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "68604063-7872-4e40-b88c-55e10244f842",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 13,
                    "apartments": []
                  },
                ]
              },
              {
                "id": 29,
                "name": "Блок D",
                "floors": [
                  {
                    "name": 1,
                    "apartments": []
                  },
                  {
                    "name": 2,
                    "apartments": [
                      {
                        "id": 690,
                        "number": "1",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "7c585c24-23b1-4847-99a0-8b579b77b01d",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 691,
                        "number": "2",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "88820267-13a7-4ac5-a435-5745ef8d5844",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 692,
                        "number": "3",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "40ffc3e9-2e45-487d-8bdc-0fc0b39fbdc9",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 693,
                        "number": "4",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "857c7d2c-c865-48c7-97c0-1a2886ed5b82",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 694,
                        "number": "5",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d62baf17-74fc-4afd-9103-171bd8eb2d46",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 695,
                        "number": "6",
                        "floor": 2,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "b247fab4-b759-482f-9e11-88cc989ad32c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 696,
                        "number": "7",
                        "floor": 2,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 138,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "1af9ba73-ecd1-4a27-8a20-67a3dd3ba62f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 3,
                    "apartments": [
                      {
                        "id": 697,
                        "number": "8",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "251dd920-db02-4e2d-b153-dd120f62159e",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 698,
                        "number": "9",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "8c58857b-d266-476b-a74a-29be62320a6f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 699,
                        "number": "10",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "79f257df-9533-422d-9668-24dda7beaca4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 700,
                        "number": "11",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "96f00c97-073b-4fe3-a1ef-d7c7457b9ea4",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 701,
                        "number": "12",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "16f35851-248e-4e47-94d6-929b9aa78505",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 702,
                        "number": "13",
                        "floor": 3,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "7648da88-8688-4ccd-955c-0fa320bf1f13",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 703,
                        "number": "14",
                        "floor": 3,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c8419848-9055-43e1-af57-213afc1c771b",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 4,
                    "apartments": [
                      {
                        "id": 704,
                        "number": "15",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "8115a55f-1e7a-4363-a843-8018f6a6fc43",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 705,
                        "number": "16",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "211b4bca-b6ce-4c4f-b98a-7b046503b85b",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 706,
                        "number": "17",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "4c3d061d-5b6e-41fa-89ae-f488afb3d0ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 707,
                        "number": "18",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "3367926a-b4c9-4a9f-9e2b-659542164473",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 708,
                        "number": "19",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "49fd39d5-8e2e-4e5d-a2ff-eb85aa8b756a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 709,
                        "number": "20",
                        "floor": 4,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3a80396-6158-4da3-8270-33fcfc81e522",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 710,
                        "number": "21",
                        "floor": 4,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "d43cfceb-83c7-48d3-aec7-1a5dd71ca6b5",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 5,
                    "apartments": [
                      {
                        "id": 711,
                        "number": "22",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "261a9362-0385-428e-8df0-8be152be50f2",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 712,
                        "number": "23",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "bad3b28a-2d5b-469f-ac59-f18d4df4416f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 713,
                        "number": "24",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "9a913d71-a254-4e04-a1ce-85204cff0a80",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 714,
                        "number": "25",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "84c18ac5-eb54-4a5c-a0b2-4d929f90ba53",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 715,
                        "number": "26",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "54dfca69-1262-4645-bec9-46aa7680ecef",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 716,
                        "number": "27",
                        "floor": 5,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "ad4ebafa-8b2a-4f62-b0ad-8a0b0b31c425",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 717,
                        "number": "28",
                        "floor": 5,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "fcfffbef-49bb-4cab-adc6-b82fcc59732c",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 6,
                    "apartments": [
                      {
                        "id": 718,
                        "number": "29",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5538a9c9-26e1-44b6-9f5d-c61f7b947453",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 719,
                        "number": "30",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "0e887eb2-ae6d-4678-98c8-7f372a4100a7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 720,
                        "number": "31",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cae7c4e4-1938-4112-a66a-ead8cfe72588",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 721,
                        "number": "32",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "10fd7f59-977a-4131-a64c-8e854db3f566",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 722,
                        "number": "33",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "5a055a3a-3c9b-4e98-99f4-7a0e3c0da606",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 723,
                        "number": "34",
                        "floor": 6,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f000bbc8-c8c0-4882-a474-833d9da9bfd7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 724,
                        "number": "35",
                        "floor": 6,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "aed2cbac-5783-4080-b40a-4d55410552ad",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 7,
                    "apartments": [
                      {
                        "id": 725,
                        "number": "36",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "c5b5dc34-fe74-4ca8-925e-8e0132856fd1",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 726,
                        "number": "37",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1c301ec1-01f1-4a8d-99f6-fb51a77266d1",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 727,
                        "number": "38",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "bea29750-d148-42b4-b474-a82fb397834f",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 728,
                        "number": "39",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a27ddb16-8ff7-44d6-a05b-c2663bad39a8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 729,
                        "number": "40",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2d05b66e-a405-40b5-a787-03e3c3d3a43c",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 730,
                        "number": "41",
                        "floor": 7,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "f04c6ab2-2d4a-4f21-b1de-06393ea5b072",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 731,
                        "number": "42",
                        "floor": 7,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "cf64d4b7-7571-436f-bfc7-a068f2a8941d",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 8,
                    "apartments": [
                      {
                        "id": 1636,
                        "number": "43",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "2ec505d5-31f5-4a23-8036-b9de3abb7f72",
                        "is_sold": false,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1637,
                        "number": "44",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "a3d5d07f-ebfb-47b2-8ab5-0b473c38a17a",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1638,
                        "number": "45",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "f546f32b-4895-45a8-a0d3-be27ec1f9c75",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1639,
                        "number": "46",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 56,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "1db367d8-b148-466b-b049-401ae0566fc7",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1640,
                        "number": "47",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "04ad2ad6-a5e9-4379-99b1-a209849c6ad8",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1641,
                        "number": "48",
                        "floor": 8,
                        "rooms": 1,
                        "entrance": 1,
                        "plan_id": 55,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": false,
                        "other_price": 0,
                        "uuid": "4378a5e3-2816-4ae4-9c10-80fb515f11d0",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      },
                      {
                        "id": 1642,
                        "number": "49",
                        "floor": 8,
                        "rooms": 2,
                        "entrance": 1,
                        "plan_id": 54,
                        "balcony_paid": false,
                        "booking_date": null,
                        "check_other_price": true,
                        "other_price": 885,
                        "uuid": "68604063-7872-4e40-b88c-55e10244f842",
                        "is_sold": true,
                        "created_by": null,
                        "updated_by": null,
                        "deleted_by": null,
                        "active": true
                      }
                    ]
                  },
                  {
                    "name": 9,
                    "apartments": []
                  },
                  {
                    "name": 10,
                    "apartments": []
                  }
                ]
              }
            ]
      },
      object: {
        block1: [
          [1, 2, 3, 432, 543, 5346],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block2: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block3: [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block4: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block5: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
      },
      levelLarge: 0,
>>>>>>> 7371370 (XT-440 . continue process of create apartment express view.)
    }
  },
  methods: {
    status(value) {
      switch (value) {
        case 'available': {
          return {statusText: '', class: 'teal'}
        }
        case 'contract': {
          return {statusText: 'Оформлено', class: 'blue'}
        }
        case 'sold': {
          return {statusText: 'Продано', class: 'gray'}
        }
        case 'bron': {
          return {statusText: 'Забронировано', class: 'yellow'}
        }
        default:
          return {statusText: '', class: 'yellow'}
      }
    },
    price(value) {
      return value.toLocaleString()
    },
    levelLarge(index) {
      return Math.max(...this.apartments[index].blocks.map(item => {
        return item.floors.length
      }))
<<<<<<< HEAD
    }
=======
      // this.levelLarge = Math.max(...Object.values(arr).map(item => {
      //   return item.length
      // }))
    },
    showExpressSidebar(item) {
      this.$emit('show-express-sidebar', item)
    },
>>>>>>> 7371370 (XT-440 . continue process of create apartment express view.)
  }
}
</script>

<style lang="scss" scoped>


.square {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 16.5rem;
  height: 96px;
  background-color: var(--gray-50);

  p {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-500);
    margin-bottom: 0;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &-body {
    display: flex;

    h5 {
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      margin: 0;
    }

    .yellow {
      color: var(--yellow-500);
    }

    .teal {
      color: var(--teal-500);
    }

    .blue {
      color: var(--light-blue-500);
    }

    .gray {
      color: var(--gray-500);
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}


.list-number {
  position: sticky;
  z-index: 5;
  top: 0;
  left: 0;
  display: flex;
  padding-top: 22px;
  background-color: var(--white);
  flex-direction: column-reverse;
}

.counter {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray-400);
  padding: 3px;
  height: 97px;
}

.block {
  display: flex;
  height: 100%;
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: visible;

  &-content {
    border: 1px solid var(--gray-100);
    //min-height: 56px;
    height: auto;
  }


  &-item {
    color: var(--teal-500);
    width: 100%;
    height: auto;
    min-height: 56px;
    border-color: var(--gray-100);
    border-style: solid;
    border-top: 0;
    border-bottom: 0;
    background-color: var(--gray-50);

  }

}


.header {
  position: sticky;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray-400);
  text-transform: capitalize;
  width: 100%;
}

.vertical {
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  max-height: 100vh;
  padding-left: 18px;
  padding-right: 10px;

  h5 {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-400);
    margin: 0;
    transform: rotate(180deg);
    writing-mode: vertical-lr;
    -webkit-writing-mode: vertical-lr;
    background-color: var(--white);

  }
}


</style>