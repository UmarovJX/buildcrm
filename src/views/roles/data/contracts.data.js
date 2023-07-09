const values = {
  view: false,
  filter: false,
  download: false,
  cancel: false,
  client_type: false,
  root_branch: false,
  root: false,
  uniformity: false,
  edit: true,
  payments: {
    create: false,
    initial_type: {
      create: false,
      edit: false,
      delete: false,
    },
    monthly_type: {
      create: false,
      edit: false,
      delete: false,
    },
    import: false,
    list: false,
  },
  reissue: {
    view: true,
    create: true,
  },
  comments: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.contracts",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.watch_deals",
        refer: "view",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.filter_deals",
        refer: "filter",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.download_deal",
        refer: "download",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.decline_deal",
        refer: "cancel",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.client_type",
        refer: "client_type",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.watch_branch_deals",
        refer: "root_branch",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.full_access",
        refer: "root",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.uniformity",
        refer: "uniformity",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.list",
        refer: "payments.list",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.import",
        refer: "payments.import",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.add_payment",
        refer: "payments.create",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.create_type_payment",
        refer: "payments.initial_type.create",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.edit_type_payment",
        refer: "payments.initial_type.edit",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.delete_type_payment",
        refer: "payments.initial_type.delete",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.create_monthly_payment",
        refer: "payments.monthly_type.create",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.edit_monthly_type",
        refer: "payments.monthly_type.edit",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.delete_monthly_type",
        refer: "payments.monthly_type.delete",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.reissue_view",
        refer: "reissue.view",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.reissue_create",
        refer: "reissue.create",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.edit",
        refer: "edit",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.read_comments",
        refer: "comments.view",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.create_comments",
        refer: "comments.create",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.update_comments",
        refer: "comments.edit",
        parent: "contracts",
      },
      {
        label: "roles_permission.contracts.delete_comments",
        refer: "comments.delete",
        parent: "contracts",
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
