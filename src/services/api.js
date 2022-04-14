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

export default {
    home: new Home(),
    user: new User(),
    plans: new Plans(),
    promo: new Promo.Promo(),
    promoV2: new Promo.PromoV2(),
    roles: new Roles(),
    orders: new Orders(),
    clients: new Clients(),
    objects: new Objects.ObjectsV1Crm(),
    objectsV2: new Objects.ObjectsV2(),
    debtors: new Debtors(),
    contract: new Contract.Contract(),
    contractV2: new Contract.ContractV2(),
    branches: new Branches(),
    settings: new Settings(),
    authV1: new Auth.AuthV1(),
    auth: new Auth.AuthV2(),
    companies: new Companies(),
    apartments: new Apartments(),
    accountants: new Accountants(),
}