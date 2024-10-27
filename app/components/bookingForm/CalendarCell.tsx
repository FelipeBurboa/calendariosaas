import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { type CalendarState } from "react-stately";
import {
  CalendarDate,
  getLocalTimeZone,
  isToday,
  isSameMonth,
} from "@internationalized/date";
import { cn } from "@/lib/utils";

interface CalendarCellProps {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: boolean;
}

export function CalendarCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: CalendarCellProps) {
  let ref = useRef(null);
  let { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const isDayToday = isToday(date, getLocalTimeZone());
  const isOutsideOfMonth = !isSameMonth(currentMonth, date);
  const finallyIsDisabled = isDisabled || isUnavailable;

  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        ref={ref}
        hidden={isOutsideOfMonth}
        {...mergeProps(buttonProps, focusProps)}
        className="size-10 sm:size-12 outline-none group rounded-md"
      >
        <div
          className={cn(
            "size-full rounded-sm flex items-center justify-center text-sm font-semibold",
            isSelected ? "bg-primary text-white" : "",
            !isSelected && !finallyIsDisabled
              ? "bg-primary/30 hover:bg-primary/50"
              : "",
            finallyIsDisabled
              ? "text-muted-foreground cursor-default bg-muted opacity-30"
              : ""
          )}
        >
          {formattedDate}
          {isDayToday && (
            <div
              className={cn(
                "absolute bottom-2.5 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 dark:bg-primary rounded-full sm:size-2 bg-black",
                isSelected && "bg-white dark:bg-white"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
