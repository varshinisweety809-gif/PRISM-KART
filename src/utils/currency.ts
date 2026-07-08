/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a USD price value into Indian Rupees (INR) for realistic Indian e-commerce display.
 * Uses a standard exchange rate of 80 INR per USD and formats using en-IN localization.
 */
export function formatINR(usdAmount: number): string {
  const inrValue = Math.round(usdAmount * 80);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(inrValue);
}
