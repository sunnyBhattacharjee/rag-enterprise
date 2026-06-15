const OLLAMA_BASE = 'http://127.0.0.1:11434';

/**
 * Generates a 768-dimensional vector from text using nomic-embed-text
 */
export async function getEmbedding(text) {
    const response = await fetch(`${OLLAMA_BASE}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'nomic-embed-text',
            input: text
        })
    });

    if (!response.ok) {
        throw new Error(`Embedding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embeddings[0]; 
}

/**
 * Sends context and user query to qwen2.5:7b
 */
export async function generateResponse(prompt, context) {
    const systemPrompt = `You are an expert AI assistant. Answer the user's question strictly using the provided context.\n\nContext:\n${context}`;

    const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen2.5:7b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
}