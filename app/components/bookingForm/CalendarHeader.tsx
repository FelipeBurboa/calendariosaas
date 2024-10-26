import { type CalendarState } from "react-stately";
import { FocusableElement, DOMAttributes } from "@react-types/shared";
import { type AriaButtonProps } from "@react-aria/button";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { CalendarButton } from "./CalendarButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
}

export function CalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: CalendarHeaderProps) {
  const monthDateFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    timeZone: state.timeZone,
  });

  const [monthName, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);

  return (
    <div className="flex items-center pb-4">
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>
      <h2 className="font-semibold flex-1">
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
        <span className="text-muted-foreground text-sm font-medium">
          {" "}
          {year}
        </span>
      </h2>
      <div className="flex gap-2 items-center">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeft className="size-4" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRight className="size-4" />
        </CalendarButton>
      </div>
    </div>
  );
}
