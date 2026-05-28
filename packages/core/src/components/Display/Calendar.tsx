import { ChevronLeftIcon, ChevronRightIcon } from '@mindees/icons';
import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface CalendarProps extends Omit<ViewProps, 'style'> {
  /** Currently-selected date (controlled). */
  readonly value?: Date;
  /** Fires when a day is tapped. */
  readonly onChange?: (date: Date) => void;
  /** Month to show initially when uncontrolled. Defaults to `value` or today. */
  readonly defaultMonth?: Date;
  readonly style?: StyleProp<ViewStyle>;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const DAYS_PER_WEEK = 7;

// Pure leap-year rule: divisible by 4, except centuries unless divisible by 400.
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Days in a month index (0 = Jan ... 11 = Dec), guarding February by year.
function daysInMonth(year: number, month: number): number {
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month] ?? 30;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const HEADER_ROW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const WEEK_ROW: ViewStyle = { flexDirection: 'row' };
const CELL_BASE: ViewStyle = {
  flex: 1,
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

const CalendarImpl = React.forwardRef<View, CalendarProps>(function Calendar(props, ref) {
  const { value, onChange, defaultMonth, style, ...rest } = props;
  const tokens = useTokens();

  const initial = defaultMonth ?? value ?? new Date();
  // Track the visible month/year only — independent of the selected day.
  const [view, setView] = React.useState<{ year: number; month: number }>(() => ({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  }));

  const goPrev = React.useCallback(() => {
    setView((prev) => {
      // Wrap January (0) back to December (11) of the previous year.
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  }, []);

  const goNext = React.useCallback(() => {
    setView((prev) => {
      // Wrap December (11) forward to January (0) of the next year.
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  }, []);

  // Build the grid of week-rows. Leading nulls pad to the first weekday.
  const weeks = React.useMemo<readonly (number | null)[][]>(() => {
    const firstWeekday = new Date(view.year, view.month, 1).getDay();
    const total = daysInMonth(view.year, view.month);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) cells.push(day);
    while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += DAYS_PER_WEEK) {
      rows.push(cells.slice(i, i + DAYS_PER_WEEK));
    }
    return rows;
  }, [view.year, view.month]);

  const onSelectDay = React.useCallback(
    (day: number) => {
      onChange?.(new Date(view.year, view.month, day));
    },
    [onChange, view.year, view.month],
  );

  const navButtonStyle: ViewStyle = {
    padding: tokens.space.xs,
    borderRadius: tokens.radii.md,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const containerStyle: ViewStyle = { gap: tokens.space.xs };
  const weekdayRowStyle: ViewStyle = { ...WEEK_ROW, marginBottom: tokens.space['3xs'] };

  return (
    <View ref={ref} accessibilityRole="none" style={[containerStyle, style]} {...rest}>
      <View style={HEADER_ROW}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={goPrev}
          style={navButtonStyle}
        >
          <ChevronLeftIcon size={20} color={tokens.colors.text.primary} />
        </Pressable>
        <Text variant="label" weight="semibold" accessibilityRole="header">
          {`${MONTH_NAMES[view.month]} ${view.year}`}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={goNext}
          style={navButtonStyle}
        >
          <ChevronRightIcon size={20} color={tokens.colors.text.primary} />
        </Pressable>
      </View>

      <View accessibilityRole="none" style={weekdayRowStyle}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={CELL_BASE}>
            <Text variant="caption" tone="muted" weight="medium">
              {label}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((row, rowIndex) => (
        <View key={rowIndex} accessibilityRole="none" style={WEEK_ROW}>
          {row.map((day, cellIndex) => {
            if (day === null) {
              return <View key={`empty-${cellIndex}`} accessibilityRole="none" style={CELL_BASE} />;
            }
            const isSelected = value ? sameDay(value, new Date(view.year, view.month, day)) : false;
            const dayStyle: ViewStyle = {
              ...CELL_BASE,
              borderRadius: tokens.radii.md,
              backgroundColor: isSelected ? tokens.colors.action.primary : 'transparent',
            };
            return (
              <Pressable
                key={day}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${MONTH_NAMES[view.month]} ${day}, ${view.year}`}
                onPress={() => onSelectDay(day)}
                style={dayStyle}
              >
                <Text tone={isSelected ? 'onAccent' : 'primary'}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
});

CalendarImpl.displayName = 'Calendar';

export const Calendar = tagComponent(CalendarImpl, 'Calendar');
