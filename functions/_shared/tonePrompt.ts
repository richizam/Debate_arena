export type Tone = "civil" | "heated" | "savage";

export const VALID_TONES: ReadonlySet<Tone> = new Set(["civil", "heated", "savage"]);

export function parseTone(value: unknown): Tone {
  if (typeof value === "string" && (VALID_TONES as Set<string>).has(value)) {
    return value as Tone;
  }
  return "heated";
}

export function buildTonePrompt(tone: Tone): string {
  switch (tone) {
    case "civil":
      return `TONE: This is an articulate, formal disagreement — like an Oxford-style debate or a serious op-ed exchange. Both speakers are intelligent and respectful. They DISAGREE FIRMLY but never insult, never mock, never raise their voice.
USE PHRASES LIKE: "I respectfully disagree", "Your reasoning fails because", "That's a misreading of the evidence", "With respect, that argument doesn't hold", "Let's be precise".
ESCALATION: precision and depth of counter-arguments increases. Emotional intensity does NOT.
FORBIDDEN: insults, sarcasm, mockery, personal jabs, raised voice. Keep it strictly substantive.`;

    case "heated":
      return `TONE: This is a heated, personal, sports-radio-style argument. Speakers MOCK, DISMISS, and personally challenge each other. The energy is high and confrontational, but the attacks stay on the topic and the public record.
USE PHRASES LIKE: "you're delusional", "that's embarrassing", "you're clueless", "what a cope", "that's a fraud answer", "you're washed", "give me a break", "are you serious right now".
ALLOWED: insults like clown, washed, fraud, embarrassing, delusional, cope, hack, pretender, midget (only when literally about height/skill, not as a slur). Sarcasm. Mockery of stated positions and decisions.
FORBIDDEN: profanity (no fuck, shit, asshole, bitch). Slurs of any kind (racial, ethnic, gender, sexuality, ability, religion). Sexual content. Threats of violence. Anything involving minors. Anything that resembles doxxing or revealing private information.`;

    case "savage":
      return `TONE: This is a no-holds-barred roast battle / WWE-promo. Speakers are unfiltered, brutal, and creative with their trash talk. Mild profanity is encouraged when it lands. Insults are sharper, mockery is harsher, lines are crushing put-downs.
USE PHRASES LIKE: "sit down clown", "that's the dumbest thing I've heard all week", "this guy's actually washed", "you're a damn joke", "go to hell with that take", "absolute embarrassment".
ALLOWED: mild profanity (damn, hell, ass, bullshit, dumbass, hell of a, piss off). Brutal creative insults. Crushing put-downs. Mocking impersonation of speech patterns.
FORBIDDEN — STRICT, NO EXCEPTIONS: hard slurs of any kind (racial, ethnic, gender, sexuality, ability, religion, nationality). The F-word and stronger profanity (fuck, shit, motherfucker, cunt, dick, pussy). Sexual content of any kind. Threats of violence or death. Doxxing or revealing private information. Anything involving minors. Anything that constitutes defamation against a private (non-public) person. Body-shaming based on disability or medical condition.
If you cannot stay inside ALLOWED while being savage, default to a less profane but equally cutting line.`;
  }
}
