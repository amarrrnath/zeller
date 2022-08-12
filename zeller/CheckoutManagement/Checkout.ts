import { DiscountType, DiscountValueType } from "./enums";
import { inventory } from "./inventory";
import { CartType, Inventory, PricingRulestype } from "./types";

interface CheckoutInterface {
    getMaxDiscount: (sku: string, itemDetails: Inventory[0]) => number;
    scan: (sku: string) => boolean;
    total: () => number;
}

export class Checkout implements CheckoutInterface {
    private pricingRules: PricingRulestype;
    private cart: CartType;
    constructor(pricingRules: PricingRulestype) {
        this.pricingRules = pricingRules;
        this.cart = {}
    };

    getMaxDiscount(sku: string, itemDetails: Inventory[0]) {
        // ASSUMPTION 1: In case of more than one pricing rule for a SKU, use maximum applicable discount.
        let maxDiscount = 0;
        let currentDiscount = 0;
        let skuPricingRules = this.pricingRules[sku];
        const currentItem = this.cart[sku];

        // Check if SKU has any pricingRules and conditions
        if (currentItem && skuPricingRules && skuPricingRules.condition.length) {
            skuPricingRules.condition.forEach(condition => {

                // If discountType is Quantity
                if (condition.type === DiscountType.QUANTITY) {
                    if (currentItem.quantity % (condition.pricedQuantity + condition.waivedQuantity) === 0) {
                        currentDiscount = currentItem.discountApplied + currentItem.price;
                        if (maxDiscount <= currentDiscount)
                            maxDiscount = currentDiscount;
                    }

                    // If discountType is Price, i.e., if there's a reduction in price
                } else {
                    if (currentItem.quantity >= condition.minQuantity) {
                        if (condition.valueType === DiscountValueType.PRICE) {
                            // maxDiscount will be the difference amount of total price to discounted price
                            currentDiscount = (currentItem.quantity * itemDetails.price) - (currentItem.quantity * condition.discount);
                            if (maxDiscount <= currentDiscount)
                                maxDiscount = currentDiscount;
                        }
                    }
                }
            })
        }

        return maxDiscount;
    };

    scan(sku: string) {
        const itemDetails = inventory.find(item => item.sku === sku);

        if (!itemDetails)
            throw new Error(`Invalid SKU: ${sku}`);

        // Check if cart already has the item
        if (!this.cart[sku]) {
            this.cart[sku] = {
                name: itemDetails.name,
                quantity: 1,
                price: itemDetails.price, // Initial values
                discountApplied: 0 // Initial values
            }
            // If cart already has the item then increase quantity
        } else
            this.cart[sku].quantity++;

        // Calculate maximum discount applicable
        const maxDiscount = this.getMaxDiscount(sku, itemDetails);
        this.cart[sku].discountApplied = maxDiscount;
        return true;
    }

    total() {
        let total: number = 0;
        Object.keys(this.cart).forEach((sku: string) => {
            total += (this.cart[sku].price * this.cart[sku].quantity) - this.cart[sku].discountApplied;
        })

        console.log(total);
        return total;
    }
}