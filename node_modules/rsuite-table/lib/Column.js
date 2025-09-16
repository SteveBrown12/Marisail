'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = exports.columnHandledProps = void 0;
var _react = _interopRequireDefault(require("react"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Column(_props) {
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null);
}
Column.displayName = 'Table.Column';
Column.defaultProps = {
  width: 100
};
var columnHandledProps = exports.columnHandledProps = ['align', 'verticalAlign', 'width', 'fixed', 'resizable', 'sortable', 'flexGrow', 'minWidth', 'colSpan', 'rowSpan', 'treeCol', 'onResize', 'children', 'fullText'];
var _default = exports["default"] = Column;