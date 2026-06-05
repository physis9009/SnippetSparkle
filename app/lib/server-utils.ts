import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getCachedTags() {
    'use cache';
    
    cacheLife('hours');
    
    cacheTag('tags'); 

    const rows = await sql<{ name: string; display_name: string }[]>`
        SELECT name, display_name FROM tags ORDER BY display_name
    `;

    return rows.map(row => ({ name: row.name, display_name: row.display_name }));
}