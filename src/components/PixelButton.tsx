import { cn } from "../utils/classNames";

interface PixelButtonProps {
  label: string;
  onClick: () => void;
  size?: "md" | "lg";
  variant?: "default" | "red" | "blue";
  disabled?: boolean;
  className?: string;
}

export default function PixelButton({
  label,
  onClick,
  size = "md",
  variant = "default",
  disabled = false,
  className,
}: PixelButtonProps) {
  return (
    <button
      className={cn(
        "pixel-btn",
        size === "lg" && "pixel-btn--lg",
        variant === "red" && "pixel-btn--red",
        variant === "blue" && "pixel-btn--blue",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {label}
    </button>
  );
}
