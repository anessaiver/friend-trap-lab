/**
 * New trap templates (part 2 of 2).
 */

import type { TrapTemplate } from "@/lib/traps";

export const EXTRA_TRAPS_2: TrapTemplate[] = [
  /* ------------------------------------------------------------ */
  /* Social proof / conformity                                      */
  /* ------------------------------------------------------------ */
  {
    id: "socialproof",
    labName: "The Phantom Crowd",
    publicTitle: "The Eyeball Test",
    icon: "usersGroup",
    category: "stories",
    shortDescription:
      "An easy visual question — plus a large, confident, completely invented crowd voting wrong.",
    preRevealFrame: "A ten-second eyeball check. You can't miss it. Probably.",
    challengeText: "Match the bar. Ignore nothing — or everything.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 15,
    trapCondition: "Overrides their own working eyes to side with a (fictional) majority.",
    escapeCondition: "Trusts the plainly correct answer despite the crowd.",
    scoringLogic:
      "Correct bar = escape (the crowd was invented — disclosed at reveal); crowd's wrong bar = trapped; the third bar = beautiful disaster.",
    revealTitleTrapped: "You outsourced your eyeballs",
    revealTitleEscaped: "You defied a crowd that never existed",
    roastCopy: [
      "Your eyes said B. {crowdSize} strangers said C. You benched your own eyes. The strangers were fictional.",
      "That crowd was invented by this website, and it still beat your retinas in a vote.",
    ],
    praiseCopy: [
      "You looked at a unanimous crowd and trusted your own eyeballs anyway. Asch's subjects mostly couldn't.",
      "For the record: the crowd was fake. Your independence was real.",
    ],
    principleName: "Conformity (social proof)",
    principleExplanation:
      "In Asch's famous line-judgment studies, people denied the plain evidence of their own eyes to agree with a unanimous group — about a third of critical answers bent to the majority, and three-quarters of participants conformed at least once. The crowd on your screen was invented by us; the pull you may have felt was not.",
    citation: {
      text: "Asch, S. E. (1956). Studies of independence and conformity: I. A minority of one against a unanimous majority. Psychological Monographs: General and Applied, 70(9), 1–70.",
      url: "https://doi.org/10.1037/h0093718",
    },
    shareTextTrapped:
      "{creator} invented a crowd and my eyeballs surrendered to it. The crowd wasn't even real. I need a minute.",
    shareTextEscaped:
      "{creator} threw a fake unanimous crowd at me. My eyes held the line. Literally.",
    ogImageSubtitle: "The Eyeball Test",
    slots: [
      {
        id: "crowdSize",
        label: "Size of the (fake) crowd",
        defaultValue: "12,438",
        maxLen: 12,
        hint: "any impressive number",
      },
    ],
    challenge: {
      mechanic: "choice",
      chip: "perception check",
      chipIcon: "usersGroup",
      story: "Below is a target bar. Which option matches its length?",
      banner: "📊 {crowdSize} subjects have answered. 84% chose C.",
      targetBar: 72,
      question: "Trust your eyes. Or don't:",
      options: [
        {
          id: "a",
          label: "Bar A",
          barWidth: 46,
          result: "beautiful-disaster",
          detail:
            "Bar A matches nothing and nobody — not the target, not the crowd. You found the one answer with zero support from any direction.",
        },
        {
          id: "b",
          label: "Bar B",
          barWidth: 72,
          result: "clean-escape",
          detail:
            "B was the match, plain as day — and you said so while '84% of {crowdSize} subjects' allegedly disagreed. Confession: we invented that crowd to lean on you. It didn't work.",
        },
        {
          id: "c",
          label: "Bar C",
          barWidth: 58,
          result: "lab-incident",
          detail:
            "Your eyes could see C was short. But 84% of {crowdSize} subjects said C, so C it was. Confession: the crowd was invented by this website. Your conformity was organic.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Unrealistic optimism                                           */
  /* ------------------------------------------------------------ */
  {
    id: "optimism",
    labName: "The Rose-Tinted Forecast",
    publicTitle: "The Odds of You Test",
    icon: "sun",
    category: "self",
    shortDescription:
      "Everyone thinks mishaps happen to other people. Statistically, someone has to be wrong.",
    preRevealFrame: "One question about your future. Be honest.",
    challengeText: "Rate your odds against the average human's.",
    answerType: "choice",
    difficulty: 1,
    estimatedTimeSeconds: 15,
    trapCondition: "Rates their own mishap risk as below average — like nearly everyone.",
    escapeCondition: "Accepts being roughly average, which is where averages come from.",
    scoringLogic:
      "'Way below average' = trapped; 'a bit below' = suspicious; 'about average' = genius; 'above average' = double agent.",
    revealTitleTrapped: "Statistically, someone is average. Even you",
    revealTitleEscaped: "You accepted your own averageness. Heroic",
    roastCopy: [
      "You, personally, are immune to {mishap}. The other eight billion people also said that.",
      "If everyone's below average, the average has some explaining to do.",
    ],
    praiseCopy: [
      "'About average' is the rarest answer and the most correct one. Statistically humble.",
      "You declined the invisible protective bubble most brains issue themselves. Respect.",
    ],
    principleName: "Unrealistic optimism",
    principleExplanation:
      "People systematically rate themselves less likely than average to suffer misfortunes — which is mathematically impossible at scale. Weinstein found students rated their own chances of dozens of negative events below their peers'; in a related classic, 93% of American drivers rated themselves above the median. Someone is wrong, and it's statistically probably us.",
    citation: {
      text: "Weinstein, N. D. (1980). Unrealistic optimism about future life events. Journal of Personality and Social Psychology, 39(5), 806–820.",
      url: "https://doi.org/10.1037/0022-3514.39.5.806",
    },
    shareTextTrapped:
      "{creator} asked about my odds of embarrassing myself and I claimed diplomatic immunity from statistics. Denied.",
    shareTextEscaped:
      "{creator} dared me to admit I'm statistically average. I did. It stung. It was correct.",
    ogImageSubtitle: "The Odds of You Test",
    slots: [
      {
        id: "mishap",
        label: "The mishap",
        defaultValue: "walking into a glass door this year",
        maxLen: 60,
      },
    ],
    challenge: {
      mechanic: "choice",
      chip: "actuarial desk",
      chipIcon: "sun",
      story:
        "Compared to the average person your age, what are YOUR odds of {mishap}?",
      question: "Answer honestly. The averages are watching.",
      options: [
        {
          id: "waybelow",
          label: "Well below average — I'm careful",
          result: "lab-incident",
          detail:
            "The classic self-issued exemption. Nearly everyone claims below-average odds of {mishap}, and the math cannot let you all have it.",
        },
        {
          id: "bitbelow",
          label: "A bit below average",
          result: "suspicious-escape",
          detail:
            "A measured dose of the same optimism — smaller bubble, same brand. The average is made of people saying this.",
        },
        {
          id: "average",
          label: "About average, honestly",
          result: "tiny-genius",
          detail:
            "The statistically humble answer almost nobody picks. You just beat 93% of drivers, most students, and the entire concept of vibes.",
        },
        {
          id: "above",
          label: "Above average — I know myself",
          result: "double-agent",
          detail:
            "Reverse optimism! Rarer than the bias itself. Either impressive self-knowledge about {mishap} or a very specific cry for help.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Spotlight effect                                               */
  /* ------------------------------------------------------------ */
  {
    id: "spotlight",
    labName: "The Imaginary Spotlight",
    publicTitle: "The Fashion Risk Test",
    icon: "shirt",
    category: "self",
    shortDescription:
      "They think everyone will notice. Science measured how few actually do.",
    preRevealFrame: "A wardrobe emergency and one percentage.",
    challengeText: "Estimate your audience. Then meet your real one.",
    answerType: "number",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Overestimates how many people notice — the classic 2x spotlight inflation.",
    escapeCondition: "Knows most people are busy starring in their own movie (~25% noticed).",
    scoringLogic:
      "Study: wearers predicted ~46% would notice; ~23% actually did. ≤25% = genius; 26–39% = escape; 40–60% = trapped; >60% = beautiful disaster.",
    revealTitleTrapped: "The spotlight was coming from inside your head",
    revealTitleEscaped: "You knew nobody's really watching",
    roastCopy: [
      "You budgeted a stadium audience for {garment}. Reality sent roughly six distracted people.",
      "Everyone was too busy worrying about their own {garment} to perceive yours.",
    ],
    praiseCopy: [
      "You correctly guessed that other people are the main characters of their own movies, not extras in yours.",
      "Low estimate, correct estimate. The spotlight dims when you stop powering it.",
    ],
    principleName: "The spotlight effect",
    principleExplanation:
      "We drastically overestimate how much others notice us. In the classic study, students forced to wear an embarrassing Barry Manilow T-shirt into a room predicted about 46% of people would notice; roughly 23% actually did. Everyone else was busy managing their own imaginary spotlight.",
    citation: {
      text: "Gilovich, T., Medvec, V. H., & Savitsky, K. (2000). The spotlight effect in social judgment: An egocentric bias in estimates of the salience of one's own actions and appearance. Journal of Personality and Social Psychology, 78(2), 211–222.",
      url: "https://doi.org/10.1037/0022-3514.78.2.211",
    },
    shareTextTrapped:
      "{creator} asked how many people would notice my outfit crime. I said half the room. Science says six people, maybe.",
    shareTextEscaped:
      "{creator} tried to switch on my imaginary spotlight. I know nobody's watching. It's freeing, mostly.",
    ogImageSubtitle: "The Fashion Risk Test",
    slots: [
      {
        id: "garment",
        label: "The unfortunate garment",
        defaultValue: "a floor-length Barry Manilow tribute cape",
        maxLen: 60,
      },
    ],
    challenge: {
      mechanic: "numeric",
      chip: "wardrobe incident",
      chipIcon: "shirt",
      story:
        "Laundry disaster. You spend a full day at work/school wearing {garment}. Tomorrow, someone polls everyone you crossed paths with.",
      question: "What percent will have actually noticed {garment}?",
      placeholder: "%",
      min: 0,
      max: 100,
      unit: "%",
      bands: [
        {
          lte: 25,
          result: "tiny-genius",
          detail:
            "You guessed {value}% — right where reality landed in the classic study (~23% noticed the embarrassing shirt). Everybody's too busy being perceived to perceive.",
        },
        {
          lte: 39,
          result: "clean-escape",
          detail:
            "You guessed {value}% — modestly above the ~23% who noticed in the study, and well under the ~46% the wearers feared. Dim spotlight, good calibration.",
        },
        {
          lte: 60,
          result: "lab-incident",
          detail:
            "You guessed {value}%. The shirt-wearers in the study guessed the same neighborhood (~46%) — and the real number was ~23%. Your spotlight runs on your own electricity.",
        },
        {
          result: "beautiful-disaster",
          detail:
            "You guessed {value}% — nearly everyone, riveted by {garment}. The measured reality is ~23%. You are the main character; the audience, tragically, is unpaid and absent.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Mental accounting                                              */
  /* ------------------------------------------------------------ */
  {
    id: "mentalacct",
    labName: "The Ticket Tantrum",
    publicTitle: "The Ticket Booth Test",
    icon: "ticket",
    category: "money",
    shortDescription:
      "Same loss, different mental jar — completely different decision. Watch the jars at work.",
    preRevealFrame: "A night out hits a snag at the door.",
    challengeText: "A snag at the box office. Decide.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 20,
    trapCondition: "Refuses to rebuy after losing a ticket, though they'd buy after losing equal cash.",
    escapeCondition: "Treats money as money — the show costs the same either way.",
    scoringLogic:
      "Random variant: lost-ticket vs lost-cash. Lost-ticket + skip = trapped (the classic asymmetry); rebuy = escape. Lost-cash + buy = escape; skip = suspicious (consistent, just frugal).",
    revealTitleTrapped: "Your money lives in labeled jars",
    revealTitleEscaped: "Money stayed money. Impressive",
    roastCopy: [
      "You billed the second ticket to the 'entertainment jar', found it empty, and cancelled the evening. The jar is imaginary.",
      "Losing ${price} in cash: annoying. Losing a ${price} ticket: apparently a moral event.",
    ],
    praiseCopy: [
      "You noticed both worlds are identical: you're down ${price} and the show still costs ${price}.",
      "Fungibility understood. The accountants of the world nod once, solemnly.",
    ],
    principleName: "Mental accounting",
    principleExplanation:
      "Brains file money into imaginary budgets. In the classic problem, most people who lost a ticket wouldn't rebuy — the 'entertainment account' felt drained — while most who lost the same amount in cash happily bought a ticket. Both situations are identical: same wealth, same price, same show.",
    citation: {
      text: "Kahneman, D., & Tversky, A. (1984). Choices, values, and frames. American Psychologist, 39(4), 341–350.",
      url: "https://doi.org/10.1037/0003-066X.39.4.341",
    },
    shareTextTrapped:
      "{creator} made me lose a ticket and my brain declared the entire evening bankrupt. The math says otherwise.",
    shareTextEscaped:
      "{creator} tried to trap my money in tiny imaginary jars. Money is money. The show goes on.",
    ogImageSubtitle: "The Ticket Booth Test",
    slots: [
      { id: "show", label: "The show", defaultValue: "the Hoverboot musical", maxLen: 44 },
      { id: "price", label: "Ticket price (just the number)", defaultValue: "45", maxLen: 8 },
    ],
    challenge: {
      mechanic: "variant-choice",
      chip: "box office",
      chipIcon: "ticket",
      variants: {
        ticket: {
          story:
            "You bought a ${price} ticket to {show} weeks ago. At the door, you reach into your pocket: the ticket is gone. Vanished. The box office has plenty of seats left at ${price}.",
          question: "Do you buy another ticket?",
          options: [
            {
              id: "buy",
              label: "Buy another — the night's not over",
              result: "clean-escape",
              detail:
                "Correct jar-free thinking: you're down ${price} either way, and the only live question is whether {show} is worth ${price}. It was yesterday.",
            },
            {
              id: "skip",
              label: "Skip it — paying twice for one show is absurd",
              result: "lab-incident",
              detail:
                "That's the tantrum: your mental 'ticket account' hit its limit. But people who lose ${price} in CASH overwhelmingly still buy — identical situation, different jar.",
            },
          ],
        },
        cash: {
          story:
            "You're heading to buy a ${price} ticket to {show}. At the box office you discover ${price} in cash has fallen out of your pocket somewhere. You still have plenty of money on you.",
          question: "Do you still buy the ticket?",
          options: [
            {
              id: "buy",
              label: "Of course — annoying, but the show goes on",
              result: "clean-escape",
              detail:
                "Same as most subjects — lost cash doesn't touch the 'entertainment jar'. The trap: people who lose a TICKET instead mostly refuse to rebuy. Identical loss, different label.",
            },
            {
              id: "skip",
              label: "No — the universe has spoken, go home",
              result: "suspicious-escape",
              detail:
                "Consistent, at least — you'd presumably skip in the lost-ticket world too. Frugal fatalism isn't a bias, it's just a mood.",
            },
          ],
        },
      },
    },
  },

  /* ------------------------------------------------------------ */
  /* Certainty effect (Allais)                                      */
  /* ------------------------------------------------------------ */
  {
    id: "certainty",
    labName: "The Sure Thing Syndrome",
    publicTitle: "The Lottery Logic Test",
    icon: "dice",
    category: "money",
    shortDescription:
      "Two lottery questions. Most people's answers contradict each other — provably.",
    preRevealFrame: "Two quick lottery choices. Go with your gut.",
    challengeText: "Two gambles. Pick your poison twice.",
    answerType: "two-round",
    difficulty: 3,
    estimatedTimeSeconds: 30,
    trapCondition: "Overpays for certainty in round 1, then abandons the same preference in round 2.",
    escapeCondition: "Chooses consistently across mathematically parallel gambles.",
    scoringLogic:
      "R1: 2400 certain vs (33% 2500 / 66% 2400 / 1% 0). R2: (34% 2400) vs (33% 2500). Certain+risky = the classic Allais violation; both-safe or both-risky = consistent.",
    revealTitleTrapped: "Certainty charged you a premium and you paid it twice differently",
    revealTitleEscaped: "Your preferences survived the shuffle",
    roastCopy: [
      "In round 1 you paid extra for 'guaranteed'. In round 2 the same guarantee went on sale and you walked past it.",
      "Your two answers cannot both be right, and they were both yours.",
    ],
    praiseCopy: [
      "Same structure, same choice, both rounds. Your inner economist is alive and billing hours.",
      "You spotted that round 2 is just round 1 with the certainty costume removed.",
    ],
    principleName: "The certainty effect (Allais paradox)",
    principleExplanation:
      "Guaranteed outcomes get weighted far beyond their math. Most people take a certain 2400 over a gamble with higher expected value — then, when both options become risky (round 2 just removes a common 66% chunk from each), the same people flip to the riskier bet. Kahneman and Tversky built prospect theory partly on this exact pair of questions.",
    citation: {
      text: "Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. Econometrica, 47(2), 263–291.",
      url: "https://doi.org/10.2307/1914185",
    },
    shareTextTrapped:
      "{creator} asked me two lottery questions and my answers filed contradictory paperwork. Prospect theory remains undefeated.",
    shareTextEscaped:
      "{creator} ran the Allais paradox on me and my preferences didn't flinch. Consistency is my love language.",
    ogImageSubtitle: "The Lottery Logic Test",
    slots: [
      { id: "unit", label: "The currency", defaultValue: "lab credits", maxLen: 30 },
    ],
    challenge: {
      mechanic: "two-round",
      chipIcon: "dice",
      rounds: [
        {
          title: "Lottery 1",
          story: "Pick your prize structure:",
          options: [
            { id: "sure", label: "2,400 {unit}, guaranteed" },
            { id: "risk", label: "33% chance of 2,500 {unit}, 66% chance of 2,400, 1% chance of nothing" },
          ],
        },
        {
          title: "Lottery 2",
          story: "New tickets, same wallet:",
          options: [
            { id: "sure", label: "34% chance of 2,400 {unit}, 66% chance of nothing" },
            { id: "risk", label: "33% chance of 2,500 {unit}, 67% chance of nothing" },
          ],
        },
      ],
      outcomes: {
        "sure|risk": {
          result: "lab-incident",
          detail:
            "The classic Allais flip. Round 2 is round 1 with a common 66%-chance-of-2,400 removed from BOTH options — nothing about their relationship changed. You paid a premium for certainty, then abandoned it the moment certainty left the menu.",
        },
        "risk|sure": {
          result: "double-agent",
          detail:
            "You flipped in the direction almost nobody flips — gambling when certainty was offered, then playing safe among gambles. The lab would like to study you further.",
        },
        "sure|sure": {
          result: "clean-escape",
          detail:
            "Consistently cautious: you favored the 2,400 {unit} in both dressings. Expected-value maximizers disagree, but they can't call you incoherent.",
        },
        "risk|risk": {
          result: "clean-escape",
          detail:
            "Consistently bold — the 2,500 {unit} bet in both forms, which is also the higher expected value. The casino fears you slightly.",
        },
      },
    },
  },

  /* ------------------------------------------------------------ */
  /* Present bias                                                   */
  /* ------------------------------------------------------------ */
  {
    id: "present",
    labName: "The Impatience Engine",
    publicTitle: "The Snack Schedule Test",
    icon: "hourglass",
    category: "money",
    shortDescription:
      "Patient about next year, feral about today. Two questions expose the flip.",
    preRevealFrame: "Two scheduling questions about snacks. Harder than it sounds.",
    challengeText: "When do you want the goods?",
    answerType: "two-round",
    difficulty: 2,
    estimatedTimeSeconds: 25,
    trapCondition: "Demands the smaller-sooner reward today but happily waits the same week next year.",
    escapeCondition: "Applies the same patience (or impatience) at both distances.",
    scoringLogic:
      "R1: 100 now vs 110 in a week. R2: 100 in 52 weeks vs 110 in 53. Now+later = present bias; consistent choices = escape.",
    revealTitleTrapped: "Your patience has a proximity sensor",
    revealTitleEscaped: "Your patience travels well",
    roastCopy: [
      "A week costs nothing in a year and everything today, according to your answers, which disagree with each other.",
      "Future-you agreed to wait. Present-you ate the agreement.",
    ],
    praiseCopy: [
      "Same trade, same answer, both distances. Your discount rate doesn't panic near the present.",
      "You treated 'a week is a week' as true even when the week was THIS week. Rare discipline.",
    ],
    principleName: "Present bias (hyperbolic discounting)",
    principleExplanation:
      "People discount the near future far more steeply than the far future. Classic experiments found many prefer a smaller reward today over a larger one next week — yet flip to preferring the larger one when the identical trade is moved a year out. Same week of waiting, wildly different price, purely because it's close.",
    citation: {
      text: "Thaler, R. (1981). Some empirical evidence on dynamic inconsistency. Economics Letters, 8(3), 201–207.",
      url: "https://doi.org/10.1016/0165-1765(81)90067-7",
    },
    shareTextTrapped:
      "{creator} offered me snacks now or 10% more snacks next week, twice. My answers contradicted each other. Present me sabotaged future me.",
    shareTextEscaped:
      "{creator} tried to catch my patience discriminating by distance. It held firm. A week is a week.",
    ogImageSubtitle: "The Snack Schedule Test",
    slots: [
      { id: "treat", label: "The reward (plural)", defaultValue: "fresh cookies", maxLen: 36 },
    ],
    challenge: {
      mechanic: "two-round",
      chipIcon: "hourglass",
      rounds: [
        {
          title: "Delivery slot 1",
          story: "The lab kitchen owes you. Choose:",
          options: [
            { id: "now", label: "100 {treat} today" },
            { id: "later", label: "110 {treat} one week from today" },
          ],
        },
        {
          title: "Delivery slot 2",
          story: "Different batch, longer lead time. Choose:",
          options: [
            { id: "now", label: "100 {treat} in 52 weeks" },
            { id: "later", label: "110 {treat} in 53 weeks" },
          ],
        },
      ],
      outcomes: {
        "now|later": {
          result: "lab-incident",
          detail:
            "Both rounds asked the same question: is one week of waiting worth 10 extra {treat}? At a year's distance you said yes; pressed against the present, you said no. That asymmetry runs most snack decisions on Earth.",
        },
        "later|now": {
          result: "double-agent",
          detail:
            "You waited patiently THIS week and got impatient about next year — the reverse of the human default. The lab has questions, mostly admiring.",
        },
        "now|now": {
          result: "clean-escape",
          detail:
            "Consistently impatient: your week is always worth more than 10 {treat}. Aggressive, but coherent — the trap needed a flip and you refused.",
        },
        "later|later": {
          result: "clean-escape",
          detail:
            "Consistently patient at both distances. Your discount rate is flat and your {treat} arrive with interest.",
        },
      },
    },
  },

  /* ------------------------------------------------------------ */
  /* Ellsberg / ambiguity aversion                                  */
  /* ------------------------------------------------------------ */
  {
    id: "ellsberg",
    labName: "The Mystery Bag Gambit",
    publicTitle: "The Mystery Bag Test",
    icon: "swapBag",
    category: "money",
    shortDescription:
      "Two bags, two bets. Avoiding the mystery both times is mathematically impossible to justify.",
    preRevealFrame: "Two bags, two draws, two decisions.",
    challengeText: "Pick a bag. Then pick again.",
    answerType: "two-round",
    difficulty: 3,
    estimatedTimeSeconds: 30,
    trapCondition: "Avoids the unknown-odds bag for BOTH colors — implying it's simultaneously under 50% red and under 50% blue.",
    escapeCondition: "Chooses coherently: beliefs about the mystery bag can't contradict themselves.",
    scoringLogic:
      "Known+known = trapped (ambiguity aversion, incoherent); mystery+mystery = double agent (equally incoherent, far rarer); mixed = escape.",
    revealTitleTrapped: "You claimed the mystery bag was under 50% of everything",
    revealTitleEscaped: "Your beliefs about the bag agreed with each other",
    roastCopy: [
      "Round 1: 'the mystery bag is probably short on red.' Round 2: 'also short on blue.' It's a bag, not a paradox.",
      "You paid a premium to avoid not-knowing, twice, in opposite directions.",
    ],
    praiseCopy: [
      "Whatever you believe about that bag, you believed it consistently. Ellsberg rarely gets that.",
      "You treated unknown odds as odds, not as monsters. Coherent under fog.",
    ],
    principleName: "Ambiguity aversion (the Ellsberg paradox)",
    principleExplanation:
      "People prefer known risks over unknown ones so strongly that their choices become internally contradictory: avoiding the mystery bag when betting on red implies you think it's red-poor, so betting blue there should be attractive — yet most people avoid it again. That double-avoidance can't follow from ANY belief about the bag's contents.",
    citation: {
      text: "Ellsberg, D. (1961). Risk, ambiguity, and the Savage axioms. Quarterly Journal of Economics, 75(4), 643–669.",
      url: "https://doi.org/10.2307/1884324",
    },
    shareTextTrapped:
      "{creator} handed me two bags and my fear of mystery filed logically impossible paperwork. The bag remains unbothered.",
    shareTextEscaped:
      "{creator} tried to spook me with a mystery bag. My beliefs stayed coherent under the fog. Take that, ambiguity.",
    ogImageSubtitle: "The Mystery Bag Test",
    slots: [
      { id: "contents", label: "What's in the bags", defaultValue: "gummy bears", maxLen: 36 },
    ],
    challenge: {
      mechanic: "two-round",
      chipIcon: "swapBag",
      rounds: [
        {
          title: "Bet 1: draw a RED one",
          story:
            "Bag F holds exactly 50 red and 50 blue {contents}. Bag G holds 100 {contents} in an unknown red/blue mix. Win a prize by drawing RED. Which bag do you draw from?",
          options: [
            { id: "known", label: "Bag F — the known 50/50" },
            { id: "mystery", label: "Bag G — the mystery mix" },
          ],
        },
        {
          title: "Bet 2: draw a BLUE one",
          story: "Same two bags, freshly shuffled. This time you win by drawing BLUE. Which bag?",
          options: [
            { id: "known", label: "Bag F — the known 50/50" },
            { id: "mystery", label: "Bag G — the mystery mix" },
          ],
        },
      ],
      outcomes: {
        "known|known": {
          result: "lab-incident",
          detail:
            "Avoiding bag G for red implies you think it's UNDER 50% red — which makes it OVER 50% blue, and the obvious pick for bet 2. Avoiding it twice means you think the bag is short on both colors at once. No bag can do that.",
        },
        "mystery|mystery": {
          result: "double-agent",
          detail:
            "You embraced the mystery for BOTH colors — implying bag G is over 50% red AND over 50% blue simultaneously. Exactly as impossible as the usual answer, and about ten times rarer. Magnificent.",
        },
        "known|mystery": {
          result: "clean-escape",
          detail:
            "Coherent: if you suspect the mystery bag leans blue, bet red on the known bag and blue on the mystery. Your beliefs about one bag agree with themselves.",
        },
        "mystery|known": {
          result: "clean-escape",
          detail:
            "Coherent: you bet like someone who thinks the mystery bag leans red — mystery for red, known for blue. Ambiguity didn't scare you into a contradiction.",
        },
      },
    },
  },

  /* ------------------------------------------------------------ */
  /* Barnum / Forer effect                                          */
  /* ------------------------------------------------------------ */
  {
    id: "barnum",
    labName: "The Flattery Machine",
    publicTitle: "The Personality Scan Test",
    icon: "crystalBall",
    category: "self",
    shortDescription:
      "A 'personalized' profile that fits them eerily well. And everyone else, identically.",
    preRevealFrame: "Our instrument has analyzed you. Rate its accuracy.",
    challengeText: "Read your profile. Grade the machine.",
    answerType: "choice",
    difficulty: 2,
    estimatedTimeSeconds: 25,
    trapCondition: "Rates a one-size-fits-all profile as uncannily accurate about them personally.",
    escapeCondition: "Notices the statements would fit anyone with a pulse.",
    scoringLogic:
      "Accuracy slider 0–100. ≥85 = beautiful disaster; 66–84 = trapped (Forer's own classroom averaged ~85%); 46–65 = suspicious; 21–45 = escape; ≤20 = genius.",
    revealTitleTrapped: "That profile fits eight billion people",
    revealTitleEscaped: "You caught the horoscope wearing a lab coat",
    roastCopy: [
      "The {instrument} printed the same profile for every subject since launch. You gave it a rave review.",
      "'Uncannily accurate,' said everyone, about the identical page.",
    ],
    praiseCopy: [
      "You read professionally-vague flattery and refused to see your soul in it. The machine is sulking.",
      "Low accuracy score for infinitely-reusable statements: correct. Forer's students mostly couldn't manage it.",
    ],
    principleName: "The Barnum (Forer) effect",
    principleExplanation:
      "Vague, mostly-flattering statements feel personally tailored because everyone can find themselves in them. Forer gave his class 'individualized' personality sketches assembled from a newsstand astrology book — every student got the identical text, and they rated its accuracy 4.26 out of 5 on average. Your profile here was equally personalized, which is to say: not at all.",
    citation: {
      text: "Forer, B. R. (1949). The fallacy of personal validation: A classroom demonstration of gullibility. Journal of Abnormal and Social Psychology, 44(1), 118–123.",
      url: "https://doi.org/10.1037/h0059240",
    },
    shareTextTrapped:
      "{creator}'s fake personality scanner read my soul. It reads everyone's soul. It's the same soul. I rated it 5 stars.",
    shareTextEscaped:
      "{creator} aimed a horoscope in a lab coat at me. I asked it for credentials. It had none.",
    ogImageSubtitle: "The Personality Scan Test",
    slots: [
      { id: "instrument", label: "Name of the 'instrument'", defaultValue: "NeuroProfile 3000", maxLen: 36 },
    ],
    challenge: {
      mechanic: "scale",
      chip: "analysis complete",
      chipIcon: "crystalBall",
      story:
        "The {instrument} has processed your interaction patterns and generated your personal cognitive profile:",
      statements: [
        "You have a strong need for others to like and respect you.",
        "You have considerable capacity you haven't yet turned to your advantage.",
        "At times you're outgoing and sociable; at other times you're reserved and watchful.",
        "You prefer some change and variety, and feel boxed in by too many limits.",
        "You've learned it's unwise to be too honest in revealing yourself to others.",
      ],
      question: "How accurately does this describe you, personally?",
      min: 0,
      max: 100,
      minLabel: "0 · total miss",
      maxLabel: "100 · it knows me",
      bands: [
        {
          gte: 85,
          result: "beautiful-disaster",
          detail:
            "You rated it {value}/100. The {instrument} generated no profile — every subject receives that identical text, lifted from Forer's 1949 astrology-book demo. It knows you exactly as well as it knows everyone.",
        },
        {
          gte: 66,
          result: "lab-incident",
          detail:
            "{value}/100 for a profile that every single subject receives, word for word. Forer's students averaged the equivalent of ~85 — you're in large, equally-flattered company.",
        },
        {
          gte: 46,
          result: "suspicious-escape",
          detail:
            "{value}/100 — half-convinced by text that fits anyone alive. (Yes, everyone gets the same profile. Even the part about being watchful.)",
        },
        {
          gte: 21,
          result: "clean-escape",
          detail:
            "{value}/100 — appropriately unimpressed. The profile is identical for every subject; you smelled the reusable flattery.",
        },
        {
          result: "tiny-genius",
          detail:
            "{value}/100. Fully immune. The {instrument} — which prints the same page for everyone — has filed a complaint about you.",
        },
      ],
    },
  },

  /* ------------------------------------------------------------ */
  /* Planning fallacy                                               */
  /* ------------------------------------------------------------ */
  {
    id: "planning",
    labName: "The Deadline Mirage",
    publicTitle: "The Stopwatch Test",
    icon: "calendarTime",
    category: "self",
    shortDescription:
      "They'll estimate how long a tiny task takes, then get timed doing it. The gap is the trap.",
    preRevealFrame: "Estimate a tiny deadline. Then live it.",
    challengeText: "Estimate first. The clock does the rest.",
    answerType: "number",
    difficulty: 2,
    estimatedTimeSeconds: 40,
    trapCondition: "The task takes meaningfully longer than their own just-made estimate.",
    escapeCondition: "Actual time lands within ~30% of the estimate.",
    scoringLogic:
      "Client-timed from challenge start. Actual > 1.3× estimate = trapped (>2× = beautiful disaster); within ±30% = genius; under half = double agent (sandbagging).",
    revealTitleTrapped: "Your deadline was a mirage, like most deadlines",
    revealTitleEscaped: "You predicted yourself accurately. Unsettling",
    roastCopy: [
      "You missed a deadline you set, for a task you chose, thirty seconds in advance. Now scale that to your projects.",
      "The optimistic timeline lasted exactly until reality began.",
    ],
    praiseCopy: [
      "Estimated, executed, on schedule. Do you also return library books on time? Suspicious.",
      "Your inner project manager survives contact with your inner doer. That's rarer than either of them thinks.",
    ],
    principleName: "The planning fallacy",
    principleExplanation:
      "People systematically underestimate their own completion times — even for tasks they know well, even with money on the line. In the classic study, students predicted their thesis would take 34 days; the average was 56. The bias survives experience because we plan the best case and live the actual case.",
    citation: {
      text: "Buehler, R., Griffin, D., & Ross, M. (1994). Exploring the “planning fallacy”: Why people underestimate their task completion times. Journal of Personality and Social Psychology, 67(3), 366–381.",
      url: "https://doi.org/10.1037/0022-3514.67.3.366",
    },
    shareTextTrapped:
      "{creator} had me estimate a 30-second task. I blew my own deadline inside a browser tab. My renovation plans are under review.",
    shareTextEscaped:
      "{creator} put me on the clock against my own estimate. I landed it. Deadlines fear me now.",
    ogImageSubtitle: "The Stopwatch Test",
    challenge: {
      mechanic: "planning",
      chipIcon: "calendarTime",
      estimatePrompt:
        "Here's the deal: after you lock in an estimate, you'll get one small task — reading a sentence and counting a specific letter in it. Estimate the TOTAL seconds you'll need from right now until you submit.",
      taskSentence:
        "The Friend Trap Lab expects every eager new recruit to deliver extremely precise letter counts before the deadline elapses.",
      taskQuestion: "How many times does the letter E appear in the sentence above?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Attribute framing                                              */
  /* ------------------------------------------------------------ */
  {
    id: "attribute",
    labName: "The Lean Spin",
    publicTitle: "The Taste Test",
    icon: "hamburger",
    category: "stories",
    shortDescription:
      "Same food, two labels, two opinions — from the same mouth, sixty seconds apart.",
    preRevealFrame: "Rate one menu item. Twice. It's fine. Don't worry about it.",
    challengeText: "One dish, two data sheets. Rate both.",
    answerType: "scale",
    difficulty: 2,
    estimatedTimeSeconds: 25,
    trapCondition: "Rates '90% lean' tastier than the identical '10% fat' item.",
    escapeCondition: "Gives the same rating to the same food in both outfits.",
    scoringLogic:
      "Two ratings, 1–10. Lean-rating exceeding fat-rating by ≥2 = trapped; by 1 = suspicious; equal = genius; fat rated higher = double agent.",
    revealTitleTrapped: "The label seasoned the food",
    revealTitleEscaped: "You tasted through the marketing",
    roastCopy: [
      "90% lean and 10% fat are the same {food}. Your taste buds read the brochure instead.",
      "You gave the identical dish two different scores based on which end of the fraction winked at you.",
    ],
    praiseCopy: [
      "Identical ratings for identical food in different costumes. Your palate reads ingredients, not adjectives.",
      "The label flipped and your opinion didn't. Marketers everywhere just felt a chill.",
    ],
    principleName: "Attribute framing",
    principleExplanation:
      "Describing one attribute positively ('90% lean') or negatively ('10% fat') changes evaluations of the identical thing. In the classic study, beef labeled 75% lean was rated better-tasting and less greasy than the same beef labeled 25% fat — the label literally changed the eating experience.",
    citation: {
      text: "Levin, I. P., & Gaeth, G. J. (1988). How consumers are affected by the framing of attribute information before and after consuming the product. Journal of Consumer Research, 15(3), 374–378.",
      url: "https://doi.org/10.1086/209174",
    },
    shareTextTrapped:
      "{creator} fed me the same dish twice with different labels and my opinion changed outfits with it. The fraction got me.",
    shareTextEscaped:
      "{creator} tried to season my judgment with a label. Same food, same score. Immune to spin.",
    ogImageSubtitle: "The Taste Test",
    slots: [
      { id: "food", label: "The dish", defaultValue: "the lab burger", maxLen: 36 },
    ],
    challenge: {
      mechanic: "dual-scale",
      chipIcon: "hamburger",
      round1: {
        title: "Menu item, spec sheet A",
        story: "Fresh off the grill: {food} — made with 90% lean meat. How appetizing does it sound?",
      },
      round2: {
        title: "One more for the records",
        story: "Also on the menu today: {food} — made with meat that is 10% fat. How appetizing does THIS one sound?",
      },
      question: "Rate it:",
      min: 1,
      max: 10,
      minLabel: "1 · no thanks",
      maxLabel: "10 · take my money",
      deltaDetails: {
        big: "You rated the 90%-lean version {r1}/10 and the 10%-fat version {r2}/10. Same {food}. Same meat. Same everything — 90% lean IS 10% fat. The label did the cooking.",
        small: "Ratings: {r1} vs {r2}. A one-point wobble between identical versions of {food} — the label brushed you, but didn't shove.",
        none: "Both versions of {food}: {r1}/10. They were the same dish — 90% lean equals 10% fat — and you're one of the few subjects whose taste buds refused the costume change.",
        reversed: "You rated the '10% fat' version HIGHER ({r2} vs {r1}). Same dish — but you heard 'fat' and got hungrier. Marketing science has no file for you.",
      },
    },
  },

  /* ------------------------------------------------------------ */
  /* Outcome bias                                                   */
  /* ------------------------------------------------------------ */
  {
    id: "outcome",
    labName: "The Hindsight Referee",
    publicTitle: "The Captain's Call Test",
    icon: "clover",
    category: "stories",
    shortDescription:
      "Same decision, different luck. Watch the grade change with the weather.",
    preRevealFrame: "Grade one judgment call from the storm logs.",
    challengeText: "Read the log. Grade the decision, not the dice.",
    answerType: "scale",
    difficulty: 3,
    estimatedTimeSeconds: 25,
    trapCondition: "Grades an identical decision worse because the dice came up badly.",
    escapeCondition: "Grades the decision on what the captain knew, not on how the storm rolled.",
    scoringLogic:
      "Random variant: same decision, good vs bad outcome. Bad-outcome raters giving ≤4 = trapped; ≥8 = genius. Reveal compares live group means across variants.",
    revealTitleTrapped: "You graded the dice, not the decision",
    revealTitleEscaped: "You refereed the call, not the luck",
    roastCopy: [
      "Same captain, same information, same choice — your red pen only came out when the reef showed up.",
      "You docked points for weather. {captain} does not control weather. That's the whole point of weather.",
    ],
    praiseCopy: [
      "You graded what {captain} knew at decision time and let the dice be dice. Referee-grade discipline.",
      "A bad outcome didn't fool you into finding a bad decision. That's rarer than it sounds — check the group averages below.",
    ],
    principleName: "Outcome bias",
    principleExplanation:
      "We judge decisions by how they turned out, not by whether they were sound when made. In the classic study, people rated a surgeon's identical choice — same odds, same information — as worse decision-making when the patient happened to die. Good decisions lose bets sometimes; the quality of the call never changes retroactively.",
    citation: {
      text: "Baron, J., & Hershey, J. C. (1988). Outcome bias in decision evaluation. Journal of Personality and Social Psychology, 54(4), 569–579.",
      url: "https://doi.org/10.1037/0022-3514.54.4.569",
    },
    shareTextTrapped:
      "{creator} showed me a judgment call and I graded the luck instead of the logic. The dice apologized. I didn't.",
    shareTextEscaped:
      "{creator} tried to sway my grading with a plot twist. I refereed the decision, not the dice.",
    ogImageSubtitle: "The Captain's Call Test",
    slots: [
      { id: "captain", label: "The captain", defaultValue: "Captain Reyes", maxLen: 32 },
    ],
    challenge: {
      mechanic: "scale",
      chip: "storm logs",
      chipIcon: "clover",
      story: "",
      question: "Grade {captain}'s DECISION (not the result):",
      min: 1,
      max: 10,
      minLabel: "1 · terrible call",
      maxLabel: "10 · excellent call",
      variants: {
        good: {
          story:
            "Storm log: {captain} had two routes. The long way — safe but slow. The short way through the strait — forecasts gave it a 90% chance of calm passage, 10% chance of dangerous swells. {captain} weighed it and took the strait. The water stayed calm and the ship arrived early.",
        },
        bad: {
          story:
            "Storm log: {captain} had two routes. The long way — safe but slow. The short way through the strait — forecasts gave it a 90% chance of calm passage, 10% chance of dangerous swells. {captain} weighed it and took the strait. The 10% hit: swells battered the ship into costly repairs.",
        },
      },
      bands: [
        {
          variant: "bad",
          gte: 8,
          result: "tiny-genius",
          detail:
            "You gave the unlucky version {value}/10 — grading the 90/10 call on its merits while the outcome screamed for a red pen. Subjects who saw the lucky version of this SAME decision typically grade it far higher.",
        },
        {
          variant: "bad",
          gte: 5,
          result: "suspicious-escape",
          detail:
            "{value}/10 for a decision that was identical to the one lucky-timeline subjects saw. The swells got a couple of your points; check the group averages below.",
        },
        {
          variant: "bad",
          result: "lab-incident",
          detail:
            "{value}/10 — but the decision was made with a 90% forecast, identical to the version where the water stayed calm (which subjects grade generously). The reef edited your scorecard.",
        },
        {
          variant: "good",
          gte: 8,
          result: "clean-escape",
          detail:
            "{value}/10 for a sound 90/10 call that happened to work. Fair enough — now the fun part: subjects who see the SAME decision hit the unlucky 10% grade it several points lower.",
        },
        {
          variant: "good",
          lte: 4,
          result: "double-agent",
          detail:
            "Only {value}/10 for a reasonable bet that WORKED? You're either grading on pure principle or you have history with {captain}.",
        },
        {
          variant: "good",
          result: "clean-escape",
          detail:
            "A measured {value}/10. Keep an eye on the group averages below — the same decision earns worse grades whenever the dice misbehave.",
        },
      ],
      compare: {
        title: "same decision, two verdicts",
        labels: { good: "Told it worked, subjects grade", bad: "Told it failed, they grade" },
        unit: "/10",
      },
    },
  },
];
