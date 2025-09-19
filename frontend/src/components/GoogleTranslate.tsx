import React, { CSSProperties, useEffect, useRef } from 'react';
import './GoogleTranslate.css';

type GoogleTranslateProps = {
  className?: string;
  style?: CSSProperties;
  containerId?: string;
  floating?: boolean;
  compact?: boolean;
};

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: {
            pageLanguage?: string;
            autoDisplay?: boolean;
            layout?: unknown;
            multilanguagePage?: boolean;
          },
          element?: Element | string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({
  className,
  style,
  containerId = 'google_translate_element',
  floating = true,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const initializeTranslate = () => {
      if (initializedRef.current) return;
      if (!window.google?.translate?.TranslateElement) return;

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      const docLang =
        (document.documentElement.getAttribute('lang') || '')
          .toLowerCase()
          .split('-')[0] || 'en';

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: docLang,
            autoDisplay: false,
            multilanguagePage: true,
          },
          containerRef.current || containerId
        );
        initializedRef.current = true;
        
        // Apply custom styling after initialization
        if (compact) {
          setTimeout(() => {
            const googTeCombo = document.querySelector('.goog-te-combo');
            if (googTeCombo) {
              googTeCombo.style.fontSize = '12px';
              googTeCombo.style.padding = '4px 8px';
              googTeCombo.style.border = '1px solid #d1d5db';
              googTeCombo.style.borderRadius = '6px';
              googTeCombo.style.backgroundColor = 'white';
              googTeCombo.style.minWidth = '120px';
              googTeCombo.style.height = '32px';
            }
          }, 100);
        }
      } catch {
        // no-op
      }
    };

    if (window.google?.translate?.TranslateElement) {
      initializeTranslate();
      return;
    }

    if (typeof window.googleTranslateElementInit === 'function') {
      window.googleTranslateElementInit();
      initializeTranslate();
      return;
    }

    window.googleTranslateElementInit = () => {
      initializeTranslate();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="translate_a/element.js"]'
    );
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-translate', 'true');
    document.head.appendChild(script);
  }, [containerId]);

  const defaultStyle: CSSProperties = floating
    ? {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 9999,
      }
    : {};

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={`${compact ? 'google-translate-compact' : ''} ${className || ''}`}
      style={{ ...defaultStyle, ...style }}
    />
  );
};

export default GoogleTranslate;


