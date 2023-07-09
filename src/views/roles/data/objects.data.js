const values = {
  view: false,
  create: false,
  edit: false,
  delete: false,
  upload_logo: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "roles_permission.titles.objects",
    active: false,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "objects",
      },
      {
        label: "roles_permission.objects.watch_objects",
        refer: "view",
        parent: "objects",
      },
      {
        label: "roles_permission.objects.create_object",
        refer: "create",
        parent: "objects",
      },
      {
        label: "roles_permission.objects.edit_object",
        refer: "edit",
        parent: "objects",
      },
      {
        label: "roles_permission.objects.delete_object",
        refer: "delete",
        parent: "objects",
      },
      {
        label: "roles_permission.objects.download_logo",
        refer: "upload_logo",
        parent: "objects",
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
