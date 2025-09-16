'use client';
import { useContext } from 'react';
import { TableContext } from '../TableProvider';
import setCss from '../utils/setCssPosition';
import isRTL from '../utils/isRTL';
export var useTable = function useTable() {
  var _useContext = useContext(TableContext),
    _useContext$setCssPos = _useContext.setCssPosition,
    setCssPosition = _useContext$setCssPos === void 0 ? setCss : _useContext$setCssPos,
    _useContext$rtl = _useContext.rtl,
    rtl = _useContext$rtl === void 0 ? isRTL() : _useContext$rtl,
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
export default useTable;