<script>
import XFormSelect from "@/components/ui-components/form-select/FormSelect";
import { mapGetters, mapMutations } from "vuex";
import { hasOwnProperty } from "@/util/object";

export default {
  name: "FirstStep",
  components: {
    XFormSelect,
  },
  data() {
    return {
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
      getFileFields: "getFileFields",
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
    ...mapMutations(["changeFileFieldType", "addItemToLinkedList"]),
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
      const contractFieldName = this.getFileFields[0].type;
      let debtorsSheets = this.getDebtorsSheets;
      let c = [[]];
      if (debtorsSheets.rows && debtorsSheets.rows.length) {
        let loopCounter = 0;

        const rows = debtorsSheets.rows.slice(1);
        const linkingContracts = {};

        for (let i = 0; i < rows.length; i++) {
          const pName = hasOwnProperty(rows[i], contractFieldName)
            ? contractFieldName
            : hasOwnProperty(rows[i], "contract")
            ? "contract"
            : false;

          if (pName) {
            if (
              // eslint-disable-next-line no-prototype-builtins
              !linkingContracts.hasOwnProperty(rows[i][contractFieldName])
            ) {
              linkingContracts[rows[i][contractFieldName]] = [];
            }
            linkingContracts[rows[i][contractFieldName]].push(rows[i]);

            if (c[c.length - 1].length <= loopCounter % 1000) {
              c[c.length - 1].push(rows[i][pName]);
            } else {
              c.push([rows[i][pName]]);
            }

            loopCounter++;
          }
        }

        this.addItemToLinkedList(linkingContracts);
      }

      return c;
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
        :items="getFileFields"
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
            :name="`${$t(`${data.item.field}`)}`"
          >
            <x-form-select
              class="w-100"
              v-model="data.item.modelType"
              :options="options"
              @change="changeFileFieldType({ item: data.item, type: $event })"
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
