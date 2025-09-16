import React from 'react';
import type { StandardProps } from './types';
export interface ColumnGroupProps extends StandardProps {
    /** Alignment */
    align?: 'left' | 'center' | 'right';
    /** Vertical alignment */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /** Fixed column */
    fixed?: boolean | 'left' | 'right';
    /**
     * Height of the merged cell group header.
     * The default value is half of the table's `headerHeight`.
     **/
    groupHeaderHeight?: number;
    /** Group header */
    header?: React.ReactNode;
    /** Width */
    width?: number;
    /** Header height */
    headerHeight?: number;
}
declare const ColumnGroup: React.ForwardRefExoticComponent<ColumnGroupProps & React.RefAttributes<HTMLDivElement>>;
export default ColumnGroup;
