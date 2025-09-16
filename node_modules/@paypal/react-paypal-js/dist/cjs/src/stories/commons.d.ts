import type { FC } from "react";
/**
 * Functional component to render a custom ineligible error UI
 */
export declare const InEligibleError: FC<{
    text?: string;
}>;
export declare const defaultProps: {
    onInit(): void;
    onClick(): void;
    onError(err: Record<string, unknown>): void;
    onCancel(): void;
};
