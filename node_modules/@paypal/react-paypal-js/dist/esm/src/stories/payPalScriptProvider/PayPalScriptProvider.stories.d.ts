import React from "react";
import type { FC } from "react";
declare const _default: {
    id: string;
    title: string;
    component: React.FC<import("../../index").ScriptProviderProps>;
    parameters: {
        controls: {
            expanded: boolean;
        };
    };
    argTypes: {
        deferLoading: {
            options: boolean[];
            control: {
                type: string;
            };
            description: string;
            table: {
                category: string;
            };
        };
        options: {
            control: {
                disable: boolean;
            };
            table: {
                category: string;
            };
        };
    };
    args: {
        deferLoading: boolean;
    };
};
export default _default;
export declare const Default: FC<{
    deferLoading: boolean;
}>;
