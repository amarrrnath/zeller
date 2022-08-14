import { DiscountType, DiscountValueType, Unit } from "./enums";
import { PricingRulestype } from "./types";

export const pricingRules: PricingRulestype = {
    atv: {
        condition: [
            {
                type: DiscountType.QUANTITY,
                pricedQuantity: 2,
                waivedQuantity: 1,
            },
        ],
    },
    ipd: {
        condition: [
            {
                type: DiscountType.PRICE,
                minQuantity: 5,
                discount: 499.99,
                valueType: DiscountValueType.PRICE,
                unit: Unit.EACH,
            },
        ],
    },
};
