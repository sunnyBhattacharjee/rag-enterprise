import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { getEmbedding, generateResponse } from './llm.js';

const app = express();
app.use(cors());
app.use(express.json());

// Ingestion Pipeline
app.post('/api/ingest', async (req, res) => {
    const { content, metadata = {} } = req.body;
    try {
        const embedding = await getEmbedding(content);
        const vectorString = `[${embedding.join(',')}]`;

        await pool.query(
            `INSERT INTO knowledge_base (content, metadata, embedding) VALUES ($1, $2, $3)`,
            [content, JSON.stringify(metadata), vectorString]
        );

        res.status(200).json({ success: true, message: 'Document vectorized and stored successfully.' });
    } catch (error) {
        console.error('Ingestion Error:', error);
        res.status(500).json({ error: 'Failed to process document ingestion.' });
    }
});

// Query & Retrieval Pipeline (RAG)
app.post('/api/ask', async (req, res) => {
    const { question } = req.body;
    try {
        const questionVector = await getEmbedding(question);
        const vectorString = `[${questionVector.join(',')}]`;

        // Native pgvector cosine distance operators (<=>)
        const dbResponse = await pool.query(`
            SELECT content, 1 - (embedding <=> $1) as similarity
            FROM knowledge_base
            ORDER BY embedding <=> $1
            LIMIT 3
        `, [vectorString]);

        const contextDocs = dbResponse.rows.map(row => row.content).join('\n\n');
        const answer = await generateResponse(question, contextDocs);

        res.status(200).json({
            answer,
            references: dbResponse.rows
        });
    } catch (error) {
        console.error('RAG Error:', error);
        res.status(500).json({ error: 'Failed to execute query workflow.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Enterprise ESM Server active on port ${PORT}`));