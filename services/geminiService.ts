
import { GoogleGenAI } from "@google/genai";
import { TarotReading, ReadingExtension } from "../types";

export const analyzeReading = async (reading: TarotReading): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isZh = reading.language === 'zh';
  
  const cardsStr = reading.cards.map((rc, idx) => {
    const name = isZh ? rc.card.nameZh : rc.card.nameEn;
    return `${idx + 1}. ${name}`;
  }).join('\n');

  const userAnalysisSnippet = reading.userAnalysis 
    ? `The user's own intuition: "${reading.userAnalysis}"` 
    : "The user has provided no initial thoughts.";

  const languageInstruction = isZh 
    ? "Please provide the analysis in Traditional Chinese (繁體中文)." 
    : "Please provide the analysis in English.";

  const prompt = `
    Tarot Analysis Request (Rider-Waite Smith Tradition).
    Query: "${reading.query}"
    
    Cards Drawn:
    ${cardsStr}
    
    Context:
    ${userAnalysisSnippet}
    
    ${languageInstruction}
    
    INSTRUCTIONS:
    1. RELATE VISUALS TO QUERY: In the [Visual Symbolism] section, specifically explain how symbols, colors, or characters in these specific card images directly answer or relate to the user's inquiry.
    2. PROVIDE ADVICE: If the user is seeking guidance, the [The Oracle's Counsel] section must be extended with actionable steps.
    3. STRUCTURE: Use exactly these headers starting with '#':
       # [Alignment Verification] - Briefly verify user's focus and the spread's energy.
       # [Visual Symbolism] - Direct correlation between card imagery and the query.
       # [Archetypal Resonance] - Deeper spiritual or psychological meanings.
       # [Hidden Synergies] - How the cards interact as a single story.
       # [The Oracle's Counsel] - Clear, actionable advice and summary.
    4. EMPHASIS: Use **double asterisks** for keywords and card names.
    5. STYLE: Mystical, professional, yet grounded. No introductory filler.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Connection to the Arcanum lost.";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const analyzeExtension = async (reading: TarotReading, extension: ReadingExtension): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isZh = reading.language === 'zh';
  
  const prevCards = reading.cards.map(rc => (isZh ? rc.card.nameZh : rc.card.nameEn)).join(', ');
  const newCards = extension.cards.map(rc => `${isZh ? rc.card.nameZh : rc.card.nameEn}`).join(', ');

  const prompt = `
    Tarot Extension Analysis (Deep Synthesis).
    Initial Query: "${reading.query}"
    Original Cards: ${prevCards}
    Initial Analysis Context: "${reading.analysis?.substring(0, 800)}..."
    
    NEW Follow-up Query: "${extension.query || 'Seeking further clarification.'}"
    NEW Auxiliary Cards: ${newCards}
    
    ${isZh ? "Please provide the analysis in Traditional Chinese." : "Please provide the analysis in English."}
    
    INSTRUCTIONS:
    1. SYNTHESIZE: You must fuse the meaning of the NEW cards with the ORIGINAL spread. Do not analyze them in isolation.
    2. HEADERS:
       # [Extended Synthesis] - How the new cards change or deepen the original message.
       # [The Evolving Oracle] - Updated, more specific advice combining all cards.
    3. Use **double asterisks** for card names and key insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "Extension channelling failed.";
  } catch (error) {
    console.error(error);
    throw error;
  }
};
