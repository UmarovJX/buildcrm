const values = {
  book: false,
  checkout: false,
  mark_friends: false,
  mark_price: false,
  edit_date: false,
  monthly_payment: false,
  root: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.execution",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.book_apartment",
        refer: "book",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.decorate_apartment",
        refer: "checkout",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.tag_acquaintances",
        refer: "mark_friends",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.change_payment",
        refer: "mark_price",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.edit_date",
        refer: "edit_date",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.change_monthly_payment",
        refer: "monthly_payment",
        parent: "checkout",
      },
      {
        label: "roles_permission.execution.full_access",
        refer: "root",
        parent: "checkout",
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
