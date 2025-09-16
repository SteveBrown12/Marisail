import type { RowDataType, RowKeyType } from '../types';
export default function findRowKeys<Row extends RowDataType, Key>(rows: readonly Row[], rowKey?: RowKeyType, expanded?: boolean): Key[];
