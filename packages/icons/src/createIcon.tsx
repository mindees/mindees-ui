import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

export interface IconProps extends Omit<SvgProps, 'children'> {
  /** Icon size in dp. Sets both width and height. Defaults to 24. */
  readonly size?: number;
  /** Stroke / fill color. Defaults to `currentColor` for inheritance. */
  readonly color?: string;
  /** Stroke width of the glyph paths. Defaults to 2. */
  readonly strokeWidth?: number;
}

export interface IconDefinition {
  readonly name: string;
  readonly viewBox: string;
  readonly path: string;
}

// Factory used by every icon module. Keeps the surface tiny and consistent.
export function createIcon(
  definition: IconDefinition,
): React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Svg>> {
  const Icon = React.forwardRef<Svg, IconProps>(function Icon(
    { size = 24, color = 'currentColor', strokeWidth = 2, ...rest },
    ref,
  ) {
    return (
      <Svg ref={ref} width={size} height={size} viewBox={definition.viewBox} fill="none" {...rest}>
        <Path
          d={definition.path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  });
  Icon.displayName = `Icon(${definition.name})`;
  return Icon;
}
