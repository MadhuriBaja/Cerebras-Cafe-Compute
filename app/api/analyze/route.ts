import {
  analyzePersonality,
  ParticipantAnswers,
} from "@/lib/personality";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const answers: ParticipantAnswers = await request.json();

    // Validate all six answers
    if (
      !answers.name ||
      !answers.mostUsedWord ||
      !answers.aiJobAnswer ||
      !answers.techWeakness ||
      !answers.threeWords ||
      !answers.surprisinglyGoodAt
    ) {
      return Response.json(
        {
          success: false,
          error: "All six answers are required.",
        },
        { status: 400 }
      );
    }

    // Analyze the participant's answers
    const result = analyzePersonality(answers);

    // Save participant + personality result to Supabase
    const { error: supabaseError } = await supabase
      .from("participants")
      .insert({
        name: answers.name,
        most_used_word: answers.mostUsedWord,
        ai_job_answer: answers.aiJobAnswer,
        tech_weakness: answers.techWeakness,
        three_words: answers.threeWords,
        surprisingly_good_at: answers.surprisinglyGoodAt,

        // Save individual tag values instead of the entire object
        tag: result.tag.id,
        tag_emoji: result.tag.emoji,

        one_liner: result.oneLiner,
        creativity: result.creativity,
        tech_energy: result.techEnergy,
        chaos: result.chaos,
        most_likely_to: result.mostLikelyTo,
        verdict: result.verdict,
      });

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);

      return Response.json(
        {
          success: false,
          error: "Your result was generated, but we couldn't save it.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Personality analysis error:", error);

    return Response.json(
      {
        success: false,
        error: "Something went wrong while reading the room.",
      },
      { status: 500 }
    );
  }
}