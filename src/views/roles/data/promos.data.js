const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'roles_permission.titles.promos',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'roles_permission.activate_all',
        refer: 'all',
        parent: 'promos',
      },
      {
        label: 'roles_permission.promos.watch_promos_page',
        refer: 'view',
        parent: 'promos',
      },
      {
        label: 'roles_permission.promos.create_promo',
        refer: 'create',
        parent: 'promos',
      },
      {
        label: 'roles_permission.promos.edit_promo',
        refer: 'edit',
        parent: 'promos',
      },
      {
        label: 'roles_permission.promos.delete_promo',
        refer: 'delete',
        parent: 'promos',
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
