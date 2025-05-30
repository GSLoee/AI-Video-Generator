import axios from "axios";
import { inngest } from "./client";
import { GenerateImageScript } from "@/configs/AiModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const ImagePromptScript = `Generate Image prompt of {style} style with all details for each scene for 30 second video : script : {script}
- Just give specific image prompt depends on the story line
- do not give camera angle image prompt
- Follow the following schema and return JSON data (Maximum of 4 to 5 images)
- [
    {
        imagePrompt='',
        sceneContent='<Script Content>'
    }
]`

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

const BASE_URL='https://aigurulab.tech';

export const GenerateVideoData=inngest.createFunction(
    {id: 'generate-video-data'},
    {event: 'generate-video-data'},
    async({event,step})=>{
        const {script, topic, title, caption, videoStyle, voice, recordId}=event?.data
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
        // Generate Audio File MP3
        const GenerateAudioFile=await step.run(
            "GenerateAudioFile",
            async()=>{
                const result = await axios.post(BASE_URL+'/api/text-to-speech',
                    {
                        input: script,
                        voice: voice
                    },
                    {
                        headers: {
                            'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY, // Your API Key
                            'Content-Type': 'application/json', // Content Type
                        },
                    })
                 console.log(result.data.audio) //Output Result: Audio Mp3 Url
                return result.data.audio;
             }
         )

        // Generate Captions
        const { createClient } = require("@deepgram/sdk");
        const GenerateCaptions=await step.run(
            "generateCaptions",
            async()=>{
                const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
                 // STEP 2: Call the transcribeUrl method with the audio payload and options
                const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
                    {
                    url: GenerateAudioFile,
                    },
                    // STEP 3: Configure Deepgram options for audio analysis
                    {
                    model: "nova-3",
                    }
                    
                );
                return result.results?.channels[0]?.alternatives[0]?.words;

             }
        )

        // Generate Image Prompt from Script
        // Add GenerateImageScript here 
        const GenerateImagePrompts = await step.run(
            "generateImagePrompt",
            async() => {
                try {
                    const FINAL_PROMPT = ImagePromptScript
                        .replace('{style}', videoStyle)
                        .replace('{script}', script);
                        
                    const result = await GenerateImageScript.sendMessage(FINAL_PROMPT);
                    
                    if (!result) {
                        console.error("sendMessage() returned undefined or null.");
                        throw new Error("sendMessage() returned invalid response.");
                    }
                    
                    let resp;
                    try {
                        resp = JSON.parse(result);
                        return resp; // Return the parsed JSON
                    } catch (err) {
                        console.error("Invalid JSON from sendMessage:", result);
                        // If we can't parse as JSON, return the raw text
                        return { raw: result };
                    }
                } catch (error) {
                    console.error("Error in generateImagePrompt:", error);
                    throw error;
                }
            }
        );
        // // Generate Images using AI
        const GenerateImages=await step.run(
            "generateImages",
            async()=>{
                let images=[];
                images=await Promise.all(
                    GenerateImagePrompts.map(async(element)=>{
                        const result = await axios.post(BASE_URL+'/api/generate-image',
                            {
                                width: 1024,
                                height: 1024,
                                input: element?.imagePrompt,
                                model: 'sdxl',//'flux'
                                aspectRatio:"1:1"//Applicable to Flux model only
                            },
                            {
                                headers: {
                                    'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY, // Your API Key
                                    'Content-Type': 'application/json', // Content Type
                                },
                            })
                        console.log("Image Data:", result.data.image) //Output Result: Base 64 Image
                            return result.data.image;
                    })
                )
                return images
            }
        )    



        // Save  all Data to DB
        const UpdateDB=await step.run(
            'UpdateDB',
            async()=>{
                const result = await convex.mutation(api.videoData.UpdateVideoRecord,{
                    recordId:recordId,
                    audioUrl:GenerateAudioFile,
                    captionJson:GenerateCaptions,
                    images:GenerateImages

                })
                return result;
            }
        )

        return 'Executed Successfully!';
    }
)