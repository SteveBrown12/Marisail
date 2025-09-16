import React from "react";
import type { FC } from "react";
import type { PayPalButtonsComponentOptions, FUNDING_SOURCE } from "@paypal/paypal-js";
declare const _default: {
    id: string;
    title: string;
    component: React.FC<import("../../index").PayPalMarksComponentProps>;
    parameters: {
        options: {
            showFunctions: boolean;
        };
        controls: {
            expanded: boolean;
        };
    };
    argTypes: {
        style: {
            table: {
                category: string;
            };
            control: {
                type: string;
            };
        };
        className: {
            control: null;
            table: {
                category: string;
            };
        };
        fundingSource: {
            table: {
                category: string;
            };
            options: (FUNDING_SOURCE | undefined)[];
            control: {
                type: string;
                labels: {
                    [x: string]: string;
                    undefined: string;
                };
            };
        };
    };
    args: {
        style: {
            color: string;
        };
    };
};
export default _default;
export declare const Default: FC<{
    fundingSource: string;
}>;
export declare const RadioButtons: FC<{
    style: PayPalButtonsComponentOptions["style"];
}>;
