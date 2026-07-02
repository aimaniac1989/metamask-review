import React, { useMemo } from 'react';
import { PureBlackContext } from '@metamask/design-system-shared';
import { ThemeType } from '../../../shared/constants/preferences';
import { getIsPureBlackPreviewEnabled } from '../../../shared/lib/environment';
import { useTheme } from '../../hooks/useTheme';

/**
 * Preview-only React context for the design-system pure-black token experiment.
 *
 * Document tokens are applied on `<html>` via `setTheme` in `ui/pages/routes/utils.js`
 * (`data-theme` + `data-pure-black`). This provider supplies `usePureBlack()` for
 * components that need to branch in JS — no extra DOM nodes.
 *
 * App-owned gate: compile-time `MM_PURE_BLACK_PREVIEW` (see `.metamaskrc`).
 * MMDS read surface: `usePureBlack()` from `@metamask/design-system-react`.
 * @param options0
 * @param options0.children
 */
export const PreviewPureBlackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  const isPureBlack =
    getIsPureBlackPreviewEnabled() && theme === ThemeType.dark;
  const value = useMemo(() => ({ isPureBlack }), [isPureBlack]);

  if (!getIsPureBlackPreviewEnabled()) {
    return children;
  }

  return (
    <PureBlackContext.Provider value={value}>{children}</PureBlackContext.Provider>
  );
};
