import type { ResultType, Theme, Tone, TrapType } from "@/types";

/* ------------------------------------------------------------------ */
/* Trap templates                                                      */
/* ------------------------------------------------------------------ */

export interface Citation {
  text: string;
  url?: string;
}

export interface TrapTemplate {
  id: TrapType;
  labName: string; // internal codename, revealed after the answer
  publicTitle: string; // what the friend sees before answering
  emoji: string;
  shortDescription: string; // creator-facing menu copy (may hint at the mischief)
  preRevealFrame: string; // friend-facing framing, must not spoil the principle
  challengeText: string; // one-line brief shown on the challenge screen
  answerType: "number" | "choice" | "sequence" | "multi-round";
  difficulty: 1 | 2 | 3;
  estimatedTimeSeconds: number;
  // Human-readable logic notes (shown in admin content review, used by scoring.ts)
  trapCondition: string;
  escapeCondition: string;
  scoringLogic: string;
  revealTitleTrapped: string;
  revealTitleEscaped: string;
  roastCopy: string[];
  praiseCopy: string[];
  principleName: string;
  principleExplanation: string;
  citation: Citation;
  shareTextTrapped: string; // {creator} placeholder
  shareTextEscaped: string;
  ogImageSubtitle: string;
}

export const TRAPS: Record<TrapType, TrapTemplate> = {
  anchor: {
    id: "anchor",
    labName: "The Anchor Drop",
    publicTitle: "The 10-Second Estimate Test",
    emoji: "⚓",
    shortDescription:
      "A giant useless number quietly leans on their estimate. They'll swear it didn't.",
    preRevealFrame: "One estimate. Ten seconds. Don't overthink it.",
    challengeText: "How many jellybeans are in the lab jar?",
    answerType: "number",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition:
      "Estimate is pulled toward the displayed irrelevant 'calibration code' (high variant: ≥800; low variant: ≤220).",
    escapeCondition:
      "Estimate stays in a sane range for a 1-liter jar (~437 beans) regardless of the anchor shown.",
    scoringLogic:
      "Random high (8,742) or low (141) anchor per attempt. Distance and direction of pull decide the result; wild overcorrection away from the anchor scores Double Agent.",
    revealTitleTrapped: "The number got you",
    revealTitleEscaped: "You shook off the number",
    roastCopy: [
      "Your brain saw a fake number and said, “Seems official.”",
      "The calibration code was decorative. Your estimate saluted it anyway.",
      "That number was labeled junk. You filed it under evidence.",
      "Your neurons used the anchor as a handrail. It was a painted-on handrail.",
    ],
    praiseCopy: [
      "You ignored a number that was screaming for attention. Textbook hygiene.",
      "The anchor dropped. You didn't. Annoyingly competent.",
      "You estimated like the giant number wasn't even in the room. It hates that.",
    ],
    principleName: "Anchoring",
    principleExplanation:
      "The first number your brain sees becomes a reference point — even when it's labeled as irrelevant. Estimates then drift toward it. In the classic study, a rigged wheel of fortune shifted people's guesses about UN membership, and most were sure it hadn't.",
    citation: {
      text: "Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. Science, 185(4157), 1124–1131.",
      url: "https://doi.org/10.1126/science.185.4157.1124",
    },
    shareTextTrapped:
      "A fake number bullied my estimate. I walked directly into {creator}'s brain trap. Science remains undefeated.",
    shareTextEscaped:
      "{creator} tried to anchor my brain with a giant fake number. I escaped with 2 neurons and a grudge.",
    ogImageSubtitle: "The 10-Second Estimate Test",
  },

  frameflip: {
    id: "frameflip",
    labName: "The Frame Flip",
    publicTitle: "The Emergency Decision Test",
    emoji: "🔁",
    shortDescription:
      "Two emergencies, same math, different outfits. Watch their answers disagree with each other.",
    preRevealFrame: "Two rapid-fire lab emergencies. Trust your gut.",
    challengeText: "Two emergencies. One judgment call each.",
    answerType: "multi-round",
    difficulty: 3,
    estimatedTimeSeconds: 35,
    trapCondition:
      "Chooses the sure thing when options are framed as gains, then gambles when the identical options are framed as losses.",
    escapeCondition: "Makes consistent choices across both mathematically identical scenarios.",
    scoringLogic:
      "Scenario 1 is a gain frame (save 200 of 600), scenario 2 a loss frame (lose 400 of 600) with a different cover story. Flip = trapped; reverse flip = Double Agent; consistent = escape.",
    revealTitleTrapped: "Same math. Different outfit. Two answers.",
    revealTitleEscaped: "You saw through the costume change",
    roastCopy: [
      "You did not answer two questions. You answered one question twice, differently.",
      "The math wore a hat and you treated it like a stranger.",
      "Your risk tolerance depends on the wallpaper. Fascinating. Documented.",
    ],
    praiseCopy: [
      "You noticed the same numbers hiding in different sentences. The lab is quietly furious.",
      "Consistent under costume change. That's rarer than you'd think.",
      "You made the same call twice because it WAS the same call. Beautiful.",
    ],
    principleName: "The framing effect",
    principleExplanation:
      "Identical options framed as gains feel safe; framed as losses, they invite gambling. In the original study, flipping the wording alone flipped most people's choices — 'saving 200 of 600' and 'losing 400 of 600' are the same outcome in different outfits.",
    citation: {
      text: "Tversky, A., & Kahneman, D. (1981). The framing of decisions and the psychology of choice. Science, 211(4481), 453–458.",
      url: "https://doi.org/10.1126/science.7455683",
    },
    shareTextTrapped:
      "{creator} asked me the same question twice in different outfits and I gave two different answers. Trapped. Cinematically.",
    shareTextEscaped:
      "{creator} tried the old costume-change trick on my brain. I answered the math, not the outfit.",
    ogImageSubtitle: "The Emergency Decision Test",
  },

  baserate: {
    id: "baserate",
    labName: "The Base Rate Goblin",
    publicTitle: "The Detective Test",
    emoji: "🕵️",
    shortDescription:
      "One dramatic clue vs one boring number. The boring number is armed.",
    preRevealFrame: "A quick lab whodunit. Science demands answers.",
    challengeText: "A mouse has escaped. Name your suspect.",
    answerType: "choice",
    difficulty: 3,
    estimatedTimeSeconds: 30,
    trapCondition:
      "Trusts the vivid camera flag and ignores that flagged-as-rare is wrong ~65% of the time.",
    escapeCondition: "Weighs the base rate (88% standard mice) against the camera's 80% accuracy.",
    scoringLogic:
      "P(Series K | flagged) ≈ 35%. Picking 'standard' escapes; confidence calibration decides between Tiny Genius (55–80%), Clean Escape, and Suspicious Escape (>85%). Picking 'Series K' at ≥85% confidence is a Beautiful Disaster.",
    revealTitleTrapped: "The dramatic clue was wearing tap shoes",
    revealTitleEscaped: "You let the boring number do its job",
    roastCopy: [
      "The dramatic clue was wearing tap shoes. The boring number was doing the actual work.",
      "You heard '80% accurate' and skipped the part where the suspect barely exists.",
      "Vivid evidence: 1. Arithmetic: 0. The goblin thanks you.",
    ],
    praiseCopy: [
      "You resisted the flashy clue and made the boring number do its job.",
      "Base rates get ignored at parties. You invited them anyway. Respect.",
      "That was not luck. That was arithmetic with good posture.",
    ],
    principleName: "Base-rate neglect",
    principleExplanation:
      "When a vivid detail points one way and a boring statistic points the other, brains chase the detail. Here the camera is 80% accurate, but escape-artist mice are rare (12%) — so out of 100 mice it correctly flags ~10 and falsely flags ~18. A 'Series K' flag is wrong about 65% of the time.",
    citation: {
      text: "Kahneman, D., & Tversky, A. (1973). On the psychology of prediction. Psychological Review, 80(4), 237–251.",
      url: "https://doi.org/10.1037/h0034747",
    },
    shareTextTrapped:
      "{creator} framed an innocent mouse and I fell for it. The boring number was right all along.",
    shareTextEscaped:
      "{creator} tried to distract me with a dramatic clue. I did the arithmetic anyway. The mouse walks free.",
    ogImageSubtitle: "The Detective Test",
  },

  pattern: {
    id: "pattern",
    labName: "The Pattern Gremlin",
    publicTitle: "The Pattern IQ Test",
    emoji: "🔢",
    shortDescription:
      "They'll hunt for proof they're right. The rule eats people who only confirm.",
    preRevealFrame: "Crack the lock's number rule. Test three codes, then call it.",
    challengeText: "2 · 4 · 6 opens the lock. Find the rule.",
    answerType: "sequence",
    difficulty: 3,
    estimatedTimeSeconds: 45,
    trapCondition:
      "Tests only sequences that confirm the obvious '+2' hypothesis, then names the wrong rule.",
    escapeCondition:
      "Names the real rule (any increasing numbers) — ideally after deliberately testing a code designed to break their own theory.",
    scoringLogic:
      "The lock accepts any strictly increasing triplet. Testing a non-increasing triplet = attempted disconfirmation (Tiny Genius if rule also correct). Correct rule with only +2 tests = Suspicious Escape. Wrong rule with only +2 tests = Beautiful Disaster.",
    revealTitleTrapped: "You only looked for yes",
    revealTitleEscaped: "You tried to break your own theory",
    roastCopy: [
      "Three confirmations, zero curiosity. The gremlin barely had to work.",
      "You did not test your theory. You threw it a small parade.",
      "Every code you tried was designed to agree with you. Bold strategy.",
    ],
    praiseCopy: [
      "You did the rare thing: you tried to disprove yourself.",
      "You poked your own theory to see if it squeaked. That's the whole skill.",
      "Most people collect yeses. You went hunting for a no. Disgustingly scientific.",
    ],
    principleName: "Confirmation bias",
    principleExplanation:
      "In Wason's classic 2-4-6 task, people invent a rule, test only sequences that fit it, collect confirmations, and lock in their answer — without ever trying a case designed to fail. Smart brains don't just look for proof. They try to break their favorite answer.",
    citation: {
      text: "Wason, P. C. (1960). On the failure to eliminate hypotheses in a conceptual task. Quarterly Journal of Experimental Psychology, 12(3), 129–140.",
      url: "https://doi.org/10.1080/17470216008416717",
    },
    shareTextTrapped:
      "{creator}'s number lock ate me alive. I collected three yeses and zero truths.",
    shareTextEscaped:
      "{creator} bet I'd only look for proof I was right. I tried to break my own theory instead. The lock opened.",
    ogImageSubtitle: "The Pattern IQ Test",
  },

  availability: {
    id: "availability",
    labName: "The Availability Ambush",
    publicTitle: "The Danger Ranking Test",
    emoji: "📺",
    shortDescription:
      "Three 'which is deadlier' calls. Their newsfeed answers before they do.",
    preRevealFrame: "Three quick calls. Which one ends more lives in a typical year?",
    challengeText: "Rank the dangers. Your gut goes first — that's the problem.",
    answerType: "multi-round",
    difficulty: 2,
    estimatedTimeSeconds: 30,
    trapCondition: "Picks the vivid, headline-friendly danger over the statistically deadlier one.",
    escapeCondition: "Calls at least 2 of 3 rounds with the boring statistics.",
    scoringLogic:
      "3 correct = Tiny Genius, 2 = Suspicious Escape, 1 = Lab Incident, 0 = Beautiful Disaster. Correct answers: asthma > tornadoes, deer > sharks, bee stings > lightning (typical US year).",
    revealTitleTrapped: "Your brain has a newsfeed. It is not a spreadsheet",
    revealTitleEscaped: "You out-ranked the headlines",
    roastCopy: [
      "Your brain ranked dangers by screen time. The spreadsheet is disappointed.",
      "You chose the movie villain over the actuarial table. Every time a shark smiles, an insurer sighs.",
      "Vivid beat common in your head, 60 years after science called it.",
    ],
    praiseCopy: [
      "You ranked by spreadsheet, not by screen time. The headlines are furious.",
      "Boring dangers finally got the respect they've earned. Statistically excellent.",
      "Your risk radar runs on data, not drama. Annoying. Impressive.",
    ],
    principleName: "The availability heuristic",
    principleExplanation:
      "Dramatic risks are easy to recall, so they feel common. Quiet risks are hard to recall, so they feel rare. In the classic study, people judged tornadoes deadlier than asthma even though asthma killed roughly 20 times more people — memorability masquerading as frequency.",
    citation: {
      text: "Lichtenstein, S., Slovic, P., Fischhoff, B., Layman, M., & Combs, B. (1978). Judged frequency of lethal events. Journal of Experimental Psychology: Human Learning and Memory, 4(6), 551–578.",
      url: "https://doi.org/10.1037/0278-7393.4.6.551",
    },
    shareTextTrapped:
      "{creator} asked me what's actually dangerous and my newsfeed answered for me. Trapped.",
    shareTextEscaped:
      "{creator} tried to ambush me with shark-week statistics. I ranked like an actuary. Revenge pending.",
    ogImageSubtitle: "The Danger Ranking Test",
  },

  sunkcost: {
    id: "sunkcost",
    labName: "The Sunk Cost Swamp",
    publicTitle: "The Project Rescue Test",
    emoji: "🕳️",
    shortDescription:
      "18 months and $900K of regret, served on a silver platter. See if they keep paying for it.",
    preRevealFrame: "You're the lab director. One budget call. Go.",
    challengeText: "Project Hoverboot is 90% built — and freshly obsolete. Your call.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 25,
    trapCondition: "Finishes the doomed project because of what's already been spent.",
    escapeCondition: "Ignores the sunk $900K and decides on future costs and payoffs only.",
    scoringLogic:
      "'Finish it — we're 90% there' = Lab Incident. 'Stop now' = Clean Escape. 'Re-price it from zero' = Tiny Genius (the actual decision procedure).",
    revealTitleTrapped: "Past effort is not a coupon for future suffering",
    revealTitleEscaped: "You let the dead project stay dead",
    roastCopy: [
      "Past effort is not a coupon for future suffering. You tried to redeem it anyway.",
      "You paid $900K for a lesson and then asked for seconds.",
      "The swamp didn't pull you in. You waded in, waving the receipts.",
    ],
    praiseCopy: [
      "You treated the $900K like it was gone. Because it was. Brutal. Correct.",
      "You made the decision the money wanted you to be too sad to make.",
      "Zero sentimentality toward a doomed hoverboot. The board approves.",
    ],
    principleName: "The sunk cost fallacy",
    principleExplanation:
      "Money and time already spent are gone no matter what you choose — only future costs and payoffs should drive the decision. But sunk costs feel like an investment to protect, so people keep funding doomed projects to avoid 'wasting' what was never coming back.",
    citation: {
      text: "Arkes, H. R., & Blumer, C. (1985). The psychology of sunk cost. Organizational Behavior and Human Decision Processes, 35(1), 124–140.",
      url: "https://doi.org/10.1016/0749-5978(85)90049-4",
    },
    shareTextTrapped:
      "{creator} handed me a doomed project and I funded it out of pure sentimentality. The swamp got me.",
    shareTextEscaped:
      "{creator} tried to drown me in sunk costs. I let the dead project stay dead. Revenge is next on the budget.",
    ogImageSubtitle: "The Project Rescue Test",
  },

  decoy: {
    id: "decoy",
    labName: "The Decoy Duck",
    publicTitle: "The Menu Genius Test",
    emoji: "🦆",
    shortDescription:
      "Three popcorn sizes. One exists only to whisper at their wallet.",
    preRevealFrame: "Movie night. Pick your popcorn like a genius.",
    challengeText: "Three sizes. One correct personality. Choose.",
    answerType: "choice",
    difficulty: 1,
    estimatedTimeSeconds: 15,
    trapCondition:
      "Picks the decoy itself (Medium, strictly worse than Large) — or gets steered to Large by the decoy's whispering.",
    escapeCondition: "Buys what they actually wanted before the menu started performing.",
    scoringLogic:
      "Small = Clean Escape. Large = Suspicious Escape (the decoy did its job, but it's at least the best per-ounce deal). Medium = Beautiful Disaster (chose the asymmetrically dominated option).",
    revealTitleTrapped: "One option was never meant to be chosen",
    revealTitleEscaped: "You heard the decoy whispering and walked away",
    roastCopy: [
      "One option was not there to be chosen. It was there to whisper at your wallet. You shook its hand.",
      "You picked the option whose entire job was to make another option look good. The decoy thanks you for your service.",
      "The menu ran a tiny play on you and you ran the wrong route.",
    ],
    praiseCopy: [
      "You bought what you wanted before the menu started performing. Rare.",
      "The decoy whispered. You left it on read.",
      "Immune to upsell theater. Your wallet just did a small bow.",
    ],
    principleName: "The decoy effect",
    principleExplanation:
      "Add a slightly-worse 'decoy' option and the option it flatters suddenly looks brilliant. The medium wasn't there to be bought — it was there to make the large feel like a steal. Menus, subscription tiers, and upgrade screens run this play every day.",
    citation: {
      text: "Huber, J., Payne, J. W., & Puto, C. (1982). Adding asymmetrically dominated alternatives: Violations of regularity and the similarity hypothesis. Journal of Consumer Research, 9(1), 90–98.",
      url: "https://doi.org/10.1086/208899",
    },
    shareTextTrapped:
      "{creator} put a decoy on a popcorn menu and my wallet listened to it. Trapped by a duck.",
    shareTextEscaped:
      "{creator} planted a decoy in a popcorn menu. I heard it whispering and walked away. Quack quack, revenge.",
    ogImageSubtitle: "The Menu Genius Test",
  },

  confidence: {
    id: "confidence",
    labName: "The Confidence Cannon",
    publicTitle: "The Two-Question Genius Test",
    emoji: "📣",
    shortDescription:
      "One trivia question, one confidence slider. The slider does the damage.",
    preRevealFrame: "One question. Then say how sure you are. That's the whole test.",
    challengeText: "Answer, then aim the confidence cannon.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Wrong answer delivered with high confidence.",
    escapeCondition: "Right answer with confidence that roughly matches reality.",
    scoringLogic:
      "Correct (Saturn) at 70–95% = Tiny Genius; >95% = Clean Escape; <70% = Suspicious Escape. Wrong at ≥85% = Beautiful Disaster; wrong below that = Lab Incident.",
    revealTitleTrapped: "Confidence is not evidence",
    revealTitleEscaped: "Your certainty matched your accuracy. Rare",
    roastCopy: [
      "Confidence is not evidence. It is just your brain using a megaphone.",
      "Your neurons sprinted confidently into a rake.",
      "You were sure. The moons were not consulted.",
    ],
    praiseCopy: [
      "Right answer, honest slider. That's calibration — most brains skip that feature.",
      "Your megaphone and your microphone agree. Statistically adorable.",
      "Confident AND correct. The cannon fires a respectful salute.",
    ],
    principleName: "Overconfidence & calibration",
    principleExplanation:
      "Being sure and being right are different skills, and for most people confidence runs ahead of accuracy. Calibration means your '80% sure' is actually right about 80% of the time — a skill so rare that forecasting tournaments treat it as a superpower.",
    citation: {
      text: "Moore, D. A., & Healy, P. J. (2008). The trouble with overconfidence. Psychological Review, 115(2), 502–517.",
      url: "https://doi.org/10.1037/0033-295X.115.2.502",
    },
    shareTextTrapped:
      "{creator} handed me a megaphone and I aimed it at the wrong planet. Confidence ≠ evidence. Noted.",
    shareTextEscaped:
      "{creator} fired the confidence cannon at me. My certainty matched my accuracy. Apparently that's rare.",
    ogImageSubtitle: "The Two-Question Genius Test",
  },
};

