"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Participant = {
  id: number;
  created_at: string;

  name: string;
  most_used_word: string;
  ai_job_answer: string;
  tech_weakness: string;
  three_words: string;
  surprisingly_good_at: string;

  tag: string;
  tag_emoji: string;

  one_liner: string;

  creativity: number;
  tech_energy: number;
  chaos: number;

  most_likely_to: string;
  verdict: string;
};

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/dashboard-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setLoginError("Incorrect password.");
        setLoggingIn(false);
        return;
      }

      setAuthenticated(true);
      setPassword("");
    } catch {
      setLoginError("Unable to connect. Please try again.");
    }

    setLoggingIn(false);
  };

  // --------------------------------------------------
  // LOAD PARTICIPANTS
  // --------------------------------------------------

  const loadParticipants = async () => {
    setLoading(true);
    setError("");

    const { data, error: supabaseError } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (supabaseError) {
      console.error("Supabase dashboard error:", supabaseError);
      setError("Unable to load participants.");
      setLoading(false);
      return;
    }

    setParticipants((data || []) as Participant[]);
    setLoading(false);
  };

  // --------------------------------------------------
  // INITIAL LOAD + REALTIME
  // --------------------------------------------------

  useEffect(() => {
    if (!authenticated) return;

    loadParticipants();

    const channel = supabase
      .channel("read-the-room-participants")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          console.log("New participant:", payload.new);

          const newParticipant = payload.new as Participant;

          setParticipants((previous) => {
            if (
              previous.some(
                (participant) =>
                  participant.id === newParticipant.id
              )
            ) {
              return previous;
            }

            return [newParticipant, ...previous];
          });
        }
      )
      .subscribe((status) => {
        console.log("Realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authenticated]);

  // --------------------------------------------------
  // ROOM STATISTICS
  // --------------------------------------------------

  const statistics = useMemo(() => {
    if (participants.length === 0) {
      return {
        averageCreativity: 0,
        averageTechEnergy: 0,
        averageChaos: 0,
        topTag: null as {
          tag: string;
          emoji: string;
          count: number;
        } | null,
      };
    }

    const average = (values: number[]) => {
      if (values.length === 0) return 0;

      return Math.round(
        values.reduce(
          (sum, value) => sum + (value || 0),
          0
        ) / values.length
      );
    };

    const tagCounts: Record<
      string,
      {
        tag: string;
        emoji: string;
        count: number;
      }
    > = {};

    participants.forEach((participant) => {
      const key = participant.tag || "unknown";

      if (!tagCounts[key]) {
        tagCounts[key] = {
          tag: participant.tag,
          emoji: participant.tag_emoji || "⚡",
          count: 0,
        };
      }

      tagCounts[key].count += 1;
    });

    const topTag =
      Object.values(tagCounts).sort(
        (a, b) => b.count - a.count
      )[0] || null;

    return {
      averageCreativity: average(
        participants.map((p) => p.creativity)
      ),

      averageTechEnergy: average(
        participants.map((p) => p.tech_energy)
      ),

      averageChaos: average(
        participants.map((p) => p.chaos)
      ),

      topTag,
    };
  }, [participants]);

  // --------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-5 text-zinc-900">

        <div className="w-full max-w-md">

          <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.06)]">

            <div className="h-1.5 w-full bg-orange-500" />

            <div className="px-8 py-10 sm:px-10">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
                  ⚡
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-[0.38em] text-zinc-900">
                    CEREBRAS
                  </p>

                  <p className="mt-0.5 text-[8px] uppercase tracking-[0.28em] text-zinc-400">
                    Host Control
                  </p>
                </div>

              </div>

              <div className="mt-9">

                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-orange-500">
                  Private Area
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-zinc-950">
                  Read the Room
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Enter the host password to access the live room dashboard.
                </p>

              </div>

              <form
                onSubmit={handleLogin}
                className="mt-8"
              >

                <label
                  htmlFor="dashboard-password"
                  className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                >
                  Host password
                </label>

                <input
                  id="dashboard-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  required
                />

                {loginError && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-600">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingIn
                    ? "Checking..."
                    : "Enter Dashboard"}
                </button>

              </form>

              <p className="mt-6 text-center text-[8px] uppercase tracking-[0.2em] text-zinc-300">
                Host access only
              </p>

            </div>

          </div>

        </div>

      </main>
    );
  }

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">

      {/* Soft background accents */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-orange-100/40 blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-orange-100/30 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1700px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">

        {/* HEADER */}

        <header className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.045)]">

          <div className="h-1.5 w-full bg-orange-500" />

          <div className="px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11">

            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-xl text-white">
                    ⚡
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.38em] text-zinc-900">
                      CEREBRAS
                    </p>

                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.28em] text-zinc-400">
                      Host Control
                    </p>
                  </div>

                </div>

                <div className="mt-9">

                  <div className="flex items-center gap-2.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                    <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-orange-500">
                      Live Room Intelligence
                    </p>

                  </div>

                  <h1 className="mt-3 text-5xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-6xl lg:text-[68px]">
                    Read the Room
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                    See the personality, energy and creativity
                    shaping the room in real time.
                  </p>

                </div>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <div className="min-w-[230px] rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">

                  <div className="flex items-center gap-3">

                    <span className="relative flex h-2.5 w-2.5">

                      <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

                      <span className="relative h-2.5 w-2.5 rounded-full bg-green-500" />

                    </span>

                    <div>

                      <p className="text-xs font-semibold text-zinc-900">
                        Live
                      </p>

                      <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-zinc-400">
                        Room is listening
                      </p>

                    </div>

                    <span className="ml-auto text-[8px] font-semibold uppercase tracking-wider text-green-600">
                      Connected
                    </span>

                  </div>

                </div>

                <div className="min-w-[230px] rounded-xl bg-orange-500 px-5 py-4 text-white">

                  <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-orange-100">
                    Participants
                  </p>

                  <div className="mt-1 flex items-end justify-between">

                    <p className="text-4xl font-semibold leading-none">
                      {participants.length}
                    </p>

                    <p className="pb-1 text-[10px] uppercase tracking-wider text-orange-100">
                      In the room
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* STATISTICS */}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            value={participants.length}
            label="Participants"
            accent="orange"
          />

          <StatCard
            value={`${statistics.averageCreativity}%`}
            label="Average creativity"
            accent="orange"
          />

          <StatCard
            value={`${statistics.averageTechEnergy}%`}
            label="Average tech energy"
            accent="orange"
          />

          <StatCard
            value={`${statistics.averageChaos}%`}
            label="Average chaos"
            accent="pink"
          />

        </section>

        {/* DOMINANT PERSONALITY */}

        {statistics.topTag && (

          <section className="mt-7 overflow-hidden rounded-2xl border border-zinc-200 bg-white">

            <div className="flex flex-col lg:flex-row">

              <div className="flex-1 px-7 py-8 sm:px-9 sm:py-9">

                <div className="flex items-center gap-2.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                  <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-orange-500">
                    Dominant room personality
                  </p>

                </div>

                <div className="mt-5 flex items-center gap-5">

                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50 text-4xl">
                    {statistics.topTag.emoji}
                  </div>

                  <div>

                    <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                      {formatTag(statistics.topTag.tag)}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      The personality currently leading the room.
                    </p>

                  </div>

                </div>

              </div>

              <div className="flex min-w-[230px] items-center justify-center bg-orange-500 px-8 py-8 text-white">

                <div className="text-center">

                  <p className="text-5xl font-semibold">
                    {statistics.topTag.count}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-orange-100">
                    People with this tag
                  </p>

                </div>

              </div>

            </div>

          </section>

        )}

        {/* PARTICIPANTS */}

        <section className="mt-12">

          <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2.5">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-500">
                  Live participants
                </p>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[7px] font-medium uppercase tracking-[0.15em] text-green-600">
                  Auto update
                </span>

              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-zinc-950 sm:text-4xl">
                Who&apos;s in the room?
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                See what Cerebras thinks about everyone in the room.
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="text-right">

                <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-400">
                  Live count
                </p>

                <p className="mt-1 text-xl font-medium text-zinc-900">
                  {participants.length}
                </p>

              </div>

              <div className="h-9 w-px bg-zinc-200" />

              <div className="text-right">

                <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-400">
                  Status
                </p>

                <p className="mt-1 text-[10px] font-medium text-green-500">
                  ● Connected
                </p>

              </div>

            </div>

          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && participants.length === 0 ? (

            <LoadingState />

          ) : participants.length === 0 ? (

            <EmptyState />

          ) : (

            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {participants.map((participant) => (

                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                />

              ))}

            </div>

          )}

        </section>

        {/* FOOTER */}

        <footer className="mt-14 border-t border-zinc-200 py-7">

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

            <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-zinc-400">
              Cerebras · Read the Room
            </p>

            <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-300">
              Real-time room intelligence
            </p>

          </div>

        </footer>

      </div>

    </main>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent: "orange" | "pink";
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-6 py-6 transition duration-200 hover:border-orange-200">

      <div className="flex items-center justify-between">

        <span
          className={`h-2 w-2 ${
            accent === "pink"
              ? "bg-pink-400"
              : "bg-orange-500"
          }`}
        />

        <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-300">
          Live
        </span>

      </div>

      <p className="mt-7 text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl">
        {value}
      </p>

      <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </p>

    </div>
  );
}

