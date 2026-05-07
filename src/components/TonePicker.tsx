import type { Tone } from "../types/battle";

interface TonePickerProps {
  tone: Tone;
  onChange: (tone: Tone) => void;
  labels: {
    heading: string;
    civil: string;
    civilDesc: string;
    heated: string;
    heatedDesc: string;
    savage: string;
    savageDesc: string;
  };
  disabled?: boolean;
}

const OPTIONS: { tone: Tone; icon: string; key: "civil" | "heated" | "savage" }[] = [
  { tone: "civil", icon: "🎓", key: "civil" },
  { tone: "heated", icon: "🔥", key: "heated" },
  { tone: "savage", icon: "💥", key: "savage" },
];

export default function TonePicker({ tone, onChange, labels, disabled }: TonePickerProps) {
  return (
    <div className="tone-picker">
      <span className="tone-picker__heading">{labels.heading}</span>
      <div className="tone-picker__options">
        {OPTIONS.map(({ tone: t, icon, key }) => {
          const active = t === tone;
          return (
            <button
              key={t}
              type="button"
              className={`tone-btn tone-btn--${t}${active ? " tone-btn--active" : ""}`}
              onClick={() => onChange(t)}
              disabled={disabled}
              title={labels[`${key}Desc` as const]}
              aria-pressed={active}
            >
              <span className="tone-btn__icon" aria-hidden="true">
                {icon}
              </span>
              <span className="tone-btn__label">{labels[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
