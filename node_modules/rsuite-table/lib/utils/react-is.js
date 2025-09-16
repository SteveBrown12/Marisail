'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.isElement = isElement;
exports.isFragment = isFragment;
var _react = _interopRequireDefault(require("react"));
function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    return object.type || object.$$typeof;
  }
}
function isFragment(children) {
  return _react["default"].Children.count(children) === 1 && typeOf(children) === Symbol["for"]('react.fragment');
}
function isElement(children) {
  return /*#__PURE__*/_react["default"].isValidElement(children);
}