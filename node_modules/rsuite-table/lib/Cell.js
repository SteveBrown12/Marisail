'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends4 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _react = _interopRequireWildcard(require("react"));
var _omit = _interopRequireDefault(require("lodash/omit"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _get = _interopRequireDefault(require("lodash/get"));
var _constants = require("./constants");
var _utils = require("./utils");
var _hooks = require("./hooks");
var _ArrowRight = require("./icons/ArrowRight");
var _Column = require("./Column");
var _excluded = ["classPrefix", "width", "left", "headerHeight", "depth", "height", "style", "className", "fullText", "firstColumn", "lastColumn", "isHeaderCell", "align", "children", "rowData", "dataKey", "rowIndex", "removed", "rowKey", "rowSpan", "wordWrap", "verticalAlign", "expanded", "treeCol", "hasChildren", "predefinedStyle", "renderCell", "renderTreeToggle", "onClick", "onTreeToggle"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var groupKeys = ['groupCount', 'groupHeader', 'groupHeaderHeight', 'groupAlign', 'groupVerticalAlign', 'renderSortIcon'];
var Cell = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _extends2, _extends3;
  var _props$classPrefix = props.classPrefix,
    classPrefix = _props$classPrefix === void 0 ? 'cell' : _props$classPrefix,
    _props$width = props.width,
    width = _props$width === void 0 ? 0 : _props$width,
    _props$left = props.left,
    left = _props$left === void 0 ? 0 : _props$left,
    _props$headerHeight = props.headerHeight,
    headerHeight = _props$headerHeight === void 0 ? _constants.ROW_HEADER_HEIGHT : _props$headerHeight,
    _props$depth = props.depth,
    depth = _props$depth === void 0 ? 0 : _props$depth,
    _props$height = props.height,
    height = _props$height === void 0 ? _constants.ROW_HEIGHT : _props$height,
    style = props.style,
    className = props.className,
    fullText = props.fullText,
    firstColumn = props.firstColumn,
    lastColumn = props.lastColumn,
    isHeaderCell = props.isHeaderCell,
    align = props.align,
    children = props.children,
    rowData = props.rowData,
    dataKey = props.dataKey,
    rowIndex = props.rowIndex,
    removed = props.removed,
    rowKey = props.rowKey,
    rowSpan = props.rowSpan,
    wordWrap = props.wordWrap,
    verticalAlign = props.verticalAlign,
    expanded = props.expanded,
    treeCol = props.treeCol,
    hasChildren = props.hasChildren,
    predefinedStyle = props.predefinedStyle,
    renderCell = props.renderCell,
    renderTreeToggle = props.renderTreeToggle,
    onClick = props.onClick,
    onTreeToggle = props.onTreeToggle,
    rest = (0, _objectWithoutPropertiesLoose2["default"])(props, _excluded);
  var _useTable = (0, _hooks.useTable)(),
    rtl = _useTable.rtl,
    hasCustomTreeCol = _useTable.hasCustomTreeCol,
    isTree = _useTable.isTree;
  var isTreeCol = treeCol || !hasCustomTreeCol && firstColumn && isTree;
  var cellHeight = typeof height === 'function' ? rowData ? height(rowData) : _constants.ROW_HEIGHT : height;
  if (isTreeCol && !isHeaderCell && !rowData) {
    throw new Error('[Table.Cell]: `rowData` is required for tree column');
  }
  var handleTreeToggle = (0, _react.useCallback)(function (event) {
    onTreeToggle === null || onTreeToggle === void 0 || onTreeToggle(rowKey, rowIndex, rowData, event);
  }, [onTreeToggle, rowData, rowIndex, rowKey]);
  var _useClassNames = (0, _hooks.useClassNames)(classPrefix),
    withClassPrefix = _useClassNames.withClassPrefix,
    merge = _useClassNames.merge,
    prefix = _useClassNames.prefix;
  var classes = merge(className, withClassPrefix({
    expanded: expanded && isTreeCol,
    first: firstColumn,
    last: lastColumn,
    rowspan: rowSpan && !isHeaderCell,
    'full-text': fullText
  }));
  var nextHeight = isHeaderCell ? headerHeight : cellHeight;
  var styles = (0, _extends4["default"])({}, predefinedStyle, (_extends2 = {}, _extends2[fullText ? 'minWidth' : 'width'] = width, _extends2.height = nextHeight, _extends2.zIndex = depth, _extends2[rtl ? 'right' : 'left'] = left, _extends2));
  var paddingKey = rtl ? 'paddingRight' : 'paddingLeft';
  var contentStyles = (0, _extends4["default"])({}, (0, _utils.convertToFlex)({
    align: align,
    verticalAlign: verticalAlign
  }), style, (_extends3 = {
    width: fullText ? width - 1 : width,
    height: nextHeight
  }, _extends3[paddingKey] = isTreeCol ? depth * _constants.LAYER_WIDTH + 10 : (style === null || style === void 0 ? void 0 : style[paddingKey]) || (style === null || style === void 0 ? void 0 : style.padding), _extends3));
  if (wordWrap) {
    contentStyles.wordBreak = typeof wordWrap === 'boolean' ? 'break-all' : wordWrap;
    contentStyles.overflowWrap = wordWrap === 'break-word' ? wordWrap : undefined;
  }
  var cellContent = null;
  if (typeof children === 'function') {
    if (!rowData) {
      cellContent = null;
    } else {
      cellContent = children(rowData, rowIndex);
    }
  } else if ((0, _isNil["default"])(children)) {
    if (rowData && dataKey) {
      cellContent = (0, _get["default"])(rowData, dataKey);
    }
  } else {
    cellContent = children;
  }
  var renderTreeNodeExpandIcon = function renderTreeNodeExpandIcon() {
    var expandButton = /*#__PURE__*/_react["default"].createElement(_ArrowRight.ArrowRight, {
      className: prefix('expand-icon'),
      "data-expanded": expanded
    });
    if (isTreeCol && hasChildren) {
      return /*#__PURE__*/_react["default"].createElement("span", {
        role: "button",
        tabIndex: -1,
        className: prefix('expand-wrapper'),
        onClick: handleTreeToggle
      }, renderTreeToggle ? renderTreeToggle(expandButton, rowData, expanded) : expandButton);
    }
    return null;
  };
  var content = wordWrap ? /*#__PURE__*/_react["default"].createElement("div", {
    className: prefix('wrap')
  }, renderTreeNodeExpandIcon(), renderCell ? renderCell(cellContent) : cellContent) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, renderTreeNodeExpandIcon(), renderCell ? renderCell(cellContent) : cellContent);
  if (removed) {
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement("div", (0, _extends4["default"])({
    ref: ref,
    role: isHeaderCell ? 'columnheader' : 'gridcell'
  }, (0, _omit["default"])(rest, [].concat(groupKeys, _Column.columnHandledProps)), {
    onClick: onClick,
    className: classes,
    style: styles
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: prefix('content'),
    style: contentStyles
  }, content));
});
Cell.displayName = 'Table.Cell';
var _default = exports["default"] = Cell;