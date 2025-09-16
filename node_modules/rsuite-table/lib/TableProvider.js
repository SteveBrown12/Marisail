'use client';
"use strict";

exports.__esModule = true;
exports["default"] = exports.TableProvider = exports.TableContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var _utils = require("./utils");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
/**
 * Callback function type for translating DOM position.
 * @param style - The CSSStyleDeclaration object to modify.
 * @param x - The x-coordinate (optional).
 * @param y - The y-coordinate (optional).
 */

var TableContext = exports.TableContext = /*#__PURE__*/_react["default"].createContext({});
var TableProvider = exports.TableProvider = function TableProvider(props) {
  var children = props.children,
    _props$rtl = props.rtl,
    rtl = _props$rtl === void 0 ? (0, _utils.isRTL)() : _props$rtl,
    _props$hasCustomTreeC = props.hasCustomTreeCol,
    hasCustomTreeCol = _props$hasCustomTreeC === void 0 ? false : _props$hasCustomTreeC,
    isTree = props.isTree,
    classPrefix = props.classPrefix;
  var value = (0, _react.useMemo)(function () {
    return {
      setCssPosition: _utils.setCssPosition,
      rtl: rtl != null ? rtl : (0, _utils.isRTL)(),
      hasCustomTreeCol: hasCustomTreeCol,
      isTree: isTree,
      classPrefix: classPrefix
    };
  }, [rtl, hasCustomTreeCol, isTree, classPrefix]);
  return /*#__PURE__*/_react["default"].createElement(TableContext.Provider, {
    value: value
  }, children);
};
var _default = exports["default"] = TableProvider;