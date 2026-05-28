import { render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';
import { InfoState } from '../InfoState';
import { LoadingState } from '../LoadingState';
import { MaintenanceState } from '../MaintenanceState';
import { OfflineState } from '../OfflineState';
import { SuccessState } from '../SuccessState';
import { WarningState } from '../WarningState';

describe('States — tag identity', () => {
  it('state tags', () => {
    expect(getComponentTag(<EmptyState />)).toBe('EmptyState');
    expect(getComponentTag(<ErrorState />)).toBe('ErrorState');
    expect(getComponentTag(<OfflineState />)).toBe('OfflineState');
    expect(getComponentTag(<MaintenanceState />)).toBe('MaintenanceState');
    expect(getComponentTag(<LoadingState />)).toBe('LoadingState');
    expect(getComponentTag(<SuccessState />)).toBe('SuccessState');
    expect(getComponentTag(<WarningState />)).toBe('WarningState');
    expect(getComponentTag(<InfoState />)).toBe('InfoState');
  });
});

describe('States — render without throwing', () => {
  it('renders each state with default copy', () => {
    expect(() => render(<EmptyState />)).not.toThrow();
    expect(() => render(<ErrorState />)).not.toThrow();
    expect(() => render(<OfflineState />)).not.toThrow();
    expect(() => render(<MaintenanceState />)).not.toThrow();
    expect(() => render(<LoadingState />)).not.toThrow();
    expect(() => render(<SuccessState />)).not.toThrow();
    expect(() => render(<WarningState />)).not.toThrow();
    expect(() => render(<InfoState />)).not.toThrow();
  });

  it('renders error and offline states with retry handlers', () => {
    expect(() =>
      render(<ErrorState title="Boom" description="It broke" onRetry={() => undefined} />),
    ).not.toThrow();
    expect(() => render(<OfflineState onRetry={() => undefined} />)).not.toThrow();
  });

  it('exposes the title to assistive tech', () => {
    const { getByText } = render(
      <SuccessState title="Saved" description="Your changes are live" />,
    );
    expect(getByText('Saved')).toBeTruthy();
  });
});
