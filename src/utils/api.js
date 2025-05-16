/**
 * API utilities for interacting with external services
 */

/**
 * Validate deobfuscated code against original code using Gemini API
 *
 * @param {string} originalCode - The original obfuscated code
 * @param {string} userCode - The user's deobfuscated code
 * @returns {Promise<Object>} - Object containing validation result
 */
export async function validateDeobfuscation(originalCode, userCode) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Gemini API key not found. Please check your .env file.');
    }

    // Construct the prompt for Gemini
    const prompt = `
You are a code validation expert. Your task is to determine if the second code snippet is a valid deobfuscation of the first code snippet.

OBFUSCATED CODE:
\`\`\`javascript
${originalCode}
\`\`\`

USER'S DEOBFUSCATED CODE:
\`\`\`javascript
${userCode}
\`\`\`

Analyze both code snippets and determine if they are functionally equivalent. The deobfuscated code should:
1. Perform the same operations as the original code
2. Produce the same outputs for the same inputs
3. Have the same side effects

Ignore differences in:
- Variable naming (as long as they're consistent)
- Whitespace and formatting
- Comments
- Code style (e.g., using let/const vs var)

Respond with a JSON object with the following structure:
{
  "isCorrect": true/false,
  "explanation": "Brief explanation of your reasoning",
  "score": 0-100 (a score based on readability improvements),
  "bonus": 0-10 (bonus points for exceptional improvements),
  "penalty": 0-10 (penalty points for any issues)
}
`;

    // Make the API request to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Extract the text response
    const textResponse = data.candidates[0]?.content?.parts[0]?.text;

    if (!textResponse) {
      throw new Error('No response from Gemini API');
    }

    // Parse the JSON response from the text
    // Find JSON object in the response (it might be surrounded by other text)
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      // If no JSON found, create a default response
      return {
        isCorrect: false,
        explanation: "Could not parse API response",
        score: 0
      };
    }

    try {
      const result = JSON.parse(jsonMatch[0]);
      return {
        isCorrect: result.isCorrect || false,
        explanation: result.explanation || "No explanation provided",
        score: result.score || 0,
        bonus: result.bonus || 0,
        penalty: result.penalty || 0
      };
    } catch (parseError) {
      console.error('Error parsing JSON from API response:', parseError);
      return {
        isCorrect: false,
        explanation: "Error parsing validation result",
        score: 0
      };
    }
  } catch (error) {
    console.error('Validation API error:', error);
    return {
      isCorrect: false,
      explanation: `API Error: ${error.message}`,
      score: 0
    };
  }
}
