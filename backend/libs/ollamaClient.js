
const { Ollama } = require("ollama");

const client = new Ollama({ host: 'http://localhost:11434' });

async function runModel(prompt) {
    try {
        const response = await client.generate({
            model: "phi3",
            prompt: prompt
        });
        return response.response;
    } catch (e) {
        console.error("🚫 Ollama Model Error:", e);
    
        return "ERROR_LLM_FAILED"; 
    }
}

async function generateRFPResponse(text) {
    const prompt = `
    You are an RFP extraction model.
    Extract structured fields from the text below and return valid JSON only.

    Text:
    ${text}

    Return JSON format:
    {
      "title": "",
      "client": "",
      "items_required": [],
      "quantity": "",
      "delivery_time": "",
      "budget": "",
      "summary": ""
    }
    `;

    const response = await runModel(prompt);
    
    try {
        
        const jsonStart = response.indexOf("{");
        const jsonEnd = response.lastIndexOf("}") + 1;
        if (jsonStart !== -1 && jsonEnd !== 0) {
            const jsonData = JSON.parse(response.slice(jsonStart, jsonEnd));
            return jsonData;
        }
        return { error: "Failed to locate and parse JSON", raw: response };
    } catch (e) {
        return { error: "Failed to parse JSON", raw: response };
    }
}


module.exports = { generateRFPResponse, runModel };