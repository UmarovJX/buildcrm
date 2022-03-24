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

export default {
    authV1: new Auth.AuthV1(),
    auth: new Auth.AuthV2(),
    home: new Home(),
    user: new User(),
    plans: new Plans(),
    roles: new Roles(),
    orders: new Orders(),
    clients: new Clients(),
    objects: new Objects(),
    debtors: new Debtors(),
    contract: new Contract(),
    branches: new Branches(),
    settings: new Settings(),
    companies: new Companies(),
    apartments: new Apartments(),
    accountants: new Accountants(),
}