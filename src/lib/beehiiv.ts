/**
 * Beehiiv V2 subscription client. Server-side only — the API key must
 * never reach the client or the logs.
 */

const NEWSLETTER_SOURCE = "distilledai";

export interface SubscribeResult {
  ok: boolean;
  alreadySubscribed: boolean;
  message: string;
}

export async function subscribeToBeehiiv(
  email: string,
  opts: { source?: string } = {}
): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    return {
      ok: false,
      alreadySubscribed: false,
      message: "Email signups are napping right now. Try again soon.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: NEWSLETTER_SOURCE,
          utm_medium: "site",
          utm_campaign: opts.source ?? "friend-trap-lab",
          referring_site: "https://distilledai.org",
        }),
        signal: controller.signal,
      }
    );

    if (res.ok) {
      // Beehiiv returns the subscription whether it's new or existing.
      let alreadySubscribed = false;
      try {
        const data = (await res.json()) as { data?: { status?: string; created?: number } };
        // Existing active subscribers come back with status "active" and an old created date;
        // we treat every 2xx as a friendly success either way.
        alreadySubscribed = data?.data?.status === "active" && false;
      } catch {
        // body parse failures don't matter — 2xx is success
      }
      return {
        ok: true,
        alreadySubscribed,
        message: "Check your inbox. The lab notes are on their way.",
      };
    }

    const text = await res.text().catch(() => "");
    if (res.status === 400 && /already|exists|subscribed/i.test(text)) {
      return {
        ok: true,
        alreadySubscribed: true,
        message: "You're already on the list. The lab notes will find you.",
      };
    }
    console.error(`Beehiiv subscribe failed: status ${res.status}`);
    return {
      ok: false,
      alreadySubscribed: false,
      message: "The signup machine hiccuped. Try again in a minute?",
    };
  } catch {
    console.error("Beehiiv subscribe failed: network error or timeout");
    return {
      ok: false,
      alreadySubscribed: false,
      message: "The signup machine hiccuped. Try again in a minute?",
    };
  } finally {
    clearTimeout(timer);
  }
}
