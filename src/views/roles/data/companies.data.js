const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.companies",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "companies",
      },
      {
        label: "roles_permission.companies.watch_companies",
        refer: "view",
        parent: "companies",
      },
      // {
      //
      //   label: 'roles_permission.companies.watch_company',
      //   refer: 'show',
      //   parent: 'companies',
      // },
      {
        label: "roles_permission.companies.create_company",
        refer: "create",
        parent: "companies",
      },
      {
        label: "roles_permission.companies.edit_companies",
        refer: "edit",
        parent: "companies",
      },
      {
        label: "roles_permission.companies.delete_company",
        refer: "delete",
        parent: "companies",
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
