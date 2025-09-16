import React from 'react';
import type { RowDataType } from '../types';
import type { ColumnProps } from '../Column';
declare function getTotalByColumns<Row extends RowDataType>(columns: React.ReactElement<ColumnProps<Row>> | React.ReactElement<ColumnProps<Row>>[]): {
    totalFlexGrow: number;
    totalWidth: number;
};
export default getTotalByColumns;
