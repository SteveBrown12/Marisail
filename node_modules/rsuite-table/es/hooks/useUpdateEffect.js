'use client';
import { useEffect, useRef } from 'react';
var useUpdateEffect = function useUpdateEffect(effect, deps) {
  var isMounting = useRef(true);
  useEffect(function () {
    if (isMounting.current) {
      isMounting.current = false;
      return;
    }
    effect();
  }, deps);
};
export default useUpdateEffect;