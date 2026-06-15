import React, { useState } from 'react';

export default function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeRetrievalPipeline = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:3001/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      setAnswer(data.answer);
      setReferences(data.references || []);
    } catch (error) {
      console.error('Pipeline communication error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '50px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header>
        <h1>Enterprise Semantic Knowledge Portal</h1>
        <p>Locally decoupled RAG architecture using Node.js ESM & pgvector</p>
      </header>

      <main style={{ marginTop: '30px' }}>
        <form onSubmit={executeRetrievalPipeline} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Query system database (e.g., Explain architectural standard guidelines...)"
            style={{ flex: 1, padding: '14px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <button
            type="submit"
            disabled={isProcessing}
            style={{ padding: '0 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isProcessing ? 'Processing System Context...' : 'Query Engine'}
          </button>
        </form>

        {answer && (
          <section style={{ marginTop: '40px', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h2>Engine Output (qwen2.5:7b)</h2>
            <p style={{ lineHeight: '1.6', fontSize: '16px' }}>{answer}</p>

            <h3 style={{ marginTop: '30px' }}>Vector Sources & Vector Distance Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {references.map((source, index) => (
                <div key={index} style={{ padding: '15px', borderRadius: '6px', background: '#f9f9f9', borderLeft: '4px solid #4a90e2' }}>
                  {/* <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{source.content}</p> */}
                  <small style={{ color: '#666' }}>
                    Similarity Confidence Metric: <strong>{(source.similarity * 100).toFixed(2)}%</strong>
                  </small>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}