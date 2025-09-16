/// <reference types="react" />
import type { DocsContextProps } from "@storybook/addon-docs/dist/ts3.9/blocks";
/**
 * Component to override the default DocPage structure from the storybook
 *
 * @param param custom props and context
 * @returns an Element with the DocPage new structure
 */
declare const DocPageStructure: ({ context, code, options, }: {
    context: DocsContextProps;
    code: string;
    options?: {
        previewHeight: string;
        codeHeight: string;
    } | undefined;
}) => JSX.Element;
export default DocPageStructure;
