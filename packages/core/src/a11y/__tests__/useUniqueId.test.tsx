import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { useUniqueId } from '../useUniqueId';

function Probe({ prefix }: { prefix?: string }) {
  const id = useUniqueId(prefix);
  return <Text testID="probe">{id}</Text>;
}

describe('useUniqueId', () => {
  it('produces a string that starts with the default prefix', () => {
    const { getByTestId } = render(<Probe />);
    const id = getByTestId('probe').props.children as string;
    expect(id).toMatch(/^mindees-/);
  });

  it('uses the custom prefix when given', () => {
    const { getByTestId } = render(<Probe prefix="form-field" />);
    const id = getByTestId('probe').props.children as string;
    expect(id).toMatch(/^form-field-/);
  });

  it('strips characters that some native id systems reject', () => {
    const { getByTestId } = render(<Probe prefix="x" />);
    const id = getByTestId('probe').props.children as string;
    // After the "x-" prefix, the remainder is the sanitised useId. It must
    // not contain colons or other punctuation React 19's useId can emit.
    const tail = id.slice('x-'.length);
    expect(tail).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('produces different ids for different components rendered concurrently', () => {
    const { getAllByTestId } = render(
      <>
        <Probe />
        <Probe />
      </>,
    );
    const ids = getAllByTestId('probe').map((n) => n.props.children as string);
    expect(ids[0]).not.toBe(ids[1]);
  });
});
