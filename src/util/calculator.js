import Vue from 'vue'

export function getPrepay(apartments, contract) {
    if (contract.discount.prepay === 100) return getTotal(apartments, contract);

    if (parseInt(contract.month) === 0 ) return getTotal(apartments, contract)

    let total_discount = getDiscount(apartments, contract);

    let total;

    switch (contract.discount.type) {
        case "fixed":
            // if (parseFloat(this.calc.discount_price)) {
            //     total =
            //         (parseFloat(this.client.discount.amount) -
            //             parseFloat(this.calc.discount_price)) *
            //         getAreaTotal(apartments, contract);
            // } else {
                total = getTotal(apartments, contract);
            // }
            break;
        default:
            total = getTotalForPercent(apartments, contract) / total_discount;
            break;
    }

    if (contract.initial_payments.length > 1) {
        total = 0;

        for (let i = 0; contract.initial_payments.length > i; i++) {
            total += parseFloat(contract.initial_payments[i].amount);
        }

        return total;
    }

    if (contract.prepay_edited) {
        return parseFloat(contract.prepay_amount);
    }

    return (contract.discount.prepay * total) / 100;

}

export function getAreaTotal(apartments) {
    let planAreas = 0;
    for (let i = 0; apartments.length > i; i++) {
        planAreas += apartments[i].plan.area;
    }
    return planAreas;
}

export function getPricePerM2(apartments, contract) {
    return getPrice(apartments, contract) / getAreaTotal(apartments);
}

export function getPrice(apartments, contract) {
    let price = [];
    switch (contract.discount.type) {
        case "fixed":
            for (let i = 0; apartments.length > i; i++) {
                let amountApartment = 0;
                if (contract.discount.id !== 'other')
                    amountApartment = apartments[i].discounts.find(
                        (val) => val.prepay === contract.discount.prepay
                    ).amount;
                else
                    amountApartment = contract.discount.amount;

                // if (contract.discount.id === apartments[i].discount_id && apartments[i].price_current && parseFloat(apartments[i].price_current) !== parseFloat(apartments[i].price_calc)) {
                //     price.push(parseFloat(apartments[i].price_current));
                // } else {
                    const totalAmount = parseFloat(amountApartment) * apartments[i].plan.area;

                    // Vue.set(apartments[i], 'price_current', totalAmount.toFixed(2))
                    Vue.set(apartments[i], 'price_calc', parseFloat(totalAmount.toFixed(2)))
                    Vue.set(apartments[i], 'price_edited', false)
                    Vue.set(apartments[i], 'discount_id', contract.discount.id)

                    // .price_calc = totalAmount
                    // apartments[i].price_current = totalAmount
                    price.push(parseFloat(totalAmount.toFixed(2)));
                // }
            }
            break;
        default:
            if (contract.discount.prepay === 100) {
                for (let index = 0; index < apartments.length; index++) {

                    // apartments[index].price_current = apartments[index].price
                    apartments[index].price_calc = apartments[index].price

                    // Vue.set(apartments[index], 'price_current', apartments[index].price.toFixed(2))
                    Vue.set(apartments[index], 'price_calc', parseFloat(apartments[index].price.toFixed(2)))
                    Vue.set(apartments[index], 'price_edited', false)
                    Vue.set(apartments[index], 'discount_id', contract.discount.id)

                    price.push(parseFloat(apartments[index].price.toFixed(2)));
                }
            } else {
                for (let i = 0; apartments.length > i; i++) {
                    let amountApartment = 0;
                    if (contract.discount.id !== 'other')
                        amountApartment = apartments[i].discounts.find(
                            (val) => val.prepay === contract.discount.prepay
                        ).amount;
                    else
                        amountApartment = contract.discount.amount;


                    let totalAmount = 0;

                    // if (contract.discount.id === 'other')
                    //     Vue.set(apartments[i], 'price_edited', false)

                    if (apartments[i].price_edited)
                        totalAmount = apartments[i].price_calc
                    else
                        totalAmount = parseFloat(apartments[i].price_m2) * apartments[i].plan.area / (1 - amountApartment / 100);



                    // apartments[i].price_calc = totalAmount

                    // apartments[i].price_current = totalAmount
                    // Vue.set(apartments[i], 'price_current', totalAmount.toFixed(2))
                    Vue.set(apartments[i], 'price_calc', parseFloat(totalAmount.toFixed(2)))
                    Vue.set(apartments[i], 'discount_id', contract.discount.id)
                    // apartments[i].price_calc = totalAmount

                    // apartments[i].price_current = totalAmount

                    price.push(parseFloat(totalAmount.toFixed(2)));
                }
            }
            break;
    }

    let total = price.reduce((a, b) => a + b, 0);
    return total
}

export function getDiscount(apartments, contract) {
    if (contract.discount.prepay === 100) return 1;

    return 1 - contract.discount.amount / 100;
}

