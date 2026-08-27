export type PersonalityTag = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const personalityTags: PersonalityTag[] = [
  {
    id: "visionary-builder",
    name: "The Visionary Builder",
    emoji: "🚀",
    description:
      "Always thinking about the next big thing and actually building it.",
  },
  {
    id: "ai-strategist",
    name: "The AI Strategist",
    emoji: "🧠",
    description:
      "Sees AI as a tool for solving bigger problems.",
  },
  {
    id: "fearless-experimenter",
    name: "The Fearless Experimenter",
    emoji: "🔥",
    description:
      "Tries things first and figures out the details later.",
  },
  {
    id: "chaos-coder",
    name: "The Chaos Coder",
    emoji: "😂",
    description:
      "Somehow turns bugs, caffeine and questionable decisions into working software.",
  },
  {
    id: "idea-machine",
    name: "The Idea Machine",
    emoji: "💡",
    description:
      "Has more ideas than tabs open in their browser.",
  },
  {
    id: "speed-demon",
    name: "The Speed Demon",
    emoji: "⚡",
    description:
      "Moves fast, ships fast and has zero patience for unnecessary meetings.",
  },
  {
    id: "problem-solver",
    name: "The Problem Solver",
    emoji: "🛠️",
    description:
      "Give them a difficult problem and they will keep digging until it works.",
  },
  {
    id: "quiet-genius",
    name: "The Quiet Genius",
    emoji: "🎯",
    description:
      "Doesn't say much, but somehow has the answer when everyone else is stuck.",
  },
  {
    id: "ai-whisperer",
    name: "The AI Whisperer",
    emoji: "🤖",
    description:
      "Knows exactly what to ask AI to get surprisingly good results.",
  },
  {
    id: "wildcard",
    name: "The Wildcard",
    emoji: "🌪️",
    description:
      "Impossible to predict and probably the most interesting person in the room.",
  },
  {
    id: "future-ceo",
    name: "The Future CEO",
    emoji: "👑",
    description:
      "Already thinking about the product, the users and the company behind it.",
  },
  {
    id: "mad-scientist",
    name: "The Mad Scientist",
    emoji: "🧪",
    description:
      "Will experiment with technology simply because someone said it couldn't be done.",
  },
];

export type ParticipantAnswers = {
  name: string;
  mostUsedWord: string;
  aiJobAnswer: string;
  techWeakness: string;
  threeWords: string;
  surprisinglyGoodAt: string;
};

export type PersonalityResult = {
  name: string;
  tag: PersonalityTag;
  creativity: number;
  techEnergy: number;
  chaos: number;
  oneLiner: string;
  mostLikelyTo: string;
  verdict: string;
};

