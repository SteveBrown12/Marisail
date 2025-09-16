'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _react = _interopRequireDefault(require("react"));
var _utils = require("./utils");
var _hooks = require("./hooks");
var _constants = require("./constants");
var _excluded = ["classPrefix", "height", "headerHeight", "className", "width", "top", "style", "isHeaderRow", "rowRef", "children", "rowSpan"];
var Row = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _props$classPrefix = props.classPrefix,
    classPrefix = _props$classPrefix === void 0 ? 'row' : _props$classPrefix,
    _props$height = props.height,
    height = _props$height === void 0 ? _constants.ROW_HEIGHT : _props$height,
    _props$headerHeight = props.headerHeight,
    headerHeight = _props$headerHeight === void 0 ? _constants.ROW_HEADER_HEIGHT : _props$headerHeight,
    className = props.className,
    width = props.width,
    top = props.top,
    style = props.style,
    isHeaderRow = props.isHeaderRow,
    rowRef = props.rowRef,
    children = props.children,
    rowSpan = props.rowSpan,
    rest = (0, _objectWithoutPropertiesLoose2["default"])(props, _excluded);
  var _useTable = (0, _hooks.useTable)(),
    setCssPosition = _useTable.setCssPosition;
  var _useClassNames = (0, _hooks.useClassNames)(classPrefix),
    withClassPrefix = _useClassNames.withClassPrefix,
    merge = _useClassNames.merge;
  var classes = merge(className, withClassPrefix({
    header: isHeaderRow,
    rowspan: rowSpan
  }));
  var styles = (0, _extends2["default"])({
    minWidth: width,
    height: isHeaderRow ? headerHeight : height
  }, style);
  setCssPosition === null || setCssPosition === void 0 || setCssPosition(styles, 0, top);
  return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
    role: "row"
  }, rest, {
    ref: (0, _utils.mergeRefs)(rowRef, ref),
    className: classes,
    style: styles
  }), children);
});
Row.displayName = 'Table.Row';
var _default = exports["default"] = Row;