export const TRAP_LIST: TrapTemplate[] = Object.values(TRAPS);

export const TRAP_TYPES = Object.keys(TRAPS) as TrapType[];

export function getTrapOfTheDay(): TrapTemplate {
  const day = Math.floor(Date.now() / 86_400_000);
  return TRAP_LIST[day % TRAP_LIST.length];
}

/* ------------------------------------------------------------------ */
/* Challenge content (single source of truth for UI + scoring)         */
/* ------------------------------------------------------------------ */

export const ANCHOR_CHALLENGE = {
  jarDescription: "Standard lab jar. One liter. Regulation jellybeans.",
  labCount: 437,
  anchors: { high: 8742, low: 141 },
} as const;

export const FRAMEFLIP_CHALLENGE = {
  q1: {
    title: "Emergency 1: The Freezer Incident",
    story:
      "The lab freezer is failing. 600 experimental ice-cream samples are at risk. Two rescue protocols exist:",
    sure: "Protocol A: exactly 200 samples are saved.",
    gamble:
      "Protocol B: 1-in-3 chance all 600 are saved, 2-in-3 chance none are.",
  },
  q2: {
    title: "Emergency 2: The Server Meltdown",
    story:
      "A storage server is dying. 600 irreplaceable datasets are on it. Two recovery plans exist:",
    sure: "Plan C: exactly 400 datasets are lost.",
    gamble: "Plan D: 1-in-3 chance nothing is lost, 2-in-3 chance all 600 are lost.",
  },
} as const;

