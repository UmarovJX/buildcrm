const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'plan.title',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'roles_permission.activate_all',
        refer: 'all',
        parent: 'plan',
      },
      {
        label: 'roles_permission.view',
        refer: 'view',
        parent: 'plan',
      },
      {
        label: 'roles_permission.create',
        refer: 'create',
        parent: 'plan',
      },
      {
        label: 'roles_permission.update',
        refer: 'edit',
        parent: 'plan',
      },
      {
        label: 'roles_permission.delete',
        refer: 'delete',
        parent: 'plan',
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
