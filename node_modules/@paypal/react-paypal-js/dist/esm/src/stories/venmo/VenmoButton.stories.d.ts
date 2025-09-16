import type { FC } from "react";
declare const _default: {
    id: string;
    title: string;
    parameters: {
        controls: {
            expanded: boolean;
        };
        docs: {
            source: {
                type: string;
            };
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        style: {
            description: string;
            control: {
                type: string;
                expanded: boolean;
            };
            table: {
                category: string;
                type: {
                    summary: string;
                };
            };
        };
        onShippingChange: {
            description: string;
            control: null;
            table: {
                category: string;
                type: {
                    summary: string;
                };
            };
        };
    };
    args: {
        onShippingChange: null;
        style: {
            color: string;
        };
    };
};
export default _default;
export declare const Default: FC<{
    style: {
        color?: "blue" | "silver" | "white" | "black";
        label?: "paypal" | "checkout" | "buynow" | "pay" | "installment" | "subscribe" | "donate";
        shape?: "rect" | "pill";
    };
}>;
