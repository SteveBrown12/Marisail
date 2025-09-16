'use client';
import React, { useMemo } from 'react';
import { setCssPosition, isRTL } from './utils';

/**
 * Callback function type for translating DOM position.
 * @param style - The CSSStyleDeclaration object to modify.
 * @param x - The x-coordinate (optional).
 * @param y - The y-coordinate (optional).
 */

export var TableContext = /*#__PURE__*/React.createContext({});
export var TableProvider = function TableProvider(props) {
  var children = props.children,
    _props$rtl = props.rtl,
    rtl = _props$rtl === void 0 ? isRTL() : _props$rtl,
    _props$hasCustomTreeC = props.hasCustomTreeCol,
    hasCustomTreeCol = _props$hasCustomTreeC === void 0 ? false : _props$hasCustomTreeC,
    isTree = props.isTree,
    classPrefix = props.classPrefix;
  var value = useMemo(function () {
    return {
      setCssPosition: setCssPosition,
      rtl: rtl != null ? rtl : isRTL(),
      hasCustomTreeCol: hasCustomTreeCol,
      isTree: isTree,
      classPrefix: classPrefix
    };
  }, [rtl, hasCustomTreeCol, isTree, classPrefix]);
  return /*#__PURE__*/React.createElement(TableContext.Provider, {
    value: value
  }, children);
};
export default TableProvider;