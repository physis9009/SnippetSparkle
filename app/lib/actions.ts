'use server';

import { z } from 'zod';
import postgres from 'postgres';
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

const SnippetCreateSchema = FormSchema.omit({ id: true, created_at: true });

export async function creatSnippet(formData: FormData) {
  const newTagDisplay = formData.get('new_tag') as string | null;
  
  const validated = SnippetCreateSchema.safeParse({
    language: formData.get('language'),
    title: formData.get('title'),
    code: formData.get('code'),
    summary: formData.get('summary'),
    tags: formData.getAll('tags'),
  });

  if (!validated.success) {
    throw new Error('Validation failed');
  }

  const { language, title, code, summary, tags = [] } = validated.data;

  if (newTagDisplay && newTagDisplay.trim()) {
    const newTagName = toTagKey(newTagDisplay.trim());
    const displayName = newTagDisplay.trim();
    
    if (!tags.includes(newTagName)) {
        await sql`
            INSERT INTO tags (name, display_name)
            VALUES (${newTagName}, ${displayName})
            ON CONFLICT (name) DO NOTHING
        `;
        
        tags.push(newTagName);
    }
  }

  if (tags.length > 0) {
    const existingTags = await sql<{ name: string }[]>`SELECT name FROM tags`;
    const existingNames = new Set(existingTags.map(t => t.name));
    const missing = tags.filter(name => !existingNames.has(name));
    
    for (const name of missing) {
      const displayName = name.split('-').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      await sql`
        INSERT INTO tags (name, display_name)
        VALUES (${name}, ${displayName})
        ON CONFLICT (name) DO NOTHING
      `;
    }
  }

  await sql`
    INSERT INTO snippets (title, language, summary, code, tags, created_at)
    VALUES (
      ${title ?? null},
      ${language},
      ${summary ?? null},
      ${code},
      ${tags.length > 0 ? tags : null}::text[],
      NOW()
    )
  `;
}