import type { ReactNode } from "react";
import type { OrderResponseBody } from "@paypal/paypal-js";
export declare const FLY_SERVER = "https://react-paypal-js-storybook.fly.dev";
export declare const CREATE_ORDER_URL: string;
export declare const CAPTURE_ORDER_URL: string;
export declare function getOptionsFromQueryString(): Record<string, string>;
export declare function getClientToken(url?: string): Promise<string>;
export declare function approveSale(nonce: string, amount: string): Promise<unknown>;
export declare function generateRandomString(): string;
export declare function reactElementToString(source: ReactNode, ctx?: unknown): string;
export declare function generateFundingSource(fundingSource?: string): string;
export declare function createOrder(cart: {
    sku: string;
    quantity: number;
}[]): Promise<OrderResponseBody>;
export declare function onApprove(data: {
    orderID: string;
}): Promise<OrderResponseBody>;