export const BASERATE_CHALLENGE = {
  story:
    "A mouse escaped the enclosure overnight. Lab census: 12% of our mice are “Series K” escape-artists; 88% are standard. The night camera — 80% accurate in low light — flagged the escapee as Series K.",
  question: "Who probably did it?",
  options: {
    flagged: "A Series K mouse — the camera saw it",
    standard: "A standard mouse — camera or no camera",
  },
  posteriorNote:
    "Out of 100 mice, the camera correctly flags ~10 Series K and falsely flags ~18 standard mice. A “Series K” flag is wrong ~65% of the time.",
} as const;

export const PATTERN_CHALLENGE = {
  seedTriplet: [2, 4, 6] as const,
  maxTests: 3,
  guesses: [
    { id: "plus-two", label: "Counting up by 2" },
    { id: "evens-up", label: "Even numbers, in order" },
    { id: "any-increasing", label: "Any three increasing numbers" },
    { id: "sum-twelve", label: "The three numbers sum to 12" },
  ] as const,
  correctGuess: "any-increasing" as const,
  fits(a: number, b: number, c: number): boolean {
    return a < b && b < c;
  },
};

export const AVAILABILITY_CHALLENGE = {
  question: "Which ends more human lives in a typical US year?",
  rounds: [
    {
      options: ["Tornadoes 🌪️", "Asthma 🫁"],
      correct: 1,
      note: "Asthma: ~3,500+ US deaths a year (CDC). Tornadoes: well under 100 (NOAA).",
    },
    {
      options: ["Shark attacks 🦈", "Deer on the road 🦌"],
      correct: 1,
      note: "Deer–vehicle collisions: ~150–200 US deaths a year. Sharks: about one.",
    },
    {
      options: ["Lightning ⚡", "Bee & wasp stings 🐝"],
      correct: 1,
      note: "Stings: ~70 US deaths a year (CDC). Lightning: ~20 (NOAA).",
    },
  ],
} as const;

