const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.release_note",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "release_note",
      },
      {
        label: "roles_permission.release_note.watch_notes",
        refer: "view",
        parent: "release_note",
      },
      {
        label: "roles_permission.release_note.create_note",
        refer: "create",
        parent: "release_note",
      },
      {
        label: "roles_permission.release_note.edit_note",
        refer: "edit",
        parent: "release_note",
      },
      {
        label: "roles_permission.release_note.delete_note",
        refer: "delete",
        parent: "release_note",
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
