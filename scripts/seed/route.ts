import postgres from 'postgres';
import {snippets, tags} from '@/app/lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

async function seedSnippets() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
        CREATE TABLE IF NOT EXISTS snippets (
            uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            language TEXT NOT NULL,
            author TEXT NOT NULL,
            source TEXT NOT NULL,
            summary TEXT NOT NULL,
            code TEXT NOT NULL,
            analysis TEXT NOT NULL,
            tags TEXT[] NOT NULL, 
            created_at TIMESTAMPTZ NOT NULL
        );
    `;

    const insertedSnippets = await Promise.all(
        snippets.map(async (snippet) => {
            return sql`
                INSERT INTO snippets (id, title, language, author, source, summary, code, analysis, tags, created_at)
                VALUES (${snippet.id}, ${snippet.title}, ${snippet.language}, ${snippet.author}, ${snippet.source}, ${snippet.summary}, ${snippet.code}, ${snippet.analysis}, ${snippet.tags}::text[], ${new Date(snippet.created_at)})
                ON CONFLICT (id) DO NOTHING;
            `;
        })
    );

    return insertedSnippets;
}

async function seedTags() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
        CREATE TABLE IF NOT EXISTS tags (
            uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL
        );
    `;

    const insertedTags = await Promise.all(
        tags.map(async (tag) => {
            return sql`
                INSERT INTO tags (id, name)
                VALUES (${tag.id}, ${tag.name})
                ON CONFLICT (id) DO NOTHING;
            `;
        })
    );

    return insertedTags;
}

export async function GET() {
    try {
        await seedSnippets();
        await seedTags();

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    };
}