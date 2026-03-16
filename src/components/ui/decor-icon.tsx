import { cn } from "@societiza/lib/utils";

type DecorIconProps = {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export function DecorIcon({ className, position = "top-left" }: DecorIconProps) {
  const positionClasses = {
    "top-left": "-top-1.5 -left-1.5",
    "top-right": "-top-1.5 -right-1.5",
    "bottom-left": "-bottom-1.5 -left-1.5",
    "bottom-right": "-bottom-1.5 -right-1.5",
  };

  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute text-border",
        positionClasses[position],
        className
      )}
    >
      <path
        d="M7 0V14M0 7H14"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}