export const SUNKCOST_CHALLENGE = {
  story:
    "18 months and $900K went into Project Hoverboot. It's 90% built. This morning, a rival shipped a better version at half the price. Finishing costs another $100K.",
  question: "What do you do?",
  options: [
    { id: "finish", label: "Finish it — we're 90% there and $900K deep" },
    { id: "stop", label: "Stop now — put the $100K into the next idea" },
    { id: "reprice", label: "Re-price from zero: would I start Hoverboot today?" },
  ] as const,
};

export const DECOY_CHALLENGE = {
  intro: "The lab vending machine, movie night edition:",
  options: [
    { id: "small", label: "Small popcorn", price: "$3.50", tag: "fits one hand" },
    { id: "medium", label: "Medium popcorn", price: "$6.50", tag: "fits one lap" },
    { id: "large", label: "Large popcorn", price: "$7.00", tag: "fits one lifestyle" },
  ] as const,
};

export const CONFIDENCE_CHALLENGE = {
  question: "Which planet has more confirmed moons?",
  options: [
    { id: "jupiter", label: "Jupiter" },
    { id: "saturn", label: "Saturn" },
  ] as const,
  correct: "saturn" as const,
  factNote:
    "Saturn leads 274 confirmed moons to Jupiter's 95 (IAU/NASA, 2025). Jupiter's fame does the heavy lifting.",
};

