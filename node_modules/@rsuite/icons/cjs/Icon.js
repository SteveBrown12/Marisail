"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _react = /*#__PURE__*/ _interop_require_default(require("react"));
var _classnames = /*#__PURE__*/ _interop_require_default(require("classnames"));
var _utils = require("./utils");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function filterProps(props) {
    var nextProps = {};
    Object.entries(props).forEach(function(param) {
        var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
        if (typeof value !== 'undefined') {
            nextProps[key] = value;
        }
    });
    return nextProps;
}
var Icon = /*#__PURE__*/ _react.default.forwardRef(function(props, ref) {
    var tmp = props.as, Component = tmp === void 0 ? 'svg' : tmp, spin = props.spin, pulse = props.pulse, flip = props.flip, _props_fill = props.fill, fill = _props_fill === void 0 ? 'currentColor' : _props_fill, className = props.className, rotate = props.rotate, children = props.children, viewBox = props.viewBox, _props_width = props.width, width = _props_width === void 0 ? '1em' : _props_width, _props_height = props.height, height = _props_height === void 0 ? '1em' : _props_height, style = props.style, rest = _object_without_properties(props, [
        "as",
        "spin",
        "pulse",
        "flip",
        "fill",
        "className",
        "rotate",
        "children",
        "viewBox",
        "width",
        "height",
        "style"
    ]);
    var _useClassNames = _sliced_to_array((0, _utils.useClassNames)(), 2), componentClassName = _useClassNames[0], addPrefix = _useClassNames[1];
    var _obj;
    var classes = (0, _classnames.default)(className, componentClassName, (_obj = {}, _define_property(_obj, addPrefix('spin'), spin), _define_property(_obj, addPrefix('pulse'), pulse), _define_property(_obj, addPrefix("flip-".concat(flip)), !!flip), _obj));
    var rotateStyles = {
        msTransform: "rotate(".concat(rotate, "deg)"),
        transform: "rotate(".concat(rotate, "deg)")
    };
    (0, _utils.useInsertStyles)();
    var svgProps = filterProps({
        width: width,
        height: height,
        fill: fill,
        viewBox: viewBox,
        className: classes,
        style: rotate ? _object_spread({}, rotateStyles, style) : style
    });
    return /*#__PURE__*/ _react.default.createElement(Component, _object_spread({
        "aria-hidden": true,
        focusable: false,
        ref: ref
    }, svgProps, rest), children);
});
Icon.displayName = 'Icon';
var _default = Icon;
