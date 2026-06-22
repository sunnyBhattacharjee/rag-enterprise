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


you are an expert technical architect and expert AI engineer with expert knowledge in Daterverse and power platform architecture and integration with external systems, I am going to be working with a enterprise level project for provider enrollment and services which is in federal healthcare sector. create a code review checklist , best prctices , code conventions (naming,file structure etc). create this as a professional document that can be used for enterprise level project.
