"use client";

import { useState } from "react";

const questions = [
  {
    question: "What's your name?",
    hint: "Don't worry. Cerebras needs to know who it's judging. 👀",
    placeholder: "Enter your name",
    key: "name",
  },
  {
    question: "What's your most-used word?",
    hint: "The word you probably say way too often. 😂",
    placeholder: "Type your most-used word",
    key: "mostUsedWord",
  },
  {
    question: "If AI took your job tomorrow, what would you do? 😂",
    hint: "Be honest. Cerebras is listening.",
    placeholder: "I'd probably...",
    key: "aiJobAnswer",
  },
  {
    question: "What's your biggest tech weakness?",
    hint: "We won't judge. Probably.",
    placeholder: "For example: debugging, CSS, DSA...",
    key: "techWeakness",
  },
  {
    question: "Describe yourself in 3 words.",
    hint: "Three words. No more. Make them count.",
    placeholder: "e.g. Curious, chaotic, ambitious",
    key: "threeWords",
  },
  {
    question: "What's one thing you're surprisingly good at?",
    hint: "Time to reveal your hidden talent. 👀",
    placeholder: "I'm surprisingly good at...",
    key: "surprisinglyGoodAt",
  },
];

type Answers = {
  name: string;
  mostUsedWord: string;
  aiJobAnswer: string;
  techWeakness: string;
  threeWords: string;
  surprisinglyGoodAt: string;
};

