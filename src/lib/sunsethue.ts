export const BALCONY = {
  // 48°08'09.7"N 11°32'47.9"E
  latitude: 48.13602777777778,
  longitude: 11.54663888888889,
} as const;

export type SunsethueEventType = "sunrise" | "sunset";

export type SunsethueEventData = {
  type: SunsethueEventType;
  model_data: boolean;
  time: string; // ISO UTC
  direction: number;
  quality?: number;
  quality_text?: string;
  cloud_cover?: number;
  magics?: {
    blue_hour: [string, string];
    golden_hour: [string, string];
  };
};

export type SunsethueForecastResponse = {
  time: string;
  location: { latitude: number; longitude: number };
  grid_location: { latitude: number; longitude: number };
  data: SunsethueEventData[];
};

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function getBerlinTimezoneOffsetHours(now = new Date()): number {
  // Parse "GMT+1"/"GMT+2" reliably via shortOffset.
  // If the runtime doesn't support it, fall back to 1.
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Berlin",
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tz = parts.find((p) => p.type === "timeZoneName")?.value;
    if (!tz) return 1;
    const m = tz.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
    if (!m) return 1;
    const hours = parseInt(m[1], 10);
    const minutes = m[2] ? parseInt(m[2], 10) : 0;
    return hours + Math.sign(hours || 1) * (minutes / 60);
  } catch {
    return 1;
  }
}

export async function getSunsetForecast({
  days = 3,
  type = "sunset",
}: {
  days?: number;
  type?: SunsethueEventType;
} = {}): Promise<SunsethueForecastResponse> {
  const key = getEnv("SUNSETHUE_API_KEY");
  const timezone = getBerlinTimezoneOffsetHours();
  const url = new URL("https://api.sunsethue.com/forecast");
  url.searchParams.set("latitude", String(BALCONY.latitude));
  url.searchParams.set("longitude", String(BALCONY.longitude));
  url.searchParams.set("days", String(days));
  url.searchParams.set("type", type);
  url.searchParams.set("timezone", String(timezone));

  const res = await fetch(url.toString(), {
    headers: { "x-api-key": key },
    // keep it fresh; sunsets change quickly
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");

    // Check for quota exceeded error
    if (res.status === 400) {
      try {
        const errorData = JSON.parse(text);
        if (
          errorData.code === 204 &&
          errorData.message?.includes("daily quota")
        ) {
          throw new Error("QUOTA_EXCEEDED");
        }
      } catch () {
        // If parsing fails, fall through to generic error
      }
    }

    throw new Error(
      `Sunsethue API error (${res.status}): ${text || res.statusText}`,
    );
  }
  return (await res.json()) as SunsethueForecastResponse;
}

export function formatInBerlin(
  isoUtc: string,
  opts?: Intl.DateTimeFormatOptions,
) {
  const date = new Date(isoUtc);
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    ...opts,
  }).format(date);
}

export function pickNextEvent(events: SunsethueEventData[], now = new Date()) {
  const nowMs = now.getTime();
  return events
    .map((e) => ({ e, t: new Date(e.time).getTime() }))
    .filter((x) => Number.isFinite(x.t) && x.t >= nowMs - 60_000)
    .sort((a, b) => a.t - b.t)[0]?.e;
}
