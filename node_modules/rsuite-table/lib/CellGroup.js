'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _react = _interopRequireDefault(require("react"));
var _hooks = require("./hooks");
var _excluded = ["fixed", "width", "left", "height", "style", "classPrefix", "className", "children"];
var CellGroup = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _withClassPrefix;
  var fixed = props.fixed,
    width = props.width,
    left = props.left,
    height = props.height,
    style = props.style,
    _props$classPrefix = props.classPrefix,
    classPrefix = _props$classPrefix === void 0 ? 'cell-group' : _props$classPrefix,
    className = props.className,
    children = props.children,
    rest = (0, _objectWithoutPropertiesLoose2["default"])(props, _excluded);
  var _useTable = (0, _hooks.useTable)(),
    setCssPosition = _useTable.setCssPosition;
  var _useClassNames = (0, _hooks.useClassNames)(classPrefix),
    withClassPrefix = _useClassNames.withClassPrefix,
    merge = _useClassNames.merge;
  var classes = merge(className, withClassPrefix((_withClassPrefix = {}, _withClassPrefix["fixed-" + fixed] = fixed, _withClassPrefix.scroll = !fixed, _withClassPrefix)));
  var styles = (0, _extends2["default"])({
    width: width,
    height: height
  }, style);
  setCssPosition === null || setCssPosition === void 0 || setCssPosition(styles, left, 0);
  return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({}, rest, {
    ref: ref,
    className: classes,
    style: styles
  }), children);
});
CellGroup.displayName = 'Table.CellGroup';
var _default = exports["default"] = CellGroup;