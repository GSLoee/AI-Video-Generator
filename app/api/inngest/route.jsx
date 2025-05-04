import { inngest } from "@/inngest/client";
import { GenerateVideoData, helloWorld } from "@/inngest/function";
import { serve } from "inngest/next";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    GenerateVideoData, // <-- This is where you'll always add all your functions
  ],
});

