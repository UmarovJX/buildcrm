const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
  templates: {
    view: true,
    create: true,
    delete: true,
    is_primary: true,
    instruction: true,
    download: true,
  },
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.branches",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.watch_branches",
        refer: "view",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.add_branch",
        refer: "create",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.edit_branch",
        refer: "edit",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.delete_branch",
        refer: "delete",
        parent: "branches",
      },
      /*{

                        label: 'roles_permission.branches.watch_contract_template',
                        refer: 'contract_templates',
                        parent: 'branches',
                      },*/
      {
        label: "roles_permission.branches.watch_contract_template",
        refer: "templates.view",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.create_contract_template",
        refer: "templates.create",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.delete_contract_template",
        refer: "templates.delete",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.make_main_branch_template",
        refer: "templates.is_primary",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.template_instruction",
        refer: "templates.instruction",
        parent: "branches",
      },
      {
        label: "roles_permission.branches.template_download",
        refer: "templates.download",
        parent: "branches",
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
