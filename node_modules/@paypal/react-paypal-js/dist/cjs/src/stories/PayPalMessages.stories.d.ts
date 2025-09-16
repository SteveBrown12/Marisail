import React from "react";
import type { FC } from "react";
declare const _default: {
    id: string;
    title: string;
    component: React.FC<import("../index").PayPalMessagesComponentProps>;
    parameters: {
        controls: {
            expanded: boolean;
        };
        actions: {
            disable: boolean;
        };
        docs: {
            source: {
                type: string;
            };
        };
    };
    argTypes: {
        style: {
            table: {
                category: string;
            };
            description: string;
        };
        forceReRender: {
            table: {
                category: string;
            };
            control: null;
            description: string;
        };
        className: {
            table: {
                category: string;
            };
            control: null;
            description: string;
        };
        account: {
            table: {
                category: string;
            };
            control: null;
            description: string;
        };
        amount: {
            table: {
                category: string;
            };
            control: null;
            description: string;
        };
    };
    args: {
        style: {
            layout: string;
        };
    };
};
export default _default;
export declare const Default: FC<{
    style: {
        layout?: "text" | "flex" | "custom";
        color: string;
    };
}>;
