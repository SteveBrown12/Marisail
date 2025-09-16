import React from "react";
import type { CSSProperties, FC, ReactElement } from "react";
type StoryProps = {
    amount: string;
    styles: Record<string, unknown>;
    style: CSSProperties;
};
declare const _default: {
    title: string;
    component: React.FC<import("../../index").PayPalHostedFieldProps>;
    parameters: {
        controls: {
            expanded: boolean;
            sort: string;
        };
    };
    argTypes: {
        hostedFieldType: {
            table: {
                category: string;
            };
            control: boolean;
        };
        options: {
            table: {
                category: string;
            };
            control: boolean;
        };
        align: {
            table: {
                category: string;
            };
            control: boolean;
        };
        className: {
            table: {
                category: string;
            };
            control: boolean;
        };
        id: {
            table: {
                category: string;
            };
            control: boolean;
        };
        lang: {
            table: {
                category: string;
            };
            control: boolean;
        };
        styles: {
            type: {
                summary: string;
            };
            table: {
                category: string;
            };
            description: string;
            control: {
                type: string;
            };
        };
        title: {
            table: {
                category: string;
            };
            control: boolean;
        };
        amount: {
            description: string;
            options: string[];
            control: {
                type: string;
            };
            table: {
                defaultValue: {
                    summary: string;
                };
                category: string;
                type: {
                    summary: string;
                };
            };
        };
        style: {
            type: {
                summary: string;
            };
            table: {
                category: string;
            };
            description: string;
            control: {
                type: string;
            };
        };
        PAYPAL_HOSTED_FIELDS_TYPES: {
            control: boolean;
            type: {
                required: boolean;
            };
            description: string;
            table: {
                category: string;
            };
        };
        PayPalHostedFieldOptions: {
            control: boolean;
            type: {
                required: boolean;
            };
            description: string;
            table: {
                category: string;
            };
        };
    };
    args: {
        amount: string;
        styles: {
            ".valid": {
                color: string;
            };
            ".invalid": {
                color: string;
            };
            input: {
                "font-family": string;
                "font-size": string;
            };
        };
        style: {
            border: string;
            boxShadow: string;
        };
    };
    decorators: ((Story: FC) => ReactElement)[];
};
export default _default;
export declare const Default: FC<StoryProps>;
export declare const ExpirationDate: FC<{
    amount: string;
}>;