export function analyzePersonality(
  answers: ParticipantAnswers
): PersonalityResult {
  const fields = {
    mostUsedWord: answers.mostUsedWord.toLowerCase(),
    aiJobAnswer: answers.aiJobAnswer.toLowerCase(),
    techWeakness: answers.techWeakness.toLowerCase(),
    threeWords: answers.threeWords.toLowerCase(),
    surprisinglyGoodAt:
      answers.surprisinglyGoodAt.toLowerCase(),
  };

  const scores: Record<string, number> = {};

  personalityTags.forEach((tag) => {
    scores[tag.id] = 0;
  });

  // 🚀 VISIONARY BUILDER
  scoreIf(
    scores,
    "visionary-builder",
    fields.aiJobAnswer,
    [
      "startup",
      "build",
      "building",
      "product",
      "company",
      "launch",
      "create",
      "creating",
      "business",
      "app",
    ],
    5
  );

  scoreIf(
    scores,
    "visionary-builder",
    fields.threeWords,
    [
      "ambitious",
      "visionary",
      "creative",
      "builder",
      "driven",
    ],
    4
  );

  scoreIf(
    scores,
    "visionary-builder",
    fields.surprisinglyGoodAt,
    [
      "building",
      "creating",
      "designing",
      "leading",
      "ideas",
    ],
    4
  );

  // 🧠 AI STRATEGIST
  scoreIf(
    scores,
    "ai-strategist",
    fields.aiJobAnswer,
    [
      "ai",
      "automation",
      "automate",
      "strategy",
      "strategic",
    ],
    5
  );

  scoreIf(
    scores,
    "ai-strategist",
    fields.threeWords,
    [
      "strategic",
      "analytical",
      "logical",
      "future",
      "focused",
    ],
    4
  );

  scoreIf(
    scores,
    "ai-strategist",
    fields.surprisinglyGoodAt,
    [
      "strategy",
      "planning",
      "analysis",
      "research",
      "solving",
    ],
    4
  );

  // 🔥 FEARLESS EXPERIMENTER
  scoreIf(
    scores,
    "fearless-experimenter",
    fields.aiJobAnswer,
    [
      "experiment",
      "try",
      "explore",
      "adventure",
      "learn",
    ],
    5
  );

  scoreIf(
    scores,
    "fearless-experimenter",
    fields.threeWords,
    [
      "curious",
      "adventurous",
      "bold",
      "fearless",
      "experimental",
    ],
    5
  );

  scoreIf(
    scores,
    "fearless-experimenter",
    fields.surprisinglyGoodAt,
    [
      "experiment",
      "trying",
      "learning",
      "exploring",
      "adapting",
    ],
    4
  );

  // 😂 CHAOS CODER
  // Requires both chaos AND coding signals.
  const chaosSignals = countSignals(
    `${fields.aiJobAnswer} ${fields.threeWords} ${fields.surprisinglyGoodAt}`,
    [
      "chaos",
      "chaotic",
      "bug",
      "bugs",
      "debug",
      "debugging",
      "deadline",
      "coffee",
      "caffeine",
      "sleep",
      "2am",
      "late",
    ]
  );

  const codingSignals = countSignals(
    `${fields.aiJobAnswer} ${fields.techWeakness} ${fields.surprisinglyGoodAt}`,
    [
      "code",
      "coding",
      "programming",
      "developer",
      "debug",
      "debugging",
      "css",
      "javascript",
      "python",
      "software",
    ]
  );

  if (chaosSignals >= 2 && codingSignals >= 1) {
    scores["chaos-coder"] += 8;
  }

  if (chaosSignals >= 3 && codingSignals >= 2) {
    scores["chaos-coder"] += 5;
  }

  // 💡 IDEA MACHINE
  scoreIf(
    scores,
    "idea-machine",
    fields.aiJobAnswer,
    [
      "idea",
      "ideas",
      "create",
      "invent",
      "content",
      "design",
    ],
    5
  );

  scoreIf(
    scores,
    "idea-machine",
    fields.threeWords,
    [
      "creative",
      "imaginative",
      "curious",
      "dreamer",
      "idea",
    ],
    5
  );

  scoreIf(
    scores,
    "idea-machine",
    fields.surprisinglyGoodAt,
    [
      "ideas",
      "brainstorm",
      "storytelling",
      "writing",
      "design",
    ],
    5
  );

  // ⚡ SPEED DEMON
  scoreIf(
    scores,
    "speed-demon",
    fields.aiJobAnswer,
    [
      "fast",
      "quick",
      "freelance",
      "start working",
      "travel",
    ],
    4
  );

  scoreIf(
    scores,
    "speed-demon",
    fields.threeWords,
    [
      "fast",
      "quick",
      "energetic",
      "efficient",
      "productive",
    ],
    5
  );

  scoreIf(
    scores,
    "speed-demon",
    fields.surprisinglyGoodAt,
    [
      "quick",
      "fast",
      "finishing",
      "multitasking",
      "productive",
    ],
    5
  );

  // 🛠️ PROBLEM SOLVER
  scoreIf(
    scores,
    "problem-solver",
    fields.aiJobAnswer,
    [
      "solve",
      "problem",
      "fix",
      "debug",
      "build",
      "freelance",
    ],
    4
  );

  scoreIf(
    scores,
    "problem-solver",
    fields.threeWords,
    [
      "logical",
      "patient",
      "analytical",
      "focused",
      "practical",
    ],
    5
  );

  scoreIf(
    scores,
    "problem-solver",
    fields.surprisinglyGoodAt,
    [
      "debugging",
      "solving",
      "fixing",
      "logic",
      "puzzles",
      "problems",
    ],
    6
  );

  // 🎯 QUIET GENIUS
  scoreIf(
    scores,
    "quiet-genius",
    fields.aiJobAnswer,
    [
      "read",
      "learn",
      "observe",
      "research",
      "study",
    ],
    3
  );

  scoreIf(
    scores,
    "quiet-genius",
    fields.threeWords,
    [
      "quiet",
      "calm",
      "introvert",
      "observant",
      "thoughtful",
    ],
    6
  );

  scoreIf(
    scores,
    "quiet-genius",
    fields.surprisinglyGoodAt,
    [
      "observing",
      "listening",
      "details",
      "analysis",
      "memory",
    ],
    5
  );

  // 🤖 AI WHISPERER
  scoreIf(
    scores,
    "ai-whisperer",
    fields.aiJobAnswer,
    [
      "chatgpt",
      "ai",
      "prompt",
      "copilot",
      "gemini",
      "automation",
    ],
    6
  );

  scoreIf(
    scores,
    "ai-whisperer",
    fields.threeWords,
    [
      "technical",
      "ai",
      "smart",
      "efficient",
      "tech",
    ],
    4
  );

  scoreIf(
    scores,
    "ai-whisperer",
    fields.surprisinglyGoodAt,
    [
      "prompt",
      "prompting",
      "ai",
      "automation",
      "chatgpt",
    ],
    6
  );

  // 🌪️ WILDCARD
  scoreIf(
    scores,
    "wildcard",
    fields.aiJobAnswer,
    [
      "random",
      "anything",
      "surprise",
      "meme",
      "nothing",
      "travel",
    ],
    5
  );

  scoreIf(
    scores,
    "wildcard",
    fields.threeWords,
    [
      "random",
      "weird",
      "wild",
      "unpredictable",
      "spontaneous",
    ],
    6
  );

  scoreIf(
    scores,
    "wildcard",
    fields.surprisinglyGoodAt,
    [
      "roasting",
      "memes",
      "random",
      "surprising",
      "improvising",
    ],
    6
  );

  // 👑 FUTURE CEO
  scoreIf(
    scores,
    "future-ceo",
    fields.aiJobAnswer,
    [
      "startup",
      "company",
      "business",
      "founder",
      "ceo",
      "entrepreneur",
    ],
    7
  );

  scoreIf(
    scores,
    "future-ceo",
    fields.threeWords,
    [
      "leader",
      "ambitious",
      "confident",
      "driven",
      "entrepreneur",
    ],
    5
  );

  scoreIf(
    scores,
    "future-ceo",
    fields.surprisinglyGoodAt,
    [
      "leading",
      "selling",
      "pitching",
      "organizing",
      "managing",
    ],
    5
  );

  // 🧪 MAD SCIENTIST
  scoreIf(
    scores,
    "mad-scientist",
    fields.aiJobAnswer,
    [
      "experiment",
      "research",
      "invent",
      "build",
      "robot",
      "science",
    ],
    6
  );

  scoreIf(
    scores,
    "mad-scientist",
    fields.threeWords,
    [
      "curious",
      "experimental",
      "nerdy",
      "scientist",
      "inventive",
    ],
    6
  );

  scoreIf(
    scores,
    "mad-scientist",
    fields.surprisinglyGoodAt,
    [
      "experiment",
      "research",
      "hacking",
      "building",
      "inventing",
    ],
    6
  );

  // Find the highest-scoring personality.
  const sortedScores = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  );

  const winningId = sortedScores[0][0];

  const tag =
    personalityTags.find(
      (personality) => personality.id === winningId
    ) ?? personalityTags[0];

  const creativity = calculateCreativity(fields);
  const techEnergy = calculateTechEnergy(fields);
  const chaos = calculateChaos(fields);

  return {
    name: answers.name,
    tag,
    creativity,
    techEnergy,
    chaos,
    oneLiner: generateOneLiner(tag.id),
    mostLikelyTo: generateMostLikelyTo(tag.id),
    verdict: generateVerdict(tag.id),
  };
}

