'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getCachedTags() {
    'use cache';

    return await sql<{ name: string; display_name: string }[]>`
        SELECT name, display_name FROM tags ORDER BY display_name
    `;
}

getCachedTags.revalidate = 3600;
getCachedTags.tags = ['tags'];