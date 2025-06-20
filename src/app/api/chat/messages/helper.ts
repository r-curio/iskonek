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
  "http://103.149.162.194:80",
  "http://103.149.162.195:80",
  "http://103.149.162.196:80",
];

const getProxyAgent = (proxyUrl: string) => {
  return new HttpsProxyAgent(proxyUrl);
};

export async function checkModeration(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  // Add a timeout wrapper to prevent hanging
  const timeoutPromise = new Promise<{ flagged: boolean; categories: Record<string, boolean> }>((resolve) => {
    setTimeout(() => {
      console.log("Moderation check timed out, allowing message through");
      resolve({ flagged: false, categories: {} });
    }, 15000); // 15 second timeout
  });

  const moderationPromise = async (): Promise<{ flagged: boolean; categories: Record<string, boolean> }> => {
    try {
      let translatedText = text;
      let translationSuccessful = false;

      // Skip translation for very short messages or if text appears to be English
      const isLikelyEnglish = /^[a-zA-Z\s.,!?]+$/.test(text.trim());
      const isShortMessage = text.trim().length < 10;
      
      if (isLikelyEnglish || isShortMessage) {
        console.log("Skipping translation - likely English or short message");
        translationSuccessful = true;
      } else {
        // Try each proxy until successful
        for (const proxyUrl of proxyConfigs) {
          try {
            const agent = getProxyAgent(proxyUrl);
            const { text: translated } = await translate(text, {
              from: "fil",
              to: "en",
              fetchOptions: { 
                agent,
                timeout: 5000 // 5 second timeout
              },
            });
            translatedText = translated;
            translationSuccessful = true;
            break;
          } catch (e: unknown) {
            console.log(`Proxy ${proxyUrl} failed:`, e);
            // Continue to next proxy for any error (timeout, rate limit, etc.)
            continue;
          }
        }
      }

      // If translation failed, use original text
      if (!translationSuccessful) {
        console.log("Translation failed, using original text for moderation");
        translatedText = text;
      }

      console.log("Text for moderation:", translatedText);

      try {
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
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // If OpenAI fails, return not flagged to allow message through
        return { flagged: false, categories: {} };
      }
    } catch (error) {
      console.error("Error checking moderation:", error);
      return { flagged: false, categories: {} };
    }
  };

  // Race between timeout and moderation check
  return Promise.race([moderationPromise(), timeoutPromise]);
}