export default function ReadRoom() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Answers>({
    name: "",
    mostUsedWord: "",
    aiJobAnswer: "",
    techWeakness: "",
    threeWords: "",
    surprisinglyGoodAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const current = questions[currentQuestion];

  const currentAnswer = answers[current.key as keyof Answers];

  const updateAnswer = (value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [current.key]: value,
    }));
  };

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);

      setError(
        "Cerebras couldn't read the room. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleRestart = () => {
    setResult(null);
    setCurrentQuestion(0);

    setAnswers({
      name: "",
      mostUsedWord: "",
      aiJobAnswer: "",
      techWeakness: "",
      threeWords: "",
      surprisinglyGoodAt: "",
    });

    setError("");
  };

  // --------------------------------------------------
  // CEREBRAS IS READING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
        {/* Ambient background */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="relative z-10 w-full max-w-md text-center">
          {/* Animated Cerebras symbol */}

          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 animate-ping rounded-full border border-orange-400/20" />

            <div className="absolute inset-3 animate-pulse rounded-full border border-orange-400/30" />

            <div className="absolute inset-7 flex items-center justify-center rounded-full bg-orange-400 text-3xl text-black shadow-[0_0_60px_rgba(251,146,60,0.35)]">
              ⚡
            </div>
          </div>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.4em] text-orange-400">
            CEREBRAS
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Reading the room<span className="animate-pulse">...</span>
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-500">
            Connecting the dots between your answers.
            <br />
            Your Cerebras Tag is almost ready. 👀
          </p>

          <div className="mt-9 flex justify-center gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-zinc-700">
            Analyzing all six answers
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // RESULT
  // --------------------------------------------------

  if (result) {
    const participantName = result.name || answers.name;

    return (
      <main className="relative min-h-screen overflow-hidden bg-black px-5 py-8 text-white sm:px-8 sm:py-12">
        {/* Background atmosphere */}

        <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/8 blur-[140px]" />

        <div className="pointer-events-none fixed bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-orange-500/5 blur-[120px]" />

        <div className="relative mx-auto w-full max-w-xl">
          {/* Header */}

          <header className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.4em] text-orange-400">
                CEREBRAS
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-600">
                READ THE ROOM
              </p>
            </div>

            <div className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                PERSONAL PROFILE
              </span>
            </div>
          </header>

          {/* Main result card */}

          <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Card glows */}

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl" />

            <div className="relative p-7 sm:p-10">
              {/* Spoken */}

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                  Cerebras has spoken
                </p>

                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {/* Name */}

              <div className="mt-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                  THE ROOM SEES
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                  {participantName}
                </h1>
              </div>

              {/* Tag */}

              <div className="mt-10 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-orange-400/20 bg-orange-400/10 text-5xl shadow-[0_0_60px_rgba(251,146,60,0.12)]">
                  {result.tag?.emoji}
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.35em] text-orange-400">
                  YOUR CEREBRAS TAG
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
                  {result.tag?.name}
                </h2>
              </div>

              {/* One liner */}

              <div className="relative mt-9 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
                <div className="absolute left-0 top-0 h-full w-1 bg-orange-400" />

                <p className="text-lg font-medium leading-7 text-zinc-200">
                  “{result.oneLiner}”
                </p>
              </div>

              {/* Scores */}

              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    YOUR ENERGY
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                    / 100
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  <ScoreCard
                    label="Creativity"
                    value={result.creativity}
                    icon="💡"
                  />

                  <ScoreCard
                    label="Tech Energy"
                    value={result.techEnergy}
                    icon="⚡"
                  />

                  <ScoreCard
                    label="Chaos"
                    value={result.chaos}
                    icon="🌪️"
                  />
                </div>
              </div>

              {/* Most likely */}

              <div className="mt-10 border-t border-zinc-800 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                  MOST LIKELY TO...
                </p>

                <p className="mt-4 text-xl font-semibold leading-8 text-zinc-100">
                  {result.mostLikelyTo}
                </p>
              </div>

              {/* Verdict */}

              <div className="relative mt-8 overflow-hidden rounded-2xl bg-orange-400 p-6 text-black">
                <div className="pointer-events-none absolute -right-8 -top-8 text-[100px] opacity-10">
                  ⚡
                </div>

                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                    CEREBRAS VERDICT
                  </p>

                  <p className="mt-3 text-xl font-black leading-8">
                    {result.verdict}
                  </p>
                </div>
              </div>

              {/* Event footer inside card */}

              <div className="mt-8 flex items-center justify-center gap-3 text-center">
                <span className="text-xs text-zinc-600">
                  ⚡
                </span>

                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                  CEREBRAS • READ THE ROOM
                </p>

                <span className="text-xs text-zinc-600">
                  ⚡
                </span>
              </div>
            </div>
          </section>

          {/* Bottom actions */}

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-600">
              Your personality was calculated from all six answers.
            </p>

            <button
              onClick={handleRestart}
              className="mt-5 rounded-full border border-zinc-800 px-7 py-3 text-sm font-semibold text-zinc-300 transition hover:border-orange-400 hover:text-orange-400 active:scale-95"
            >
              Read Me Again ↻
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // QUESTIONS
  // --------------------------------------------------

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-white">
      {/* Ambient background */}

      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}

        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.35em] text-orange-400">
                CEREBRAS
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                READ THE ROOM
              </p>
            </div>

            <span className="text-xs font-bold tracking-wider text-zinc-500">
              {String(currentQuestion + 1).padStart(2, "0")}{" "}
              / {String(questions.length).padStart(2, "0")}
            </span>
          </div>

          {/* Progress */}

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-orange-400 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}

        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
            QUESTION{" "}
            {String(currentQuestion + 1).padStart(2, "0")}
          </p>

          <h1 className="mt-5 text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl">
            {current.question}
          </h1>

          <p className="mt-5 text-sm leading-6 text-zinc-500">
            {current.hint}
          </p>
        </section>

        {/* Input */}

        <div className="mt-8">
          <textarea
            autoFocus
            value={currentAnswer}
            onChange={(event) =>
              updateAnswer(event.target.value)
            }
            placeholder={current.placeholder}
            rows={4}
            className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-5 text-lg text-white placeholder:text-zinc-700 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
          />
        </div>

        {/* Error */}

        {error && (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Buttons */}

        <div className="mt-6 flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="w-1/3 rounded-2xl border border-zinc-800 px-4 py-4 font-semibold text-zinc-300 transition hover:bg-zinc-900 active:scale-[0.98]"
            >
              ← BACK
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
            className={`rounded-2xl bg-orange-400 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 ${
              currentQuestion > 0
                ? "w-2/3"
                : "w-full"
            }`}
          >
            {currentQuestion === questions.length - 1
              ? "REVEAL ME ⚡"
              : "NEXT →"}
          </button>
        </div>

        <p className="mt-7 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-700">
          Cerebras is about to read between the lines.
        </p>
      </div>
    </main>
  );
}

// --------------------------------------------------
// SCORE CARD
// --------------------------------------------------

function ScoreCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-lg">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-300">
              {label}
            </span>

            <span className="text-sm font-black text-orange-400">
              {value}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-orange-400 transition-all duration-1000"
              style={{
                width: `${value}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}