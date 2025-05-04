// Updated GenerateImageScript implementation
import {GoogleGenAI} from '@google/genai';

export const GenerateImageScript = {
  sendMessage: async function(userPrompt) {
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    
    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-1.5-pro';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `\`Generate Image prompt of realistic style with all details for each scene for 30 second video : script : Imagine 1492. A brave explorer named Christopher Columbus set sail across the vast ocean blue. He believed he could reach the Indies by sailing west. Instead, he landed on the shores of a new world, the Americas. His voyage changed the course of history, connecting continents and cultures forever.",

- Just give specific image prompt depends on the story line
- do not give camera angle image prompt
- Follow the following schema and return JSON data (Maximum of 4 to 5 images)
- [
    {
        imagePrompt='',
        sceneContent='<Script Content>'
    }
]\``,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: `\`\`\`json
[
    {
        "imagePrompt": "A 15th-century carrack-style ship sailing on a vast, open ocean under a clear blue sky. The ship should be highly detailed, showing weathered wood, rolled-up sails billowing slightly in the wind, ropes, and sailors on deck. Focus on the vastness of the ocean and the smallness of the ship.",
        "sceneContent": "1492. A brave explorer named Christopher Columbus set sail across the vast ocean blue."
    },
    {
        "imagePrompt": "Christopher Columbus, a determined-looking man in period clothing, studying a navigational chart on the deck of his ship. The background should show the open ocean.  Include details like an astrolabe, compass, and other navigational tools.",
        "sceneContent": "He believed he could reach the Indies by sailing west."
    },
    {
        "imagePrompt": "The sandy shore of a tropical island, lush with vegetation.  Crystal clear turquoise water laps gently against the beach.  Focus on the untouched beauty of the new world.",
        "sceneContent": "Instead, he landed on the shores of a new world, the Americas."
    },
    {
        "imagePrompt": "Christopher Columbus and his crew planting a Spanish flag on the beach of the newly discovered land. The crew should be dressed in 15th-century attire. Native people can be seen observing from the edge of the jungle, curious and apprehensive.",
        "sceneContent": "His voyage changed the course of history, connecting continents and cultures forever."
    }
]
\`\`\`
`,
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: userPrompt,
          },
        ],
      },
    ];

    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = '';
      for await (const chunk of response) {
        console.log(chunk.text);
        fullResponse += chunk.text;
      }
      
      // Extract JSON content from the response
      const jsonMatch = fullResponse.match(/```json([\s\S]*?)```/) || 
                        fullResponse.match(/```([\s\S]*?)```/);
                        
      if (jsonMatch && jsonMatch[1]) {
        return jsonMatch[1].trim();
      } else {
        // If no code blocks, try to return the raw response
        return fullResponse.trim();
      }
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }
}