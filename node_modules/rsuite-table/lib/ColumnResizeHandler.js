'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _react = _interopRequireWildcard(require("react"));
var _clamp = _interopRequireDefault(require("lodash/clamp"));
var _DOMMouseMoveTracker = _interopRequireDefault(require("dom-lib/DOMMouseMoveTracker"));
var _hooks = require("./hooks");
var _constants = require("./constants");
var _excluded = ["columnLeft", "classPrefix", "height", "className", "style", "columnFixed", "defaultColumnWidth", "minWidth", "onColumnResizeStart", "onColumnResizeMove", "onColumnResizeEnd"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var ColumnResizeHandler = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _extends2;
  var _props$columnLeft = props.columnLeft,
    columnLeft = _props$columnLeft === void 0 ? 0 : _props$columnLeft,
    _props$classPrefix = props.classPrefix,
    classPrefix = _props$classPrefix === void 0 ? 'column-resize-spanner' : _props$classPrefix,
    height = props.height,
    className = props.className,
    style = props.style,
    columnFixed = props.columnFixed,
    defaultColumnWidth = props.defaultColumnWidth,
    minWidth = props.minWidth,
    onColumnResizeStart = props.onColumnResizeStart,
    onColumnResizeMove = props.onColumnResizeMove,
    onColumnResizeEnd = props.onColumnResizeEnd,
    rest = (0, _objectWithoutPropertiesLoose2["default"])(props, _excluded);
  var _useTable = (0, _hooks.useTable)(),
    rtl = _useTable.rtl;
  var _useClassNames = (0, _hooks.useClassNames)(classPrefix),
    withClassPrefix = _useClassNames.withClassPrefix,
    merge = _useClassNames.merge;
  var classes = merge(className, withClassPrefix());
  var columnWidth = (0, _react.useRef)(defaultColumnWidth || 0);
  var mouseMoveTracker = (0, _react.useRef)();
  var isKeyDown = (0, _react.useRef)();
  var cursorDelta = (0, _react.useRef)(0);
  var handleMove = (0, _react.useCallback)(function (deltaX) {
    if (!isKeyDown.current) {
      return;
    }
    cursorDelta.current += deltaX;
    columnWidth.current = (0, _clamp["default"])((defaultColumnWidth || 0) + (rtl ? -cursorDelta.current : cursorDelta.current), minWidth ? Math.max(minWidth, _constants.RESIZE_MIN_WIDTH) : _constants.RESIZE_MIN_WIDTH, 20000);
    onColumnResizeMove === null || onColumnResizeMove === void 0 || onColumnResizeMove(columnWidth.current, columnLeft, columnFixed);
  }, [columnFixed, columnLeft, defaultColumnWidth, minWidth, onColumnResizeMove, rtl]);
  var handleColumnResizeEnd = (0, _react.useCallback)(function () {
    var _mouseMoveTracker$cur, _mouseMoveTracker$cur2;
    isKeyDown.current = false;
    onColumnResizeEnd === null || onColumnResizeEnd === void 0 || onColumnResizeEnd(columnWidth.current, cursorDelta.current);
    (_mouseMoveTracker$cur = mouseMoveTracker.current) === null || _mouseMoveTracker$cur === void 0 || (_mouseMoveTracker$cur2 = _mouseMoveTracker$cur.releaseMouseMoves) === null || _mouseMoveTracker$cur2 === void 0 || _mouseMoveTracker$cur2.call(_mouseMoveTracker$cur);
    mouseMoveTracker.current = null;
  }, [onColumnResizeEnd]);
  var getMouseMoveTracker = (0, _react.useCallback)(function () {
    return mouseMoveTracker.current || new _DOMMouseMoveTracker["default"](handleMove, handleColumnResizeEnd, document.body);
  }, [handleColumnResizeEnd, handleMove]);
  var handleColumnResizeMouseDown = (0, _react.useCallback)(function (event) {
    mouseMoveTracker.current = getMouseMoveTracker();
    mouseMoveTracker.current.captureMouseMoves(event);
    isKeyDown.current = true;
    cursorDelta.current = 0;
    var client = {
      clientX: event.clientX,
      clientY: event.clientY,
      preventDefault: Function()
    };
    onColumnResizeStart === null || onColumnResizeStart === void 0 || onColumnResizeStart(client);
  }, [getMouseMoveTracker, onColumnResizeStart]);
  (0, _react.useEffect)(function () {
    return function () {
      var _mouseMoveTracker$cur3;
      (_mouseMoveTracker$cur3 = mouseMoveTracker.current) === null || _mouseMoveTracker$cur3 === void 0 || _mouseMoveTracker$cur3.releaseMouseMoves();
      mouseMoveTracker.current = null;
    };
  }, []);
  if (columnFixed === 'right') {
    return null;
  }
  var styles = (0, _extends3["default"])((_extends2 = {}, _extends2[rtl ? 'right' : 'left'] = columnWidth.current + columnLeft - 2, _extends2.height = height, _extends2), style);
  return /*#__PURE__*/_react["default"].createElement("div", (0, _extends3["default"])({
    tabIndex: -1,
    role: "button",
    ref: ref
  }, rest, {
    className: classes,
    style: styles,
    onMouseDown: handleColumnResizeMouseDown
  }));
});
ColumnResizeHandler.displayName = 'Table.ColumnResizeHandler';
var _default = exports["default"] = ColumnResizeHandler;