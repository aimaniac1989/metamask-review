import { ThemeType } from '../../shared/constants/preferences';
import { setBackgroundConnection } from './background-connection';
import { setTheme as setThemeAction } from './actions';

jest.mock('../pages/routes/utils', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  setTheme: jest.fn(),
}));

// Import after mocking to get the mocked reference
import { setTheme as applyDocumentTheme } from '../pages/routes/utils';

describe('actions.setTheme (rollback on RPC failure)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reverts the optimistic DOM theme when background setTheme fails', async () => {
    // Arrange: background RPC rejects
    const backgroundSetTheme = jest.fn().mockRejectedValue(new Error('fail'));
    setBackgroundConnection({ setTheme: backgroundSetTheme } as never);

    // Previous saved preference in Redux
    const getState = () =>
      ({ metamask: { theme: ThemeType.light } } as unknown as Record<
        string,
        unknown
      >);

    // Act
    await (setThemeAction(ThemeType.dark) as never)(
      jest.fn(),
      getState as never,
    );

    // Assert: applied new theme then rolled back to previous one
    expect(applyDocumentTheme).toHaveBeenNthCalledWith(1, ThemeType.dark);
    expect(applyDocumentTheme).toHaveBeenNthCalledWith(2, ThemeType.light);
  });
});

