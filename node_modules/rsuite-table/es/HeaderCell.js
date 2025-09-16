'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["className", "classPrefix", "width", "dataKey", "headerHeight", "children", "left", "sortable", "sortColumn", "sortType", "groupHeader", "resizable", "fixed", "minWidth", "index", "flexGrow", "align", "verticalAlign", "onColumnResizeEnd", "onResize", "onColumnResizeStart", "onColumnResizeMove", "onSortColumn", "renderSortIcon"];
import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import ColumnResizeHandler from './ColumnResizeHandler';
import Cell from './Cell';
import { Sort } from './icons/Sort';
import { SortDown } from './icons/SortDown';
import { useUpdateEffect, useClassNames } from './hooks';
var HeaderCell = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var className = props.className,
    _props$classPrefix = props.classPrefix,
    classPrefix = _props$classPrefix === void 0 ? 'cell-header' : _props$classPrefix,
    width = props.width,
    dataKey = props.dataKey,
    headerHeight = props.headerHeight,
    children = props.children,
    left = props.left,
    sortable = props.sortable,
    sortColumn = props.sortColumn,
    sortType = props.sortType,
    groupHeader = props.groupHeader,
    resizable = props.resizable,
    fixed = props.fixed,
    minWidth = props.minWidth,
    index = props.index,
    flexGrow = props.flexGrow,
    align = props.align,
    verticalAlign = props.verticalAlign,
    onColumnResizeEnd = props.onColumnResizeEnd,
    onResize = props.onResize,
    onColumnResizeStart = props.onColumnResizeStart,
    onColumnResizeMove = props.onColumnResizeMove,
    onSortColumn = props.onSortColumn,
    renderSortIcon = props.renderSortIcon,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  var _useState = useState(isNil(flexGrow) ? width : 0),
    columnWidth = _useState[0],
    setColumnWidth = _useState[1];
  useUpdateEffect(function () {
    setColumnWidth(isNil(flexGrow) ? width : 0);
  }, [flexGrow, width]);
  var _useClassNames = useClassNames(classPrefix),
    withClassPrefix = _useClassNames.withClassPrefix,
    merge = _useClassNames.merge,
    prefix = _useClassNames.prefix;
  var classes = merge(className, withClassPrefix({
    sortable: sortable
  }));
  var ariaSort;
  if (sortColumn === dataKey) {
    ariaSort = 'other';
    if (sortType === 'asc') {
      ariaSort = 'ascending';
    } else if (sortType === 'desc') {
      ariaSort = 'descending';
    }
  }
  var handleClick = useCallback(function () {
    if (sortable) {
      onSortColumn === null || onSortColumn === void 0 || onSortColumn(dataKey);
    }
  }, [dataKey, onSortColumn, sortable]);
  var handleColumnResizeStart = useCallback(function () {
    onColumnResizeStart === null || onColumnResizeStart === void 0 || onColumnResizeStart(columnWidth, left, !!fixed);
  }, [columnWidth, fixed, left, onColumnResizeStart]);
  var handleColumnResizeEnd = useCallback(function (nextColumnWidth, cursorDelta) {
    setColumnWidth(nextColumnWidth);
    onColumnResizeEnd === null || onColumnResizeEnd === void 0 || onColumnResizeEnd(nextColumnWidth, cursorDelta, dataKey, index);
    onResize === null || onResize === void 0 || onResize(nextColumnWidth, dataKey);
  }, [dataKey, index, onColumnResizeEnd, onResize]);
  var renderSortColumn = function renderSortColumn() {
    if (sortable && !groupHeader) {
      var SortIcon = sortColumn === dataKey && sortType ? SortDown : Sort;
      var iconClasses = classNames(prefix('icon-sort'));
      var sortIcon = renderSortIcon ? renderSortIcon(sortColumn === dataKey ? sortType : undefined) : /*#__PURE__*/React.createElement(SortIcon, {
        className: iconClasses,
        "data-sort": sortType
      });
      return /*#__PURE__*/React.createElement("span", {
        className: prefix('sort-wrapper')
      }, sortIcon);
    }
    return null;
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classes
  }, /*#__PURE__*/React.createElement(Cell, _extends({
    "aria-sort": ariaSort
  }, rest, {
    width: width,
    dataKey: dataKey,
    left: left,
    headerHeight: headerHeight,
    isHeaderCell: true,
    align: !groupHeader ? align : undefined,
    verticalAlign: !groupHeader ? verticalAlign : undefined,
    onClick: !groupHeader ? handleClick : undefined
  }), children, renderSortColumn()), resizable ? /*#__PURE__*/React.createElement(ColumnResizeHandler, {
    defaultColumnWidth: columnWidth,
    key: columnWidth,
    columnLeft: left,
    columnFixed: fixed,
    height: headerHeight ? headerHeight - 1 : undefined,
    minWidth: minWidth,
    onColumnResizeMove: onColumnResizeMove,
    onColumnResizeStart: handleColumnResizeStart,
    onColumnResizeEnd: handleColumnResizeEnd
  }) : null);
});
HeaderCell.displayName = 'HeaderCell';
export default HeaderCell;