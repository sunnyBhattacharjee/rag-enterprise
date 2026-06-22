# rag-enterprise db setup

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_base (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(768)
);


CREATE INDEX ON knowledge_base USING hnsw (embedding vector_cosine_ops);

SELECT extname,extversion FROM pg_extension WHERE extname = 'vector';

