import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-orange-400 font-semibold">
            CEREBRAS
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            READ THE
            <br />
            <span className="text-orange-400">ROOM.</span>
          </h1>
        </div>

        <p className="text-lg text-zinc-300 leading-7">
          We&apos;ve met the people around you.
          <br />
          Now let&apos;s see what Cerebras thinks about{" "}
          <span className="text-white font-semibold">YOU.</span>
        </p>

        <div className="mt-10">
          <Link
            href="/read"
            className="block w-full rounded-2xl bg-orange-400 px-6 py-4 text-lg font-bold text-black transition hover:bg-orange-300"
          >
            LET CEREBRAS READ ME →
          </Link>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          6 questions • 1 Cerebras verdict
        </p>
      </div>
    </main>
  );
}