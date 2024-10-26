import { useCalendarGrid, useLocale } from "react-aria";
import {
  DateDuration,
  endOfMonth,
  getWeeksInMonth,
} from "@internationalized/date";
import { type CalendarState } from "react-stately";
import { CalendarCell } from "./CalendarCell";

interface CalendarGridProps {
  state: CalendarState;
  offset?: DateDuration;
}

export function CalendarGrid({ state, offset = {} }: CalendarGridProps) {
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  let { locale } = useLocale();

  let { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate,
      weekdayStyle: "short",
    },
    state
  );

  let weeksInMonth = getWeeksInMonth(startDate, locale);

  return (
    <table {...gridProps} cellPadding={0} className="flex-1">
      <thead {...headerProps} className="text-sm font-medium">
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
