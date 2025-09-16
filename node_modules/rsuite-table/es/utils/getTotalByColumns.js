'use client';
import React from 'react';
import isPlainObject from 'lodash/isPlainObject';
import getColumnProps from './getColumnProps';
function getTotalByColumns(columns) {
  var totalFlexGrow = 0;
  var totalWidth = 0;
  var _count = function count(items) {
    Array.from(items).forEach(function (column) {
      if (/*#__PURE__*/React.isValidElement(column)) {
        var _getColumnProps = getColumnProps(column),
          flexGrow = _getColumnProps.flexGrow,
          _getColumnProps$width = _getColumnProps.width,
          width = _getColumnProps$width === void 0 ? 0 : _getColumnProps$width;
        totalFlexGrow += flexGrow || 0;
        totalWidth += flexGrow ? 0 : width;
      } else if (Array.isArray(column)) {
        _count(column);
      }
    });
  };
  if (Array.isArray(columns)) {
    _count(columns);
  } else if (isPlainObject(columns)) {
    var _ref = columns && columns.props || {},
      flexGrow = _ref.flexGrow,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 0 : _ref$width;
    totalFlexGrow = flexGrow || 0;
    totalWidth = flexGrow ? 0 : width;
  }
  return {
    totalFlexGrow: totalFlexGrow,
    totalWidth: totalWidth
  };
}
export default getTotalByColumns;