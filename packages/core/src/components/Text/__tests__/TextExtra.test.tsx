import { render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { ErrorText } from '../ErrorText';
import { HelperText } from '../HelperText';
import { Mark } from '../Mark';
import { Paragraph } from '../Paragraph';
import { QuoteBlock } from '../QuoteBlock';
import { ReadMore } from '../ReadMore';
import { RichText, type RichTextSegment } from '../RichText';
import { Subheading } from '../Subheading';
import { TruncatedText } from '../TruncatedText';

describe('Text-extra primitives — tags', () => {
  it('each component carries its component tag', () => {
    expect(getComponentTag(<Paragraph />)).toBe('Paragraph');
    expect(getComponentTag(<Subheading />)).toBe('Subheading');
    expect(getComponentTag(<HelperText />)).toBe('HelperText');
    expect(getComponentTag(<ErrorText />)).toBe('ErrorText');
    expect(getComponentTag(<QuoteBlock />)).toBe('QuoteBlock');
    expect(getComponentTag(<Mark />)).toBe('Mark');
    expect(getComponentTag(<TruncatedText />)).toBe('TruncatedText');
    expect(getComponentTag(<ReadMore />)).toBe('ReadMore');
    expect(getComponentTag(<RichText segments={[]} />)).toBe('RichText');
  });
});

describe('Text-extra primitives — smoke', () => {
  it('Paragraph renders its children', () => {
    const { getByText } = render(<Paragraph>body copy</Paragraph>);
    expect(getByText('body copy')).toBeTruthy();
  });

  it('Subheading renders with a header role', () => {
    const { getByText } = render(<Subheading>section</Subheading>);
    expect(getByText('section').props.accessibilityRole).toBe('header');
  });

  it('HelperText renders its children', () => {
    const { getByText } = render(<HelperText>help</HelperText>);
    expect(getByText('help')).toBeTruthy();
  });

  it('ErrorText renders as an assertive live region', () => {
    const { getByText } = render(<ErrorText>required</ErrorText>);
    const node = getByText('required');
    expect(node.props.accessibilityLiveRegion).toBe('assertive');
    expect(node.props.accessibilityRole).toBe('alert');
  });

  it('QuoteBlock renders its children', () => {
    const { getByText } = render(<QuoteBlock>quoted</QuoteBlock>);
    expect(getByText('quoted')).toBeTruthy();
  });

  it('Mark renders its children', () => {
    const { getByText } = render(<Mark>highlight</Mark>);
    expect(getByText('highlight')).toBeTruthy();
  });

  it('TruncatedText defaults to a single line', () => {
    const { getByText } = render(<TruncatedText>clamped</TruncatedText>);
    expect(getByText('clamped').props.numberOfLines).toBe(1);
  });

  it('ReadMore renders the body and a toggle label', () => {
    const { getByText } = render(<ReadMore>long body text</ReadMore>);
    expect(getByText(/long body text/)).toBeTruthy();
    expect(getByText('Read more')).toBeTruthy();
  });

  it('RichText renders each segment', () => {
    const segments: RichTextSegment[] = [
      { text: 'plain ' },
      { text: 'bold ', bold: true },
      { text: 'italic ', italic: true },
      { text: 'code', code: true },
    ];
    const { getByText } = render(<RichText segments={segments} />);
    expect(getByText('plain ')).toBeTruthy();
    expect(getByText('bold ')).toBeTruthy();
    expect(getByText('italic ')).toBeTruthy();
    expect(getByText('code')).toBeTruthy();
  });
});
