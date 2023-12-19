const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'roles_permission.titles.users',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'roles_permission.activate_all',
        refer: 'all',
        parent: 'users',
      },
      {
        label: 'roles_permission.users.watch_users',
        refer: 'view',
        parent: 'users',
      },
      {
        label: 'roles_permission.users.create_user',
        refer: 'create',
        parent: 'users',
      },
      {
        label: 'roles_permission.users.edit_user',
        refer: 'edit',
        parent: 'users',
      },
      {
        label: 'roles_permission.users.delete_user',
        refer: 'delete',
        parent: 'users',
      },
      {
        label: 'Unblock_Users',
        refer: 'unblock',
        parent: 'users',
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
