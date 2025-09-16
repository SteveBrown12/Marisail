'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["fixed", "width", "left", "height", "style", "classPrefix", "className", "children"];
import React from 'react';
import { useClassNames, useTable } from './hooks';
var CellGroup = /*#__PURE__*/React.forwardRef(function (props, ref) {
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
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  var _useTable = useTable(),
    setCssPosition = _useTable.setCssPosition;
  var _useClassNames = useClassNames(classPrefix),
    withClassPrefix = _useClassNames.withClassPrefix,
    merge = _useClassNames.merge;
  var classes = merge(className, withClassPrefix((_withClassPrefix = {}, _withClassPrefix["fixed-" + fixed] = fixed, _withClassPrefix.scroll = !fixed, _withClassPrefix)));
  var styles = _extends({
    width: width,
    height: height
  }, style);
  setCssPosition === null || setCssPosition === void 0 || setCssPosition(styles, left, 0);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    ref: ref,
    className: classes,
    style: styles
  }), children);
});
CellGroup.displayName = 'Table.CellGroup';
export default CellGroup;