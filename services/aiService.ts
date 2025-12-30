
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
// Using process.env.GEMINI_API_KEY as defined in vite.config.ts defaults
const apiKey = process.env.GEMINI_API_KEY || '';

// We handle the case where API key might be missing gracefully in the functions
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
    try {
        aiClient = new GoogleGenAI({ apiKey });
    } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
    }
}

export const generateSurfCommentary = async (surferName: string, score: number, status: string): Promise<string> => {
    if (!aiClient) {
        console.warn("Gemini API Key missing, returning fallback commentary.");
        return `Great surfing by ${surferName}! Scored ${score}.`;
    }

    try {
        const prompt = `Write a short, enthusiastic, 1-sentence commentator reaction for a professional surfer named ${surferName} who just scored ${score} points and is currently ${status}. Use surf terminology.`;

        // Using the new SDK signature
        const response = await aiClient.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        // Parse response
        // Safely access text if available
        const text = (response as any).text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "Wow! What a ride!";
        return text.replace(/\n/g, " ").trim();

    } catch (error) {
        console.error("Error generating commentary:", error);
        return `Incredible performance by ${surferName} with a ${score}!`;
    }
};

export const predictHeatOutcome = async (surfers: { name: string, country: string, tier: string }[]): Promise<string> => {
    if (!aiClient) return "Prediction unavailable.";

    const surferList = surfers.map(s => `${s.name} (${s.country}, Tier ${s.tier})`).join(", ");
    const prompt = `Predict the winner of a heat between these surfers: ${surferList}. Provide a 1 sentence reason based on fantasy surf stats/logic.`;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        return (response as any).text || "Prediction pending...";
    } catch (error) {
        console.error("Error predicting outcome:", error);
        return "Could not urge prediction.";
    }
};

export const generateBriefing = async (team: { name: string, tier: string }[], totalPoints: number): Promise<string> => {
    if (!aiClient) return "Draft your team to get your personalized AI scouting report.";

    const roster = team.map(s => `${s.name} (${s.tier})`).join(', ');
    const prompt = `You are a hype-man and strategic analyst for a fantasy surfing app. 
    The user has drafted this team for the Pipeline Pro: ${roster}. 
    Total Points so far: ${totalPoints.toFixed(2)}. 
    Give a 2-sentence energetic summary of their roster's potential and one "surfer to watch" today.`;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });
        return (response as any).text || response.candidates?.[0]?.content?.parts?.[0]?.text || "Briefing unavailable.";
    } catch (error) {
        console.error("Error generating briefing:", error);
        return "Swell's looking good. Your roster is ready for the incoming set.";
    }
};