export function getMonth(apartments, contract) {
    if (parseInt(contract.month) === 0) return 0;

    return (
        (getTotal(apartments, contract) - getPrepay(apartments, contract)) /
        parseInt(contract.month)
    );
}

export function getDebt(apartments, contract) {
    return getTotal(apartments, contract) - getPrepay(apartments, contract);
}

export function getTotalDiscount(apartments, contract) {
    if (parseFloat(contract.discount_amount) > 0) {
        let price = getPrice(apartments, contract)
        let square = getAreaTotal(apartments)


        let now = (parseFloat(price) - parseFloat(contract.discount_amount)) / parseFloat(square);
        let discount = price / square - now

        Vue.set(contract, 'discount_square', discount)
    } else if (parseFloat(contract.discount_square) > 0) {
        let total = getPrice(apartments, contract)
        let price = getPricePerM2(apartments, contract)
        let square = getAreaTotal(apartments)

        let now = parseFloat(price) - parseFloat(contract.discount_square);
        let discount = now * square
        discount = total - discount

        Vue.set(contract, 'discount_amount', discount)
    }

    // let total = 0;
    // for (let i = 0; apartments.length > i; i++) {
    //     if (apartments[i].price_calc && parseFloat(apartments[i].price_calc) !== parseFloat(apartments[i].price_current)) {
    //         total += parseFloat(apartments[i].price_calc) - parseFloat(apartments[i].price_current)
    //     }
    // }
    //
    // return total;
}


export function CreditMonths(apartments, contract) {
    let today = contract.payment_date ? new Date(contract.payment_date) : new Date();

    // let today = new Date();

    contract.credit_months = [];

    if (parseInt(contract.month) > 0) {
        let month_amount = getMonth(apartments, contract);

        for (let i = 0; i < parseInt(contract.month); i++) {
            if (i === 0) {
                contract.credit_months.push({
                    month: today.setMonth(today.getMonth()),
                    amount: month_amount,
                    edit: false,
                    edited: false,
                });
            } else {
                contract.credit_months.push({
                    month: today.setMonth(today.getMonth() + 1),
                    amount: month_amount,
                    edit: false,
                    edited: false,
                });
            }
        }
    }

    return contract;
}

export function editedCreditMonths(apartments, contract) {
    if (parseInt(contract.month) === 0) return contract.credit_months = [];

    let total = getPrepay(apartments, contract);
    let months = 0;

    if (contract.credit_months.length === 0)
        return CreditMonths(apartments, contract)

    if (contract.credit_months.length !== parseInt(contract.month))
        return CreditMonths(apartments, contract)

    for (let i = 0; i < contract.credit_months.length; i++) {
        if (contract.credit_months[i].edited) {
            total += parseFloat(contract.credit_months[i].amount);
        } else {
            months += 1;
        }
    }

    let monthly_amount = (getTotal(apartments, contract) - total) / months;

    for (let m = 0; m < contract.credit_months.length; m++) {
        if (!contract.credit_months[m].edited) {
            // if (monthly_amount > 0)
            contract.credit_months[m].amount = monthly_amount;
            // else
            //     this.credit_months.splice(m, 1)
        }
    }
}

export function getTotal(apartments, contract) {
    let total_discount = getDiscount(apartments, contract);
    let total = 0;

    switch (contract.discount.type) {
        case "fixed":
            // if (parseFloat(contract.discount_amount) > 0) {
            //     total = (this.client.discount.amount - parseFloat(this.calc.discount_price)) * this.planAreas();
            // } else {
            if (parseFloat(contract.discount_amount) > 0) {
                total = getPrice(apartments, contract);
                total = total - contract.discount_amount;
            } else {
                total = getPrice(apartments, contract);
            }
            // }
            break;
        default:
            if (parseFloat(contract.discount_amount) > 0) {
                total = getPrice(apartments, contract);
                total = total - contract.discount_amount;
            } else {
                total = getPrice(apartments, contract) / total_discount;
            }
            break;
    }

    return total;
}

export function getTotalForPercent(apartments, contract) {
    let total_discount = getDiscount(apartments, contract);
    let total = 0;
    let price = 0;
    switch (contract.discount.type) {
        case "fixed":
            // if (parseFloat(this.calc.discount_price)) {
            //     total =
            //         (parseFloat(this.client.discount.amount) -
            //             parseFloat(this.calc.discount_price)) *
            //         this.planAreas();
            // } else {
                total = getPrice(apartments, contract);
            // }
            break;
        default:
            if (contract.discount.prepay === 100) {
                for (let index = 0; index < apartments.length; index++) {
                    price += apartments[index]?.price_m2;
                }
                total = price / (total_discount * apartments.length);
            } else {
                total = getPrice(apartments, contract);
            }
            break;
    }

    return total;
}