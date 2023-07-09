const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.layouts",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "plans",
      },
      {
        label: "roles_permission.layouts.watch_layouts",
        refer: "view",
        parent: "plans",
      },
      {
        label: "roles_permission.layouts.create_layouts",
        refer: "create",
        parent: "plans",
      },
      {
        label: "roles_permission.layouts.edit_layouts",
        refer: "edit",
        parent: "plans",
      },
      {
        label: "roles_permission.layouts.delete_layouts",
        refer: "delete",
        parent: "plans",
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
