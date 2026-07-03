import React from 'react';
import { PureBlackProvider } from '@metamask/design-system-react';
// Keep PureBlack in sync with DOM `data-pure-black` attribute

/**
 * Applies MMDS pure-black (OLED) dark mode when the resolved theme is dark.
 *
 * Document tokens are also synced on `<html>` via `setTheme` in routes utils
 * (`data-theme` + `data-pure-black`).
 *
 * @param options0
 * @param options0.children
 */
export const AppPureBlackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPureBlack, setIsPureBlack] = React.useState<boolean>(() => {
    try {
      return document?.documentElement?.hasAttribute('data-pure-black') ?? false;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const el = document.documentElement;
    const update = () => {
      setIsPureBlack(el.hasAttribute('data-pure-black'));
    };
    update();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-pure-black') {
          update();
          break;
        }
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-pure-black'] });
    return () => observer.disconnect();
  }, []);

  return (
    <PureBlackProvider isPureBlack={isPureBlack}>
      {children}
    </PureBlackProvider>
  );
};
