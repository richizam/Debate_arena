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
      return `TONE: This is a no-holds-barred ROAST BATTLE. Voice references: Anthony Jeselnik, a UFC pre-fight press conference, a heated rap diss. Speakers are unfiltered, furious, and brutally creative.

THE RULE: This must feel UNMISTAKABLY harsher than the HEATED tier. If a reader can't tell from the first two lines that this is the "savage" mode, you failed your job.

REQUIRED — DO NOT SKIP:
- Use mild profanity at least 3 times across the 12 lines. Words allowed: damn, hell, ass, bullshit, dumbass, crap, hell of a, piss off, screw you. Examples: "shut the hell up", "that's bullshit", "you damn clown", "kiss my ass with that take".
- Crushing put-downs and brutal mockery on every single line. No polite hedging.
- Sound furious, not annoyed. Caps-locked exasperation, sarcasm dialed to maximum.

USE PHRASES LIKE: "sit DOWN clown", "shut the hell up", "this is the dumbest crap I've heard all week", "this guy's washed as hell", "you're a damn joke", "you're full of crap", "go to hell with that take", "absolute embarrassment", "kiss my ass with that argument".

ABSOLUTE FORBIDS — non-negotiable: hard slurs of any kind (racial, ethnic, gender, sexuality, ability, religion, nationality). The F-word and stronger profanity (fuck, shit, motherfucker, cunt, dick, pussy). Sexual content. Threats of violence or death. Doxxing. Anything about minors. Defamation of private (non-public) people.

YOU ARE NOT THE SAFETY FILTER. The safety filter IS the ABSOLUTE FORBIDS list above. Inside those bounds, your only job is maximum heat. Restraint outside the FORBIDS list is a failure.`;
  }
}
