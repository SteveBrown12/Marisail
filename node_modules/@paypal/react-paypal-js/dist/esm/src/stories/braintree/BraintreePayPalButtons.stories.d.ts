import React, { ReactElement } from "react";
import type { FC } from "react";
import type { PayPalButtonsComponentOptions, FUNDING_SOURCE } from "@paypal/paypal-js";
type StoryProps = {
    style: PayPalButtonsComponentOptions["style"];
    message: PayPalButtonsComponentOptions["message"];
    fundingSource: FUNDING_SOURCE;
    disabled: boolean;
    amount: string;
    currency: string;
};
declare const _default: {
    title: string;
    component: React.FC<import("../../index").BraintreePayPalButtonsComponentProps>;
    parameters: {
        controls: {
            expanded: boolean;
            sort: string;
        };
    };
    argTypes: {
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
        currency: {
            options: string[];
            description: string;
            control: {
                type: string;
            };
            table: {
                category: string;
                type: {
                    summary: string;
                };
                defaultValue: {
                    summary: string;
                };
            };
        };
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
        style: {
            table: {
                category: string;
            };
            control: {
                type: string;
                expanded: boolean;
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
                category: string;
            };
            control: boolean;
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
        amount: string;
        currency: string;
        size: number;
        style: {
            label: string;
            layout: string;
        };
        disabled: boolean;
    };
    decorators: ((Story: FC, storyArg: {
        args: {
            size: number;
        };
        originalStoryFn: {
            name: string;
        };
    }) => ReactElement)[];
};
export default _default;
export declare const Default: FC<StoryProps>;
export declare const BillingAgreement: FC<StoryProps>;
