import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function checkModeration(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  try {
    console.log("Checking moderation for:",text);
    const response = await openai.moderations.create({
      input: text
    });

    const moderationResult = response.results[0];
    const { flagged, categories } = moderationResult;

    console.log("Moderation result:", moderationResult);

    return { flagged, categories };
  } catch (error) {
    console.error("Error checking moderation:", error);
    return { flagged: false, categories: {} };
  }
}