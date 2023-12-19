const values = {
  view: false,
}

function pms(name, uuid) {
  return {
    id: uuid,
    title: 'Клиенты',
    active: false,
    parent: 'form',
    rows: [
      {
        label: 'Все',
        refer: 'all',
        parent: 'clients',
      },
      {
        label: 'Работа с данными клиентов',
        refer: 'view',
        parent: 'clients',
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
