'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { toTagKey } from './utils';
import {auth, signIn, signOut} from '@/auth';
import { AuthError } from 'next-auth';
import {revalidateTag} from 'next/cache';

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

export async function toggleStar(snippetId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Need to log in to star a snippet.");
  }

  const userId = session.user.id;
  const existing = await sql`
    SELECT 1 FROM user_starred_snippets WHERE user_id = ${userId} AND snippet_id = ${snippetId}
  `;
  if (existing.length === 0) {
    await sql`
      INSERT INTO user_starred_snippets (user_id, snippet_id)
      VALUES (${userId}, ${snippetId})
    `;
  } else {
    await sql`
      DELETE FROM user_starred_snippets WHERE user_id = ${userId} AND snippet_id = ${snippetId}
    `;
  }

  revalidateTag(`star-count-${snippetId}`, 'max')
}

export async function starSnippet(userId: string, snippetId: string) {
  try {
    await sql`
      INSERT INTO user_starred_snippets (user_id, snippet_id) VALUES (${userId}, ${snippetId})
    `;
    console.log("Star snippet successfully.")
  } catch (error) {
    console.error("Failed to star this snippet: ", error);
    throw new Error("Failed to star this snippet.");
  }
}

export async function unStarSnippet(userId: string, snippetId: string) {
  try {
    await sql`
      DELETE FROM user_starred_snippets WHERE user_id = ${userId} AND snippet_id = ${snippetId}
    `;
    console.log("Unstar snippet successfully.")
  } catch (error) {
    console.error("Failed to unstar this snippet: ", error);
    throw new Error("Failed to unstar this snippet.");
  }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  const callbackUrl = formData.get("callbackUrl") as string || "/";
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      redirectTo: callbackUrl,
      redirect: true,
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === 'CredentialsSignin') {
      return 'Invalid Credentials.';
    }
    throw error;
  }
}

export async function signInAction() {
  await signIn(undefined);
}

export async function signOutAction() {
  await signOut();
}

export async function checkIfStarred(snippetId: string, userId: string): Promise<boolean> {
  const result = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM user_starred_snippets
      WHERE user_id = ${userId} AND snippet_id = ${snippetId}
    ) AS is_starred
  `;

  return result[0]?.is_starred ? true : false;
}