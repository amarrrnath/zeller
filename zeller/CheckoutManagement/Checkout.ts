import { DiscountType, DiscountValueType } from "./enums";
import { inventory } from "./inventory";
import { CartType, Inventory, PricingRulestype } from "./types";

interface CheckoutInterface {
    getCart: () => CartType;
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

    getCart() {
        return this.cart;
    };

    getMaxDiscount(sku: string, itemDetails: Inventory[0]) {
        // ASSUMPTION 1: In case of more than one pricing rule for a SKU, use maximum applicable discount.
        let maxDiscount = this.cart[sku].discountApplied;
        let currentDiscount = 0;
        const skuPricingRules = this.pricingRules[sku];
        const currentItem = this.cart[sku];

        if (currentItem && skuPricingRules && skuPricingRules.condition.length) {
            skuPricingRules.condition.forEach(condition => {
                // If discountType is Quantity
                if (condition.type === DiscountType.QUANTITY) {
                    /**
                     * The formula :- quantity % (priced + waived)quantity === 0
                     * Provides the quantites that are multiples of (priced + waived)quantities
                     * When it resolves to true, then that quantity is added as a free quantity
                     * and price of 1 quantity is added to the total discounted price
                     */
                    if (currentItem.quantity % (condition.pricedQuantity + condition.waivedQuantity) === 0)
                        currentDiscount = ++currentItem.freeQuantity * currentItem.price;
                }

                // If discountType is Price, i.e., if there's a reduction in price
                if (condition.type === DiscountType.PRICE) {
                    if (currentItem.quantity >= condition.minQuantity) {
                        if (condition.valueType === DiscountValueType.PRICE)
                            // maxDiscount will be the difference amount of total price to discounted price
                            currentDiscount = (currentItem.quantity * itemDetails.price) - (currentItem.quantity * condition.discount);
                    }
                }

                if (maxDiscount <= currentDiscount)
                    maxDiscount = currentDiscount;
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
                price: itemDetails.price,
                discountApplied: 0,
                freeQuantity: 0
            }

            // If cart already has the item then increase quantity
        } else this.cart[sku].quantity++;

        // Calculate maximum discount applicable
        this.cart[sku].discountApplied = this.getMaxDiscount(sku, itemDetails);

        return true;
    }

    total() {
        let total: number = 0;

        Object.keys(this.cart).forEach((sku: string) => {
            total += (this.cart[sku].price * this.cart[sku].quantity) - this.cart[sku].discountApplied;
        })

        console.log(`Total = $${total}`);

        return total;
    }
}