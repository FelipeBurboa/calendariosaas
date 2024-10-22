import { cn } from "@/lib/utils";
import { Children, cloneElement, ReactElement } from "react";
import { ButtonProps } from "./button";

interface ButtonGroupProps {
  className?: string;
  children: ReactElement<ButtonProps>[];
}

export function ButtonGroup({ className, children }: ButtonGroupProps) {
  const totalButton = Children.count(children);

  return (
    <div className={cn("flex w-full", className)}>
      {children.map((child, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === totalButton - 1;
        const isSelected = child.props.variant === "secondary";
        const nextChildSelected =
          index < children.length - 1 &&
          children[index + 1].props.variant === "secondary";

        return cloneElement(child, {
          key: `button-${index}`,
          className: cn(
            "border-2 transition-colors",
            {
              "rounded-l-none": !isFirstItem,
              "rounded-r-none": !isLastItem,
              "border-l-0": !isFirstItem && !isSelected,
              "border-red-500": isSelected,
              "border-transparent": !isSelected,
              "border-r-2": isSelected && !nextChildSelected,
              "border-r-0": !isSelected && nextChildSelected,
            },
            child.props.className
          ),
        });
      })}
    </div>
  );
}
