const values = {
  view: false,
  create: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'reports.title',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'roles_permission.activate_all',
        refer: 'all',
        parent: 'reports',
      },
      {
        label: 'roles_permission.reports.view',
        refer: 'view',
        parent: 'reports',
      },
      {
        label: 'roles_permission.reports.create',
        refer: 'create',
        parent: 'reports',
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
