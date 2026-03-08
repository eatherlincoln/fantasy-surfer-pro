import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
async function run() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "say hi"
    });
    console.log("gemini-2.5-flash:", res.text);
  } catch(e) { console.error("ERR 2.5", e.message); }
  
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "say hi"
    });
    console.log("gemini-2.0-flash:", res.text);
  } catch(e) { console.error("ERR 2.0", e.message); }
}
run();
