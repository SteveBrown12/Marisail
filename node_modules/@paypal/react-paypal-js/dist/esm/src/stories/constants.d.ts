export declare const COMPONENT_PROPS_CATEGORY: {
    table: {
        category: string;
    };
};
export declare const COMPONENT_EVENTS = "Events";
export declare const COMPONENT_TYPES = "Types";
export declare const ORDER_ID = "orderID";
export declare const ERROR = "Error";
export declare const SDK = "SDK";
export declare const APPROVE = "approve";
export declare const SUBSCRIPTION = "subscription";
export declare const ORDER_INSTANCE_ERROR = "No order instance was provided";
export declare const CONTAINER_SIZE: {
    name: string;
    description: string;
    control: {
        type: string;
        min: number;
        max: number;
        step: number;
    };
    table: {
        defaultValue: {
            summary: string;
        };
        category: string;
        type: {
            summary: string;
        };
    };
};
export declare const ARG_TYPE_AMOUNT: {
    description: string;
    options: string[];
    control: {
        type: string;
    };
    table: {
        defaultValue: {
            summary: string;
        };
        category: string;
        type: {
            summary: string;
        };
    };
};
export declare const ARG_TYPE_CURRENCY: {
    options: string[];
    description: string;
    control: {
        type: string;
    };
    table: {
        category: string;
        type: {
            summary: string;
        };
        defaultValue: {
            summary: string;
        };
    };
};
export declare const FUNDING_SOURCE_ARG: {
    table: {
        category: string;
    };
    options: (string | undefined)[];
    control: {
        type: string;
        labels: {
            undefined: string;
        };
    };
};
export declare const SANDPACK_STYLES = "body {\n    font-family: sans-serif;\n    -webkit-font-smoothing: auto;\n    -moz-font-smoothing: auto;\n    -moz-osx-font-smoothing: grayscale;\n    font-smoothing: auto;\n    text-rendering: optimizeLegibility;\n    font-smooth: always;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-touch-callout: none;\n}\n\n.card-field {\n    width: 100%;\n    padding: 12px;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    box-sizing: border-box;\n    margin-top: 6px;\n    margin-bottom: 16px;\n    resize: vertical;\n    height: 40px;\n    background: white;\n    font-size: 17px;\n    color: #3a3a3a;\n    font-family: helvetica, tahoma, calibri, sans-serif;\n}\n\n.btn {\n    display: inline-block;\n    font-weight: 400;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    border: 1px solid transparent;\n    padding: 0.375rem 0.75rem;\n    font-size: 1rem;\n    line-height: 1.5;\n    border-radius: 0.25rem;\n    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,\n        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    cursor: pointer;\n}\n\n.btn-primary {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff;\n}\n\n.mark {\n    display: flex;\n    align-items: center;\n}\n.spinner {\n    display: inline-block;\n    height: 40px;\n    width: 40px;\n    box-sizing: border-box;\n    border: 3px solid rgba(0, 0, 0, 0.2);\n    border-top-color: rgba(33, 128, 192, 0.8);\n    border-radius: 100%;\n    animation: rotation 0.7s infinite linear;\n}\n\n.spinner.tiny {\n    height: 20px;\n    width: 20px;\n    border-top-color: #007bff;\n    position: relative;\n    top: 3px;\n}\n\n@keyframes rotation {\n    0% {\n        transform: rotate(0deg);\n    }\n    100% {\n        transform: rotate(359deg);\n    }\n}";
