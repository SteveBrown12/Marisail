import React from 'react';
/**
 * Callback function type for translating DOM position.
 * @param style - The CSSStyleDeclaration object to modify.
 * @param x - The x-coordinate (optional).
 * @param y - The y-coordinate (optional).
 */
type TranslateDOMPositionXYCallback = (style: CSSStyleDeclaration, x?: number, y?: number) => void;
export interface TableContextProps {
    /** Indicates if the table is in RTL mode. */
    rtl: boolean;
    /** Indicates if there's a custom tree column. */
    hasCustomTreeCol?: boolean;
    /** Indicates if the table is in tree mode. */
    isTree?: boolean;
    /** Function to translate DOM position. */
    setCssPosition: TranslateDOMPositionXYCallback;
    /** Prefix for CSS classes. */
    classPrefix?: string;
}
export declare const TableContext: React.Context<TableContextProps>;
export declare const TableProvider: (props: React.PropsWithChildren<Partial<TableContextProps>>) => React.JSX.Element;
export default TableProvider;