// ======================================================
// PARTICIPANT CARD
// ======================================================

function ParticipantCard({
  participant,
}: {
  participant: Participant;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">

      <div className="h-1 bg-orange-500" />

      <div className="p-7 sm:p-8">

        <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-zinc-300">
          Participant
        </p>

        <div className="mt-5 flex items-center justify-between gap-5">

          <h3 className="min-w-0 truncate text-3xl font-medium tracking-[-0.025em] text-zinc-950 sm:text-[34px]">
            {participant.name}
          </h3>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-3xl">
            {participant.tag_emoji || "⚡"}
          </div>

        </div>

        <div className="my-7 h-px bg-zinc-100" />

        <div>

          <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-orange-500">
            Cerebras tag
          </p>

          <h4 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-zinc-900 sm:text-[27px]">
            {formatTag(participant.tag)}
          </h4>

        </div>

        <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-4">

          <p className="text-[7px] uppercase tracking-[0.25em] text-zinc-300">
            Read the Room
          </p>

          <div className="flex items-center gap-1.5">

            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

            <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-300">
              Cerebras
            </span>

          </div>

        </div>

      </div>

    </article>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState() {
  return (
    <div className="mt-7 rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-20 text-center">

      <div className="text-5xl opacity-80">
        👀
      </div>

      <h3 className="mt-5 text-xl font-medium text-zinc-900">
        Waiting for the room
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
        When someone completes Read the Room,
        their personality will appear here automatically.
      </p>

    </div>
  );
}

// ======================================================
// LOADING STATE
// ======================================================

function LoadingState() {
  return (
    <div className="mt-7 rounded-2xl border border-zinc-200 bg-white px-6 py-20 text-center">

      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-orange-500" />

      <p className="mt-5 text-[9px] uppercase tracking-[0.25em] text-zinc-400">
        Reading the room...
      </p>

    </div>
  );
}

// ======================================================
// FORMAT TAG
// ======================================================

function formatTag(tag: string) {
  if (!tag) {
    return "Unknown Personality";
  }

  return tag
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}