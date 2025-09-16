'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _flatten = _interopRequireDefault(require("lodash/flatten"));
var _ColumnGroup = _interopRequireDefault(require("../ColumnGroup"));
var _reactIs = require("./react-is");
/**
 * Get the columns ReactElement array.
 * - Handling the case where there is an array of <Column> in children.
 * - Filter empty items in children.
 */
function getTableColumns(children) {
  var childrenArray = Array.isArray(children) ? children : [children];
  var flattenColumns = (0, _flatten["default"])(childrenArray).map(function (column) {
    // If the column is a group, we need to get the columns from the children.
    if (column && column.type === _ColumnGroup["default"]) {
      var _ref = column.props || {},
        header = _ref.header,
        groupChildren = _ref.children,
        align = _ref.align,
        fixed = _ref.fixed,
        verticalAlign = _ref.verticalAlign,
        groupHeaderHeight = _ref.groupHeaderHeight;
      var childColumns = getTableColumns(groupChildren);
      return childColumns.map(function (childColumn, index) {
        // Overwrite the props set by ColumnGroup to Column.
        var groupCellProps = (0, _extends2["default"])({}, childColumn && childColumn.props, {
          groupHeaderHeight: groupHeaderHeight,
          fixed: fixed,
          // Column extends the properties of Group （align，verticalAlign）
          align: childColumn && childColumn.props && childColumn.props.align || align,
          verticalAlign: childColumn && childColumn.props && childColumn.props.verticalAlign || verticalAlign
        });

        /**
         * Set attributes for the first column in the group:
         * @field groupCount: The number of grouping sub-items.
         * @field groupHeader: Group header title.
         * @field resizable: Set to not resizable.
         */

        if (index === 0) {
          groupCellProps.groupAlign = align;
          groupCellProps.groupVerticalAlign = verticalAlign;
          groupCellProps.groupCount = childColumns.length;
          groupCellProps.groupHeader = header;
          groupCellProps.resizable = false;
        }
        return /*#__PURE__*/_react["default"].cloneElement(childColumn, groupCellProps);
      });
    } else if ((0, _reactIs.isFragment)(column)) {
      // If the column is a fragment, we need to get the columns from the children.
      return getTableColumns(column.props && column.props.children);
    } else if (Array.isArray(column)) {
      // If the column is an array, need check item in the array.
      return getTableColumns(column);
    }

    // If the column is not a group, we just return the column.
    return column;
  });

  // Flatten the array in Columns into a one-dimensional array, and calculate lastColumn and firstColumn.
  return (0, _flatten["default"])(flattenColumns).filter(Boolean);
}
var _default = exports["default"] = getTableColumns;