/* ------------------------------------------------------------------ */
/* Tones                                                               */
/* ------------------------------------------------------------------ */

export interface ToneConfig {
  id: Tone;
  label: string;
  blurb: string; // creator-facing description
  introLine: string; // friend-facing, {creator} placeholder
  defaultTaunt: string;
  buttonLabel: string;
}

export const TONES: Record<Tone, ToneConfig> = {
  nice: {
    id: "nice",
    label: "Nice",
    blurb: "Supportive, playful, zero menace.",
    introLine: "{creator} sent you a tiny challenge. Quick, painless, weirdly fun.",
    defaultTaunt: "No pressure. Mostly curiosity. Mostly.",
    buttonLabel: "Give it a go",
  },
  spicy: {
    id: "spicy",
    label: "Spicy",
    blurb: "Light roast. Confident. Deserved.",
    introLine: "{creator} bets you'll fall for this.",
    defaultTaunt: "Prove them wrong. It takes 20 seconds and a functioning brain.",
    buttonLabel: "Prove them wrong",
  },
  chaotic: {
    id: "chaotic",
    label: "Chaotic",
    blurb: "Absurd. Internet goblin. Still kind.",
    introLine: "{creator} has armed a trap and is refreshing this page like a maniac.",
    defaultTaunt: "The floor is bait. The walls are bait. Good luck.",
    buttonLabel: "Walk into the lab",
  },
  goblin: {
    id: "goblin",
    label: "Science Goblin",
    blurb: "Nerdy, dramatic, citation-forward.",
    introLine: "{creator} has constructed a peer-reviewed menace, just for you.",
    defaultTaunt: "n = 1, and the n is you. For science.",
    buttonLabel: "Begin the trial",
  },
};

