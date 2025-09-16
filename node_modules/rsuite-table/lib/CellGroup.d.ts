import React from 'react';
import type { StandardProps } from './types';
export interface CellGroupProps extends StandardProps {
    fixed?: 'left' | 'right';
    width?: number;
    height?: number;
    left?: number;
}
declare const CellGroup: React.ForwardRefExoticComponent<CellGroupProps & React.RefAttributes<HTMLDivElement>>;
export default CellGroup;
