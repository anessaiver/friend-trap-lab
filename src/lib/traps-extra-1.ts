/**
 * New trap templates (part 1 of 2) — all data-driven via the generic
 * challenge engine. Structural numbers live in the challenge specs and are
 * NOT creator-editable; slots hold only flavor (names, objects, silly
 * quantities that don't affect scoring).
 */

import type { TrapTemplate } from "@/lib/traps";

export const EXTRA_TRAPS_1: TrapTemplate[] = [
  /* ------------------------------------------------------------ */
  /* Conjunction fallacy                                            */
  /* ------------------------------------------------------------ */
  {
    id: "conjunction",
    labName: "The Probability Pileup",
    publicTitle: "The Dossier Test",
    icon: "stack",
    category: "numbers",
    shortDescription:
      "One extra juicy detail makes a story feel MORE likely. Math disagrees, loudly.",
    preRevealFrame: "Read one tiny dossier. Make one call.",
    challengeText: "A personnel file and a probability question.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Rates the detailed compound statement as more probable than its own component.",
    escapeCondition: "Notices that A-and-B can never be more probable than A alone.",
    scoringLogic: "Option 'both' = trapped (conjunction fallacy); component alone = escape; 'equal' = suspicious.",
    revealTitleTrapped: "A story can't beat its own ingredients",
    revealTitleEscaped: "You refused the extra plot twist",
    roastCopy: [
      "You just rated 'A and B' as more likely than 'A'. The math department has fainted.",
      "The juicy detail seasoned the story so well you ate the impossible part.",
    ],
    praiseCopy: [
      "You spotted that adding details shrinks probability, even when they add flavor. Chef's kiss.",
      "The vivid version begged to be believed. You checked the arithmetic instead.",
    ],
    principleName: "The conjunction fallacy",
    principleExplanation:
      "A detailed story feels more plausible because it paints a better picture — but every added condition can only make an outcome less probable, never more. In the famous 'Linda problem,' most people rated 'bank teller AND feminist' as more likely than 'bank teller,' which is mathematically impossible.",
    citation: {
      text: "Tversky, A., & Kahneman, D. (1983). Extensional versus intuitive reasoning: The conjunction fallacy in probability judgment. Psychological Review, 90(4), 293–315.",
      url: "https://doi.org/10.1037/0033-295X.90.4.293",
    },
    shareTextTrapped:
      "{creator} handed me a story so vivid I rated it more likely than its own ingredients. Trapped by a plot twist.",
    shareTextEscaped:
      "{creator} tried to sell me an impossible probability wrapped in a juicy story. I did the math instead.",
    ogImageSubtitle: "The Dossier Test",
    slots: [
      { id: "name", label: "Character's name", defaultValue: "Linda" },
      { id: "job", label: "Their plain job", defaultValue: "a librarian" },
      { id: "extra", label: "Their juicy side detail", defaultValue: "runs a true-crime podcast", maxLen: 48 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "personnel file",
      chipIcon: "stack",
      story:
        "{name}, 31. Outspoken. Owns 340 books and highlights them. Argues about documentaries, wins. Which is more probable?",
      question: "Place your bet:",
      options: [
        {
          id: "plain",
          label: "{name} is {job}.",
          result: "clean-escape",
          detail:
            "Correct. '{job}' includes every possible version of {name} — podcast or no podcast. The plain option can't lose to its own subset.",
        },
        {
          id: "both",
          label: "{name} is {job} AND {extra}.",
          result: "lab-incident",
          detail:
            "The compound story felt truer because it fit the vibe — but '{job} AND {extra}' is a subset of '{job}'. A subset can never be more probable than the whole set.",
        },
        {
          id: "equal",
          label: "Exactly equally likely.",
          result: "suspicious-escape",
          detail:
            "Close — you resisted the juicy version. But adding a condition strictly shrinks the odds (unless every {job} on Earth also {extra}, which… no).",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Monty Hall                                                     */
  /* ------------------------------------------------------------ */
  {
    id: "montyhall",
    labName: "The Door Dilemma",
    publicTitle: "The Three Locker Test",
    icon: "door",
    category: "numbers",
    shortDescription:
      "Three lockers, one prize, one smug host. The 'obvious' answer has been wrong since 1990.",
    preRevealFrame: "Three lockers. One prize. One decision.",
    challengeText: "The host knows where the prize is. That's the whole problem.",
    answerType: "choice",
    difficulty: 3,
    estimatedTimeSeconds: 25,
    trapCondition: "Believes the two remaining lockers are 50/50, or stays out of stubbornness.",
    escapeCondition: "Switches — the first pick keeps its 1-in-3 odds; the other locker inherits 2-in-3.",
    scoringLogic: "Switch = escape; '50/50 now' = trapped (the classic error); stay = beautiful disaster.",
    revealTitleTrapped: "The host was doing math at you",
    revealTitleEscaped: "You took the 2-in-3 and ran",
    roastCopy: [
      "You called it 50/50. So did thousands of angry letter-writers in 1990, including some with PhDs. Great company, wrong answer.",
      "Your first pick had a 1-in-3 chance. It did not improve by being yours.",
    ],
    praiseCopy: [
      "You switched. Marilyn vos Savant would like to shake your hand.",
      "You noticed the host's 'help' was actually information. That's the whole game.",
    ],
    principleName: "Conditional probability (the Monty Hall problem)",
    principleExplanation:
      "Your first locker keeps its original 1-in-3 chance no matter what the host does. When the host — who knows where the prize is — eliminates an empty locker, the remaining one inherits the full 2-in-3. Switching doubles your odds, and human intuition hates it so much that studies find fewer than 15% of people switch.",
    citation: {
      text: "Krauss, S., & Wang, X. T. (2003). The psychology of the Monty Hall problem: Discovering psychological mechanisms for solving a tenacious brain teaser. Journal of Experimental Psychology: General, 132(1), 3–22.",
      url: "https://doi.org/10.1037/0096-3445.132.1.3",
    },
    shareTextTrapped:
      "{creator} put me on a game show and my brain said '50/50'. It was not 50/50. It is never 50/50.",
    shareTextEscaped:
      "{creator} tried the Monty Hall trap on me. I switched lockers like a professional. 2-in-3 or nothing.",
    ogImageSubtitle: "The Three Locker Test",
    slots: [
      { id: "prize", label: "The prize", defaultValue: "the last donut in the building", maxLen: 48 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "locker room",
      chipIcon: "door",
      story:
        "Three lockers. Exactly one holds {prize}. You pick locker 1. The lab host — who knows exactly where {prize} is — swings open locker 3: empty. The host grins: “Want to switch to locker 2?”",
      question: "Your move:",
      options: [
        {
          id: "switch",
          label: "Switch to locker 2",
          result: "clean-escape",
          detail:
            "Your first pick was right 1 time in 3. The host's reveal poured the other 2-in-3 into locker 2. Switching wins twice as often.",
        },
        {
          id: "fifty",
          label: "Doesn't matter — it's 50/50 now",
          result: "lab-incident",
          detail:
            "The signature wrong answer. The host didn't reroll the odds — he KNEW where {prize} was and dodged it. Locker 2 carries 2-in-3; your locker still carries 1-in-3.",
        },
        {
          id: "stay",
          label: "Stay — locker 1 chose me",
          result: "beautiful-disaster",
          detail:
            "Loyalty to a metal box with a 1-in-3 chance. The host offered you double the odds and you said 'we ride at dawn.'",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Gambler's fallacy                                              */
  /* ------------------------------------------------------------ */
  {
    id: "gambler",
    labName: "The Streak Mirage",
    publicTitle: "The Lucky Coin Test",
    icon: "coins",
    category: "numbers",
    shortDescription:
      "Five heads in a row and suddenly everyone's a prophet. The coin has no memory.",
    preRevealFrame: "One coin. One streak. One prediction.",
    challengeText: "Call flip number six.",
    answerType: "choice",
    difficulty: 1,
    estimatedTimeSeconds: 15,
    trapCondition: "Believes a fair coin is 'due' for tails (or 'hot' for heads).",
    escapeCondition: "Knows independent flips stay 50/50 regardless of the streak.",
    scoringLogic: "'Tails is due' = trapped; 'heads is hot' = double agent; 50/50 = escape.",
    revealTitleTrapped: "The coin does not remember you",
    revealTitleEscaped: "You let the coin be a coin",
    roastCopy: [
      "You assigned a memory, a conscience, and a sense of fairness to a metal disc.",
      "The coin has flipped five times and owes you nothing. It doesn't even know you're there.",
    ],
    praiseCopy: [
      "Streak-proof. The coin tried to look meaningful and you saw a disc.",
      "50/50, said calmly, while five heads glittered seductively. Well held.",
    ],
    principleName: "The gambler's fallacy",
    principleExplanation:
      "Independent events don't balance themselves out in the short run — a fair coin is exactly 50/50 on every flip, streak or no streak. The belief that small samples must 'look random' is so common that Tversky and Kahneman named it the belief in the law of small numbers.",
    citation: {
      text: "Tversky, A., & Kahneman, D. (1971). Belief in the law of small numbers. Psychological Bulletin, 76(2), 105–110.",
      url: "https://doi.org/10.1037/h0031322",
    },
    shareTextTrapped:
      "{creator} showed me five heads in a row and I decided the coin owed me tails. It owed me nothing.",
    shareTextEscaped:
      "{creator} tried to sell me a 'due' coin flip. Coins don't have debts. I checked.",
    ogImageSubtitle: "The Lucky Coin Test",
    slots: [
      { id: "coinName", label: "The coin", defaultValue: "Grandma's lucky nickel", maxLen: 36 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "flip log",
      chipIcon: "coins",
      story:
        "{coinName} is verifiably fair — the lab checked. It just landed HEADS five times in a row. The whole lab is gathered around for flip six.",
      question: "Flip six will be…",
      options: [
        {
          id: "tails",
          label: "Tails — it's overdue",
          result: "lab-incident",
          detail:
            "That's the gambler's fallacy in its natural habitat. {coinName} doesn't keep accounts. Every flip is a fresh 50/50, even after five heads.",
        },
        {
          id: "heads",
          label: "Heads — it's on a heater",
          result: "double-agent",
          detail:
            "You dodged 'due for tails' and invented a hot streak instead — the same error wearing sunglasses. Fair coins don't heat up.",
        },
        {
          id: "even",
          label: "50/50, same as always",
          result: "clean-escape",
          detail: "Exactly. The streak is decoration. The odds never moved.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Endowment effect                                               */
  /* ------------------------------------------------------------ */
  {
    id: "endowment",
    labName: "The Ownership Tax",
    publicTitle: "The Price Tag Test",
    icon: "mug",
    category: "money",
    shortDescription:
      "The instant something is 'theirs', its price mysteriously doubles. Watch it happen.",
    preRevealFrame: "One object. One price. Name it fast.",
    challengeText: "Price the object. That's it. That's the test.",
    answerType: "number",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Owners demand roughly double what buyers will pay for the identical object.",
    escapeCondition: "Prices the object near its actual value regardless of who owns it.",
    scoringLogic:
      "Random assignment: owner (minimum sell price) vs buyer (willingness to pay), retail fixed at $6. Owner asking ≥$9 = trapped; the reveal compares live group means (classic WTA ≈ 2× WTP).",
    revealTitleTrapped: "Ownership added pure feelings to the price",
    revealTitleEscaped: "You priced the object, not the relationship",
    roastCopy: [
      "You've owned it for eleven seconds and it's already priceless heritage.",
      "The mug didn't change. Your custody of it did. That'll be $3 in feelings, please.",
    ],
    praiseCopy: [
      "You priced it like an appraiser, not like a parent. Rare.",
      "No sentimental markup detected. The gift shop is confused and impressed.",
    ],
    principleName: "The endowment effect",
    principleExplanation:
      "People demand about twice as much to give up an object as they'd pay to acquire it — ownership itself inflates value. In the classic experiments, students given a mug wouldn't sell for less than roughly double what identical non-owners offered, even though the mug was minutes old.",
    citation: {
      text: "Kahneman, D., Knetsch, J. L., & Thaler, R. H. (1990). Experimental tests of the endowment effect and the Coase theorem. Journal of Political Economy, 98(6), 1325–1348.",
      url: "https://doi.org/10.1086/261737",
    },
    shareTextTrapped:
      "{creator} gave me an object for eleven seconds and I priced it like a family heirloom. The Ownership Tax is real.",
    shareTextEscaped:
      "{creator} tried to inflate my price tag with the power of 'mine'. I appraised like a professional.",
    ogImageSubtitle: "The Price Tag Test",
    slots: [
      { id: "object", label: "The object", defaultValue: "commemorative lab mug", maxLen: 40 },
    ],
    challenge: {
      mechanic: "numeric",
      chip: "gift shop",
      chipIcon: "mug",
      question: "Name your price (whole dollars):",
      placeholder: "$",
      min: 0,
      max: 100,
      unit: "$",
      variants: {
        own: {
          story:
            "Congratulations — the lab just gave you this {object}. It retails for $6, and it is now officially yours. A stranger wants to buy it off you right now.",
          question: "What's the minimum you'd sell YOUR {object} for?",
        },
        buy: {
          story:
            "The lab gift shop stocks this {object}. It retails for $6. You don't own one. Be honest:",
          question: "What's the most you'd actually pay for the {object}?",
        },
      },
      bands: [
        {
          variant: "own",
          gte: 9,
          result: "lab-incident",
          detail:
            "It retails for $6. You demanded {value} of someone else's dollars — the difference is the going rate for 'but it's MINE'. Owners in the classic study did exactly this.",
        },
        {
          variant: "own",
          gte: 7,
          result: "suspicious-escape",
          detail:
            "A modest ownership markup over the $6 retail. Your inner appraiser and inner mug-parent are arm-wrestling.",
        },
        {
          variant: "own",
          lte: 2,
          result: "double-agent",
          detail:
            "You'd dump your own {object} for {value} — a third of retail. Not endowed, possibly a flight risk.",
        },
        {
          variant: "own",
          result: "clean-escape",
          detail:
            "Right around the $6 it's actually worth. Ownership didn't add a feelings surcharge — most owners can't manage that.",
        },
        {
          variant: "buy",
          gte: 10,
          result: "suspicious-escape",
          detail:
            "You offered {value} for a $6 {object}. Generous! The gift shop would like your number.",
        },
        {
          variant: "buy",
          result: "clean-escape",
          detail:
            "A buyer's-eye price near what it's worth. Now look at the reveal: subjects who were HANDED one first ask for roughly double. Same {object}.",
        },
      ],
      compare: {
        title: "the ownership tax, measured live",
        labels: { own: "Owners demand", buy: "Buyers offer" },
        unit: "$",
      },
    },
  },

  /* ------------------------------------------------------------ */
  /* Ratio bias / denominator neglect                               */
  /* ------------------------------------------------------------ */
  {
    id: "ratio",
    labName: "The Bigger Bowl Bamboozle",
    publicTitle: "The Prize Draw Test",
    icon: "bowl",
    category: "numbers",
    shortDescription:
      "Nine chances feel bigger than one chance. The percentages would like a word.",
    preRevealFrame: "Two bowls. One free draw. Choose wisely.",
    challengeText: "Pick the bowl with the better odds.",
    answerType: "choice",
    difficulty: 1,
    estimatedTimeSeconds: 15,
    trapCondition: "Picks the bowl with more winning items but worse odds (9/100 over 1/10).",
    escapeCondition: "Computes the ratios: 10% beats 9%.",
    scoringLogic: "Small bowl (10%) = escape; big bowl (9%) = trapped; 'identical' = suspicious.",
    revealTitleTrapped: "Nine felt bigger than one. It wasn't",
    revealTitleEscaped: "You divided. Most people don't",
    roastCopy: [
      "You saw NINE whole winners and your brain threw the denominator in the sea.",
      "More tickets, worse odds, full confidence. The big bowl thanks you for your patronage.",
    ],
    praiseCopy: [
      "You did one division and beat a bias with a 30-year publication record.",
      "10% > 9%. Boring, correct, and rarer than it should be.",
    ],
    principleName: "Ratio bias (denominator neglect)",
    principleExplanation:
      "Brains weigh the count of winners more than the ratio — nine winning beans in a hundred FEELS more winnable than one in ten. In the original study, many people knowingly chose the worse-odds bowl, saying the extra winners just felt luckier. The feeling survives even when you can see the math.",
    citation: {
      text: "Denes-Raj, V., & Epstein, S. (1994). Conflict between intuitive and rational processing: When people behave against their better judgment. Journal of Personality and Social Psychology, 66(5), 819–829.",
      url: "https://doi.org/10.1037/0022-3514.66.5.819",
    },
    shareTextTrapped:
      "{creator} offered me two bowls and I chose the one with MORE winners and WORSE odds. Denominators are apparently optional.",
    shareTextEscaped:
      "{creator} tried to bamboozle me with a bigger bowl. I brought a denominator.",
    ogImageSubtitle: "The Prize Draw Test",
    slots: [
      { id: "prize", label: "What's inside the winning bean", defaultValue: "a golden jellybean", maxLen: 40 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "prize draw",
      chipIcon: "bowl",
      story:
        "One free draw, eyes closed, for {prize}. Bowl A: 10 beans, exactly 1 is a winner. Bowl B: 100 beans, exactly 9 are winners.",
      question: "Which bowl do you draw from?",
      options: [
        {
          id: "small",
          label: "Bowl A — 1 winner in 10",
          result: "clean-escape",
          detail: "10% beats 9%. The small bowl looked stingy and paid better. That's the whole trick.",
        },
        {
          id: "big",
          label: "Bowl B — 9 winners in 100",
          result: "lab-incident",
          detail:
            "Nine winners glitter louder than one — but 9/100 is 9%, and the humble small bowl pays 10%. Your brain kept the numerator and dropped the denominator.",
        },
        {
          id: "same",
          label: "Identical odds either way",
          result: "suspicious-escape",
          detail: "You reached for ratios — respect — but 1/10 is 10% and 9/100 is 9%. Close only counts in horseshoes.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* CRT / bat & ball                                               */
  /* ------------------------------------------------------------ */
  {
    id: "crt",
    labName: "The Obvious Answer",
    publicTitle: "The Quick Math Test",
    icon: "calculator",
    category: "numbers",
    shortDescription:
      "A one-line math problem with an answer that leaps to mind. The leap is the trap.",
    preRevealFrame: "One tiny math question. You already know the answer. Or do you?",
    challengeText: "Solve it. Carefully or quickly — your choice.",
    answerType: "number",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Blurts the intuitive answer (10¢) without checking it.",
    escapeCondition: "Overrides the reflex and computes 5¢.",
    scoringLogic: "$0.05 = genius; $0.10 = trapped (the classic); anything else = beautiful disaster.",
    revealTitleTrapped: "Your fast brain outran your math",
    revealTitleEscaped: "You caught your own reflex mid-leap",
    roastCopy: [
      "The answer arrived instantly, confidently, and wrong — the full package.",
      "Ten cents. Check it: that makes the total $1.20. Your fast brain doesn't do checking.",
    ],
    praiseCopy: [
      "You felt the easy answer tug and audited it anyway. That's cognitive reflection, textbook grade.",
      "Five cents. Verified. Most people — including at MIT — don't stop to verify.",
    ],
    principleName: "Cognitive reflection",
    principleExplanation:
      "Some problems summon a fast, fluent, WRONG answer, and the skill being tested is whether you pause to check it. If the {itemB} cost 10¢, the {itemA} would cost $1.10 and the total $1.20. The correct answer is 5¢ — and in Frederick's original samples, most university students missed it, including at elite schools.",
    citation: {
      text: "Frederick, S. (2005). Cognitive reflection and decision making. Journal of Economic Perspectives, 19(4), 25–42.",
      url: "https://doi.org/10.1257/089533005775196732",
    },
    shareTextTrapped:
      "{creator} asked me a one-line math question. My brain answered before I did. It was wrong. I stand by nothing.",
    shareTextEscaped:
      "{creator} tried the world's most famous trick question on me. I paused. I checked. Five cents.",
    ogImageSubtitle: "The Quick Math Test",
    slots: [
      { id: "itemA", label: "The expensive item", defaultValue: "A taco", maxLen: 30 },
      { id: "itemB", label: "The cheap item", defaultValue: "its salsa", maxLen: 30 },
    ],
    challenge: {
      mechanic: "numeric",
      chip: "quick math",
      chipIcon: "calculator",
      story:
        "{itemA} and {itemB} cost $1.10 in total. {itemA} costs exactly $1.00 more than {itemB}.",
      question: "How much does {itemB} cost, in dollars?",
      placeholder: "0.00",
      min: 0,
      max: 2,
      allowDecimal: true,
      unit: "$",
      bands: [
        {
          eq: 0.05,
          result: "tiny-genius",
          detail:
            "Correct: $0.05 + $1.05 = $1.10, with a gap of exactly $1.00. You heard the easy answer knocking and checked its ID.",
        },
        {
          eq: 0.1,
          result: "lab-incident",
          detail:
            "The classic. If {itemB} were 10¢, {itemA} would be $1.10 and the total $1.20. The right answer is 5¢ — the wrong one just arrives faster.",
        },
        {
          result: "beautiful-disaster",
          detail:
            "You dodged the famous wrong answer (10¢) and the right one (5¢) and found a third path. The lab is genuinely fascinated.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Exponential growth bias                                        */
  /* ------------------------------------------------------------ */
  {
    id: "growth",
    labName: "The Doubling Delusion",
    publicTitle: "The Outbreak Estimate Test",
    icon: "trendingUp",
    category: "numbers",
    shortDescription:
      "Something doubles daily for a month. Their gut will lowball it by a factor of thousands.",
    preRevealFrame: "One contamination report. One estimate. Go with your gut.",
    challengeText: "The infestation doubles daily. Estimate day 30.",
    answerType: "number",
    difficulty: 3,
    estimatedTimeSeconds: 25,
    trapCondition: "Extrapolates linearly and underestimates 2^29 by orders of magnitude.",
    escapeCondition: "Respects the doubling: roughly half a billion.",
    scoringLogic:
      "True answer 2^29 ≈ 536,870,912. Within ~2×: genius; ≥10M: escape; 100K–10M: suspicious; 1K–100K: trapped; <1K: beautiful disaster; ≥5B: double agent.",
    revealTitleTrapped: "Exponentials ate your estimate",
    revealTitleEscaped: "You respected the doubling",
    roastCopy: [
      "Your gut drew a straight line through a curve that goes to the moon.",
      "By day 30 the real number could fill a stadium. Your estimate could fill a shoebox.",
    ],
    praiseCopy: [
      "Half a billion. You actually multiplied instead of vibing. The curve salutes you.",
      "You felt the linear tug and doubled right past it. Exponentially respectable.",
    ],
    principleName: "Exponential growth bias",
    principleExplanation:
      "Human intuition extrapolates in straight lines, so repeated doubling gets underestimated catastrophically — and the error GROWS with every step. Starting from one on day 1, doubling daily reaches 2^29 ≈ 537 million by day 30. In the original studies, most people's estimates were off by orders of magnitude, even with the rule stated plainly.",
    citation: {
      text: "Wagenaar, W. A., & Sagaria, S. D. (1975). Misperception of exponential growth. Perception & Psychophysics, 18(6), 416–422.",
      url: "https://doi.org/10.3758/BF03204114",
    },
    shareTextTrapped:
      "{creator} asked me to estimate a doubling. I was off by several zoos' worth of zeros. Exponentials remain undefeated.",
    shareTextEscaped:
      "{creator} bet my gut couldn't handle exponential growth. Half a billion, delivered by hand.",
    ogImageSubtitle: "The Outbreak Estimate Test",
    slots: [
      { id: "thing", label: "What's multiplying (singular)", defaultValue: "glitter particle", maxLen: 32, hint: "e.g. 'sentient sourdough starter'" },
    ],
    challenge: {
      mechanic: "numeric",
      chip: "containment report",
      chipIcon: "trendingUp",
      story:
        "Day 1: exactly one {thing} is loose in the lab. The population doubles every day. Containment has… not started.",
      question: "How many {thing}s on day 30? (Gut estimate — no calculator.)",
      placeholder: "your estimate",
      min: 1,
      max: 1_000_000_000_000,
      bands: [
        {
          gte: 268_000_000,
          lte: 1_100_000_000,
          result: "tiny-genius",
          detail:
            "The true count is 2²⁹ = 536,870,912. You landed within shouting distance of half a billion — your gut can apparently do exponents.",
        },
        {
          gte: 5_000_000_000,
          result: "double-agent",
          detail:
            "The true count is 536,870,912. You overshot into the multi-billions — wrong direction from everyone else, which is its own achievement.",
        },
        {
          gte: 10_000_000,
          result: "clean-escape",
          detail:
            "True count: 536,870,912. You guessed {value} — the right order-of-magnitude neighborhood, which beats the vast majority of human guts.",
        },
        {
          gte: 100_000,
          result: "suspicious-escape",
          detail:
            "True count: 536,870,912. Your {value} kept some respect for the curve but still lowballed it by a factor of thousands-ish.",
        },
        {
          gte: 1_000,
          result: "lab-incident",
          detail:
            "True count: 536,870,912 — your {value} missed by several orders of magnitude. Straight-line brain, exponential {thing}s.",
        },
        {
          result: "beautiful-disaster",
          detail:
            "True count: 536,870,912. You guessed {value}. The {thing}s have already unionized and your estimate hasn't noticed.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Survivorship bias                                              */
  /* ------------------------------------------------------------ */
  {
    id: "survivorship",
    labName: "The Bullet Hole Blunder",
    publicTitle: "The Drone Fleet Test",
    icon: "plane",
    category: "stories",
    shortDescription:
      "The damage they can see is exactly the damage that doesn't matter. A WWII classic.",
    preRevealFrame: "The fleet is limping home. Make the call.",
    challengeText: "Armor is heavy. Choose where it goes.",
    answerType: "choice",
    difficulty: 3,
    estimatedTimeSeconds: 25,
    trapCondition: "Armors where returning units show damage — the spots survivors can afford to be hit.",
    escapeCondition: "Realizes the missing data: units hit elsewhere never made it back.",
    scoringLogic: "Armor the clean spots = genius (Wald's insight); armor the holes = trapped; spread evenly = suspicious.",
    revealTitleTrapped: "You studied the survivors and ignored the missing",
    revealTitleEscaped: "You heard the silence in the data",
    roastCopy: [
      "You armored the spots where {fleet} can get hit and still come home. The ones hit elsewhere sent no feedback. They couldn't.",
      "The dataset you studied was pre-filtered by survival. It flattered you.",
    ],
    praiseCopy: [
      "You asked the question that saved actual bombers: where are the holes NOT? Abraham Wald would nod slowly.",
      "You noticed the missing planes — the loudest data point is the one that never lands.",
    ],
    principleName: "Survivorship bias",
    principleExplanation:
      "Data that survives a filter misleads you about the whole population. In WWII, analysts wanted to armor bombers where returning planes showed holes — until statistician Abraham Wald pointed out those were the survivable hits. Planes struck in the clean zones never came back to be counted. Armor the places with no holes.",
    citation: {
      text: "Mangel, M., & Samaniego, F. J. (1984). Abraham Wald's work on aircraft survivability. Journal of the American Statistical Association, 79(386), 259–267.",
      url: "https://doi.org/10.1080/01621459.1984.10478038",
    },
    shareTextTrapped:
      "{creator} showed me a fleet of survivors and I armored exactly the wrong spots. The missing drones had notes for me.",
    shareTextEscaped:
      "{creator} tried the WWII bomber trap on me. I armored the clean spots like Abraham Wald's understudy.",
    ogImageSubtitle: "The Drone Fleet Test",
    slots: [
      { id: "fleet", label: "The fleet", defaultValue: "delivery drones", maxLen: 36 },
      { id: "damage", label: "The damage", defaultValue: "paintball hits", maxLen: 36 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "hangar report",
      chipIcon: "plane",
      story:
        "Your {fleet} run a gauntlet every day, and some don't come back. Every unit that RETURNS is covered in {damage} on the wings and tail — and spotless around the engines. You can afford armor for one zone.",
      question: "Where does the armor go?",
      options: [
        {
          id: "holes",
          label: "Wings and tail — where the {damage} are",
          result: "lab-incident",
          detail:
            "You armored the survivable zones. Units hit in the engines never made it home to show you their {damage} — the returning fleet is a pre-filtered dataset.",
        },
        {
          id: "spread",
          label: "Spread it evenly — cover everything a little",
          result: "suspicious-escape",
          detail:
            "Diplomatic, but the data was trying to tell you something specific: the clean zones on survivors are the fatal zones on the missing.",
        },
        {
          id: "clean",
          label: "The engine zone — where returning units have NO {damage}",
          result: "tiny-genius",
          detail:
            "Wald's exact insight. Survivors show you where hits are survivable; the missing units were hit where your survivors are clean. Armor the silence.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Omission bias                                                  */
  /* ------------------------------------------------------------ */
  {
    id: "omission",
    labName: "The Do-Nothing Doctrine",
    publicTitle: "The Firmware Test",
    icon: "robot",
    category: "stories",
    shortDescription:
      "Harm from acting feels worse than bigger harm from doing nothing. Robots will be lost either way.",
    preRevealFrame: "The fleet needs a decision by end of day.",
    challengeText: "Update the firmware, or don't. Robots hang in the balance.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Refuses the action that causes small harm, accepting larger harm by inaction.",
    escapeCondition: "Compares the numbers: 5 lost by acting beats 10 lost by waiting.",
    scoringLogic: "Update (5/10,000) = escape; skip (10/10,000) = trapped.",
    revealTitleTrapped: "Doing nothing was also a decision",
    revealTitleEscaped: "You did the math on inaction",
    roastCopy: [
      "You chose double the losses, but hey — at least it wasn't YOUR finger on the button.",
      "Inaction felt clean. The five extra bricked {robots} disagree from the recycling bin.",
    ],
    praiseCopy: [
      "You treated 'do nothing' as exactly what it is: an option with a body count.",
      "Five beats ten, even when the five feels like your fault. Coldly, correctly done.",
    ],
    principleName: "Omission bias",
    principleExplanation:
      "Harm caused by action feels morally heavier than the same (or greater) harm from inaction, so people refuse protective actions with small risks even when doing nothing is riskier. In the classic studies, many parents rejected a hypothetical vaccine whose risk was half the disease's — because at least the disease wouldn't be 'their doing.'",
    citation: {
      text: "Ritov, I., & Baron, J. (1990). Reluctance to vaccinate: Omission bias and ambiguity. Journal of Behavioral Decision Making, 3(4), 263–277.",
      url: "https://doi.org/10.1002/bdm.3960030404",
    },
    shareTextTrapped:
      "{creator} gave me a choice between small harm by action and double harm by inaction. I chose vibes. The robots paid.",
    shareTextEscaped:
      "{creator} tried to guilt me into expensive inaction. I ran the numbers and pressed the button.",
    ogImageSubtitle: "The Firmware Test",
    slots: [
      { id: "robots", label: "The fleet (plural)", defaultValue: "floor-mopping robots", maxLen: 40 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "ops decision",
      chipIcon: "robot",
      story:
        "Your 10,000 {robots} face a spreading virus. If you do nothing, it will permanently brick 10 of every 10,000. The patch stops the virus completely — but its installation glitch permanently bricks 5 of every 10,000.",
      question: "End of day. Your call:",
      options: [
        {
          id: "update",
          label: "Push the patch — lose ~5, save the rest",
          result: "clean-escape",
          detail:
            "Five bricked {robots} by your hand beats ten by your hesitation. You resisted the pull to keep your fingerprints off the outcome.",
        },
        {
          id: "skip",
          label: "Hold off — don't risk the patch",
          result: "lab-incident",
          detail:
            "The patch would lose 5; the virus takes 10. 'Not doing anything' felt safer because the losses wouldn't be your doing — but they'd be twice as many.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Money illusion                                                 */
  /* ------------------------------------------------------------ */
  {
    id: "moneyillusion",
    labName: "The Raise Ruse",
    publicTitle: "The Payday Test",
    icon: "cash",
    category: "money",
    shortDescription:
      "A bigger number on the paycheck, a worse deal in reality. Inflation hides in plain sight.",
    preRevealFrame: "Two paydays. One judgment call.",
    challengeText: "Who actually got the better deal?",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Judges the raise by its face number, ignoring inflation.",
    escapeCondition: "Computes real purchasing power: 2% − 0% beats 5% − 4%.",
    scoringLogic: "NameA (2% real) = escape; NameB (1% real) = trapped; 'same' = suspicious.",
    revealTitleTrapped: "The bigger number mugged you",
    revealTitleEscaped: "You saw through the nominal glow",
    roastCopy: [
      "You cheered for the 5% raise that buys 1% more stuff. The number was doing a costume party.",
      "Nominal dollars flexed. Real dollars sighed. You applauded the flex.",
    ],
    praiseCopy: [
      "You subtracted inflation like it owed you money. Real purchasing power appreciates you.",
      "Two percent real beats one percent real, no matter how shiny the five looked.",
    ],
    principleName: "Money illusion",
    principleExplanation:
      "People evaluate money by its face amount instead of its purchasing power. A 5% raise during 4% inflation buys you 1% more; a 2% raise with 0% inflation buys 2% more — yet the bigger nominal number reliably feels like the better deal, drives satisfaction, and wins arguments it should lose.",
    citation: {
      text: "Shafir, E., Diamond, P., & Tversky, A. (1997). Money illusion. Quarterly Journal of Economics, 112(2), 341–374.",
      url: "https://doi.org/10.1162/003355397555208",
    },
    shareTextTrapped:
      "{creator} showed me two raises and I picked the shiny number over the actual money. Inflation sends its regards.",
    shareTextEscaped:
      "{creator} tried to dazzle me with a big nominal raise. I did the subtraction. Real dollars only.",
    ogImageSubtitle: "The Payday Test",
    slots: [
      { id: "nameA", label: "First person", defaultValue: "Ana", maxLen: 24 },
      { id: "nameB", label: "Second person", defaultValue: "Bo", maxLen: 24 },
    ],
    challenge: {
      mechanic: "choice",
      chip: "payroll files",
      chipIcon: "cash",
      story:
        "{nameA} gets a 2% raise in a year with 0% inflation. {nameB} gets a 5% raise in a year with 4% inflation. Same job, same salary before the raise.",
      question: "Economically, who got the better deal?",
      options: [
        {
          id: "a",
          label: "{nameA} — 2% raise, 0% inflation",
          result: "clean-escape",
          detail:
            "{nameA} can buy 2% more stuff; {nameB} only 1% more. You priced the money by what it buys, not by its outfit.",
        },
        {
          id: "b",
          label: "{nameB} — 5% raise, 4% inflation",
          result: "lab-incident",
          detail:
            "{nameB}'s 5% is mostly costume: after 4% inflation it buys just 1% more. {nameA}'s modest 2% buys twice that. The face number got you.",
        },
        {
          id: "same",
          label: "It works out the same",
          result: "suspicious-escape",
          detail:
            "You clearly smelled the inflation trick — but 2−0 = 2 and 5−4 = 1. {nameA} wins by a full percent of actual stuff.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Letter frequency / availability by retrieval ease              */
  /* ------------------------------------------------------------ */
  {
    id: "letterfreq",
    labName: "The Third Letter Heist",
    publicTitle: "The Word Nerd Test",
    icon: "letterR",
    category: "numbers",
    shortDescription:
      "A vocabulary question their brain will answer with a search engine that lies.",
    preRevealFrame: "One question about the dictionary. No dictionary allowed.",
    challengeText: "English words and the letter R. Choose.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 15,
    trapCondition: "Judges frequency by how easily examples come to mind (R-first words are easy to recall).",
    escapeCondition: "Knows retrieval ease isn't frequency — R is far more common in third position.",
    scoringLogic: "'Third letter' = escape; 'first letter' = trapped; 'equal' = suspicious.",
    revealTitleTrapped: "Your brain searched by first letter and called it a census",
    revealTitleEscaped: "You mistrusted your own search engine",
    roastCopy: [
      "Rabbit! River! Robot! — your brain, conducting what it sincerely believed was statistics.",
      "You polled the words that volunteer and skipped the ones that hide. 'Car', 'bird', and 'street' wave from third position.",
    ],
    praiseCopy: [
      "You noticed that easy-to-recall isn't the same as common. That distinction does a lot of heavy lifting in life.",
      "Third position. Correct — words surrender alphabetically, not statistically.",
    ],
    principleName: "The availability heuristic (retrieval fluency)",
    principleExplanation:
      "Brains index words by their first letter, so R-first words leap to mind and feel plentiful — but English actually has far more words with R third ('car', 'bird', 'street', 'params'…). Tversky and Kahneman used exactly this task to show we estimate frequency by how easily examples surface, and mostly they surface by spelling, not by count.",
    citation: {
      text: "Tversky, A., & Kahneman, D. (1973). Availability: A heuristic for judging frequency and probability. Cognitive Psychology, 5(2), 207–232.",
      url: "https://doi.org/10.1016/0010-0285(73)90033-9",
    },
    shareTextTrapped:
      "{creator} asked me a dictionary question and my brain answered with vibes sorted alphabetically. Wrong vibes.",
    shareTextEscaped:
      "{creator} tried to fool my internal dictionary. I know how my own search index lies to me.",
    ogImageSubtitle: "The Word Nerd Test",
    challenge: {
      mechanic: "choice",
      chip: "dictionary duel",
      chipIcon: "letterR",
      story: "Consider all the words in English. Quick — from the gut:",
      question: "Are there more words where R is the FIRST letter, or the THIRD letter?",
      options: [
        {
          id: "first",
          label: "First letter — R words are everywhere",
          result: "lab-incident",
          detail:
            "R-first words FEEL abundant because your brain files words alphabetically — they volunteer instantly. English actually holds far more R-third words ('car', 'bird', 'street'…), but they don't come when called.",
        },
        {
          id: "third",
          label: "Third letter",
          result: "clean-escape",
          detail:
            "Correct — and the deeper win is knowing WHY it feels wrong: recall runs on first letters, so the easy examples were rigged from the start.",
        },
        {
          id: "equal",
          label: "About the same",
          result: "suspicious-escape",
          detail:
            "A cautious hedge — but third position wins by a wide margin. Your retrieval engine still got partial say in that answer.",
        },
      ],
    },
  },
];
