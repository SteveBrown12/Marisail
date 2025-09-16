'use client';
import React from 'react';
function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    return object.type || object.$$typeof;
  }
}
export function isFragment(children) {
  return React.Children.count(children) === 1 && typeOf(children) === Symbol["for"]('react.fragment');
}
export function isElement(children) {
  return /*#__PURE__*/React.isValidElement(children);
}