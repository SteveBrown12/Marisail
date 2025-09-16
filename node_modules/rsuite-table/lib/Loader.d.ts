import React from 'react';
import type { TableLocaleType } from './types';
interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    locale?: TableLocaleType;
    loadAnimation?: boolean;
    loading?: boolean;
    addPrefix: (...classes: any) => string;
    renderLoading?: (loading: React.ReactNode) => any;
}
declare const Loader: React.ForwardRefExoticComponent<LoaderProps & React.RefAttributes<HTMLDivElement>>;
export default Loader;
