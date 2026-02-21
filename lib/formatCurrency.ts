/**
 * Re-exports formatCurrency from lib/utils to provide a dedicated import path.
 *
 * @example
 * import { formatCurrency } from "@/lib/formatCurrency";
 * formatCurrency(123456);    // "₹1,23,456"
 * formatCurrency(null);      // "₹0"
 * formatCurrency(undefined); // "₹0"
 */
export { formatCurrency } from "./utils";
