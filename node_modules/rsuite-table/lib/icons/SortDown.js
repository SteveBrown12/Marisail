'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.SortDown = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var SortDown = exports.SortDown = /*#__PURE__*/(0, _react.forwardRef)(function SortDown(props, ref) {
  return /*#__PURE__*/_react["default"].createElement("svg", (0, _extends2["default"])({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ref: ref
  }, props), /*#__PURE__*/_react["default"].createElement("path", {
    d: "M8.5 14a.5.5 0 0 0 .394-.192l3.996-4.996a.5.5 0 1 0-.781-.625l-3.11 3.887V2.499a.5.5 0 0 0-1 0v9.575l-3.11-3.887a.5.5 0 1 0-.781.625l3.998 4.997.013.015a.5.5 0 0 0 .38.175z"
  }));
});