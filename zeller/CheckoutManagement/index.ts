import { Checkout } from "./Checkout";
import { pricingRules } from "./pricingRulesRegistry";

/**
 * Total atv = 2 - No discount applied
 * Total ipd = 5 - Price discount of 499.99 is applied for each item
 * Total = $2718.95
 */
const co1 = new Checkout(pricingRules);
co1.scan("atv");
co1.scan("ipd");
co1.scan("ipd");
co1.scan("atv");
co1.scan("ipd");
co1.scan("ipd");
co1.scan("ipd");
co1.total()

/**
 * Total atv = 3 - One item is discounted
 * Total vga = 1 - No discount applied
 * Total = $249
 */
const co2 = new Checkout(pricingRules);
co2.scan("atv");
co2.scan("atv");
co2.scan("atv");
co2.scan("vga");
co2.total()

/**
 * Total ipd = 5 - Price discount of 499.99 is applied for each item
 * Total atv = 1 - No discount applied
 * Total vga = 6 - No discount applied
 * Total = $2789.45
 */
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
co.total();