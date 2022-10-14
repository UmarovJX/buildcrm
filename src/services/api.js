import Apartments from "@/services/apartments";
import Branches from "@/services/branches";
import Objects from "@/services/objects";
import User from "@/services/user"
import Companies from "@/services/companies";
import Contract from "@/services/contract";
import Plans from "@/services/plans"
import Auth from "@/services/auth";
import Settings from "@/services/settings";
import Debtors from "@/services/debtors";
import Home from "@/services/home"
import Orders from "@/services/orders";
import Clients from "@/services/clients";
import Roles from "@/services/roles"
import Accountants from "@/services/accountants";
import Promo from "@/services/promo"

export const debtorsV2 = new Debtors.DebtorsV2()

export default {
    home: new Home(),
    user: new User.User(),
    userV2: new User.UserV2(),
    plans: new Plans(),
    promo: new Promo.Promo(),
    promoV2: new Promo.PromoV2(),
    roles: new Roles(),
    orders: new Orders(),
    clients: new Clients.Clients(),
    clientsV2: new Clients.ClientsV2(),
    objects: new Objects.ObjectsV1Crm(),
    objectsV2: new Objects.ObjectsV2(),
    debtors: new Debtors.DebtorsV1(),
    debtorsV2: new Debtors.DebtorsV1(),
    contract: new Contract.Contract(),
    contractV2: new Contract.ContractV2(),
    branches: new Branches(),
    settings: new Settings.Settings(),
    settingsV2: new Settings.SettingsV2(),
    authV1: new Auth.AuthV1(),
    auth: new Auth.AuthV2(),
    companies: new Companies(),
    apartments: new Apartments.ApartmentsV1(),
    apartmentsV2: new Apartments.ApartmentsV2(),
    accountants: new Accountants(),
}