export const TONE_LIST = Object.values(TONES);

/* ------------------------------------------------------------------ */
/* Card themes                                                         */
/* ------------------------------------------------------------------ */

export interface ThemeConfig {
  id: Theme;
  label: string;
  emoji: string;
  /** Tailwind classes for the invite card surface */
  cardClass: string;
  /** Accent text class */
  accentClass: string;
  /** [from, to] hex for OG image gradient accents */
  ogAccent: [string, string];
}

export const THEMES: Record<Theme, ThemeConfig> = {
  "clean-lab": {
    id: "clean-lab",
    label: "Clean Lab",
    emoji: "🧪",
    cardClass:
      "border-teal/40 bg-gradient-to-br from-teal/10 via-transparent to-grape/10 shadow-[0_0_40px_-12px_rgba(24,212,208,0.45)]",
    accentClass: "text-teal",
    ogAccent: ["#18D4D0", "#8E4DFF"],
  },
  "neon-trap": {
    id: "neon-trap",
    label: "Neon Trap",
    emoji: "🪤",
    cardClass:
      "border-punch/50 bg-gradient-to-br from-punch/15 via-transparent to-grape/10 shadow-[0_0_40px_-10px_rgba(247,37,133,0.5)]",
    accentClass: "text-punch",
    ogAccent: ["#F72585", "#8E4DFF"],
  },
  "evidence-board": {
    id: "evidence-board",
    label: "Evidence Board",
    emoji: "📌",
    cardClass:
      "border-dashed border-frost/30 bg-gradient-to-br from-frost/8 via-transparent to-teal/8",
    accentClass: "text-frost",
    ogAccent: ["#94A3B8", "#18D4D0"],
  },
  villain: {
    id: "villain",
    label: "Villain Monologue",
    emoji: "🦹",
    cardClass:
      "border-grape/50 bg-gradient-to-br from-grape/20 via-transparent to-ink shadow-[0_0_40px_-10px_rgba(142,77,255,0.5)]",
    accentClass: "text-grape",
    ogAccent: ["#8E4DFF", "#F72585"],
  },
  "game-show": {
    id: "game-show",
    label: "Game Show",
    emoji: "🎰",
    cardClass:
      "border-teal/40 bg-gradient-to-r from-teal/15 via-grape/10 to-punch/15 shadow-[0_0_40px_-10px_rgba(142,77,255,0.4)]",
    accentClass: "text-teal",
    ogAccent: ["#18D4D0", "#F72585"],
  },
  emergency: {
    id: "emergency",
    label: "Emergency Button",
    emoji: "🚨",
    cardClass:
      "border-punch/60 bg-gradient-to-br from-punch/20 via-transparent to-punch/5 shadow-[0_0_40px_-10px_rgba(247,37,133,0.6)]",
    accentClass: "text-punch",
    ogAccent: ["#F72585", "#18D4D0"],
  },
};

