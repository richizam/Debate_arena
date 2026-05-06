import { useEffect, useState } from "react";
import { isMuted, setMuted, subscribeMuted } from "../utils/audio";
import type { Translations } from "../data/i18n";

interface MuteToggleProps {
  t: Translations;
}

export default function MuteToggle({ t }: MuteToggleProps) {
  const [muted, setLocalMuted] = useState<boolean>(() => isMuted());

  useEffect(() => subscribeMuted(setLocalMuted), []);

  function toggle() {
    setMuted(!muted);
  }

  return (
    <button
      type="button"
      className={`mute-toggle${muted ? " mute-toggle--off" : ""}`}
      onClick={toggle}
      aria-label={muted ? t.unmuteSound : t.muteSound}
      title={muted ? t.unmuteSound : t.muteSound}
    >
      {muted ? "SOUND OFF" : "SOUND ON"}
    </button>
  );
}
