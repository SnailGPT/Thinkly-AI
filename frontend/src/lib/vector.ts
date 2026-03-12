type EmbeddingRecord = {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_VECTOR_TABLE = process.env.SUPABASE_VECTOR_TABLE || "lecture_embeddings";

export async function upsertEmbeddings(records: EmbeddingRecord[]) {
    if (!records.length) return;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.warn("Supabase env not configured, skipping vector upsert");
        return;
    }

    const payload = records.map((r) => ({
        id: r.id,
        embedding: r.values,
        metadata: r.metadata,
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_VECTOR_TABLE}`, {
        method: "POST",
        headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        console.error("Supabase upsert error", await res.text());
    }
}

export async function semanticSearch(params: {
    embedding: number[];
    matchLimit?: number;
    matchThreshold?: number;
    filters?: Record<string, any>;
}) {
    const { embedding, matchLimit = 8, matchThreshold = 0.7, filters } = params;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.warn("Supabase env not configured, skipping semantic search");
        return [];
    }

    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/match_lecture_embeddings`);

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query_embedding: embedding,
            match_count: matchLimit,
            match_threshold: matchThreshold,
            filter: filters ?? {},
        }),
    });

    if (!res.ok) {
        console.error("Supabase match error", await res.text());
        return [];
    }

    const json = await res.json();
    return json as {
        id: string;
        content: string;
        similarity: number;
        lecture_id: string;
    }[];
}

