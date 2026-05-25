'use server';

import {z} from 'zod';
import postgres from 'postgres';
import { revalidateTag } from 'next/cache';
import { toTagKey } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.uuid(),
    title: z.string().optional(),
    language: z.string().min(1, "Language is required"),
    summary: z.string().optional(),
    code: z.string().min(1, "Code is required"),
    tags: z.array(z.string()).optional(),
    created_at: z.iso.datetime(),
});

const SnippetCreatSchema = FormSchema.omit({id: true, created_at: true});

export async function creatSnippet(formData: FormData) {
    const rawTags = formData.getAll('tags') as string[];

    const newTagDisplay = formData.get('new_tag') as string | null;

    const validated = SnippetCreatSchema.safeParse({
        language: formData.get('language'),
        title: formData.get('title'),
        code: formData.get('code'),
        summary: formData.get('summary'),
        tags: rawTags.length > 0 ? rawTags : undefined,
    });

    if (!validated.success) {
        console.error(validated.error);
        throw new Error('Validation failed');
    }

    let { language, title, code, summary, tags } = validated.data;

    if (newTagDisplay && newTagDisplay.trim()) {
        const newTagName = toTagKey(newTagDisplay.trim());
       
        const exists = await sql`SELECT 1 FROM tags WHERE name = ${newTagName}`;
        if (exists.length === 0) {
            await sql`
                INSERT INTO tags (name, display_name)
                VALUES (${newTagName}, ${newTagDisplay.trim()})
            `;
            
            revalidateTag('tags', 'max');
        }
        
        if (!tags) tags = [];
        if (!tags.includes(newTagName)) tags.push(newTagName);
    }

   
    if (tags && tags.length > 0) {
        const existingTags = await sql<{ name: string }[]>`SELECT name FROM tags`;
        const existingNames = new Set(existingTags.map(t => t.name));
        const missing = tags.filter(name => !existingNames.has(name));
        for (const name of missing) {
            const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            await sql`
                INSERT INTO tags (name, display_name)
                VALUES (${name}, ${displayName})
                ON CONFLICT (name) DO NOTHING
            `;
        }
        if (missing.length > 0) {
            revalidateTag('tags', 'max');
        }
    }

    const inserted = await sql`
        INSERT INTO snippets (title, language, summary, code, tags, created_at)
        VALUES (
        ${title ?? null},
        ${language},
        ${summary ?? null},
        ${code},
        ${tags ?? null}::text[],
        NOW()
        )
        RETURNING id
    `;

    console.log(`Snippet created with id: ${inserted[0].id}`);
}