export const THEME_LIST = Object.values(THEMES);

/* ------------------------------------------------------------------ */
/* Result archetypes                                                   */
/* ------------------------------------------------------------------ */

export interface ResultMeta {
  id: ResultType;
  title: string;
  vibe: string;
  emoji: string;
  grid: string; // wordle-style emoji summary
  colorClass: string;
  borderClass: string;
  escaped: boolean;
}

export const RESULT_META: Record<ResultType, ResultMeta> = {
  "clean-escape": {
    id: "clean-escape",
    title: "CLEAN ESCAPE",
    vibe: "You escaped. Annoying, but impressive.",
    emoji: "🔓",
    grid: "🧠✅🔓",
    colorClass: "text-teal",
    borderClass: "border-teal/50",
    escaped: true,
  },
  "suspicious-escape": {
    id: "suspicious-escape",
    title: "SUSPICIOUS ESCAPE",
    vibe: "Right answer. Shaky landing. The lab is watching.",
    emoji: "🧐",
    grid: "🧠✅😅",
    colorClass: "text-frost",
    borderClass: "border-frost/40",
    escaped: true,
  },
  "lab-incident": {
    id: "lab-incident",
    title: "LAB INCIDENT",
    vibe: "You got trapped. Beautifully. Cinematically.",
    emoji: "🪤",
    grid: "🧠💥🪤",
    colorClass: "text-punch",
    borderClass: "border-punch/50",
    escaped: false,
  },
  "beautiful-disaster": {
    id: "beautiful-disaster",
    title: "BEAUTIFUL DISASTER",
    vibe: "A museum-quality mistake. Frame it.",
    emoji: "🎆",
    grid: "🧠🎆🪤",
    colorClass: "text-punch",
    borderClass: "border-punch/60",
    escaped: false,
  },
  "double-agent": {
    id: "double-agent",
    title: "DOUBLE AGENT",
    vibe: "You dodged our trap and invented your own. Respect?",
    emoji: "🕶️",
    grid: "🧠🕶️🌀",
    colorClass: "text-grape",
    borderClass: "border-grape/50",
    escaped: true,
  },
  "tiny-genius": {
    id: "tiny-genius",
    title: "TINY GENIUS MOMENT",
    vibe: "Escaped AND calibrated. Genuinely upsetting.",
    emoji: "🏆",
    grid: "🧠🎯🏆",
    colorClass: "text-teal",
    borderClass: "border-teal/60",
    escaped: true,
  },
};
