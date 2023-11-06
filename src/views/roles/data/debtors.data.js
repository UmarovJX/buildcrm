const values = {
  view: false,
  manage_issues: false,
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
      {
        label: "Работа с проблемными платежами",
        refer: "manage_issues",
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
