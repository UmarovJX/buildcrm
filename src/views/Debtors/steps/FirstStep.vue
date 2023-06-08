<script>
import XFormSelect from "@/components/ui-components/form-select/FormSelect";
import { mapGetters } from "vuex";
import { PAGINATION_COUNT } from "@/constants/names";

export default {
  name: "FirstStep",
  components: {
    XFormSelect,
  },
  data() {
    return {
      fileFields: [
        {
          field: "contracts.table.contract",
          type: null,
          default: "contract",
        },
        {
          field: "sum",
          type: null,
          default: "amount",
        },
        {
          field: "date",
          type: null,
          default: "date",
        },
        {
          field: "contracts.comment",
          type: null,
          default: "comment",
        },
        {
          field: "payment_type",
          type: null,
          default: "payment_type",
        },
        {
          field: "contracts.view.payment_type",
          type: null,
          default: "type",
        },
      ],
      typeFields: [
        {
          key: "field",
          label: "debtors.property",
          thClass: "theadKey",
          tdClass: "tbodyKey",
        },
        {
          key: "type",
          label: "debtors.file",
          thClass: "theadValue",
          tdClass: "tbodyValue",
        },
      ],
      options: [],
    };
  },
  computed: {
    ...mapGetters({
      getDebtorsSheets: "getDebtorsSheets",
      getCurrentPagination: "getCurrentPagination",
    }),
  },
  watch: {
    getCurrentPagination() {
      this.getContractNumbers();
    },
  },
  created() {
    this.setupOptions();
  },
  methods: {
    setupOptions() {
      const { rows } = this.getDebtorsSheets;
      this.options = rows[0].map((item) => {
        return {
          value: item,
          text: item,
        };
      });
    },
    getContractNumbers() {
      const contractFieldName = this.fileFields[0].type;
      let debtorsSheets = this.getDebtorsSheets;
      let contractsList = [];

      if (debtorsSheets.rows && debtorsSheets.rows.length) {
        debtorsSheets = debtorsSheets.rows.slice(1);
        console.log(debtorsSheets);
        console.log(
          "DebtorsSheets: ",
          debtorsSheets.slice(
            PAGINATION_COUNT * this.getCurrentPagination,
            PAGINATION_COUNT * this.getCurrentPagination + PAGINATION_COUNT
          )
        );
        debtorsSheets
          .slice(
            PAGINATION_COUNT * this.getCurrentPagination,
            PAGINATION_COUNT * this.getCurrentPagination + PAGINATION_COUNT
          )
          .map((item, index) => {
            Object.entries(item).forEach(([key, value]) => {
              if (key === contractFieldName || key === "contract") {
                contractsList = [...contractsList, value];
              }
            });

            this.fileFields.forEach((field) => {
              if (debtorsSheets[index][`${field.default}`]) {
                debtorsSheets[index][`${field.default}`] =
                  debtorsSheets[index][`${field.type}`];
                // delete debtorsSheets[index][`${field.type}`]
              }
            });
          });
      }
      return contractsList;
    },
    async validateFirstStep() {
      return await this.$refs["type-validation"].validate();
    },
    iTranslate(text) {
      return this.$t(`${text}`);
    },
  },
};
</script>

<template>
  <div>
    <!--  MAIN NAVIGATION  -->
    <ValidationObserver ref="type-validation" class="main__row">
      <b-table
        :fields="typeFields"
        :items="fileFields"
        class="fixed-table"
        :empty-text="$t('no_data')"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border"
        borderless
        fixed
      >
        <template #head()="data">
          <span>{{ $t(`${data.label}`) }}</span>
        </template>

        <template #cell(field)="data">
          <span>
            {{ $t(`${data.item.field}`) }}
          </span>
        </template>

        <template #cell(type)="data">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            class="cell"
            :name="$t(`${data.item.field}`)"
          >
            <x-form-select
              class="w-100"
              v-model="data.item.type"
              :options="options"
              :placeholder="iTranslate(data.item.field)"
            />
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </template>
      </b-table>
    </ValidationObserver>
  </div>
</template>

<style scoped>
.error__provider {
  color: red;
  font-size: 12px;
}
</style>

