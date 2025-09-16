import type { FC, ReactElement } from "react";
declare const _default: {
    id: string;
    title: string;
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
        controls: {
            expanded: boolean;
        };
    };
    argTypes: {
        type: {
            control: string;
            options: string[];
            table: {
                category: string;
                type: {
                    summary: string;
                };
                defaultValue: {
                    summary: string;
                };
            };
            description: string;
        };
    };
    args: {
        type: string;
    };
    decorators: ((Story: FC, storyArgs: {
        args: {
            type: string;
        };
    }) => ReactElement)[];
};
export default _default;
export declare const Default: FC<{
    type: string;
}>;
