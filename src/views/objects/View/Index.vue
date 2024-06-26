<script>
import api from "@/services/api";
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/view/Tabs/ObjectBlock";
import ApartmentExpressView from "@/components/Objects/view/elements/ApartmentExpressView";
import ParkingExpressView from "@/components/Objects/view/elements/ParkingExpressView";
import PlanExpressView from "@/components/Objects/view/elements/PlanExpressView";
import ChessSquareCard from "@/components/Objects/view/Tabs/ChessSquareCard";
import ObjectTable from "@/components/Objects/ObjectTable";
import ParkingTable from "@/components/Objects/ParkingTable";
import ObjectPlan from "@/components/Objects/view/Tabs/ObjectPlan";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import ApartmentsPermission from "@/permission/apartments";
import { mapGetters } from "vuex";
import { isPrimitiveValue } from "@/util/reusable";
import { sessionStorageGetItem, sessionStorageSetItem } from "@/util/storage";
import AppHeader from "@/components/Header/AppHeader";

export default {
  name: "Objects",
  components: {
    AppHeader,
    BaseCloseIcon,
    BaseArrowRight,
    BaseArrowLeft,
    ChessSquareCard,
    ObjectTable,
    ParkingTable,
    ObjectSort,
    ObjectBlock,
    ObjectPlan,
    ApartmentExpressView,
    ParkingExpressView,
    PlanExpressView,
    BaseButton,
    BaseModal,
  },
  beforeRouteLeave(to, from, next) {
    const id = from.params.object;
    sessionStorageSetItem(`object_history_of_tab_${id}`, this.currentTab);
    next();
  },
  data() {
    return {
      expressView: {
        toggle: false,
        item: {},
      },
      planView: {
        toggle: false,
        item: {},
      },
      parkingView: {
        toggle: false,
        item: {},
      },
      getLoading: false,
      finishLoading: true,
      planLoading: false,
      apartments: [],
      plans: [],
      currentTab: this.$route.query.currentTab || "ObjectTable",
      priceList: [],
      priceFields: [
        {
          key: "level",
          label: "Дата",
        },
        {
          key: "price_m2",
          label: "price_m2",
        },
      ],
      statusList: [
        {
          label: this.$t("object.status.available"),
          class: "teal",
          value: "available",
        },
        {
          label: this.$t("object.status.booked"),
          class: "yellow",
          value: "booked",
        },
        {
          label: this.$t("object.status.contract"),
          class: "blue",
          value: "contract",
        },
        {
          label: this.$t("object.status.sold"),
          class: "gray",
          value: "sold",
        },
        {
          label: this.$t("object.status.disable"),
          class: "disabled",
          value: "unavailable",
        },
      ],
      apartmentStatusList: [
        {
          label: this.$t("object.status.available"),
          class: "teal",
          value: "available",
        },
        {
          label: this.$t("object.status.booked"),
          class: "yellow",
          value: "booked",
        },
        {
          label: this.$t("object.status.contract"),
          class: "blue",
          value: "contract",
        },
        {
          label: this.$t("object.status.sold"),
          class: "gray",
          value: "sold",
        },
        {
          label: this.$t("object.status.disable"),
          class: "disabled",
          value: "unavailable",
        },
      ],
      parkingStatusList: [],
      statusFilter: [],
      filter: [],
      filterFields: {},
      objectName: "",
      is_parking: false,
      isHidePrice: false,
      componentTabs: [
        {
          id: 4,
          param: "chess",
          name: "ObjectTable",
          buttonIcon: "BaseChessList",
          title: this.$t("object.list"),
          view: "list",
          show: true,
        },
        {
          id: 2,
          param: "chess",
          name: "ObjectBlock",
          buttonIcon: "BaseChessOne",
          title: this.$t("object.chess") + " 1.0",
          view: "architecture",
          show: true,
        },
        {
          id: 3,
          param: "chess",
          name: "ChessSquareCard",
          buttonIcon: "BaseChessTwo",
          title: this.$t("object.chess") + " 2.0",
          view: "chess",
          show: true,
        },
        {
          id: 5,
          param: "chess",
          name: "ObjectPlan",
          buttonIcon: "BaseChessPlan",
          title: this.$t("object.plan"),
          view: "plan",
          show: true,
        },
        {
          id: 6,
          param: "chess",
          name: "ParkingTable",
          buttonIcon: "local_parking",
          title: this.$t("object.parking"),
          view: "list",
          show: true,
        },
      ],
      otherPrices: [],
      defaultPrices: [],
      // allApartments: [],
      statusCounter: {
        unavailable: 0,
        available: 0,
        contract: 0,
        sold: 0,
        booked: 0,
        hold: 0,
        none: 0,
        closed: 0,
      },
      filtered: false,
      gridApartments: [],
      chessApartments: [],
    };
  },
  computed: {
    ...mapGetters(["getPermission"]),
    apartmentsByTabs() {
      const gridList = ["ObjectBlock", "ChessSquareCard"];
      if (gridList.includes(this.currentTab)) {
        return this.chessApartments;
      }
      return this.apartments;
    },
    breadCrumbs() {
      return [
        {
          routeName: "contracts",
          textContent: this.$t("contracts.title"),
        },
      ];
    },
    checkedPermissionTab() {
      let result = this.componentTabs;
      if (!ApartmentsPermission.getApartmentListPermission()) {
        result = result.filter((item) => item.view !== "list");
      }
      if (!ApartmentsPermission.getApartmentGridPermission()) {
        result = result.filter((item) => item.view !== "architecture");
      }
      if (!ApartmentsPermission.getApartmentChessPermission()) {
        result = result.filter((item) => item.view !== "chess");
      }
      if (!ApartmentsPermission.getApartmentPlanPermission()) {
        result = result.filter((item) => item.view !== "plan");
      }
      if (!this.is_parking) {
        result = result.filter((item) => item.name !== "ParkingTable");
      }
      return result;
    },
    activeContent() {
      return this.$t("view");
    },
    query() {
      return Object.assign({}, this.$route.query);
    },
    hasQuery() {
      return Object.keys(this.$route.query).length > 0;
    },
    accessToFilter() {
      const tabsActiveToFilter = ["ObjectBlock", "ChessSquareCard"];
      return tabsActiveToFilter.includes(this.currentTab);
    },
    apartmentsFilterPermission() {
      return ApartmentsPermission.getApartmentsPermission("filter");
    },

    // apartmentsViewPermission() {
    //   return ApartmentsPermission.getApartViewPermission()
    // },
    // apartmentsEditPermission() {
    //   return ApartmentsPermission.getApartEditPermission()
    // },
    // apartmentsListPermission() {
    //   return ApartmentsPermission.getApartListPermission()
    // },
    // apartmentsGridPermission() {
    //   return ApartmentsPermission.getApartGridPermission()
    // },
    // apartmentsChessPermission() {
    //   return ApartmentsPermission.getApartChessPermission()
    // },
    // apartmentsPlanPermission() {
    //   return ApartmentsPermission.getApartPlanPermission()
    // }
  },

  watch: {
    statusFilter(status) {
      if (status.length) {
        const isNotEqual = !this.compareArray(
          this.query.status,
          this.statusFilter
        );
        if (isNotEqual) {
          const arraySatisfaction = Array.isArray(status) && status.length > 0;
          if (arraySatisfaction) {
            this.$router.push({
              query: {
                ...this.query,
                page: 1,
                status: status,
              },
            });
          }
        }
      } else {
        const routeQuery = this.query;
        delete routeQuery.status;
        this.$router.push({
          query: routeQuery,
        });
      }
    },
    "$route.query": {
      async handler(query) {
        this.compareStatus(query);
        if (this.accessToFilter) {
          this.chessApartments = this.filterItems(query, this.chessApartments);
          this.filtered = true;
        }
        if (this.currentTab !== "ParkingTable") {
          this.getAllApartment();
        }
      },
      immediate: true,
    },
    currentTab(value) {
      this.initRelatedToComponent();
      this.fetchFilterFields();
      this.$router.push({
        query: {
          page: 1,
          currentTab: value,
        },
      });

      if (this.currentTab == "ParkingTable") {
        this.fetchParkingStatusList();
      } else {
        this.statusList = this.apartmentStatusList;
      }
    },
  },
  mounted() {
    this.getPriceList();
  },
  created() {
    this.fetchNecessary();

    const historyTab = sessionStorageGetItem(
      "object_history_of_tab_" + this.$route.params.object
    );

    if (
      historyTab &&
      this.checkedPermissionTab.filter((item) => item.name === historyTab)
        .length !== 0
    ) {
      this.currentTab = historyTab;
    } else {
      this.changeTab(this.checkedPermissionTab[0]);
    }

    if (this.currentTab == "ParkingTable") {
      this.fetchParkingStatusList();
    } else {
      this.statusList = this.apartmentStatusList;
    }
    setTimeout(() => {
      this.getAllApartment();
    }, 100);
    this.getBlockName();
  },
  methods: {
    async fetchParkingStatusList() {
      const { object } = this.$route.params;

      const res = await api.objectsV2.fetchObjectParkingsStatusList(object);
      const response = res.data;
      this.statusList = response.map((el) => ({
        label: el.name[this.$i18n.locale],
        class: el.color,
        value: el.status,
      }));
      const statusCounterNew = {};
      response.forEach((el) => {
        statusCounterNew[el.status] = el.count;
      });
      this.statusCounter = statusCounterNew;
    },
    async fetchNecessary() {
      if (ApartmentsPermission.getApartmentsPermission("filter")) {
        await this.fetchFilterFields();
        await this.getGridOptimizationItems();
      }

      if (this.currentTab === "ObjectTable") {
        await this.$refs["object-child"].fetchContractList();
      }
    },
    async getBlockItems(blocks) {
      const { object } = this.$route.params;
      let idx = 0;

      const setObjectMap = (_b) => {
        if (this.gridApartments.length) {
          const idx = this.gridApartments.findIndex(
            (_obj) => _obj.id === _b.building.id
          );
          if (idx !== -1) {
            this.gridApartments[idx].blocks.push(_b.block);
            return;
          }
        }

        this.gridApartments.push({
          id: _b.building.id,
          name: _b.building.name,
          blocks: [_b.block],
        });

        if (this.hasQuery) {
          this.compareStatus(this.query);
          this.chessApartments = this.filterItems(
            this.query,
            this.gridApartments
          );
        } else {
          this.chessApartments = this.gridApartments;
        }
      };

      async function fetchGrid() {
        await api.objectsV2
          .getOptimizeApartments(object, blocks[idx])
          .then(({ data }) => {
            setObjectMap(data);
            idx++;
            if (idx < blocks.length) {
              fetchGrid();
            }
          });
      }

      await fetchGrid();
    },
    async getGridOptimizationItems() {
      const _bs = this.filterFields.blocks.map((b) => b.id);
      await this.getBlockItems(_bs);
    },
    countGet(value) {
      if (!this.accessToFilter) {
        this.statusCounter = value;
      } else {
        this.getAllApartment();
      }
    },
    getAllApartment() {
      this.statusCounter = {
        unavailable: 0,
        available: 0,
        contract: 0,
        sold: 0,
        booked: 0,
        hold: 0,
        none: 0,
      };
      if (this.filtered) {
        this.chessApartments.map((item) => {
          item.blocks.map((block) => {
            if (block.blockActive) {
              block.floors.map((floor) => {
                if (floor.floorActive) {
                  floor.apartments.map((apartment) => {
                    if (apartment.apartmentActive) {
                      if (apartment["is_sold"]) {
                        switch (apartment.order.status) {
                          case "available": {
                            return (this.statusCounter.available += 1);
                          }
                          case "hold": {
                            return (this.statusCounter.hold += 1);
                          }
                          case "sold":
                          case "closed": {
                            return (this.statusCounter.sold += 1);
                          }
                          case "booked": {
                            return (this.statusCounter.booked += 1);
                          }
                          case "contract": {
                            return (this.statusCounter.contract += 1);
                          }
                          default:
                            return (this.statusCounter.none += 1);
                        }
                      } else {
                        this.statusCounter.unavailable += 1;
                      }
                    }
                  });
                }
              });
            }
          });
        });
      } else {
        this.chessApartments.map((item) => {
          item.blocks.map((block) => {
            block.floors.map((floor) => {
              floor.apartments.map((apartment) => {
                if (apartment["is_sold"]) {
                  switch (apartment.order.status) {
                    case "available": {
                      return (this.statusCounter.available += 1);
                    }
                    case "hold": {
                      return (this.statusCounter.hold += 1);
                    }
                    case "sold":
                    case "closed": {
                      return (this.statusCounter.sold += 1);
                    }
                    case "booked": {
                      return (this.statusCounter.booked += 1);
                    }
                    case "contract": {
                      return (this.statusCounter.contract += 1);
                    }
                    default:
                      return (this.statusCounter.none += 1);
                  }
                } else {
                  this.statusCounter.unavailable += 1;
                }
              });
            });
          });
        });
      }
    },
    cellAttributes(slot) {
      return ["#cell(" + slot.id + ')="data"'];
    },
    closeMapModal() {
      this.$refs["price-table"].closeModal();
    },
    getPriceList() {
      const { object } = this.$route.params;
      api.objectsV2.fetchObjectPrice(object).then((response) => {
        this.priceList = response.data;
        response.data.map((item) => {
          // console.log(item.prepay);
          // this.otherPrices = [...this.otherPrices, ...item.prices.filter(price => price.type === 'other_price')]
          // this.defaultPrices = [...this.defaultPrices, ...item.prices.filter(price => price.type === 'default')]
          this.priceFields = [
            ...this.priceFields,
            {
              key: `${item.id}`,
              label: item.id,
            },
          ];
        });
      });
    },
    openPriceList() {
      this.$refs["price-table"].openModal();
    },
    async initRelatedToComponent() {
      if (this.currentTab === "ObjectPlan" && !this.plans.length) {
        await this.getObjectPlans();
        return;
      }

      const graphComponentList = ["ObjectBlock", "ChessSquareCard"];
      const isGraphComponent = graphComponentList.includes(this.currentTab);
      if (isGraphComponent && !this.chessApartments.length) {
        await this.fetchNecessary();
      } else if (this.hasQuery) {
        this.compareStatus(this.query);
        this.chessApartments = this.filterItems(
          this.query,
          this.gridApartments
        );
      }
    },
    async fetchFilterFields() {
      //if (this.filterFields.length) return;

      const { object } = this.$route.params;
      if (this.currentTab !== "ParkingTable") {
        await api.objectsV2
          .fetchObjectFields(object)
          .then((response) => {
            this.filterFields = response.data;
          })
          .catch((err) => {
            this.toastedWithErrorCode(err);
          })
          .finally(() => {
            this.finishLoading = true;
          });
      } else {
        await api.objectsV2
          .fetchParkingFilterFields(object)
          .then((response) => {
            this.filterFields = response.data;
          })
          .catch((err) => {
            this.toastedWithErrorCode(err);
          })
          .finally(() => {
            this.finishLoading = true;
          });
      }
    },
    changeTab({ name }) {
      this.currentTab = name;
      const { object } = this.$route.params;
      sessionStorageSetItem(`object_history_of_tab_${object}`, this.currentTab);
    },
    clearStatus() {
      this.statusFilter = [];
    },
    compareArray(arrayOne, arrayTwo) {
      if (Array.isArray(arrayOne) && Array.isArray(arrayTwo)) {
        const arr1 = [...arrayOne].sort();
        const arr2 = [...arrayTwo].sort();
        const equalLength = arr1.length === arr2.length;
        const isEqualByValue = arr1.every(
          (value, index) => value === arr2[index]
        );
        return equalLength && isEqualByValue;
      }
      return false;
    },
    compareStatus(routeQuery) {
      let isNotEqual = false;
      if (Object.keys(routeQuery).length) {
        if (routeQuery.status) {
          isNotEqual = !this.compareArray(routeQuery.status, this.statusFilter);
        }
      }

      if (isNotEqual) {
        const isPrimitive = isPrimitiveValue(routeQuery.status);
        if (isPrimitive) {
          this.statusFilter = [routeQuery.status];
        } else {
          this.statusFilter = routeQuery.status;
        }
      }

      if (routeQuery.status === undefined) {
        this.statusFilter = [];
      }
    },
    filterItems(filter, apartments = []) {
      let localApartments = [];

      if (apartments.length) {
        localApartments = apartments;
      } else {
        localApartments = this.apartments;
      }

      return localApartments.map((mainConstructor) => {
        let filterBlocks;
        const hasBlocks = filter.hasOwnProperty("blocks");
        if (hasBlocks) {
          filterBlocks = mainConstructor.blocks.map((block) => {
            if (typeof filter.blocks === "string") {
              filter.blocks = [filter.blocks];
            }

            const isActiveBlock = filter.blocks
              .map((blockId) => {
                if (typeof blockId === "string") {
                  return parseInt(blockId);
                }
                return blockId;
              })
              .includes(block.id);

            if (isActiveBlock) {
              return {
                ...block,
                blockActive: true,
              };
            }

            return {
              ...block,
              blockActive: false,
            };
          });
        } else {
          filterBlocks = mainConstructor.blocks.map((block) => {
            return {
              ...block,
              blockActive: true,
            };
          });
        }

        filterBlocks = filterBlocks.map((filterBlock) => {
          let filterFloors = filterBlock.floors;
          const hasFloorsQuery = filter.hasOwnProperty("floors");
          if (hasFloorsQuery) {
            if (typeof filter.floors === "string") {
              filter.floors = [filter.floors];
            }

            filterFloors = filterFloors.map((floor) => {
              const isActiveFloor = filter.floors
                .map((floor) => {
                  if (typeof floor === "string") {
                    return parseInt(floor);
                  }
                  return floor;
                })
                .includes(floor.name);

              if (isActiveFloor) {
                return {
                  ...floor,
                  floorActive: true,
                };
              }

              return {
                ...floor,
                floorActive: false,
              };
            });
          } else {
            filterFloors = filterFloors.map((floor) => {
              return {
                ...floor,
                floorActive: true,
              };
            });
          }

          const notRelatedToApartment =
            Object.keys(filter).length === 2 && hasFloorsQuery && hasBlocks;
          if (!notRelatedToApartment) {
            filterFloors = filterFloors.map((filterFloor) => {
              let floorApartments = filterFloor.apartments;
              floorApartments = floorApartments.map((floorApartment) => {
                let apartment = floorApartment;
                const { price_m2, number, price, plan, rooms, order, is_sold } =
                  apartment;
                const filterResult = [];
                const filterQueryLength = Object.keys(filter).length > 0;
                if (filterQueryLength) {
                  for (let [key, value] of Object.entries(filter)) {
                    const arrayFareList = ["area", "rooms", "number"];
                    const isThereFareList = arrayFareList.includes(key);
                    if (isThereFareList && isPrimitiveValue(value)) {
                      value = [value];
                    }

                    if (key === "price_m2") {
                      const isSatisfy = value === price_m2;
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "price_from") {
                      const isSatisfy = value <= price;
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "price_to") {
                      const isSatisfy = value >= price;
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "area_from") {
                      const isSatisfy = value <= plan.area;
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "area_to") {
                      const isSatisfy = value >= plan.area;
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "area") {
                      const isSatisfy = value.includes(plan.area);
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "rooms") {
                      const isSatisfy = value
                        .map((vs) => {
                          if (typeof vs === "string") {
                            return parseInt(vs);
                          }
                          return vs;
                        })
                        .includes(rooms);
                      filterResult.push(isSatisfy);
                      continue;
                    }

                    if (key === "status") {
                      const isUnavailable = value.includes("unavailable");
                      if (isUnavailable) {
                        if (!is_sold) {
                          filterResult.push(true);
                          continue;
                        }
                      }

                      if (is_sold) {
                        const isStatusPrimitive = isPrimitiveValue(value);
                        let values = value;

                        if (isStatusPrimitive) {
                          values = [value];
                        }

                        const isSatisfy = values.includes(order.status);
                        filterResult.push(isSatisfy);
                      } else {
                        filterResult.push(false);
                      }
                      continue;
                    }

                    if (key === "number") {
                      const isSatisfy = value.includes(number);
                      filterResult.push(isSatisfy);
                    }
                  }

                  let satisfyFilter = true;

                  if (filterResult.length) {
                    satisfyFilter = filterResult.reduce(
                      (prev, next) => prev && next
                    );
                  }

                  if (satisfyFilter) {
                    return {
                      ...apartment,
                      apartmentActive: true,
                    };
                  } else {
                    return {
                      ...apartment,
                      apartmentActive: false,
                    };
                  }
                } else {
                  return {
                    ...apartment,
                    apartmentActive: true,
                  };
                }
              });

              return {
                name: filterFloor.name,
                apartments: floorApartments,
                floorActive: filterFloor.floorActive,
              };
            });
          }

          const { id, name, blockActive } = filterBlock;
          return {
            id,
            name,
            blockActive,
            floors: filterFloors,
          };
        });

        return {
          ...mainConstructor,
          blocks: filterBlocks,
        };
      });
    },
    async getBlockName() {
      const id = this.$route.params.object;
      await api.objectsV2
        .getObjectName(id)
        .then((res) => {
          this.objectName = res.data.name;
          this.is_parking = res.data.is_parking;
          this.isHidePrice = res.data.is_hide_m2_price;
        })
        .catch((err) => {
          return err;
        });
    },
    async getApartments() {
      const id = this.$route.params.object;
      this.getLoading = true;
      await api.objectsV2
        .getApartments(id)
        .then(async (res) => {
          this.saveToLocalStorage(res.data);
          if (this.hasQuery) {
            this.compareStatus(this.query);
            this.filterItems(this.query, res.data.data);
          } else {
            this.apartments = res.data.data;
          }
        })
        .catch((err) => {
          this.toastedWithErrorCode(err);
        })
        .finally(() => {
          this.getAllApartment();
          this.getLoading = false;
        });
    },
    saveToLocalStorage(data) {
      const expiryDate = new Date().getTime() + 20 * 60 * 1000;
      localStorage.setItem(
        "apartments_expiry_date",
        JSON.stringify(expiryDate)
      );
      localStorage.setItem("object_apartment_list", JSON.stringify(data.data));
      localStorage.setItem(
        "object_information",
        JSON.stringify({
          name: data.object,
          id: data.id,
        })
      );
    },
    async getApartmentsFromLocaleMachine() {
      // if (!this.apartments.length) {
      //     const objectApartmentList = localStorage.getItem('object_apartment_list')
      //     const objectInformation = localStorage.getItem('object_information')
      //     if (objectApartmentList && objectInformation) {
      //         const storeId = JSON.parse(objectInformation).id.toString()
      //         if (this.$route.params.object.toString() === storeId) {
      //             const apartmentsExpiryDate = localStorage.getItem('apartments_expiry_date')
      //             const currentTime = (new Date()).getTime()
      //             const intervalTime = 20 * 60 * 1000
      //             const distinction = currentTime - parseFloat(apartmentsExpiryDate)
      //             if (distinction < intervalTime) {
      //                 const apartments = JSON.parse(objectApartmentList)
      //                 if (this.hasQuery) {
      //                     this.compareStatus(this.query)
      //                     await this.filterItems(this.query, apartments)
      //                 } else {
      //                     this.apartments = apartments
      //                 }
      //                 return
      //             }
      //         }
      //     }

      await this.getApartments();
    },
    async getObjectPlans() {
      this.planLoading = true;
      const id = this.$route.params.object;
      await api.objectsV2
        .getObjectPlans(id)
        .then((response) => {
          this.plans = response.data;
        })
        .catch((err) => {
          this.toastedWithErrorCode(err);
        })
        .finally(() => {
          this.planLoading = false;
        });
    },
    apartmentExpressReview(item) {
      if (item) {
        this.expressView.item = item;
        this.expressView.toggle = true;
      }
    },
    planExpressReview(item) {
      if (item) {
        this.planView.item = item;
        this.planView.toggle = true;
      }
    },
    parkingExpressReview(item) {
      if (item) {
        this.parkingView.item = item;
        this.parkingView.toggle = true;
      }
    },

    hideApartmentSidebarView() {
      this.expressView.toggle = false;
    },
    hideParkingSidebarView() {
      this.parkingView.toggle = false;
    },
    hidePlanSidebarView() {
      this.planView.toggle = false;
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-breadcrumb>
        <div v-if="finishLoading && objectName" class="navigation__content">
          <div class="d-flex align-items-center">
            <router-link class="go__back" :to="{ name: 'objects' }">
              <base-arrow-left :width="32" :height="32"></base-arrow-left>
            </router-link>
            <div class="breadcrumb__content">
              <div class="d-flex align-items-center">
                <span class="mr-2">{{ $t("objects.title") }}</span>
                <base-arrow-right :width="16" :height="16" />
                <span class="ml-2">{{ objectName }}</span>
              </div>
              <div class="head">
                <span class="contract__number">{{ objectName }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </app-header>

    <!--  Header Navigation  -->
    <!--        <div v-if="finishFetching && objectName.length" class="navigation__content justify-content-between">-->
    <!--            <div class="d-flex align-items-center">-->
    <!--                <router-link class="go__back" :to="{name: 'objects'}">-->
    <!--                    <base-arrow-left :width="32" :height="32"></base-arrow-left>-->
    <!--                </router-link>-->
    <!--                <span class="breadcrumb__content">-->
    <!--                  <span class="d-flex align-items-center">-->
    <!--                    <span class="mr-2">{{ $t('objects.title') }}</span>-->
    <!--                    <base-arrow-right :width="16" :height="16"/>-->
    <!--                    <span class="ml-2">{{ objectName }}</span>-->
    <!--                  </span>-->
    <!--                  <span class="head">-->
    <!--                    <span class="contract__number">{{ objectName }}</span>-->
    <!--                  </span>-->
    <!--                </span>-->
    <!--            </div>-->
    <!--        </div>-->

    <object-sort
      :filter-fields="filterFields"
      :app-loading="finishLoading"
      :tabs="checkedPermissionTab"
      @clear-status="clearStatus"
      @current-tab="changeTab"
    />

    <div
      class="status-row"
      v-if="apartmentsFilterPermission && currentTab !== 'ObjectPlan'"
    >
      <b-form-checkbox-group
        id="checkbox-sort"
        class="status-sort"
        v-model="statusFilter"
        name="sort"
      >
        <b-form-checkbox
          v-for="status in statusList"
          :key="status.label"
          :value="status.value"
          :class="status.class"
        >
          {{ status.label }}
          <b-badge>
            {{ statusCounter[`${status.value}`] }}
          </b-badge>
        </b-form-checkbox>
      </b-form-checkbox-group>
    </div>

    <base-modal ref="price-table">
      <template #header>
        <!--   GO BACK     -->
        <span class="d-flex align-items-center justify-content-between">
          <!--    TITLE      -->
          <span class="title">{{ $t("objects.create.prices") }}</span>
          <!--          CLOSE-->
          <span class="go__back" @click="closeMapModal">
            <BaseCloseIcon :width="40" :height="40" />
          </span>
        </span>
      </template>
      <template #main>
        <b-table
          :items="priceList"
          :fields="priceFields"
          class="table__list"
          :empty-text="$t('no_data')"
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border"
          head-variant="light"
          show-empty
          bordered
        >
          <!--    CELL OF COMMENT      -->
          <template #cell(level)="data">
            <span>{{ data.item.type }}</span>
          </template>
          <template #cell(price_m2)="data">
            <span>{{ data.item.amount }}</span>
          </template>

          <template v-for="price of priceList" #cell()="data">
            <slot :name="price.id" v-bind="data">{{ data.item.prices }}</slot>
          </template>
        </b-table>
      </template>
    </base-modal>

    <component
      ref="object-child"
      :loading="getLoading"
      :plans="plans"
      :plan-load="planLoading"
      :is="currentTab"
      :apartments="apartmentsByTabs"
      :is-hide-price="isHidePrice"
      @counter="countGet"
      @show-express-sidebar="apartmentExpressReview"
      @show-parking-details="parkingExpressReview"
      @show-plan-sidebar="planExpressReview"
    />

    <!-- APARTMENT QUICK VIEW   -->
    <apartment-express-view
      :visible="expressView.toggle"
      :apartment="expressView.item"
      :apartmentUuid="expressView.item.uuid"
      @update-content="fetchNecessary"
      @hide-apartment-sidebar-view="hideApartmentSidebarView"
    />

    <!-- Parking QUICK VIEW   -->
    <parking-express-view
      :visible="parkingView.toggle"
      :object-name="objectName"
      :apartment="parkingView.item"
      :apartmentUuid="parkingView.item.id"
      @hide-parking-details="hideParkingSidebarView"
    />

    <plan-express-view
      :visible="planView.toggle"
      :plan-id="planView.item.id"
      :is-hide-price="isHidePrice"
      @hide-plan-sidebar-view="hidePlanSidebarView"
    />
  </div>
</template>

<style lang="scss" scoped>
.navigation__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //margin-bottom: 2rem;

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
    display: flex;
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

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.price-button {
  display: flex;
  padding-right: 0;
  padding-top: 3px;
  margin: 0;
  background-color: transparent !important;
}

.object-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

::v-deep .status-sort {
  display: flex;
  column-gap: 30px;
  margin-bottom: 21px;
  font-family: Inter, sans-serif;

  .custom-control-input:checked ~ .custom-control-label::after {
    top: 0.3rem;
  }

  .badge {
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    border-radius: 2rem;
    padding: 0.25px 0.5rem;
    margin-left: 0.5rem;
  }

  .teal {
    color: var(--teal-600);

    .badge {
      color: var(--teal-600);
      background-color: var(--teal-100);
    }

    .custom-control-label {
      &::before {
        border: 2px solid var(--teal-600);
      }
    }

    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: var(--teal-600);
    }
  }

  .yellow {
    color: var(--yellow-600);

    .badge {
      color: var(--yellow-600);
      background-color: var(--yellow-100);
    }

    .custom-control-label {
      &::before {
        border: 2px solid var(--yellow-600);
      }
    }

    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: var(--yellow-600);
    }
  }

  .blue {
    color: var(--light-blue-600);

    .badge {
      color: var(--light-blue-600);
      background-color: var(--light-blue-100);
    }

    .custom-control-label {
      &::before {
        border: 2px solid var(--light-blue-600);
      }
    }

    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: var(--light-blue-600);
    }
  }

  .gray {
    color: var(--red-600);

    .badge {
      color: var(--red-600);
      background-color: var(--red-100);
    }

    .custom-control-label {
      &::before {
        border: 2px solid var(--red-600);
      }
    }

    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: var(--red-600);
    }
  }

  .disabled {
    color: var(--gray-400);

    .badge {
      color: var(--gray-400);
      background-color: var(--gray-100);
    }

    .custom-control-label {
      &::before {
        border: 2px solid var(--gray-400);
      }
    }

    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: var(--gray-400);
    }
  }
}
</style>