<!--<ul id="vs1__listbox" role="listbox" tabindex="-1" class="vs__dropdown-menu"> <li id="vs1__option-0" role="option" class="vs__dropdown-option">-->
<!--    1MAY22LI-->
<!--</li><li id="vs1__option-1" role="option" class="vs__dropdown-option">-->
<!--    1JOH22RD-->
<!--</li><li id="vs1__option-2" role="option" class="vs__dropdown-option">-->
<!--    2JOH226L-->
<!--</li><li id="vs1__option-3" role="option" class="vs__dropdown-option">-->
<!--    1BOR22JH-->
<!--</li><li id="vs1__option-4" role="option" class="vs__dropdown-option">-->
<!--    2BOR22FR-->
<!--</li><li id="vs1__option-5" role="option" class="vs__dropdown-option">-->
<!--    3BOR22ZC-->
<!--</li><li id="vs1__option-6" role="option" class="vs__dropdown-option">-->
<!--    2MAY22VT-->
<!--</li><li id="vs1__option-7" role="option" class="vs__dropdown-option">-->
<!--    122KB-->
<!--</li><li id="vs1__option-8" role="option" class="vs__dropdown-option">-->
<!--    4BOR22JR-->
<!--</li><li id="vs1__option-9" role="option" class="vs__dropdown-option">-->
<!--    5BOR229I-->
<!--</li><li id="vs1__option-10" role="option" class="vs__dropdown-option">-->
<!--    6BOR22II-->
<!--</li><li id="vs1__option-11" role="option" class="vs__dropdown-option">-->
<!--    7BOR22NN-->
<!--</li><li id="vs1__option-12" role="option" class="vs__dropdown-option">-->
<!--    8BOR22K8-->
<!--</li><li id="vs1__option-13" role="option" class="vs__dropdown-option">-->
<!--    10BOR22HP-->
<!--</li><li id="vs1__option-14" role="option" class="vs__dropdown-option">-->
<!--    11BOR22P7-->
<!--</li><li id="vs1__option-15" role="option" class="vs__dropdown-option">-->
<!--    12BOR22FF-->
<!--</li><li id="vs1__option-16" role="option" class="vs__dropdown-option">-->
<!--    13BOR226B-->
<!--</li><li id="vs1__option-17" role="option" class="vs__dropdown-option">-->
<!--    15BOR22RL-->
<!--</li><li id="vs1__option-18" role="option" class="vs__dropdown-option">-->
<!--    17BOR22JA-->
<!--</li><li id="vs1__option-19" role="option" class="vs__dropdown-option">-->
<!--    18BOR22NJ-->
<!--</li><li id="vs1__option-20" role="option" class="vs__dropdown-option">-->
<!--    19BOR22UW-->
<!--</li><li id="vs1__option-21" role="option" class="vs__dropdown-option">-->
<!--    23BOR22UE-->
<!--</li><li id="vs1__option-22" role="option" class="vs__dropdown-option">-->
<!--    24BOR226D-->
<!--</li><li id="vs1__option-23" role="option" class="vs__dropdown-option">-->
<!--    25BOR22GW-->
<!--</li><li id="vs1__option-24" role="option" class="vs__dropdown-option">-->
<!--    5JOH22B5-->
<!--</li><li id="vs1__option-25" role="option" class="vs__dropdown-option">-->
<!--    6JOH227Q-->
<!--</li><li id="vs1__option-26" role="option" class="vs__dropdown-option">-->
<!--    30BOR22E5-->
<!--</li><li id="vs1__option-27" role="option" class="vs__dropdown-option">-->
<!--    122D4-->
<!--</li><li id="vs1__option-28" role="option" class="vs__dropdown-option">-->
<!--    122AP-->
<!--</li><li id="vs1__option-29" role="option" class="vs__dropdown-option">-->
<!--    1228O-->
<!--</li><li id="vs1__option-30" role="option" class="vs__dropdown-option">-->
<!--    122TR-->
<!--</li><li id="vs1__option-31" role="option" class="vs__dropdown-option">-->
<!--    kms_017-->
<!--</li><li id="vs1__option-32" role="option" class="vs__dropdown-option">-->
<!--    usoft_01-->
<!--</li><li id="vs1__option-33" role="option" class="vs__dropdown-option">-->
<!--    937BOR22UQ-->
<!--</li><li id="vs1__option-34" role="option" class="vs__dropdown-option">-->
<!--    938BOR222R-->
<!--</li><li id="vs1__option-35" role="option" class="vs__dropdown-option">-->
<!--    kms_017-->
<!--</li><li id="vs1__option-36" role="option" class="vs__dropdown-option vs__dropdown-option&#45;&#45;highlight" aria-selected="true">-->
<!--    34JOH22MH-->
<!--</li><li id="vs1__option-37" role="option" class="vs__dropdown-option">-->
<!--    52JOH22LO-->
<!--</li><li id="vs1__option-38" role="option" class="vs__dropdown-option">-->
<!--    122JY-->
<!--</li><li id="vs1__option-39" role="option" class="vs__dropdown-option">-->
<!--    89JOH22ZN-->
<!--</li><li id="vs1__option-40" role="option" class="vs__dropdown-option">-->
<!--    123NW-->
<!--</li><li id="vs1__option-41" role="option" class="vs__dropdown-option">-->
<!--    123XL-->
<!--</li><li id="vs1__option-42" role="option" class="vs__dropdown-option">-->
<!--    1BOR23PU-->
<!--</li><li id="vs1__option-43" role="option" class="vs__dropdown-option">-->
<!--    1BOR23V6-->
<!--</li><li id="vs1__option-44" role="option" class="vs__dropdown-option">-->
<!--    1ORZ233L-->
<!--</li><li id="vs1__option-45" role="option" class="vs__dropdown-option">-->
<!--    2ORZ23KF-->
<!--</li><li id="vs1__option-46" role="option" class="vs__dropdown-option vs__dropdown-option&#45;&#45;selected">-->
<!--    123C7-->
<!--</li><li id="vs1__option-47" role="option" class="vs__dropdown-option">-->
<!--    2ORZ23VI-->
<!--</li><li id="vs1__option-48" role="option" class="vs__dropdown-option">-->
<!--    1ORZ23DF-->
<!--</li><li id="vs1__option-49" role="option" class="vs__dropdown-option">-->
<!--    1232Y-->
<!--</li> &lt;!&ndash;&ndash;&gt; </ul>-->
