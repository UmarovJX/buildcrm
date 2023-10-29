const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "Bot",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "bot",
      },
      {
        label: "roles_permission.view",
        refer: "view",
        parent: "bot",
      },
      {
        label: "roles_permission.create",
        refer: "create",
        parent: "bot",
      },
      {
        label: "roles_permission.edit",
        refer: "edit",
        parent: "bot",
      },
      {
        label: "roles_permission.delete",
        refer: "delete",
        parent: "bot",
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
