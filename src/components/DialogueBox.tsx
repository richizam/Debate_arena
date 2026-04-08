import type { SpeakerId } from "../types/battle";
import SpeakerBadge from "./SpeakerBadge";
import { cn } from "../utils/classNames";

interface DialogueBoxProps {
  speakerName: string;
  speakerId: SpeakerId;
  text: string;
  isVisible: boolean;
}

export default function DialogueBox({ speakerName, speakerId, text, isVisible }: DialogueBoxProps) {
  return (
    <div className={cn("dialogue-box", !isVisible && "hidden")}>
      <div className="dialogue-box-speaker">
        <SpeakerBadge name={speakerName} speakerId={speakerId} />
      </div>
      <p className="dialogue-box-text">{text}</p>
    </div>
  );
}
