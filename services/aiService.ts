import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
    // We check import.meta.env.VITE_GEMINI_API_KEY
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;
    try {
        return new GoogleGenAI({ apiKey });
    } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
        return null;
    }
};

export const generateSurfCommentary = async (surferName: string, score: number, status: string): Promise<string> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        console.warn("Gemini API Key missing, returning fallback commentary.");
        return `[AI Offline] Great surfing by ${surferName}! Scored ${score}.`;
    }

    try {
        const prompt = `Write a short, enthusiastic, 1-sentence commentator reaction for a professional surfer named ${surferName} who just scored ${score} points and is currently ${status}. Use surf terminology.`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = (response as any).text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "Wow! What a ride!";
        return text.replace(/\n/g, " ").trim();

    } catch (error: any) {
        console.error("Error generating commentary:", error);
        if (error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
            return `[AI Rate Limit] Incredible performance by ${surferName}!`;
        }
        return `[API Error] Incredible performance by ${surferName}!`;
    }
};

export const predictHeatOutcome = async (surfers: { name: string, country: string, tier: string }[]): Promise<string> => {
    const aiClient = getAiClient();
    if (!aiClient) return "[AI Offline] Prediction unavailable.";

    const surferList = surfers.map(s => `${s.name} (${s.country}, Tier ${s.tier})`).join(", ");
    const prompt = `Predict the winner of a heat between these surfers: ${surferList}. Provide a 1 sentence reason based on fantasy surf stats/logic.`;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return (response as any).text || "Prediction pending...";
    } catch (error: any) {
        console.error("Error predicting outcome:", error);
        if (error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
            return "[AI Rate Limit] Prediction unavailable at this time.";
        }
        return `[API Error] Could not urge prediction.`;
    }
};

export const generateBriefing = async (team: { name: string, tier: string }[], totalPoints: number): Promise<string> => {
    const aiClient = getAiClient();
    if (!aiClient) return "AI Endpoint Missing: VITE_GEMINI_API_KEY must be added to Vercel Environment Variables.";

    const roster = team.map(s => `${s.name} (${s.tier})`).join(', ');
    const prompt = `Act as a professional, grounded surf journalist analyzing a fantasy surfing app. 
    The user has drafted this team for the upcoming event: ${roster}. 
    Total Points so far: ${totalPoints.toFixed(2)}. 
    Give a 2-sentence analytical summary of their roster's potential and one "surfer to watch" today.
    Rules: Do NOT use markdown symbols (no asterisks or bolding). Write in a tight, professional tone.`;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return (response as any).text || response.candidates?.[0]?.content?.parts?.[0]?.text || "Briefing unavailable.";
    } catch (error: any) {
        console.error("Error generating briefing:", error);
        if (error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
            return "AI Strategy Offline: Daily analytical quota has been temporarily exhausted. Trust your instincts!";
        }
        return "AI Generation Error: Service currently unavailable.";
    }
};
