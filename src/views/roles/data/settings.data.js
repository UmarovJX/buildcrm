const crud = {
  view: false,
  create: false,
  edit: false,
  delete: false,
};

const values = {
  view: false,
  holders: Object.assign({}, crud),
  statuses: Object.assign({}, crud),
  client_types: Object.assign({}, crud),
  client_countries: Object.assign({}, crud),
  contracts: {
    main_manager: false,
  },
  apartments: {
    holder: {
      view: false,
      edit: false,
    },
    status: {
      view: false,
      edit: false,
    },
  },
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.settings",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.view",
        refer: "view",
        parent: "settings",
      },

      /**
       ? STARTING OF
       ! CONTRACTS
       ? ROW
       * */
      {
        label: "roles_permission.settings.contracts.main_manager",
        refer: "contracts.main_manager",
        parent: "settings",
      },

      /**
       ? STARTING OF
       ! HOLDERS
       ? ROW
       * */
      {
        label: "roles_permission.settings.holders.view",
        refer: "holders.view",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.holders.create",
        refer: "holders.create",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.holders.update",
        refer: "holders.update",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.holders.delete",
        refer: "holders.delete",
        parent: "settings",
      },

      /**
       ? STARTING OF
       ! STATUSES
       ? ROW
       * */
      {
        label: "roles_permission.settings.statuses.view",
        refer: "statuses.view",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.statuses.create",
        refer: "statuses.create",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.statuses.update",
        refer: "statuses.update",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.statuses.delete",
        refer: "statuses.delete",
        parent: "settings",
      },

      /**
       ? STARTING OF
       ! CLIENT TYPES
       ? ROW
       * */
      {
        label: "roles_permission.settings.client_types.view",
        refer: "client_types.view",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.client_types.create",
        refer: "client_types.create",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.client_types.update",
        refer: "client_types.update",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.client_types.delete",
        refer: "client_types.delete",
        parent: "settings",
      },

      /**
       ? STARTING OF
       ! CLIENT COUNTRIES
       ? ROW
       * */
      {
        label: "roles_permission.settings.client_countries.view",
        refer: "client_countries.view",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.client_countries.create",
        refer: "client_countries.create",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.client_countries.update",
        refer: "client_countries.update",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.client_countries.delete",
        refer: "client_countries.delete",
        parent: "settings",
      },

      /**
       ? STARTING OF
       ! APARTMENTS
       ? ROW
       * */
      {
        label: "roles_permission.settings.apartments.holder.view",
        refer: "apartments.holder.view",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.apartments.holder.edit",
        refer: "apartments.holder.edit",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.apartments.status.view",
        refer: "apartments.status.view",
        parent: "settings",
      },
      {
        label: "roles_permission.settings.apartments.status.edit",
        refer: "apartments.status.edit",
        parent: "settings",
      },
    ],
  };
}

export default function (name, uuid) {
  return {
    values,
    permission: pms(name, uuid),
  };
}
