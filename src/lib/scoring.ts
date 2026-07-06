import type { BespokeAnswer, ScoreOutcome, ResultType } from "@/types";
import {
  ANCHOR_CHALLENGE,
  AVAILABILITY_CHALLENGE,
  CONFIDENCE_CHALLENGE,
  PATTERN_CHALLENGE,
} from "@/lib/traps";

const SCORE_BY_RESULT: Record<ResultType, number> = {
  "tiny-genius": 100,
  "clean-escape": 85,
  "suspicious-escape": 60,
  "double-agent": 40,
  "lab-incident": 25,
  "beautiful-disaster": 10,
};

function outcome(
  resultType: ResultType,
  detailLine: string,
  extra?: Partial<ScoreOutcome>
): ScoreOutcome {
  return {
    resultType,
    isTrapped: resultType === "lab-incident" || resultType === "beautiful-disaster",
    score: SCORE_BY_RESULT[resultType],
    detailLine,
    ...extra,
  };
}

export function scoreAttempt(answer: BespokeAnswer): ScoreOutcome {
  switch (answer.trapType) {
    case "anchor": {
      const { estimate, variant } = answer;
      const anchor = ANCHOR_CHALLENGE.anchors[variant];
      const jar = ANCHOR_CHALLENGE.labCount;
      const detail = (verdict: string) =>
        `You saw “${anchor.toLocaleString()}” and guessed ${estimate.toLocaleString()}. A one-liter jar holds about ${jar} jellybeans. ${verdict}`;
      if (variant === "high") {
        if (estimate >= 2000)
          return outcome("beautiful-disaster", detail("You didn't drift toward the anchor — you moved in with it."), { frameVariant: "high" });
        if (estimate >= 800)
          return outcome("lab-incident", detail("That's the anchor pulling."), { frameVariant: "high" });
        if (estimate >= 500)
          return outcome("suspicious-escape", detail("A light gravitational tug, but you stayed in orbit."), { frameVariant: "high" });
        if (estimate <= 60)
          return outcome("double-agent", detail("You dodged the anchor so hard you fell off the other side of the jar."), { frameVariant: "high" });
        return outcome("clean-escape", detail("The giant number never touched you."), { frameVariant: "high" });
      } else {
        if (estimate <= 60)
          return outcome("beautiful-disaster", detail("The tiny anchor didn't nudge you — it adopted you."), { frameVariant: "low" });
        if (estimate <= 220)
          return outcome("lab-incident", detail("That's the anchor pulling."), { frameVariant: "low" });
        if (estimate <= 340)
          return outcome("suspicious-escape", detail("A light gravitational tug, but you stayed in orbit."), { frameVariant: "low" });
        if (estimate >= 3000)
          return outcome("double-agent", detail("You overcorrected into a jellybean silo that does not exist."), { frameVariant: "low" });
        return outcome("clean-escape", detail("The sneaky little number never touched you."), { frameVariant: "low" });
      }
    }

    case "frameflip": {
      const { q1, q2 } = answer;
      const label = (v: "sure" | "gamble") => (v === "sure" ? "the sure thing" : "the gamble");
      const detail = `Freezer: you chose ${label(q1)}. Server: you chose ${label(q2)}. Both offered the exact same odds — 200 of 600 survive.`;
      if (q1 === "sure" && q2 === "gamble")
        return outcome("lab-incident", detail + " Gains made you cautious; losses made you gamble.", { frameVariant: "classic-flip" });
      if (q1 === "gamble" && q2 === "sure")
        return outcome("double-agent", detail + " You flipped — in the direction almost nobody flips.", { frameVariant: "reverse-flip" });
      return outcome(
        "clean-escape",
        detail + ` Consistent ${q1 === "sure" ? "and cautious" : "and bold"} — the costume change didn't fool you.`,
        { frameVariant: q1 === "sure" ? "consistent-sure" : "consistent-gamble" }
      );
    }

    case "baserate": {
      const { pick, confidence } = answer;
      const detail = `You accused ${pick === "flagged" ? "the Series K mouse" : "a standard mouse"} at ${confidence}% confidence. The flag is wrong ~65% of the time.`;
      if (pick === "standard") {
        if (confidence > 85)
          return outcome("suspicious-escape", detail + " Right call — but the true odds were only ~65/35. Ease off the megaphone.", { confidence });
        if (confidence >= 55)
          return outcome("tiny-genius", detail + " Right call, honestly calibrated. Textbook.", { confidence });
        return outcome("clean-escape", detail + " Right call, even if you basically flipped a coin.", { confidence });
      }
      if (confidence >= 85)
        return outcome("beautiful-disaster", detail + " Maximum confidence, minimum arithmetic.", { confidence });
      return outcome("lab-incident", detail + " The vivid clue won.", { confidence });
    }

    case "pattern": {
      const { tests, guess } = answer;
      const fits = (t: { a: number; b: number; c: number }) => PATTERN_CHALLENGE.fits(t.a, t.b, t.c);
      const isPlusTwo = (t: { a: number; b: number; c: number }) => t.b - t.a === 2 && t.c - t.b === 2;
      const triedBreaker = tests.some((t) => !fits(t));
      const exploredBeyondPlusTwo = tests.some((t) => !isPlusTwo(t));
      const correct = guess === PATTERN_CHALLENGE.correctGuess;
      const guessLabel =
        PATTERN_CHALLENGE.guesses.find((g) => g.id === guess)?.label ?? guess;
      const detail = `You ran ${tests.length} test${tests.length === 1 ? "" : "s"} (${
        triedBreaker ? "including one built to fail — the good kind" : "all built to succeed"
      }) and called “${guessLabel}.” The rule: any three increasing numbers.`;
      if (correct && triedBreaker) return outcome("tiny-genius", detail);
      if (correct && exploredBeyondPlusTwo) return outcome("clean-escape", detail);
      if (correct)
        return outcome("suspicious-escape", detail + " Right rule, zero attempts to break it. The lab suspects luck.");
      if (!exploredBeyondPlusTwo && tests.length > 0)
        return outcome("beautiful-disaster", detail);
      return outcome("lab-incident", detail);
    }

    case "availability": {
      const rounds = AVAILABILITY_CHALLENGE.rounds;
      const picks = answer.picks.slice(0, rounds.length);
      const marks = rounds.map((r, i) => (picks[i] === r.correct ? "✓" : "✗"));
      const correctCount = marks.filter((m) => m === "✓").length;
      const detail = `Tornado round ${marks[0]}, shark round ${marks[1]}, lightning round ${marks[2]} — ${correctCount} of 3 against the headlines.`;
      if (correctCount === 3) return outcome("tiny-genius", detail);
      if (correctCount === 2) return outcome("suspicious-escape", detail);
      if (correctCount === 1) return outcome("lab-incident", detail);
      return outcome("beautiful-disaster", detail);
    }

    case "confidence": {
      const { pick, confidence } = answer;
      const correct = pick === CONFIDENCE_CHALLENGE.correct;
      const detail = `You said ${pick === "jupiter" ? "Jupiter" : "Saturn"} at ${confidence}% sure. ${CONFIDENCE_CHALLENGE.factNote}`;
      if (correct) {
        if (confidence > 95) return outcome("clean-escape", detail + " Bold AND right. Fine.", { confidence });
        if (confidence >= 70) return outcome("tiny-genius", detail, { confidence });
        return outcome("suspicious-escape", detail + " Right answer, wobbly conviction.", { confidence });
      }
      if (confidence >= 85) return outcome("beautiful-disaster", detail, { confidence });
      return outcome("lab-incident", detail + " At least your doubt was trying.", { confidence });
    }
  }
}
