import type { SpeakerId } from "../types/battle";

interface SpeakerBadgeProps {
  name: string;
  speakerId: SpeakerId;
}

export default function SpeakerBadge({ name, speakerId }: SpeakerBadgeProps) {
  return (
    <span className={`speaker-badge speaker-badge--${speakerId}`}>
      {name}
    </span>
  );
}
