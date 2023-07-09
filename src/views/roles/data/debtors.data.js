const values = {
  view: false,
  // import: false
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.debtors",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "debtors",
      },
      {
        label: "roles_permission.debtors.watch_debtors",
        refer: "view",
        parent: "debtors",
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
