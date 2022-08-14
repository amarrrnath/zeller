import { DiscountType, DiscountValueType, Unit } from "./enums";

export type ConditionTypeOne = {
    type: DiscountType.QUANTITY;
    pricedQuantity: number,
    waivedQuantity: number,

};

export type ConditionTypeTwo = {
    type: DiscountType.PRICE;
    minQuantity: number;
    discount: number;
    valueType: DiscountValueType;
    unit: Unit;
}

export type PricingRulestype = {
    [SKU: string]: {
        condition: Array<ConditionTypeOne | ConditionTypeTwo>;
    }
}

export type CartType = {
    [SKU: string]: {
        name: string;
        quantity: number;
        price: number;
        discountApplied: number;
        freeQuantity: number;
    };
}

export type Inventory = Array<{
    sku: string;
    name: string;
    price: number;
}>