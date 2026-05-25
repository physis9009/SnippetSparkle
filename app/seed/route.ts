import postgres from 'postgres';
import { snippets, tags } from '@/app/lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedSnippets() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    await sql`DROP TABLE IF EXISTS snippets;`;

    await sql`
        CREATE TABLE snippets (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT,
            language TEXT NOT NULL,
            summary TEXT,
            code TEXT NOT NULL,
            tags TEXT[],  
            created_at TIMESTAMPTZ NOT NULL
        );
    `;

    const insertedSnippets = await Promise.all(
        snippets.map(async (snippet) => {
            return sql`
                INSERT INTO snippets (title, language, summary, code, tags, created_at)
                VALUES (
                    ${snippet.title ?? null}, 
                    ${snippet.language}, 
                    ${snippet.summary ?? null}, 
                    ${snippet.code}, 
                    ${snippet.tags ?? null}::text[], 
                    ${new Date(snippet.created_at)}
                )
            `;
        })
    );

    return insertedSnippets;
}

async function seedTags() {
    await sql`DROP TABLE IF EXISTS tags;`;

    await sql`
        CREATE TABLE tags (
            name VARCHAR(100) PRIMARY KEY,  
            display_name TEXT NOT NULL      
        );
    `;

    const insertedTags = await Promise.all(
        tags.map(async (tag) => {
            return sql`
                INSERT INTO tags (name, display_name)
                VALUES (${tag.name}, ${tag.displayName})
                ON CONFLICT (name) DO UPDATE SET display_name = EXCLUDED.display_name;
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
        console.error('Seeding error:', error);
        return Response.json({ error: String(error) }, { status: 500 });
    }
}