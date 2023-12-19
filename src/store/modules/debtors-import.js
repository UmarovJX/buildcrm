import { DEBTORS_EXCEL_FILES } from '@/constants/names'
import { hasOwnProperty } from '@/util/object'
// import { isObject } from "@/util/inspect";

export default {
  state: {
    fileFields: [
      {
        field: 'contracts.table.contract',
        type: null,
        default: 'contract',
        modelType: null,
      },
      {
        field: 'sum',
        type: null,
        default: 'amount',
        modelType: null,
      },
      {
        field: 'payment_type',
        type: null,
        default: 'payment_type',
        modelType: null,
      },
      {
        field: 'contracts.view.payment_type',
        type: null,
        default: 'type',
        modelType: null,
      },
      {
        field: 'date',
        type: null,
        default: 'date',
        modelType: null,
      },
      {
        field: 'contracts.comment',
        type: null,
        default: 'comment',
        modelType: null,
      },
    ],
    linkingContracts: {},
    debtors: [],
    pagination: {},
    debtorsExcelSheets: {
      rows: [],
      file: null,
    },
    importContracts: {
      found: [],
      aliases: [],
      not_found: [],
      createdAliases: [],
      previewItems: [],
    },
  },

  getters: {
    getImportDebtors(state) {
      return state.debtors
    },

    getImportPaginationDebtors(state) {
      return state.pagination
    },

    getDebtorsSheets(state) {
      return state.debtorsExcelSheets
    },

    getFoundContracts(state) {
      return state.importContracts.found
    },

    getNotFoundContracts(state) {
      return state.importContracts.not_found
    },

    getSelectAliases(state) {
      return state.importContracts.aliases
    },

    getFileFields(state) {
      return state.fileFields
    },

    getPreviewItems(state) {
      return state.importContracts.previewItems
    },

    //   getHavingAliases(state) {
    //     const l = [];
    //
    //     for (let i = 0; i < state.importContracts.not_found.length; i++) {
    //       const c = Object.assign({}, state.importContracts.not_found[i]);
    //       if (c?.alias && isObject(c.alias) && Object.keys(c.alias).length) {
    //         l.push({
    //           uuid: c.alias.uuid,
    //           alias: c.alias.contract,
    //           contract: c.value.contract,
    //         });
    //       }
    //     }
    //
    //     return l;
    //   },
  },

  mutations: {
    addItemToLinkedList(state, lCtc) {
      state.linkingContracts = lCtc
    },
    changeFileFieldType(state, { item, type }) {
      const fieldIdx = state.fileFields.findIndex(
        f => f.default === item.default,
      )

      if (fieldIdx !== -1) {
        state.fileFields[fieldIdx].type = type
      }
    },
    generateImportTable(state) {
      state.importContracts.found.forEach(fc => {
        const hasInLink = hasOwnProperty(
          state.linkingContracts,
          fc.value.alias,
        )
        if (hasInLink) {
          state.linkingContracts[fc.value.alias].forEach(tableItem => {
            state.importContracts.previewItems.push({
              ...fc,
              table: tableItem,
            })
          })
        }
      })
    },
    setCreatedAlias(state, aliasList) {
      state.importContracts.createdAliases = aliasList
    },
    updateNotFoundOption(state, { item, options }) {
      state.importContracts.not_found[item.index].option = options
    },
    updateNotFoundAlias(state, { index, option }) {
      state.importContracts.not_found[index].alias = option

      const ctcIdx = state.importContracts.aliases.findIndex(
        alias => alias.contract === option.contract,
      )

      if (ctcIdx !== -1) {
        state.importContracts.aliases[ctcIdx] = {
          uuid: option.uuid,
          alias: option.contract,
          contract: state.importContracts.not_found[index].value.contract,
        }
      } else {
        state.importContracts.aliases.push({
          uuid: option.uuid,
          alias: option.contract,
          contract: state.importContracts.not_found[index].value.contract,
        })
      }
    },
    checkContracts(state, rsp) {
      for (let i = 0; i < rsp.data.found.length; i++) {
        state.importContracts.found.push({
          index: state.importContracts.found.length,
          key: rsp.data.found[i].contract_number,
          value: {
            alias: rsp.data.found[i].alias,
            uuid: rsp.data.found[i].uuid,
            contract: rsp.data.found[i].contract_number,
          },
        })
      }

      for (let i = 0; i < rsp.data.not_found.length; i++) {
        state.importContracts.not_found.push({
          index: state.importContracts.not_found.length,
          key: rsp.data.not_found[i],
          option: [],
          value: {
            alias: null,
            contract: rsp.data.not_found[i],
            uuid: null,
          },
        })
      }

      // for (let i = 0; i < rsp.data.aliases.length; i++) {
      //   state.importContracts.aliases.push(rsp.data.aliases[i]);
      // }
    },
    updateDebtors(state, debtors) {
      state.debtors = debtors
    },

    updatePagination(state, pagination) {
      state.pagination = pagination
    },

    updateDebtorsExcel(state, debtorsExcelSheets, fromStorage = false) {
      if (!fromStorage) {
        sessionStorage.setItem(
          DEBTORS_EXCEL_FILES,
          JSON.stringify({
            file: {
              name: debtorsExcelSheets.file.name,
            },
            rows: debtorsExcelSheets.rows,
          }),
        )
      }

      state.debtorsExcelSheets = debtorsExcelSheets
    },
  },
}
