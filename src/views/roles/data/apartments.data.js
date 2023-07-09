const values = {
  view: false,
  filter: false,
  comments: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  lists: {
    list: false,
    grid: false,
    grid_sm: false,
    plan: false,
  },
  edit: false,
  is_sold: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.apartments",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.change_list_apartments",
        refer: "lists.list",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.list_apartments1",
        refer: "lists.grid",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.list_apartments2",
        refer: "lists.grid_sm",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.using_layouts",
        refer: "lists.plan",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.watch_apartments",
        refer: "view",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.filter_apartments",
        refer: "filter",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.edit_apartment",
        refer: "edit",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.status_apartment",
        refer: "is_sold",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.read_comments",
        refer: "comments.view",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.create_comments",
        refer: "comments.create",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.update_comments",
        refer: "comments.edit",
        parent: "apartments",
      },
      {
        label: "roles_permission.apartments.delete_comments",
        refer: "comments.delete",
        parent: "apartments",
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
