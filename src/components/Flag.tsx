import type { Language } from "../types/battle";

interface FlagProps {
  code: Language;
  className?: string;
}

export default function Flag({ code, className }: FlagProps) {
  const commonProps = {
    className,
    viewBox: "0 0 24 16",
    preserveAspectRatio: "none" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (code) {
    case "en":
      return (
        <svg {...commonProps}>
          <rect width="24" height="16" fill="#012169" />
          <path
            d="M0 0 L24 16 M24 0 L0 16"
            stroke="#ffffff"
            strokeWidth="3"
          />
          <path
            d="M0 0 L24 16 M24 0 L0 16"
            stroke="#C8102E"
            strokeWidth="1.5"
          />
          <path
            d="M12 0 V16 M0 8 H24"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <path
            d="M12 0 V16 M0 8 H24"
            stroke="#C8102E"
            strokeWidth="2.4"
          />
        </svg>
      );
    case "es":
      return (
        <svg {...commonProps}>
          <rect width="24" height="4" fill="#AA151B" />
          <rect y="4" width="24" height="8" fill="#F1BF00" />
          <rect y="12" width="24" height="4" fill="#AA151B" />
        </svg>
      );
    case "de":
      return (
        <svg {...commonProps}>
          <rect width="24" height="5.334" fill="#000000" />
          <rect y="5.334" width="24" height="5.333" fill="#DD0000" />
          <rect y="10.667" width="24" height="5.333" fill="#FFCE00" />
        </svg>
      );
    case "fr":
      return (
        <svg {...commonProps}>
          <rect width="8" height="16" fill="#0055A4" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#EF4135" />
        </svg>
      );
    case "ru":
      return (
        <svg {...commonProps}>
          <rect width="24" height="5.334" fill="#FFFFFF" />
          <rect y="5.334" width="24" height="5.333" fill="#0039A6" />
          <rect y="10.667" width="24" height="5.333" fill="#D52B1E" />
        </svg>
      );
  }
}
