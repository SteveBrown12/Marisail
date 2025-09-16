import type { ReactElement } from "react";
import type { SandpackPredefinedTemplate, SandpackFile } from "@codesandbox/sandpack-react/dist/types/types";
import "@codesandbox/sandpack-react/dist/index.css";
/**
 * Custom component to adjust the Sandpack react library UI to the
 * storybook requirements for a better user experience
 *
 * @param props to modify the UI behavior and source files
 * @returns a ReactElement with the customized Sandpack component
 */
declare const CustomSandpack: (props: {
    template?: SandpackPredefinedTemplate;
    files?: Record<string, SandpackFile>;
    customSetup?: Record<string, unknown>;
    showLineNumbers?: boolean;
    previewHeight?: string;
    codeHeight?: string;
}) => ReactElement;
export default CustomSandpack;
