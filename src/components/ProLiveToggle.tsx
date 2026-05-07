interface ProLiveToggleProps {
  enabled: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
  unlocked: boolean;
  premiumCreditsRemaining: number;
  labels: {
    label: string;
    badge: string;
    desc: string;
    lockedDesc: string;
    outOfCredits: string;
  };
}

export default function ProLiveToggle({
  enabled,
  onToggle,
  disabled,
  unlocked,
  premiumCreditsRemaining,
  labels,
}: ProLiveToggleProps) {
  const outOfCredits = unlocked && premiumCreditsRemaining <= 0;
  const interactive = unlocked && !outOfCredits && !disabled;

  let helper = labels.desc;
  if (!unlocked) {
    helper = labels.lockedDesc;
  } else if (outOfCredits) {
    helper = labels.outOfCredits;
  }

  function handleClick() {
    if (!interactive) return;
    onToggle(!enabled);
  }

  return (
    <div
      className={`pro-live-toggle${enabled ? " pro-live-toggle--on" : ""}${
        !interactive ? " pro-live-toggle--locked" : ""
      }`}
    >
      <button
        type="button"
        className="pro-live-toggle__button"
        onClick={handleClick}
        disabled={!interactive}
        aria-pressed={enabled}
      >
        <span className="pro-live-toggle__badge">{labels.badge}</span>
        <span className="pro-live-toggle__label">{labels.label}</span>
        <span className="pro-live-toggle__credits">
          {unlocked ? `· ${premiumCreditsRemaining}` : ""}
        </span>
        <span className="pro-live-toggle__switch" aria-hidden="true">
          <span className="pro-live-toggle__switch-knob" />
        </span>
      </button>
      <p className="pro-live-toggle__helper">{helper}</p>
    </div>
  );
}
