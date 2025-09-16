'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.useTable = exports["default"] = void 0;
var _react = require("react");
var _TableProvider = require("../TableProvider");
var _setCssPosition = _interopRequireDefault(require("../utils/setCssPosition"));
var _isRTL = _interopRequireDefault(require("../utils/isRTL"));
var useTable = exports.useTable = function useTable() {
  var _useContext = (0, _react.useContext)(_TableProvider.TableContext),
    _useContext$setCssPos = _useContext.setCssPosition,
    setCssPosition = _useContext$setCssPos === void 0 ? _setCssPosition["default"] : _useContext$setCssPos,
    _useContext$rtl = _useContext.rtl,
    rtl = _useContext$rtl === void 0 ? (0, _isRTL["default"])() : _useContext$rtl,
    hasCustomTreeCol = _useContext.hasCustomTreeCol,
    isTree = _useContext.isTree,
    classPrefix = _useContext.classPrefix;
  return {
    setCssPosition: setCssPosition,
    rtl: rtl,
    hasCustomTreeCol: hasCustomTreeCol,
    isTree: isTree,
    classPrefix: classPrefix
  };
};
var _default = exports["default"] = useTable;