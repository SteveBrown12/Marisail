import React from 'react';
export declare function isFragment(children: React.ReactNode): boolean;
export declare function isElement(children: React.ReactNode): children is React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
