import { Checkout } from "../CheckoutManagement/Checkout";

jest.mock("../CheckoutManagement/inventory");
jest.mock("../CheckoutManagement/pricingRulesRegistry");

import { pricingRules } from "../CheckoutManagement/pricingRulesRegistry";

describe("Checkout Management Test Cases", () => {

    test("[POSITIVE] Test for quantity type discount", () => {
        const co = new Checkout(pricingRules);
        co.scan("ipd");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        expect(co.getCart().atv.quantity).toEqual(3);
        expect(co.getCart().atv.freeQuantity).toEqual(1);
        expect(co.getCart().atv.discountApplied).toEqual(109.5);
        expect(co.getCart().ipd.discountApplied).toEqual(0);

        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");
        co.scan("atv");

        const total = co.total();

        expect(co.getCart().atv.quantity).toEqual(8);
        expect(co.getCart().ipd.quantity).toEqual(1);
        expect(co.getCart().atv.freeQuantity).toEqual(2);
        expect(co.getCart().ipd.freeQuantity).toEqual(0);
        expect(co.getCart().atv.discountApplied).toEqual(219);
        expect(co.getCart().ipd.discountApplied).toEqual(0);
        expect(total).toEqual(1206.99);
    });

    test("[POSITIVE] Test for price type discount", () => {
        const co = new Checkout(pricingRules);
        co.scan("ipd");
        co.scan("atv");
        co.scan("ipd");
        co.scan("ipd");
        co.scan("vga");
        co.scan("vga");
        co.scan("ipd");
        co.scan("ipd");
        co.scan("vga");
        co.scan("vga");
        co.scan("vga");
        co.scan("vga");

        const total = co.total();

        expect(co.getCart().atv.quantity).toEqual(1);
        expect(co.getCart().ipd.quantity).toEqual(5);
        expect(co.getCart().vga.quantity).toEqual(6);
        expect(co.getCart().atv.freeQuantity).toEqual(0);
        expect(co.getCart().vga.discountApplied).toEqual(31);
        expect(total).toEqual(2764.45);
    });

    test("[POSITIVE] test for a sku which has no pricing rule", () => {
        const co = new Checkout(pricingRules);

        co.scan("mbp");
        co.scan("mbp");

        const total = co.total();
        expect(total).toEqual(2799.98);
        expect(co.getCart().mbp.discountApplied).toEqual(0);
        expect(co.getCart().mbp.quantity).toEqual(2);
        expect(co.getCart().mbp.freeQuantity).toEqual(0);
    })

    test("[NEGATIVE] test for an invalid/non-existing sku", () => {
        const co = new Checkout(pricingRules);
        expect(() => co.scan("xyz")).toThrow("Invalid SKU: xyz");
    })
});
