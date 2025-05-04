import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the topic from the request body
    const { topic } = await request.json();
    
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Initialize Google Generative AI with API key
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined");
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
    }
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Configure model and create a generative model instance
    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-1.5-pro';

    // Prepare the conversation contents
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Write a two different script for 30 seconds video on Topic: Kids Story
Do not add Scene description
Do not add anything in braces, Just return the plain story in text not / nothing just the story.
Give me response in JSON format and follow the schema NOTICE HOW THERE ARE TWO CONTENT.
-{
scripts:[
{
content:"
},
{
content:"
}
],
}`,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: `\`\`\`json
{
"scripts": [
    {
    "content": "Once upon a time, in a land filled with candy trees, lived a little girl named Lily. Lily loved collecting lollipops, but she never shared. One day, a tiny gnome asked for just one. Lily hesitated, then gave him her smallest lollipop. The gnome smiled, revealing a secret: the lollipop made wishes come true! Lily wished for everyone to have candy, and the land sparkled, showering sweets on all. Lily learned that sharing is sweeter than any candy."
    },
    {
    "content": "Once there was a brave little bear named Barnaby who was afraid of the dark. Every night, he'd hide under his covers. One evening, his grandma gave him a tiny star that glowed softly. 'This star will light your way,' she said. Barnaby held it tight and peeked out. He saw fireflies dancing! He realized the dark wasn't scary, it was full of wonder. Barnaby spent the night watching the stars, no longer afraid, all thanks to his little light."
    }
]
}
\`\`\``,
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: `${topic}`,
          },
        ],
      },
    ];

    try {
      // Create a stream to match the original code structure
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      // Collect all chunks of the response
      let fullResponse = '';
      for await (const chunk of response) {
        fullResponse += chunk.text || '';
      }

      // Try to parse the response as JSON
      let scriptsData;
      try {
        // Clean up the response if it has markdown code blocks
        let jsonText = fullResponse;
        if (fullResponse.includes('```json')) {
          jsonText = fullResponse.split('```json')[1].split('```')[0].trim();
        } else if (fullResponse.includes('```')) {
          jsonText = fullResponse.split('```')[1].split('```')[0].trim();
        }
        
        scriptsData = JSON.parse(jsonText);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError, "Raw response:", fullResponse);
        
        // Try to extract scripts even if JSON parsing fails
        const scripts = {
          scripts: [
            { content: fullResponse }
          ]
        };
        
        return NextResponse.json(scripts);
      }

      return NextResponse.json(scriptsData);
    } catch (aiError) {
      console.error("Error calling Gemini API:", aiError);
      return NextResponse.json({ 
        error: "Failed to generate content from AI", 
        message: aiError.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in generate-script route:", error);
    return NextResponse.json({ 
      error: "Failed to process request", 
      message: error.message 
    }, { status: 500 });
  }
}