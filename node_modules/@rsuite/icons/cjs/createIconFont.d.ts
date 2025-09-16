import React from 'react';
import { IconProps } from './Icon';
export interface Options {
    /** Icon script url */
    scriptUrl?: string | string[];
    /** Common props for Icon */
    commonProps?: React.SVGProps<SVGElement>;
    /** Loaded callback */
    onLoaded?(): void;
}
export interface IconFontProps extends IconProps {
    /** Icon name in IconFont */
    icon: string;
}
declare function createIconFont({ scriptUrl, commonProps, onLoaded }?: Options): React.ForwardRefExoticComponent<Omit<IconFontProps, "ref"> & React.RefAttributes<SVGElement>>;
export default createIconFont;
