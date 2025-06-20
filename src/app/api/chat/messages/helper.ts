import {
  GoogleGenAI,
  Type,
} from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

interface ModerationResult {
  original_message: string;
  detected_language: string;
  is_harmful: boolean;
  harm_classification: string[];
}

export async function checkModeration(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  try {
    console.log("text:", text);

    const config = {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ["original_message", "detected_language", "is_harmful", "harm_classification"],
        properties: {
          original_message: {
            type: Type.STRING,
            description: "The original message received from the user.",
          },
          detected_language: {
            type: Type.STRING,
            description: "The detected language of the original_message (e.g., 'en' for English, 'es' for Spanish, 'fil' for Filipino). If unsure, default to 'unknown'.",
          },
          is_harmful: {
            type: Type.BOOLEAN,
            description: "True if the original_message is detected as harmful, false otherwise.",
          },
          harm_classification: {
            type: Type.ARRAY,
            description: "A list of harmful categories detected if is_harmful is true. Possible values include harassment, hate, illicit, self-harm, sexual, violence, and their specific sub-categories. If no specific category is available or if it's not harmful, this array should be empty.",
            items: {
              type: Type.STRING,
              enum: ["harassment", "harassment/threatening", "hate", "hate/threatening", "illicit", "illicit/violent", "self-harm", "self-harm/intent", "self-harm/instructions", "sexual", "sexual/minors", "violence", "violence/graphic", "UNSPECIFIED"],
            },
          },
        },
      },
      systemInstruction: [
        {
          text: `You are a helpful and polite chatbot designed to assist users while maintaining a safe and respectful environment.
Your primary task is to take the input message and classify if it is harmful or not, and identify its classification based on the given categories.`,
        }
      ],
    };

    const model = 'gemini-2.5-flash-lite-preview-06-17';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: text,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let responseText = '';
    for await (const chunk of response) {
      responseText += chunk.text;
    }

    // Parse the JSON response
    const moderationResult: ModerationResult = JSON.parse(responseText);
   
    // Convert harm_classification array to categories object (similar to OpenAI format)
    const categories: Record<string, boolean> = {};
    moderationResult.harm_classification.forEach(category => {
      categories[category] = true;
    });

    return {
      flagged: moderationResult.is_harmful,
      categories,
    };
  } catch (error) {
    console.error("Error checking moderation:", error);
    return { flagged: false, categories: {} };
  }
}

