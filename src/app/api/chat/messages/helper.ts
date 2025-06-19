import OpenAI from "openai";
import { translate } from "@vitalets/google-translate-api";
import { HttpsProxyAgent } from "https-proxy-agent";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Define proxy configurations
const proxyConfigs = [
  "http://180.210.89.215:3128",
  "http://89.19.215.223:80",
  "http://168.205.255.238:80",
];

const getProxyAgent = (proxyUrl: string) => {
  return new HttpsProxyAgent(proxyUrl);
};

export async function checkModeration(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  try {
    let translatedText = text;

    // Try each proxy until successful
    for (const proxyUrl of proxyConfigs) {
      try {
        const agent = getProxyAgent(proxyUrl);
        const { text: translated } = await translate(text, {
          from: "fil",
          to: "en",
          fetchOptions: { agent },
        });
        translatedText = translated;
        break;
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'name' in e && e.name === "TooManyRequestsError") {
          continue; // Try next proxy
        }
        throw e; // Throw other errors
      }
    }

    console.log("Translated text:", translatedText);

    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: translatedText,
    });

    const moderationResult = response.results[0];
    const { flagged, categories } = moderationResult;

    return {
      flagged,
      categories: Object.fromEntries(Object.entries(categories)) as Record<
        string,
        boolean
      >,
    };
  } catch (error) {
    console.error("Error checking moderation:", error);
    return { flagged: false, categories: {} };
  }
}
