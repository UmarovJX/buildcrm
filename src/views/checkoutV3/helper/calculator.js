
export const basePrice = function () {
    return this.order.calculation.price || this.order.apartment.prices.price
}
export const currentInstallmentObj = function () {
    const current = this.order.calculation.currentInstallment
    return this.order.calculation.installments.find(el => el.id === current) || {}
}
export const fullPrice = function () {
    const type = this.order.calculation.type
    if (type === 'installment') {
        return this.currentInstallmentObj.amount * this.order.apartment.plan.area;
    }
    if (this.order.calculation.price) return this.order.calculation.price;
    if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) return this.order.apartment.price;
        return this.order.apartment.prices.price;
    }
    return this.discount.amount * this.order.apartment.plan.area;
}



export const fullPayment = function () {
    return this.fullPrice - this.order.calculation.discount_amount
}

export const prepayAmount = function () {
    const type = this.order.calculation.type
    if (type === 'installment') {
        return (this.order.calculation.prepay * (this.order.apartment.plan.area * this.discount.amount) / 100);
    }
    return this.fullPayment * this.order.calculation.prepay / 100
}

export const m2Price = function () {
    const type = this.order.calculation.type
    if (type === 'installment') {
        return this.currentInstallmentObj.amount
    }
    return this.fullPayment / this.order.apartment.plan.area
}
// export const monthlyPayment = function () {
//     const degree = Math.floor(
//         parseInt(this.totalPayment - this.prepay).toString().length / 3
//     );
//     if (this.order.calculation.type === "custom") {
//         if (this.order.calculation.months) {
//             return (
//                 Math.ceil(
//                     (this.totalPayment - this.prepay) /
//                     (Math.pow(10, degree) * this.calc.month)
//                 ) * Math.pow(10, degree)
//             );
//         }
//     } else {
//         return (
//             Math.ceil(
//                 (this.totalPayment - this.prepay) /
//                 (Math.pow(10, degree) * this.currentInstallmentObj.months)
//             ) * Math.pow(10, degree)
//         );
//     }
//     return 0;
// }

export const monthly = function (m, p) {
    const degree = Math.floor(
        Math.floor(p).toString().length / 3
    );
    return Math.ceil(
        p / (Math.pow(10, degree) * m)
    ) * Math.pow(10, degree)
}