// --------------------------------------------------
// Helper functions
// --------------------------------------------------

function scoreIf(
  scores: Record<string, number>,
  tagId: string,
  text: string,
  keywords: string[],
  points: number
) {
  const matches = keywords.filter((keyword) =>
    text.includes(keyword)
  ).length;

  if (matches > 0) {
    scores[tagId] +=
      points + Math.min(matches - 1, 2);
  }
}

function countSignals(
  text: string,
  keywords: string[]
): number {
  return keywords.filter((keyword) =>
    text.includes(keyword)
  ).length;
}

// --------------------------------------------------
// Creativity
// --------------------------------------------------

function calculateCreativity(fields: {
  mostUsedWord: string;
  aiJobAnswer: string;
  techWeakness: string;
  threeWords: string;
  surprisinglyGoodAt: string;
}): number {
  const text = Object.values(fields).join(" ");

  let score = 55;

  if (
    /creative|ideas|idea|imaginative|invent|design|create/.test(
      text
    )
  ) {
    score += 15;
  }

  if (
    /experiment|explore|curious|new|different|weird/.test(
      text
    )
  ) {
    score += 10;
  }

  if (
    /story|writing|art|music|content|brainstorm/.test(text)
  ) {
    score += 10;
  }

  return Math.min(score, 99);
}

// --------------------------------------------------
// Tech Energy
// --------------------------------------------------

function calculateTechEnergy(fields: {
  mostUsedWord: string;
  aiJobAnswer: string;
  techWeakness: string;
  threeWords: string;
  surprisinglyGoodAt: string;
}): number {
  const text = Object.values(fields).join(" ");

  let score = 50;

  if (
    /code|coding|programming|developer|software|debug|ai|tech|technology|python|javascript/.test(
      text
    )
  ) {
    score += 20;
  }

  if (
    /automation|llm|prompt|machine|app|build|api/.test(text)
  ) {
    score += 10;
  }

  if (
    /engineering|development|computer|data|algorithm/.test(
      text
    )
  ) {
    score += 10;
  }

  return Math.min(score, 99);
}

