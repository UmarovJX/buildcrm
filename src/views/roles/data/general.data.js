const values = {
  currency: false,
  theme: false,
  language: false,
  settings: false,
  profile_settings: false,
  password_settings: false,
};

function pms(name, uuid) {
  return {
    id: uuid,
    title: "general",
    active: true,
    parent: "form",
    rows: [
      {
        label: "roles_permission.activate_all",
        refer: "all",
        parent: "general",
      },
      {
        label: "roles_permission.general.role_name_ru",
        refer: "ru",
        parent: name,
        inputActive: true,
        inputPlaceholder: "roles_permission.placeholder_ru",
        checkboxActive: false,
      },
      {
        label: "roles_permission.general.role_name_uz",
        refer: "uz",
        parent: name,
        inputActive: true,
        inputPlaceholder: "roles_permission.placeholder_uz",
        checkboxActive: false,
      },
      {
        label: "roles_permission.general.exchange_rates",
        refer: "currency",
        parent: "general",
      },
      {
        label: "roles_permission.general.theme",
        refer: "theme",
        parent: "general",
      },
      {
        label: "roles_permission.general.language",
        refer: "language",
        parent: "general",
      },
      {
        label: "roles_permission.general.user_data",
        refer: "settings",
        parent: "general",
      },
      {
        label: "roles_permission.general.profile_settings",
        refer: "profile_settings",
        parent: "general",
      },
      {
        label: "roles_permission.general.user_password",
        refer: "password_settings",
        parent: "general",
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
