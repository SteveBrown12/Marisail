'use client';
import { getTranslateDOMPositionXY } from 'dom-lib/translateDOMPositionXY';
var setCssPosition = getTranslateDOMPositionXY({
  enable3DTransform: true
});
export default setCssPosition;