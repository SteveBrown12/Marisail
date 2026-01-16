import React, { CSSProperties, useEffect, useRef, useState } from 'react';
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
  const [showFallback, setShowFallback] = useState(false);

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
        setTimeout(() => {
          const googTeCombo = document.querySelector('.goog-te-combo');
          if (googTeCombo) {
            if (compact) {
              googTeCombo.style.fontSize = '11px';
              googTeCombo.style.padding = '2px 6px';
              googTeCombo.style.height = '28px';
              googTeCombo.style.minWidth = '100px';
            } else {
              googTeCombo.style.fontSize = '12px';
              googTeCombo.style.padding = '4px 8px';
              googTeCombo.style.height = '32px';
              googTeCombo.style.minWidth = '120px';
            }
            googTeCombo.style.border = '1px solid #d1d5db';
            googTeCombo.style.borderRadius = '6px';
            googTeCombo.style.backgroundColor = 'white';
            googTeCombo.style.color = '#374151';
            googTeCombo.style.fontFamily = 'inherit';
            googTeCombo.style.display = 'block';
            googTeCombo.style.visibility = 'visible';
            googTeCombo.style.opacity = '1';
            console.log('Google Translate combo styled successfully');
          } else {
            console.warn('Google Translate combo not found');
          }
          
          // Also ensure the parent container is visible
          const googTeGadget = document.querySelector('.goog-te-gadget');
          if (googTeGadget) {
            googTeGadget.style.display = 'block';
            googTeGadget.style.visibility = 'visible';
            googTeGadget.style.opacity = '1';
            console.log('Google Translate gadget styled successfully');
          } else {
            console.warn('Google Translate gadget not found');
          }
        }, 200);
      } catch (error) {
        console.error('Google Translate initialization error:', error);
        setShowFallback(true);
      }
    };

    // Set up fallback timeout
    const fallbackTimeout = setTimeout(() => {
      const googTeCombo = document.querySelector('.goog-te-combo');
      if (!googTeCombo) {
        console.warn('Google Translate not loaded after 5 seconds, showing fallback');
        setShowFallback(true);
      }
    }, 5000);

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

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [containerId, compact]);

  const defaultStyle: CSSProperties = floating
    ? {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 9999,
      }
    : {};

  // Fallback language selector
  const handleLanguageChange = (lang: string) => {
    // Simple language change - you can implement your own logic here
    console.log('Language changed to:', lang);
    // For now, just reload the page with the new language
    window.location.reload();
  };

  if (showFallback) {
    return (
      <div
        className={`${compact ? 'google-translate-compact' : ''} ${className || ''}`}
        style={{ 
          ...defaultStyle, 
          ...style,
          display: 'block',
          visibility: 'visible',
          opacity: 1,
          minHeight: compact ? '28px' : '32px',
          minWidth: compact ? '100px' : '120px'
        }}
      >
        <select
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          style={{
            fontSize: compact ? '11px' : '12px',
            height: compact ? '28px' : '32px',
            minWidth: compact ? '100px' : '120px',
            padding: compact ? '2px 6px' : '4px 8px'
          }}
        >
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="pt">🇵🇹 Português</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="ko">🇰🇷 한국어</option>
          <option value="zh">🇨🇳 中文</option>
          <option value="ar">🇸🇦 العربية</option>
          <option value="hi">🇮🇳 हिन्दी</option>
        </select>
      </div>
    );
  }

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={`${compact ? 'google-translate-compact' : ''} ${className || ''}`}
      style={{ 
        ...defaultStyle, 
        ...style,
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        minHeight: compact ? '28px' : '32px',
        minWidth: compact ? '100px' : '120px'
      }}
    />
  );
};

export default GoogleTranslate;


