import React from 'react';
import type { TableLocaleType } from './types';
interface EmptyMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    locale?: TableLocaleType;
    loading?: boolean;
    addPrefix: (...classes: any) => string;
    renderEmpty?: (info: React.ReactNode) => any;
}
declare const EmptyMessage: React.ForwardRefExoticComponent<EmptyMessageProps & React.RefAttributes<HTMLDivElement>>;
export default EmptyMessage;
