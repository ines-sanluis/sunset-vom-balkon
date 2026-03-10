import Image from "next/image";

import {
  BALCONY,
  formatInBerlin,
  getSunsetForecast,
  pickNextEvent,
} from "@/lib/sunsethue";
import { InviteInesButton } from "@/components/InviteInesButton";

const QUALITY_LABEL_DE: Record<string, string> = {
  poor: "schwach",
  fair: "okay",
  good: "gut",
  great: "sehr gut",
  excellent: "ausgezeichnet",
};

function qualityLabelDe(label?: string) {
  if (!label) return "";
  return QUALITY_LABEL_DE[label.toLowerCase()] ?? label;
}

function enjoymentWindow(
  event: {
    time?: string;
    magics?: {
      golden_hour?: [string, string];
      blue_hour?: [string, string];
    };
  } | null,
) {
  if (!event?.time) return null;
  const startIso =
    event.magics?.golden_hour?.[0] ??
    new Date(new Date(event.time).getTime() - 30 * 60_000).toISOString();
  const endIso =
    event.magics?.blue_hour?.[1] ??
    new Date(new Date(event.time).getTime() + 30 * 60_000).toISOString();
  return { startIso, endIso };
}

export default async function Home() {
  let forecast: Awaited<ReturnType<typeof getSunsetForecast>> | null = null;
  let errorMessage: string | null = null;

  try {
    forecast = await getSunsetForecast({ days: 3, type: "sunset" });
  } catch (e) {
    if (e instanceof Error && e.message === "QUOTA_EXCEEDED") {
      errorMessage = "QUOTA_EXCEEDED";
    } else {
      errorMessage =
        e instanceof Error ? e.message : "Could not load Sunsethue data.";
    }
  }

  const next = pickNextEvent(forecast?.data ?? []);
  const window = enjoymentWindow(next);

  let nextDayLabel = "";
  let nextTimeLabel = "";
  let inviteMessage =
    "Sieht so aus, als gäbe es heute einen schönen Sonnenuntergang. Kommst du vorbei und schaust ihn dir mit mir an?";

  if (next?.time) {
    const now = new Date();
    const eventDate = new Date(next.time);

    const toKey = (d: Date) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);

    const todayKey = toKey(now);
    const tomorrowKey = toKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));
    const eventKey = toKey(eventDate);

    if (eventKey === todayKey) {
      nextDayLabel = "Heute";
    } else if (eventKey === tomorrowKey) {
      nextDayLabel = "Morgen";
    } else {
      nextDayLabel = formatInBerlin(next.time, { weekday: "short" });
    }

    nextTimeLabel = formatInBerlin(next.time, {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (window) {
      const startLocal = formatInBerlin(window.startIso, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endLocal = formatInBerlin(window.endIso, {
        hour: "2-digit",
        minute: "2-digit",
      });
      inviteMessage = `Sieht so aus, als gäbe es heute einen schönen Sonnenuntergang. Hast du zwischen ${startLocal} und ${endLocal} Zeit vorbeizukommen?`;
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#f2b654] via-[#f47a4d] via-55% to-[#463e85] text-[#1d1230]">
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-10 pt-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="relative h-32 w-32">
            <Image
              src="/black-sun.png"
              alt="Strahlende Sonne mit Retro-Charme"
              fill
              sizes="128px"
              className="rounded-full drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a3810]">
            <s>sonnenunterweg</s> von deinem Balkon
          </h1>
          {/* <h1 className="text-3xl font-extrabold tracking-tight text-[#231815]">
                        Sonnenuntergang in München
                    </h1>
                    <div className="text-xs font-medium text-[#5a3810]">
                        {BALCONY.latitude.toFixed(6)},{' '}
                        {BALCONY.longitude.toFixed(6)}
                    </div> */}
        </header>

        {errorMessage && (
          <section className="rounded-3xl bg-white/10 p-5 text-white ring-1 ring-white/20 backdrop-blur">
            {errorMessage === "QUOTA_EXCEEDED" ? (
              <>
                <div className="text-sm font-semibold uppercase tracking-wide text-white">
                  Tageslimit erreicht
                </div>
                <p className="mt-2 text-sm text-white/80">
                  Das tägliche Limit für Sonnenuntergang-Vorhersagen wurde
                  erreicht.
                </p>
                <p className="mt-2 text-sm text-white/90 font-medium">
                  🌅 Komm morgen wieder vorbei für die neuesten
                  Sonnenuntergang-Daten!
                </p>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold uppercase tracking-wide text-white">
                  Konfiguration erforderlich
                </div>
                <p className="mt-2 text-sm text-white/80">
                  Füge{" "}
                  <span className="font-mono text-white">
                    SUNSETHUE_API_KEY
                  </span>{" "}
                  in <span className="font-mono text-white">.env.local</span>{" "}
                  unter{" "}
                  <span className="font-mono text-white">
                    projects/sunset-in-munich
                  </span>{" "}
                  hinzu.
                </p>
                <p className="mt-2 text-xs text-white/60">{errorMessage}</p>
              </>
            )}
          </section>
        )}

        <section className="rounded-3xl bg-[#4D2C4D]/65 p-5 text-white ring-1 ring-[#5a3810] backdrop-blur shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Als nächstes
              </div>
              <div className="text-2xl font-extrabold text-white">
                {next ? `${nextDayLabel} ${nextTimeLabel}` : "—"}
              </div>
              {window && (
                <div className="text-sm  font-semibold text-white/80">
                  Zuhause-Zeit:{" "}
                  <span className="tabular-nums">
                    {formatInBerlin(window.startIso, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" – "}
                    {formatInBerlin(window.endIso, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              {typeof next?.cloud_cover === "number" && (
                <div className="text-xs text-white/70">
                  Bewölkung:{" "}
                  <span className="font-semibold">
                    {Math.round(next.cloud_cover * 100)}%
                  </span>
                </div>
              )}
              {next?.magics?.golden_hour?.length === 2 && (
                <div className="text-xs text-white/70">
                  Goldene Stunde:{" "}
                  <span className="tabular-nums">
                    {formatInBerlin(next.magics.golden_hour[0], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {formatInBerlin(next.magics.golden_hour[1], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              {next?.magics?.blue_hour?.length === 2 && (
                <div className="text-xs text-white/70">
                  Blaue Stunde:{" "}
                  <span className="tabular-nums">
                    {formatInBerlin(next.magics.blue_hour[0], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {formatInBerlin(next.magics.blue_hour[1], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
            {typeof next?.quality === "number" && (
              <div className="rounded-2xl bg-black/20 px-4 py-3 text-right ring-1 ring-white/25 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Qualität
                </div>
                <div className="mt-1 text-lg font-extrabold text-white tabular-nums">
                  {Math.round(next.quality * 100)}%
                </div>
                {qualityLabelDe(next.quality_text) && (
                  <div className="text-[10px] text-white/70">
                    {qualityLabelDe(next.quality_text)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <InviteInesButton
              message={inviteMessage}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md backdrop-blur hover:bg-white hover:text-[#1d1230] transition-colors"
            />
          </div>
        </section>

        <section className="rounded-3xl bg-[#4D2C4D]/65 p-5 text-white ring-1 ring-[#5a3810] backdrop-blur shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Nächste zwei Sonnenuntergänge
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {(forecast?.data ?? []).slice(1, 4).map((e) => (
              <div
                key={e.time}
                className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20"
              >
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-white">
                    {formatInBerlin(e.time, {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </div>
                  <div className="text-xs text-white/80">
                    {typeof e.quality === "number"
                      ? `Qualität: ${Math.round(e.quality * 100)}%${
                          e.quality_text
                            ? ` (${qualityLabelDe(e.quality_text)})`
                            : ""
                        }`
                      : e.model_data
                        ? "Qualität unbekannt"
                        : "Keine Vorhersagedaten"}
                  </div>
                </div>
                <div className="text-lg font-extrabold tabular-nums text-white">
                  {formatInBerlin(e.time, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-2 text-center text-[10px] uppercase tracking-[0.25em] text-[#1d1230]/70">
          Mit Liebe gemacht von Inés
        </footer>
      </main>
    </div>
  );
}
