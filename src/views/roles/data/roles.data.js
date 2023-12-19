const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'roles_permission.titles.roles',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'roles_permission.activate_all',
        refer: 'all',
        parent: 'roles',
      },
      {
        label: 'roles_permission.roles.watch_roles',
        refer: 'view',
        parent: 'roles',
      },
      {
        label: 'roles_permission.roles.add_roles',
        refer: 'create',
        parent: 'roles',
      },
      {
        label: 'roles_permission.roles.edit_roles',
        refer: 'edit',
        parent: 'roles',
      },
      {
        label: 'roles_permission.roles.delete_roles',
        refer: 'delete',
        parent: 'roles',
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
