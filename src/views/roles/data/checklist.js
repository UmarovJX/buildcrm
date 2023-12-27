export default {
  general: {
    currency: false,// ✅
    theme: false,// ✅
    language: false,// ✅
    settings: false,// ✅
    profile_settings: false,// ✅
    password_settings: false,// ✅
    view_statistics: false, // ✅
    view_manager_statistics: false, // ✅
  },

  apartments: {
    view: false,// ✅
    filter: false,// ❌
    comments: {
      view: false,// ✅
      create: false,// ✅
      edit: false,// ✅
      delete: false,// ✅
    },
    lists: {
      list: false, // ✅
      grid: false,// ✅
      grid_sm: false,// ✅
      plan: false,// ✅
    },
    edit: false,// ✅
    is_sold: false,// ✅
  },

  bot: {
    view: false, // ✅
    create: false, // ✅
    update: false, // ✅
    delete: false, // ✅
  },

  branches: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
    templates: {
      view: true,// ✅
      create: true,// ✅
      delete: true,// ✅
      is_primary: true,// ✅
      instruction: true,// ✅
      download: true,// ✅
    },
  },

  checkout: {
    book: false,// ✅
    checkout: false,// ✅
    mark_friends: false,// ✅
    mark_price: false,// ✅
    edit_date: false,// ✅
    monthly_payment: false,// ✅
    root: false,// ✅
  },

  clients: {
    view: false,// ❌
  },

  companies: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
  },

  contracts: {
    view: false,// ✅
    filter: false,// ✅
    download: false,// ✅
    cancel: false,// ✅
    client_type: false,// ✅
    root_branch: false,
    root: false, // ❌
    uniformity: false,// ✅
    edit: true,// ✅
    main_manager: false,
    payments: {
      create: false,// ✅
      initial_type: {
        create: false,// ✅
        edit: false,// ✅
        delete: false,// ✅
      },
      monthly_type: {
        create: false,// ✅
        edit: false,// ✅
        delete: false,// ✅
      },
      import: false,// ✅
      list: false,// ✅
    },
    reissue: {
      view: true,// ✅
      create: true,// ✅
    },
    comments: {
      view: false,// ✅
      create: false,// ✅
      edit: false,// ✅
      delete: false,// ✅
    },
    // download_order: false,
    download_report: false,// ❌
  },

  debtors: {
    view: false, // ❌
    manage_issues: false, // ❌
    // import: false
  },

  objects: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
    upload_logo: false,// ✅
    manage_facilities: false,// ✅
  },

  paynet_account: {
    view: false,// ❌
    create: false,// ❌
    edit: false,// ❌
    delete: false,// ❌
  },

  plan: {
    view: false,// ❌
    create: false,// ❌
    edit: false,// ❌
    delete: false,// ❌
  },

  plans: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
  },

  promos: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
  },

  release_note: {
    view: false,// ❌
    create: false,// ❌
    edit: false,// ❌
    delete: false,// ❌
  },

  reports: {
    view: false, // ✅
    create: false, // ✅
  },

  roles: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
  },

  settings: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
  },

  users: {
    view: false,// ✅
    create: false,// ✅
    edit: false,// ✅
    delete: false,// ✅
  },
}
