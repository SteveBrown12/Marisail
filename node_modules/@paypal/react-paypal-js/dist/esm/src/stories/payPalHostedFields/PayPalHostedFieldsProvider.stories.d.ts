import React from "react";
import type { FC, ReactElement } from "react";
import type { DocsContextProps } from "@storybook/addon-docs";
declare const _default: {
    title: string;
    component: React.FC<import("../../index").PayPalHostedFieldsComponentProps>;
    parameters: {
        controls: {
            expanded: boolean;
        };
        docs: {
            container: ({ context, }: {
                context: DocsContextProps;
            }) => ReactElement;
        };
    };
    argTypes: {
        styles: {
            table: {
                category: string;
            };
            control: {
                type: string;
                expanded: boolean;
            };
        };
        createOrder: {
            control: boolean;
            table: {
                category: string;
            };
        };
        notEligibleError: {
            table: {
                category: string;
            };
            control: boolean;
        };
    };
    args: {
        styles: {
            ".valid": {
                color: string;
            };
            ".invalid": {
                color: string;
            };
        };
    };
    decorators: ((Story: FC) => ReactElement)[];
};
export default _default;
export declare const Default: FC<{
    styles: {
        [key in string]: unknown;
    };
}>;
