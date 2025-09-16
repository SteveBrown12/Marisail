import React from "react";
import type { FC, ReactElement } from "react";
import type { PayPalButtonsComponentOptions, FUNDING_SOURCE } from "@paypal/paypal-js";
type StoryProps = {
    style: PayPalButtonsComponentOptions["style"];
    message: PayPalButtonsComponentOptions["message"];
    fundingSource: FUNDING_SOURCE;
    disabled: boolean;
    showSpinner: boolean;
};
declare const _default: {
    id: string;
    title: string;
    component: React.FunctionComponent<import("../../index").PayPalButtonsComponentProps>;
    parameters: {
        controls: {
            expanded: boolean;
            sort: string;
        };
    };
    argTypes: {
        size: {
            name: string;
            description: string;
            control: {
                type: string;
                min: number;
                max: number;
                step: number;
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
        showSpinner: {
            description: string;
            options: boolean[];
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
            table: {
                category: string;
            };
            control: {
                type: string;
            };
        };
        message: {
            table: {
                category: string;
            };
            control: {
                type: string;
            };
        };
        disabled: {
            table: {
                category: string;
            };
            options: boolean[];
            control: {
                type: string;
            };
        };
        forceReRender: {
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
        children: {
            table: {
                disable: boolean;
            };
        };
        fundingSource: {
            table: {
                category: string;
            };
            options: (string | undefined)[];
            control: {
                type: string;
                labels: {
                    undefined: string;
                };
            };
        };
        createOrder: {
            table: {
                category: string;
            };
        };
        createBillingAgreement: {
            table: {
                category: string;
            };
        };
        createSubscription: {
            table: {
                category: string;
            };
        };
        onShippingChange: {
            table: {
                category: string;
            };
        };
        onShippingAddressChange: {
            table: {
                category: string;
            };
        };
        onShippingOptionsChange: {
            table: {
                category: string;
            };
        };
        onApprove: {
            table: {
                category: string;
            };
        };
        onCancel: {
            table: {
                category: string;
            };
        };
        onClick: {
            table: {
                category: string;
            };
        };
        onInit: {
            table: {
                category: string;
            };
        };
        onError: {
            table: {
                category: string;
            };
        };
    };
    args: {
        onShippingChange: null;
        size: number;
        showSpinner: boolean;
        style: {
            layout: string;
        };
        disabled: boolean;
    };
    decorators: ((Story: FC, storyArg: {
        args: {
            size: number;
        };
    }) => ReactElement)[];
};
export default _default;
export declare const Default: FC<StoryProps>;
export declare const Donate: FC<Omit<StoryProps, "showSpinner" | "fundingSource">>;
export declare const WithDynamicOrderState: FC<StoryProps>;