// --------------------------------------------------
// Chaos
// --------------------------------------------------

function calculateChaos(fields: {
  mostUsedWord: string;
  aiJobAnswer: string;
  techWeakness: string;
  threeWords: string;
  surprisinglyGoodAt: string;
}): number {
  const text = Object.values(fields).join(" ");

  let score = 30;

  if (
    /chaos|chaotic|random|wild|weird|spontaneous|unpredictable/.test(
      text
    )
  ) {
    score += 25;
  }

  if (
    /bug|bugs|deadline|coffee|caffeine|sleep|2am|late|procrastinate/.test(
      text
    )
  ) {
    score += 15;
  }

  if (
    /meme|roasting|funny|crazy|mess/.test(text)
  ) {
    score += 10;
  }

  return Math.min(score, 99);
}

// --------------------------------------------------
// Funny one-liners
// --------------------------------------------------

function generateOneLiner(tagId: string): string {
  const lines: Record<string, string> = {
    "visionary-builder":
      "Has 17 ideas before breakfast and somehow makes 3 of them work.",

    "ai-strategist":
      "Already thinking three steps ahead while everyone else is opening ChatGPT.",

    "fearless-experimenter":
      "Will absolutely press the button marked 'Do Not Press'.",

    "chaos-coder":
      "Will definitely say 'it works on my machine.'",

    "idea-machine":
      "Has more ideas than open browser tabs.",

    "speed-demon":
      "Ships first and asks questions somewhere around version 2.0.",

    "problem-solver":
      "Treats impossible bugs like personal challenges.",

    "quiet-genius":
      "Says almost nothing and then casually solves the hardest problem.",

    "ai-whisperer":
      "Has somehow convinced AI to do half the work already.",

    wildcard:
      "Nobody knows what the plan is. Including them. Somehow it works.",

    "future-ceo":
      "Already has the startup idea, the pitch and probably the domain name.",

    "mad-scientist":
      "Will build it just because someone said it couldn't be built.",
  };

  return (
    lines[tagId] ??
    "Cerebras is still trying to figure you out."
  );
}

// --------------------------------------------------
// Most likely to
// --------------------------------------------------

function generateMostLikelyTo(tagId: string): string {
  const statements: Record<string, string> = {
    "visionary-builder":
      "Start an AI startup at 2 AM because they couldn't sleep.",

    "ai-strategist":
      "Turn an annoying problem into an AI-powered product.",

    "fearless-experimenter":
      "Try something completely new five minutes before the deadline.",

    "chaos-coder":
      "Fix a bug by accidentally creating three new ones.",

    "idea-machine":
      "Come up with a startup idea during lunch.",

    "speed-demon":
      "Finish the project while everyone else is still setting up.",

    "problem-solver":
      "Keep debugging until the sun comes up.",

    "quiet-genius":
      "Save the entire team without making a big deal about it.",

    "ai-whisperer":
      "Write one prompt that replaces an hour of work.",

    wildcard:
      "Do something nobody in the room saw coming.",

    "future-ceo":
      "Turn a side project into a company.",

    "mad-scientist":
      "Build something unnecessarily complicated just to see if it works.",
  };

  return (
    statements[tagId] ??
    "Surprise everyone in the room."
  );
}

// --------------------------------------------------
// Cerebras Verdict
// --------------------------------------------------

function generateVerdict(tagId: string): string {
  const verdicts: Record<string, string> = {
    "visionary-builder":
      "You're not waiting for the future. You're building it.",

    "ai-strategist":
      "You don't just use technology. You think about where it is going.",

    "fearless-experimenter":
      "Your biggest advantage is that you're willing to try.",

    "chaos-coder":
      "Somehow, the chaos is part of the process.",

    "idea-machine":
      "Your brain clearly has an unlimited free trial.",

    "speed-demon":
      "Fast isn't just your speed. It's your personality.",

    "problem-solver":
      "Give you a problem and you'll eventually give it a solution.",

    "quiet-genius":
      "You don't need to be the loudest person in the room.",

    "ai-whisperer":
      "You're not replacing AI. You're making AI work for you.",

    wildcard:
      "Predictable is overrated.",

    "future-ceo":
      "You might already be thinking bigger than this room.",

    "mad-scientist":
      "Curiosity is your most dangerous superpower.",
  };

  return verdicts[tagId] ?? "Cerebras has spoken.";
}