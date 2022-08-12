import { Checkout } from "./Checkout";
import { PricingRules } from "./pricingRulesRegistry";

const co1 = new Checkout(PricingRules);
co1.scan("atv");
co1.scan("ipd");
co1.scan("ipd");
co1.scan("atv");
co1.scan("ipd");
co1.scan("ipd");
co1.scan("ipd");
co1.total()

const co2 = new Checkout(PricingRules);
co2.scan("atv");
co2.scan("atv");
co2.scan("atv");
co2.scan("vga");
co2.total()