import React from 'react';
import { IconProps } from './Icon';
interface SvgIconProps {
    as: IconProps['as'];
    ariaLabel?: string;
    displayName?: string;
    category?: string;
}
declare function createSvgIcon({ as, ariaLabel, displayName, category }: SvgIconProps): React.ForwardRefExoticComponent<Omit<IconProps, "ref"> & React.RefAttributes<SVGElement>>;
export default createSvgIcon;
