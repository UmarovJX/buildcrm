import { v4 as uuid } from "uuid";
import generalData from "@/views/roles/data/general.data";
import contractsData from "@/views/roles/data/contracts.data";
import objectsData from "@/views/roles/data/objects.data";
import promosData from "@/views/roles/data/promos.data";
import plansData from "@/views/roles/data/plans.data";
import apartmentsData from "@/views/roles/data/apartments.data";
import checkoutData from "@/views/roles/data/checkout.data";
import usersData from "@/views/roles/data/users.data";
import rolesData from "@/views/roles/data/roles.data";
import releaseNoteData from "@/views/roles/data/releaseNote.data";
import debtorsData from "@/views/roles/data/debtors.data";
import companiesData from "@/views/roles/data/companies.data";
import paynetAccountData from "@/views/roles/data/paynetAccount.data";
import branchesData from "@/views/roles/data/branches.data";
import settingsData from "@/views/roles/data/settings.data";
import reportsData from "@/views/roles/data/reports.data";

export function joinRolesRows({ name }) {
  const { values: generalVs, permission: generalPms } = generalData(
    name,
    uuid()
  );
  const { values: contractVs, permission: contractPms } = contractsData(
    name,
    uuid()
  );
  const { values: objectsVs, permission: objectsPms } = objectsData(
    name,
    uuid()
  );
  const { values: promosVs, permission: promosPms } = promosData(name, uuid());
  const { values: plansVs, permission: plansPms } = plansData(name, uuid());
  const { values: apartmentsVs, permission: apartmentsPms } = apartmentsData(
    name,
    uuid()
  );
  const { values: checkoutVs, permission: checkoutPms } = checkoutData(
    name,
    uuid()
  );
  const { values: usersVs, permission: usersPms } = usersData(name, uuid());
  const { values: rolesVs, permission: rolesPms } = rolesData(name, uuid());
  const { values: releaseNoteVs, permission: releaseNotePms } = releaseNoteData(
    name,
    uuid()
  );
  const { values: debtorsVs, permission: debtorsPms } = debtorsData(
    name,
    uuid()
  );
  const { values: companiesVs, permission: companiesPms } = companiesData(
    name,
    uuid()
  );
  const { values: paynetAccountVs, permission: paynetAccountPms } =
    paynetAccountData(name, uuid());
  const { values: branchesVs, permission: branchesPms } = branchesData(
    name,
    uuid()
  );
  const { values: settingsVs, permission: settingsPms } = settingsData(
    name,
    uuid()
  );

  const { values: reportsVs, permission: reportsPms } = reportsData(
    name,
    uuid()
  );

  const form = {
    general: generalVs,
    objects: objectsVs,
    promos: promosVs,
    plans: plansVs,
    apartments: apartmentsVs,
    checkout: checkoutVs,
    contracts: contractVs,
    users: usersVs,
    roles: rolesVs,
    debtors: debtorsVs,
    companies: companiesVs,
    release_note: releaseNoteVs,
    payment_account: paynetAccountVs,
    branches: branchesVs,
    settings: settingsVs,
    reports: reportsVs,
  };

  const permissionTabs = [
    generalPms,
    objectsPms,
    promosPms,
    plansPms,
    apartmentsPms,
    checkoutPms,
    contractPms,
    usersPms,
    releaseNotePms,
    rolesPms,
    debtorsPms,
    companiesPms,
    paynetAccountPms,
    branchesPms,
    settingsPms,
    reportsPms,
  ];

  const row = {
    width: "50%",
    inputActive: false,
    inputType: "text",
    inputPlaceholder: "",
    inputClass: "form-control",
    checkboxActive: true,
    checkboxSize: "lg",
    checkboxSwitch: true,
    vBind: false,
  };

  for (let i = 0; i < permissionTabs.length; i++) {
    for (let j = 0; j < permissionTabs[i].rows.length; j++) {
      permissionTabs[i].rows[j] = {
        ...row,
        ...permissionTabs[i].rows[j],
      };
    }
  }

  return {
    form,
    permissionTabs,
  };
}
