const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'roles_permission.titles.payment_account',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'roles_permission.activate_all',
        refer: 'all',
        parent: 'payment_account',
      },
      {
        label: 'roles_permission.payment_account.access_payments_list',
        refer: 'view',
        parent: 'payment_account',
      },

      {
        label: 'roles_permission.payment_account.add_payment',
        refer: 'create',
        parent: 'payment_account',
      },

      {
        label: 'roles_permission.payment_account.edit_payment',
        refer: 'edit',
        parent: 'payment_account',
      },

      {
        label: 'roles_permission.payment_account.delete_payment',
        refer: 'delete',
        parent: 'payment_account',
      },
    ],
  }
}

export default function (name, uuid) {
  return {
    values,
    permission: pms(name, uuid),
  }
}
